import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SubscriptionManager } from "./profile/SubscriptionManager";

interface FiltersProps {
  onFilterChange: (filters: {
    industry?: string;
    country?: string;
    companySize?: string;
    certLevel?: string;
  }) => void;
  onResetFilters: () => void;
  onCertificationTypeChange: (isEcoVadisCertified: boolean) => void;
  isEcoVadisCertified: boolean;
}

export const Filters = ({ 
  onFilterChange, 
  onResetFilters, 
  onCertificationTypeChange,
  isEcoVadisCertified 
}: FiltersProps) => {
  const [filters, setFilters] = useState({
    industry: "",
    country: "",
    companySize: "",
    certLevel: "",
  });
  const [currentPlan, setCurrentPlan] = useState<string>("free");
  const [showPricing, setShowPricing] = useState(false);
  const { toast } = useToast();

  const checkSubscription = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return "free";

      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      
      return data.plan;
    } catch (error) {
      console.error('Error checking subscription:', error);
      return "free";
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    // For certification level, keep existing logic
    if (key === "certLevel") {
      const newFilters = { ...filters };
      if (["bronze", "silver", "gold", "platinum"].includes(value.toLowerCase())) {
        newFilters.certLevel = value.toLowerCase();
      } else {
        newFilters.certLevel = value === "non-certified" ? "non-certified" : value;
      }
      setFilters(newFilters);
    } else if (key === "country") {
      // For country, preserve the original case
      setFilters(prev => ({ ...prev, [key]: value }));
    } else {
      setFilters(prev => ({ ...prev, [key]: value.toLowerCase() }));
    }
  };

  const handleApplyFilters = async () => {
    const plan = await checkSubscription();
    setCurrentPlan(plan);
    
    if (plan === "free") {
      toast({
        title: "Premium Feature",
        description: "Please upgrade to a paid plan to use the filtering feature.",
      });
      setShowPricing(true);
      return;
    }
    
    onFilterChange(filters);
  };

  const handleResetFilters = () => {
    setFilters({
      industry: "",
      country: "",
      companySize: "",
      certLevel: "",
    });
    onResetFilters();
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-4">
        <Select 
          value={isEcoVadisCertified ? "certified" : "non-certified"}
          onValueChange={(value) => onCertificationTypeChange(value === "certified")}
        >
          <SelectTrigger className="w-full bg-white text-gray-900 border-white/20">
            <SelectValue placeholder="Company Type" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="certified">EcoVadis-certified</SelectItem>
            <SelectItem value="non-certified">Non-EcoVadis-Certified</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isEcoVadisCertified && (
        <div className="space-y-4">
          <h3 className="font-medium text-white">Certification Level</h3>
          <RadioGroup 
            value={filters.certLevel} 
            onValueChange={(value) => handleFilterChange("certLevel", value)} 
            className="space-y-2"
          >
            {["Platinum", "Gold", "Silver", "Bronze"].map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={level.toLowerCase()} 
                  id={level} 
                  className="border-white/50 text-white"
                />
                <Label htmlFor={level} className="text-sm text-white/90">
                  {level}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="font-medium text-white">Country</h3>
        <RadioGroup 
          value={filters.country} 
          onValueChange={(value) => handleFilterChange("country", value)} 
          className="space-y-2"
        >
          {["United States", "United Kingdom", "Canada", "Germany", "France", "Japan", "Australia"].map((country) => (
            <div key={country} className="flex items-center space-x-2">
              <RadioGroupItem 
                value={country} // Remove toLowerCase()
                id={country} 
                className="border-white/50 text-white" 
              />
              <Label htmlFor={country} className="text-sm text-white/90">
                {country}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-white">Industry</h3>
        <Select value={filters.industry} onValueChange={(value) => handleFilterChange("industry", value)}>
          <SelectTrigger className="bg-white text-gray-900 border-white/20">
            <SelectValue placeholder="Select industry" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="healthcare">Healthcare</SelectItem>
            <SelectItem value="manufacturing">Manufacturing</SelectItem>
            <SelectItem value="energy">Energy</SelectItem>
            <SelectItem value="construction">Construction</SelectItem>
            <SelectItem value="transportation">Transportation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-white">Company Size</h3>
        <RadioGroup 
          value={filters.companySize} 
          onValueChange={(value) => handleFilterChange("companySize", value)} 
          className="space-y-2"
        >
          {["1-50", "51-200", "201-500", "501-1000", "1000+"].map((size) => (
            <div key={size} className="flex items-center space-x-2">
              <RadioGroupItem value={size} id={size} className="border-white/50 text-white" />
              <Label htmlFor={size} className="text-sm text-white/90">
                {size} employees
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Button 
          className="w-full bg-white/10 text-white hover:bg-white/20"
          onClick={handleApplyFilters}
        >
          Apply Filters
        </Button>
        <Button 
          variant="destructive"
          className="w-full bg-red-100 hover:bg-red-200 text-red-600"
          onClick={handleResetFilters}
        >
          Remove Filters
        </Button>
      </div>
      <Dialog open={showPricing} onOpenChange={setShowPricing}>
        <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pricing Plans</DialogTitle>
            <DialogDescription>
              Choose the plan that best fits your needs
            </DialogDescription>
          </DialogHeader>
          <SubscriptionManager />
        </DialogContent>
      </Dialog>
    </div>
  );
};
