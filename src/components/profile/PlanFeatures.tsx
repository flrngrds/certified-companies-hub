
import { Check } from "lucide-react";

interface PlanFeaturesProps {
  features: string[];
}

export const PlanFeatures = ({ features }: PlanFeaturesProps) => {
  return (
    <ul className="space-y-3 text-xs">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
};
