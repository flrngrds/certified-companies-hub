
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useSubscription = () => {
  const [currentPlan, setCurrentPlan] = useState<string>("Loading...");

  useEffect(() => {
    const checkSubscription = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.id) {
        setCurrentPlan("Free");
        return;
      }

      const { data } = await supabase
        .from('stripe_customers')
        .select('subscription_status, price_id')
        .eq('id', session.user.id)
        .single();

      if (!data) {
        setCurrentPlan("Free");
        return;
      }

      console.log('Customer subscription data:', data);

      if (data.subscription_status === 'active') {
        switch (data.price_id) {
          case 'price_1QGMpIG4TGR1Qn6rUc16QbuT':
            setCurrentPlan('Basic');
            break;
          case 'price_1QGMsMG4TGR1Qn6retfbREsl':
            setCurrentPlan('Premium');
            break;
          case 'price_1QGMsvG4TGR1Qn6rghOqEU8H':
            setCurrentPlan('Enterprise');
            break;
          default:
            setCurrentPlan('Free');
        }
      } else {
        setCurrentPlan("Free");
      }
    };

    // Initial check
    checkSubscription();

    // Set up realtime subscription
    const channel = supabase
      .channel('stripe_customers_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stripe_customers'
        },
        checkSubscription
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { currentPlan };
};
