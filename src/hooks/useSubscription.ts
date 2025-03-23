
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSubscription = () => {
  const [currentPlan, setCurrentPlan] = useState<string>("Loading...");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user?.id) {
          setCurrentPlan("Free");
          return;
        }

        console.log("Checking subscription for user:", session.user.email);

        // First try to get from stripe_customers table
        const { data, error: dbError } = await supabase
          .from('stripe_customers')
          .select('subscription_status, price_id')
          .eq('id', session.user.id)
          .eq('subscription_status', 'active')
          .maybeSingle();

        if (dbError) {
          console.error('Error fetching local subscription data:', dbError);
          // Fall back to the edge function if there's a database error
        }

        if (data?.subscription_status === 'active' && data?.price_id) {
          console.log('Found active subscription in database:', data);
          
          // Map price_id to plan name
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
          setIsLoading(false);
          return;
        }
        
        // If no active subscription found in the database, check with Stripe directly
        console.log("No active subscription found in database, checking with Stripe...");
        const { data: stripeData, error: stripeError } = await supabase.functions.invoke('check-subscription');

        if (stripeError) {
          console.error('Error checking subscription with Stripe:', stripeError);
          setError(stripeError.message);
          setCurrentPlan("Free");
          toast({
            title: "Error checking subscription",
            description: "Unable to verify your subscription status. Please try again later.",
            variant: "destructive",
          });
        } else {
          console.log('Stripe subscription check result:', stripeData);
          setCurrentPlan(stripeData?.plan || "Free");
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

    // Set up realtime subscription for stripe_customers table
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
          console.log('Stripe customer data changed:', payload);
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
