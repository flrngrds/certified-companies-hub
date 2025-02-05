import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { PricingDialog } from "./PricingDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SearchFiltersProps {
  onSearch: (searchTerm: string, certLevel: string) => void;
}

export const SearchFilters = ({ onSearch }: SearchFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [certLevel, setCertLevel] = useState("");
  const [showPricing, setShowPricing] = useState(false);
  const { toast } = useToast();
  const [currentPlan, setCurrentPlan] = useState<string>("free");

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

  const handleSearch = async () => {
    const plan = await checkSubscription();
    setCurrentPlan(plan);
    
    if (plan === "free") {
      toast({
        title: "Premium Feature",
        description: "Please upgrade to a paid plan to use the search feature.",
      });
      setShowPricing(true);
      return;
    }
    
    onSearch(searchTerm, certLevel);
  };

  return (
    <div className="w-full space-y-4 bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold">Search Companies</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input 
            placeholder="Company name..." 
            className="w-full bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={certLevel} onValueChange={setCertLevel}>
          <SelectTrigger className="w-full md:w-[200px] bg-white">
            <SelectValue placeholder="Certification Level" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="bronze">Bronze</SelectItem>
            <SelectItem value="silver">Silver</SelectItem>
            <SelectItem value="gold">Gold</SelectItem>
            <SelectItem value="platinum">Platinum</SelectItem>
          </SelectContent>
        </Select>
        <Button className="w-full md:w-auto" onClick={handleSearch}>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
      {showPricing && <PricingDialog />}
    </div>
  );
};