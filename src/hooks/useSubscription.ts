
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

        const { data: customerData, error: dbError } = await supabase
          .from('stripe_customers')
          .select('subscription_status, price_id')
          .eq('id', session.user.id)
          .single();

        if (dbError) {
          console.error('Error fetching from database:', dbError);
          const { data, error } = await supabase.functions.invoke('check-subscription');
          if (error) throw error;
          setCurrentPlan(data.plan);
          return;
        }

        if (customerData && customerData.subscription_status === 'active') {
          const planMap: { [key: string]: string } = {
            'price_1QGMpIG4TGR1Qn6rUc16QbuT': 'Basic',
            'price_1QGMsMG4TGR1Qn6retfbREsl': 'Premium',
            'price_1QGMsvG4TGR1Qn6rghOqEU8H': 'Enterprise'
          };
          setCurrentPlan(planMap[customerData.price_id] || 'Free');
        } else {
          setCurrentPlan('Free');
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
        setCurrentPlan("Free");
      }
    };

    checkSubscription();
  }, []);

  return { currentPlan };
};
