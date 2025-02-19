
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
          .single();

        console.log('Raw customer data:', customerData);

        if (dbError) {
          console.error('Database error:', dbError);
          setCurrentPlan("Free");
          return;
        }

        // Map price IDs to plan names
        const planMap: { [key: string]: string } = {
          'price_1QGMpIG4TGR1Qn6rUc16QbuT': 'Basic',
          'price_1QGMsMG4TGR1Qn6retfbREsl': 'Premium',
          'price_1QGMsvG4TGR1Qn6rghOqEU8H': 'Enterprise'
        };

        console.log('Subscription status:', customerData?.subscription_status);
        console.log('Price ID:', customerData?.price_id);

        if (customerData?.subscription_status === 'active' && customerData?.price_id) {
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
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.id) {
        if (realTimeChannel) {
          supabase.removeChannel(realTimeChannel);
        }

        realTimeChannel = supabase
          .channel(`stripe_customers_${session.user.id}`)
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
          .subscribe();
      }
    };

    // Initial check and setup
    checkSubscription();
    setupRealTimeSubscription();

    // Cleanup
    return () => {
      if (realTimeChannel) {
        supabase.removeChannel(realTimeChannel);
      }
    };
  }, []);

  return { currentPlan };
};
