
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlanFeatures } from "./PlanFeatures";

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
  const getPlanButton = () => {
    const normalizedCurrentPlan = currentPlan.toLowerCase();
    const normalizedName = name.toLowerCase();

    if (normalizedCurrentPlan === normalizedName) {
      return (
        <Button 
          className="w-full bg-[#E2FFC8] text-gray-700 hover:bg-[#E2FFC8] cursor-not-allowed"
          disabled
        >
          Current Plan
        </Button>
      );
    }

    const planOrder = ['free', 'basic', 'premium', 'enterprise'];
    const currentPlanIndex = planOrder.indexOf(normalizedCurrentPlan);
    const newPlanIndex = planOrder.indexOf(normalizedName);
    const isUpgrade = newPlanIndex > currentPlanIndex;

    return (
      <Button 
        className="w-full bg-primary text-white hover:bg-primary-hover"
        onClick={() => onSubscribe(priceId)}
      >
        {normalizedCurrentPlan === 'free' ? 'Get Started' : (isUpgrade ? 'Upgrade' : 'Downgrade')}
      </Button>
    );
  };

  return (
    <Card className={`p-6 relative ${currentPlan.toLowerCase() === name.toLowerCase() ? 'bg-gray-50' : ''}`}>
      {badge && (
        <div className={`absolute -top-3 right-4 ${badge.color} text-white px-3 py-1 rounded-full text-sm`}>
          {badge.text} {badge.emoji}
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2">{name} Plan</h3>
      <p className="text-4xl font-bold mb-1">${price}<span className="text-sm font-normal">/month</span></p>
      <p className="text-sm text-gray-600 mb-4">{billingPeriod}</p>
      {getPlanButton()}
      <h4 className="font-semibold mb-4 mt-6">Features</h4>
      <PlanFeatures features={features} />
    </Card>
  );
};
