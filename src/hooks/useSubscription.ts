
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useSubscription = () => {
  const [currentPlan, setCurrentPlan] = useState<string>("Loading...");

  useEffect(() => {
    let realTimeChannel: ReturnType<typeof supabase.channel> | null = null;

    const checkSubscription = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user?.id) {
          setCurrentPlan("Free");
          return;
        }

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

        console.log('Raw customer data:', customerData);

        // Map price IDs to plan names
        const planMap: { [key: string]: string } = {
          'price_1QGMpIG4TGR1Qn6rUc16QbuT': 'Basic',
          'price_1QGMsMG4TGR1Qn6retfbREsl': 'Premium',
          'price_1QGMsvG4TGR1Qn6rghOqEU8H': 'Enterprise'
        };

        if (customerData?.subscription_status === 'active' && customerData?.price_id) {
          const plan = planMap[customerData.price_id];
          if (plan) {
            setCurrentPlan(plan);
            return;
          }
        }

        setCurrentPlan("Free");
      } catch (error) {
        console.error('Error in subscription check:', error);
        setCurrentPlan("Free");
      }
    };

    // Initial check
    checkSubscription();

    // Set up realtime subscription for changes
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
          checkSubscription();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { currentPlan };
};
