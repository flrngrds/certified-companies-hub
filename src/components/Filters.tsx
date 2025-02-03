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

export const Filters = () => {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium text-white">Certification Type</h3>
        <Select>
          <SelectTrigger className="bg-white text-gray-900 border-white/20">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="iso">ISO Certification</SelectItem>
            <SelectItem value="quality">Quality Management</SelectItem>
            <SelectItem value="environmental">Environmental</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-white">Country</h3>
        <RadioGroup defaultValue="us" className="space-y-2">
          {["United States", "United Kingdom", "Canada", "Germany", "France", "Japan", "Australia"].map((country) => (
            <div key={country} className="flex items-center space-x-2">
              <RadioGroupItem value={country.toLowerCase().replace(/\s+/g, '-')} id={country} className="border-white/50 text-white" />
              <Label htmlFor={country} className="text-sm text-white/90">
                {country}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-white">Company Size</h3>
        <RadioGroup defaultValue="1-50" className="space-y-2">
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

      <div className="space-y-4">
        <h3 className="font-medium text-white">Certification Level</h3>
        <RadioGroup defaultValue="bronze" className="space-y-2">
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

      <Button className="w-full bg-white/10 text-white hover:bg-white/20">Apply Filters</Button>
    </div>
  );
};