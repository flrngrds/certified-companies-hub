
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlanFeatures } from "./PlanFeatures";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface PricingPlanProps {
  name: string;
  price: number;
  billingPeriod: string;
  features: string[];
  currentPlan: string;
  priceId: string;
  subscriptionEndDate?: string | null;
  badge?: {
    text: string;
    color: string;
    emoji?: string;
  };
  onSubscribe: (priceId: string) => Promise<void>;
}

export const PricingPlan = ({
  name,
  price,
  billingPeriod,
  features,
  currentPlan,
  priceId,
  subscriptionEndDate,
  badge,
  onSubscribe,
}: PricingPlanProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Normalize plan names for comparison
  const normalizedCurrentPlan = currentPlan?.toLowerCase().trim() || '';
  const normalizedName = name.toLowerCase().trim();
  const isCurrentPlan = normalizedCurrentPlan === normalizedName;
  
  // Plan order for upgrade/downgrade logic
  const planOrder = ['free', 'basic', 'premium', 'enterprise'];
  const currentPlanIndex = planOrder.indexOf(normalizedCurrentPlan);
  const newPlanIndex = planOrder.indexOf(normalizedName);
  const isUpgrade = newPlanIndex > currentPlanIndex;
  
  // Format subscription end date for display
  const formatEndDate = (dateString?: string | null) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return null;
    }
  };
  
  const formattedEndDate = formatEndDate(subscriptionEndDate);
  
  const handleSubscribeClick = async () => {
    setIsLoading(true);
    try {
      console.log(`Subscribing to plan: ${name} with priceId: ${priceId}`);
      await onSubscribe(priceId);
      toast({
        title: "Subscription process initiated",
        description: "You'll be redirected to Stripe to complete your payment",
      });
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        variant: "destructive",
        title: "Subscription error",
        description: error?.message || "Failed to process subscription request. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isCurrentPlan) return 'Current Plan';
    if (normalizedCurrentPlan === 'free' || normalizedCurrentPlan === 'loading...') return 'Get Started';
    return isUpgrade ? 'Upgrade' : 'Downgrade';
  };

  return (
    <Card className={`p-6 relative ${
      isCurrentPlan ? 'bg-gray-50 border-primary' : ''
    }`}>
      {badge && (
        <div className={`absolute -top-3 right-4 ${badge.color} text-white px-3 py-1 rounded-full text-sm font-medium`}>
          {badge.text} {badge.emoji}
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2">{name} Plan</h3>
      <p className="text-4xl font-bold mb-1">${price}<span className="text-sm font-normal">/month</span></p>
      <p className="text-sm text-gray-600 mb-4">{billingPeriod}</p>
      
      <Button 
        variant={isCurrentPlan ? "secondary" : "default"}
        className="w-full"
        disabled={isCurrentPlan || isLoading || currentPlan === "Loading..."}
        onClick={handleSubscribeClick}
      >
        {isLoading ? 'Processing...' : getButtonText()}
      </Button>
      
      <h4 className="font-semibold mb-4 mt-6">Features</h4>
      <PlanFeatures features={features} />
      
      {isCurrentPlan && (
        <div className="mt-4 bg-primary/10 p-3 rounded-md text-sm">
          <p className="font-medium text-primary">Your active plan</p>
          {formattedEndDate && (
            <p className="text-sm text-gray-600 mt-1">
              Renews on: {formattedEndDate}
            </p>
          )}
        </div>
      )}
    </Card>
  );
};
