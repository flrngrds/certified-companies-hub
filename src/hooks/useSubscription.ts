
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

        // Query stripe_customers table to check subscription status
        const { data: customerData, error: dbError } = await supabase
          .from('stripe_customers')
          .select('subscription_status, price_id')
          .eq('id', session.user.id)
          .maybeSingle();

        if (dbError) {
          console.error('Database error:', dbError);
          setCurrentPlan("Free");
          return;
        }

        // If no customer data found, return Free plan
        if (!customerData) {
          console.log('No customer record found, setting to Free plan');
          setCurrentPlan("Free");
          return;
        }

        // Map price IDs to plan names
        const planMap: { [key: string]: string } = {
          'price_1QGMpIG4TGR1Qn6rUc16QbuT': 'Basic',
          'price_1QGMsMG4TGR1Qn6retfbREsl': 'Premium',
          'price_1QGMsvG4TGR1Qn6rghOqEU8H': 'Enterprise'
        };

        const status = customerData.subscription_status;
        const priceId = customerData.price_id;

        console.log('Customer data:', {
          status,
          priceId,
          mappedPlan: planMap[priceId]
        });

        if (status === 'active' || status === 'trialing') {
          if (priceId && planMap[priceId]) {
            const plan = planMap[priceId];
            console.log(`Setting active plan: ${plan}`);
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
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user?.id) {
          console.log('No active session for realtime subscription');
          return;
        }

        if (realTimeChannel) {
          console.log('Removing existing channel');
          await supabase.removeChannel(realTimeChannel);
        }

        console.log('Setting up realtime subscription');
        realTimeChannel = supabase
          .channel(`stripe_customers_${Date.now()}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'stripe_customers'
            },
            async (payload) => {
              console.log('Subscription change detected:', payload);
              await checkSubscription();
            }
          )
          .subscribe((status) => {
            console.log('Channel status:', status);
          });

      } catch (error) {
        console.error('Error setting up realtime subscription:', error);
      }
    };

    // Initial setup
    checkSubscription().then(() => {
      setupRealTimeSubscription();
    });

    // Auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      console.log('Auth state changed:', event);
      if (event === 'SIGNED_IN') {
        checkSubscription().then(() => {
          setupRealTimeSubscription();
        });
      } else if (event === 'SIGNED_OUT') {
        setCurrentPlan('Free');
        if (realTimeChannel) {
          supabase.removeChannel(realTimeChannel);
        }
      }
    });

    // Cleanup
    return () => {
      if (realTimeChannel) {
        supabase.removeChannel(realTimeChannel);
      }
      subscription.unsubscribe();
    };
  }, []);

  return { currentPlan };
};
