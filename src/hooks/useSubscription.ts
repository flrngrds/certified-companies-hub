
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSubscription = () => {
  const [currentPlan, setCurrentPlan] = useState<string>("Loading...");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionEndDate, setSubscriptionEndDate] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user?.id) {
          setCurrentPlan("Free");
          setIsLoading(false);
          return;
        }

        console.log("Checking subscription for user:", session.user.email);

        // First try to get subscription data from stripe_customers table
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from('stripe_customers')
          .select('subscription_status, price_id')
          .eq('id', session.user.id)
          .maybeSingle();
        
        // Get end date in a separate query to handle potential schema inconsistencies
        const { data: endDateData, error: endDateError } = await supabase
          .from('stripe_customers')
          .select('current_period_end')
          .eq('id', session.user.id)
          .maybeSingle();

        if (subscriptionError) {
          console.error('Error fetching subscription data:', subscriptionError);
        }

        if (endDateError) {
          console.error('Error fetching end date data:', endDateError);
        }

        // Check if we have valid subscription data from the database
        if (subscriptionData && subscriptionData.subscription_status === 'active' && subscriptionData.price_id) {
          console.log('Found active subscription in database:', subscriptionData);
          
          // Map price_id to plan name
          switch (subscriptionData.price_id) {
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

          // Set subscription end date if available
          if (endDateData?.current_period_end) {
            const endDate = new Date(endDateData.current_period_end);
            setSubscriptionEndDate(endDate.toISOString());
            console.log(`Subscription ends on: ${endDate.toLocaleDateString()}`);
            
            // Check if subscription has expired
            const now = new Date();
            if (endDate < now) {
              console.log('Subscription has expired. Status should be updated soon.');
              toast({
                title: "Subscription status",
                description: "Your subscription appears to have expired. It will be updated shortly.",
                variant: "default",
              });
            }
          }
          
          setIsLoading(false);
          return;
        }
        
        // If no active subscription found in the database or there was an error, check with Stripe directly
        console.log("No active subscription found in database or error occurred, checking with Stripe...");
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
          
          // Ensure we have valid data from the Stripe check
          if (stripeData?.plan) {
            setCurrentPlan(stripeData.plan);
          } else {
            console.log('No plan data returned from Stripe, defaulting to Free');
            setCurrentPlan("Free");
          }
          
          if (stripeData?.subscriptionEndDate) {
            setSubscriptionEndDate(stripeData.subscriptionEndDate);
            console.log(`Subscription ends on: ${new Date(stripeData.subscriptionEndDate).toLocaleDateString()}`);
          }
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

  return { currentPlan, isLoading, error, subscriptionEndDate };
};
