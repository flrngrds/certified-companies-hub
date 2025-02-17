
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

        // First try to get data from stripe_customers table
        const { data: customerData, error: dbError } = await supabase
          .from('stripe_customers')
          .select('subscription_status, price_id')
          .eq('id', session.user.id)
          .single();

        // Enhanced logging
        console.log('User ID:', session.user.id);
        console.log('Customer Data:', customerData);
        console.log('DB Error:', dbError);

        // If there's a database error or no data, fallback to edge function
        if (dbError || !customerData) {
          console.log('Falling back to edge function due to:', dbError || 'no customer data');
          const { data, error } = await supabase.functions.invoke('check-subscription');
          if (error) {
            console.error('Edge function error:', error);
            throw error;
          }
          setCurrentPlan(data.plan);
          return;
        }

        // Map price IDs to plan names
        const planMap: { [key: string]: string } = {
          'price_1QGMpIG4TGR1Qn6rUc16QbuT': 'Basic',
          'price_1QGMsMG4TGR1Qn6retfbREsl': 'Premium',
          'price_1QGMsvG4TGR1Qn6rghOqEU8H': 'Enterprise'
        };

        // Log subscription details
        console.log('Subscription Status:', customerData.subscription_status);
        console.log('Price ID:', customerData.price_id);
        console.log('Mapped Plan:', planMap[customerData.price_id]);

        // Check subscription status and set plan
        if (customerData.subscription_status === 'active' || 
            customerData.subscription_status === 'trialing') {
          const plan = planMap[customerData.price_id];
          if (plan) {
            setCurrentPlan(plan);
            return;
          }
        }

        // If we get here, set plan to Free
        console.log('No active subscription found, setting plan to Free');
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
        () => {
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
