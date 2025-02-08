
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/hooks/useSubscription";
import { PricingPlan } from "./PricingPlan";

const BASIC_FEATURES = [
  "Access to EcoVadis-Certified company database",
  "Access to database of verified but not certified companies",
  "Advanced search and filtering options",
  "Detailed company profile",
  "Real-Time updates"
];

const PREMIUM_FEATURES = [
  ...BASIC_FEATURES,
  "Email alerts for new added companies",
  "Priority support"
];

export const SubscriptionManager = () => {
  const { toast } = useToast();
  const { currentPlan } = useSubscription();

  const handleSubscribe = async (priceId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please log in to subscribe to a plan",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to initiate checkout",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Current Plan</h3>
        <p className="text-gray-600">{currentPlan}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <PricingPlan
          name="Basic"
          price={299}
          billingPeriod="No commitment"
          features={BASIC_FEATURES}
          currentPlan={currentPlan}
          priceId="price_1QGMpIG4TGR1Qn6rUc16QbuT"
          onSubscribe={handleSubscribe}
        />
        <PricingPlan
          name="Premium"
          price={279}
          billingPeriod="(billed semi-annually)"
          features={PREMIUM_FEATURES}
          currentPlan={currentPlan}
          priceId="price_1QGMsMG4TGR1Qn6retfbREsl"
          badge={{
            text: "Most Popular",
            color: "bg-orange-400",
            emoji: "🎉"
          }}
          onSubscribe={handleSubscribe}
        />
        <PricingPlan
          name="Enterprise"
          price={249}
          billingPeriod="(billed annually)"
          features={PREMIUM_FEATURES}
          currentPlan={currentPlan}
          priceId="price_1QGMsvG4TGR1Qn6rghOqEU8H"
          badge={{
            text: "Best Deal",
            color: "bg-blue-900",
            emoji: "💰"
          }}
          onSubscribe={handleSubscribe}
        />
      </div>
    </div>
  );
};
