
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useSubscription = () => {
  const [currentPlan, setCurrentPlan] = useState<string>("Loading...");

  useEffect(() => {
    let realTimeChannel: ReturnType<typeof supabase.channel> | null = null;

    const checkSubscription = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log('No session found, setting plan to Free');
          setCurrentPlan("Free");
          return;
        }

        console.log('Checking subscription for user:', session.user.id);

        // First enable real-time for the table
        await supabase
          .from('stripe_customers')
          .select('*')
          .limit(0);

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

    const setupRealTimeSubscription = async () => {
      const sessionResponse = await supabase.auth.getSession();
      const session = sessionResponse.data.session;
      
      if (session?.user?.id) {
        // Clean up any existing subscription
        if (realTimeChannel) {
          supabase.removeChannel(realTimeChannel);
        }

        realTimeChannel = supabase
          .channel('stripe_customers_changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'stripe_customers',
              filter: `id=eq.${session.user.id}`
            },
            async (payload) => {
              console.log('Subscription change detected:', payload);
              await checkSubscription();
            }
          )
          .subscribe((status) => {
            console.log('Realtime subscription status:', status);
            if (status === 'SUBSCRIBED') {
              checkSubscription();
            }
          });
      }
    };

    // Set up auth state change listener
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_OUT') {
          setCurrentPlan("Free");
          if (realTimeChannel) {
            supabase.removeChannel(realTimeChannel);
            realTimeChannel = null;
          }
          return;
        }

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await checkSubscription();
          await setupRealTimeSubscription();
        }
      }
    );

    // Initial check and setup
    const initialize = async () => {
      await checkSubscription();
      await setupRealTimeSubscription();
    };
    initialize();

    // Cleanup
    return () => {
      if (realTimeChannel) {
        supabase.removeChannel(realTimeChannel);
      }
      authSubscription.unsubscribe();
    };
  }, []);

  return { currentPlan };
};
