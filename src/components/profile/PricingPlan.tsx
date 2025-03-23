
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlanFeatures } from "./PlanFeatures";
import { useState } from "react";

interface PricingPlanProps {
  name: string;
  price: number;
  billingPeriod: string;
  features: string[];
  currentPlan: string;
  priceId: string;
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
  badge,
  onSubscribe,
}: PricingPlanProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Normalize plan names for comparison
  const normalizedCurrentPlan = currentPlan?.toLowerCase().trim() || '';
  const normalizedName = name.toLowerCase().trim();
  const isCurrentPlan = normalizedCurrentPlan === normalizedName;
  
  // Plan order for upgrade/downgrade logic
  const planOrder = ['free', 'basic', 'premium', 'enterprise'];
  const currentPlanIndex = planOrder.indexOf(normalizedCurrentPlan);
  const newPlanIndex = planOrder.indexOf(normalizedName);
  const isUpgrade = newPlanIndex > currentPlanIndex;
  
  const handleSubscribeClick = async () => {
    setIsLoading(true);
    try {
      await onSubscribe(priceId);
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isCurrentPlan) return 'Current Plan';
    if (normalizedCurrentPlan === 'free') return 'Get Started';
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
        disabled={isCurrentPlan || isLoading}
        onClick={handleSubscribeClick}
      >
        {isLoading ? 'Processing...' : getButtonText()}
      </Button>
      
      <h4 className="font-semibold mb-4 mt-6">Features</h4>
      <PlanFeatures features={features} />
      
      {isCurrentPlan && (
        <div className="mt-4 bg-primary/10 p-3 rounded-md text-sm">
          <p className="font-medium text-primary">Your active plan</p>
        </div>
      )}
    </Card>
  );
};
