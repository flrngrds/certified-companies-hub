
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

/**
 * Checks if the current user has an active paid subscription
 * @returns Promise with the plan name or "free" if no active subscription
 */
export const checkSubscription = async (): Promise<string> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return "free";

    const { data, error } = await supabase.functions.invoke('check-subscription');
    if (error) throw error;
    
    return data.plan || "free";
  } catch (error) {
    console.error('Error checking subscription:', error);
    return "free";
  }
};

/**
 * Utility to handle premium features - shows pricing popup if user doesn't have a paid plan
 * @param currentPlan The user's current plan
 * @param setShowPricing Function to show the pricing dialog
 * @param featureName Optional name of the feature for the toast message
 * @returns Boolean indicating if the user can access the feature
 */
export const handlePremiumFeature = (
  currentPlan: string, 
  setShowPricing: (show: boolean) => void,
  featureName: string = "this feature"
): boolean => {
  if (currentPlan === "free" || currentPlan === "Free") {
    toast({
      title: "Premium Feature",
      description: `Please upgrade to a paid plan to use ${featureName}.`,
    });
    setShowPricing(true);
    return false;
  }
  return true;
};
