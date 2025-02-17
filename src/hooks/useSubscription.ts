
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useSubscription = () => {
  const [currentPlan, setCurrentPlan] = useState<string>("Loading...");

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setCurrentPlan("Free");
          return;
        }

        // First try to get data from stripe_customers table
        const { data: customerData, error: dbError } = await supabase
          .from('stripe_customers')
          .select('subscription_status, price_id')
          .eq('id', session.user.id)
          .maybeSingle();

        // Log data for debugging
        console.log('Customer Data:', customerData);

        // If there's a database error, fallback to edge function
        if (dbError) {
          console.error('Error fetching from database:', dbError);
          const { data, error } = await supabase.functions.invoke('check-subscription');
          if (error) throw error;
          setCurrentPlan(data.plan);
          return;
        }

        // If we have customer data and subscription is active
        if (customerData) {
          console.log('Subscription Status:', customerData.subscription_status);
          console.log('Price ID:', customerData.price_id);

          // Consider both 'active' and 'trialing' as valid subscription states
          if (customerData.subscription_status === 'active' || 
              customerData.subscription_status === 'trialing') {
            const planMap: { [key: string]: string } = {
              'price_1QGMpIG4TGR1Qn6rUc16QbuT': 'Basic',
              'price_1QGMsMG4TGR1Qn6retfbREsl': 'Premium',
              'price_1QGMsvG4TGR1Qn6rghOqEU8H': 'Enterprise'
            };
            
            const plan = planMap[customerData.price_id];
            console.log('Mapped Plan:', plan);
            
            if (plan) {
              setCurrentPlan(plan);
              return;
            }
          }
        }

        // If no valid subscription found, fallback to edge function
        const { data, error } = await supabase.functions.invoke('check-subscription');
        if (error) {
          console.error('Error checking subscription via function:', error);
          setCurrentPlan("Free");
          return;
        }

        setCurrentPlan(data.plan);
      } catch (error) {
        console.error('Error checking subscription:', error);
        setCurrentPlan("Free");
      }
    };

    checkSubscription();
  }, []);

  return { currentPlan };
};
