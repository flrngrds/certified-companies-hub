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

interface FiltersProps {
  onFilterChange: (filters: {
    industry?: string;
    country?: string;
    companySize?: string;
    certLevel?: string;
  }) => void;
}

export const Filters = ({ onFilterChange }: FiltersProps) => {
  const [filters, setFilters] = useState({
    industry: "",
    country: "",
    companySize: "",
    certLevel: "",
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium text-white">Certification Level</h3>
        <RadioGroup 
          value={filters.certLevel} 
          onValueChange={(value) => handleFilterChange("certLevel", value)} 
          className="space-y-2"
        >
          {["Bronze", "Silver", "Gold", "Platinum"].map((level) => (
            <div key={level} className="flex items-center space-x-2">
              <RadioGroupItem value={level.toLowerCase()} id={level} className="border-white/50 text-white" />
              <Label htmlFor={level} className="text-sm text-white/90">
                {level}
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
        <h3 className="font-medium text-white">Country</h3>
        <RadioGroup 
          value={filters.country} 
          onValueChange={(value) => handleFilterChange("country", value)} 
          className="space-y-2"
        >
          {["United States", "United Kingdom", "Canada", "Germany", "France", "Japan", "Australia"].map((country) => (
            <div key={country} className="flex items-center space-x-2">
              <RadioGroupItem 
                value={country.toLowerCase().replace(/\s+/g, '-')} 
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

      <Button 
        className="w-full bg-white/10 text-white hover:bg-white/20"
        onClick={handleApplyFilters}
      >
        Apply Filters
      </Button>
    </div>
  );
};