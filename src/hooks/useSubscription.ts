
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useSubscription = () => {
  const [currentPlan, setCurrentPlan] = useState<string>("Loading...");

  useEffect(() => {
    // Set up auth state change listener
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setCurrentPlan("Free");
          return;
        }

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          checkSubscription();
        }
      }
    );

    const checkSubscription = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log('No session found, setting plan to Free');
          setCurrentPlan("Free");
          return;
        }

        console.log('Checking subscription for user:', session.user.id);

        // Query stripe_customers table to check subscription status
        const { data: customerData, error: dbError } = await supabase
          .from('stripe_customers')
          .select('subscription_status, price_id')
          .eq('id', session.user.id)
          .maybeSingle();

        console.log('Raw customer data:', customerData);

        if (dbError) {
          console.error('Database error:', dbError);
          setCurrentPlan("Free");
          return;
        }

        // Handle case where no customer record exists
        if (!customerData) {
          console.log('No customer data found, setting plan to Free');
          setCurrentPlan("Free");
          return;
        }

        // Map price IDs to plan names
        const planMap: { [key: string]: string } = {
          'price_1QGMpIG4TGR1Qn6rUc16QbuT': 'Basic',
          'price_1QGMsMG4TGR1Qn6retfbREsl': 'Premium',
          'price_1QGMsvG4TGR1Qn6rghOqEU8H': 'Enterprise'
        };

        console.log('Subscription status:', customerData.subscription_status);
        console.log('Price ID:', customerData.price_id);

        // Include both 'active' and 'trialing' statuses
        if ((customerData.subscription_status === 'active' || customerData.subscription_status === 'trialing') && customerData.price_id) {
          const plan = planMap[customerData.price_id];
          if (plan) {
            console.log(`Setting plan to ${plan} based on price_id ${customerData.price_id}`);
            setCurrentPlan(plan);
            return;
          }
        }

        console.log('No active subscription found, setting to Free');
        setCurrentPlan("Free");
      } catch (error) {
        console.error('Error in subscription check:', error);
        setCurrentPlan("Free");
      }
    };

    const setupRealTimeSubscription = () => {
      let cleanup: (() => void) | undefined;

      const setup = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user?.id) {
          const channel = supabase
            .channel('stripe_customers_changes')
            .on(
              'postgres_changes',
              {
                event: '*',
                schema: 'public',
                table: 'stripe_customers',
                filter: `id=eq.${session.user.id}`
              },
              () => {
                console.log('Subscription changed, rechecking status...');
                checkSubscription();
              }
            )
            .subscribe();

          cleanup = () => {
            console.log('Cleaning up subscription...');
            supabase.removeChannel(channel);
          };
        }
      };

      setup();

      return () => {
        if (cleanup) {
          cleanup();
        }
      };
    };

    // Handle initial auth state check first
    const initializeSubscription = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await checkSubscription();
      } else {
        setCurrentPlan("Free");
      }
    };

    // Initial auth and subscription check
    initializeSubscription();
    
    // Setup real-time listener
    const realtimeCleanup = setupRealTimeSubscription();

    // Return cleanup function for useEffect
    return () => {
      authSubscription.unsubscribe();
      realtimeCleanup();
    };
  }, []);

  return { currentPlan };
};
