
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useSubscription = () => {
  const [currentPlan, setCurrentPlan] = useState<string>("Loading...");

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log('No session found, setting plan to Free');
          setCurrentPlan("Free");
          return;
        }

        // Query stripe_customers table
        const { data: customerData, error: dbError } = await supabase
          .from('stripe_customers')
          .select('subscription_status, price_id')
          .eq('id', session.user.id)
          .single();

        console.log('Customer query result:', { customerData, dbError });

        if (dbError) {
          console.error('Database error:', dbError);
          setCurrentPlan("Free");
          return;
        }

        if (!customerData) {
          console.log('No customer data found');
          setCurrentPlan("Free");
          return;
        }

        // Map price IDs to plan names
        const planMap: { [key: string]: string } = {
          'price_1QGMpIG4TGR1Qn6rUc16QbuT': 'Basic',
          'price_1QGMsMG4TGR1Qn6retfbREsl': 'Premium',
          'price_1QGMsvG4TGR1Qn6rghOqEU8H': 'Enterprise'
        };

        // Direct check for active subscription
        if (customerData.subscription_status === 'active' || 
            customerData.subscription_status === 'trialing') {
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

    // Initial check
    checkSubscription();

    // Set up real-time subscription
    const channel = supabase
      .channel('stripe_customers_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stripe_customers'
        },
        (payload) => {
          console.log('Subscription data changed, rechecking...');
          checkSubscription();
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { currentPlan };
};
