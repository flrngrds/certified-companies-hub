
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useSubscription = () => {
  const [currentPlan, setCurrentPlan] = useState<string>("Loading...");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user?.id) {
          setCurrentPlan("Free");
          return;
        }

        const { data, error } = await supabase
          .from('stripe_customers')
          .select('subscription_status, price_id')
          .eq('id', session.user.id)
          .maybeSingle();

        console.log('Customer subscription data:', data);

        if (error) {
          console.error('Error fetching subscription:', error);
          setError(error.message);
        }

        if (!data || data.subscription_status !== 'active') {
          setCurrentPlan("Free");
          return;
        }

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
      } catch (error) {
        console.error('Subscription check error:', error);
        setError(error.message);
        setCurrentPlan("Free");
      } finally {
        setIsLoading(false);
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
        () => {
          console.log('Stripe customer data changed, refreshing subscription status');
          checkSubscription();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { currentPlan, isLoading, error };
};
