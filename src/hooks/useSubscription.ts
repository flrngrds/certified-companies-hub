
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useSubscription = () => {
  const [currentPlan, setCurrentPlan] = useState<string>("Loading...");

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Session:', session); // Debug log

        if (!session) {
          console.log('No session found, setting plan to Free');
          setCurrentPlan("Free");
          return;
        }

        // First try to get data directly from stripe_customers table
        const { data: customerData, error: dbError } = await supabase
          .from('stripe_customers')
          .select('subscription_status, price_id')
          .eq('id', session.user.id)
          .maybeSingle();

        console.log('Raw customer data:', customerData); // Debug log

        // Map price IDs to plan names
        const planMap: { [key: string]: string } = {
          'price_1QGMpIG4TGR1Qn6rUc16QbuT': 'Basic',
          'price_1QGMsMG4TGR1Qn6retfbREsl': 'Premium',
          'price_1QGMsvG4TGR1Qn6rghOqEU8H': 'Enterprise'
        };

        // If we have customer data and subscription is active/trialing
        if (customerData && 
           (customerData.subscription_status === 'active' || 
            customerData.subscription_status === 'trialing')) {
          const plan = planMap[customerData.price_id];
          console.log('Found active subscription:', {
            status: customerData.subscription_status,
            priceId: customerData.price_id,
            mappedPlan: plan
          });
          
          if (plan) {
            setCurrentPlan(plan);
            return;
          }
        }

        // If no valid subscription found in database, try edge function
        console.log('No valid subscription in database, checking edge function');
        const { data, error } = await supabase.functions.invoke('check-subscription');
        
        if (error) {
          console.error('Edge function error:', error);
          setCurrentPlan("Free");
          return;
        }

        if (data && data.plan) {
          console.log('Edge function returned plan:', data.plan);
          setCurrentPlan(data.plan);
          return;
        }

        // Final fallback
        console.log('No subscription found, defaulting to Free');
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
          console.log('Subscription data changed:', payload);
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
