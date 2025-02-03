import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Filters = () => {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium text-white">Certification Type</h3>
        <Select>
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="iso">ISO Certification</SelectItem>
            <SelectItem value="quality">Quality Management</SelectItem>
            <SelectItem value="environmental">Environmental</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-white">Country</h3>
        <div className="space-y-2">
          {["United States", "United Kingdom", "Canada", "Germany", "France", "Japan", "Australia"].map((country) => (
            <div key={country} className="flex items-center space-x-2">
              <Checkbox id={country} className="border-white/50 data-[state=checked]:bg-white/90 data-[state=checked]:border-white/90" />
              <label htmlFor={country} className="text-sm text-white/90">
                {country}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-white">Company Size</h3>
        <div className="space-y-2">
          {["1-50", "51-200", "201-500", "501-1000", "1000+"].map((size) => (
            <div key={size} className="flex items-center space-x-2">
              <Checkbox id={size} className="border-white/50 data-[state=checked]:bg-white/90 data-[state=checked]:border-white/90" />
              <label htmlFor={size} className="text-sm text-white/90">
                {size} employees
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-white">Certification Level</h3>
        <div className="space-y-2">
          {["Bronze", "Silver", "Gold", "Platinum"].map((level) => (
            <div key={level} className="flex items-center space-x-2">
              <Checkbox id={level} className="border-white/50 data-[state=checked]:bg-white/90 data-[state=checked]:border-white/90" />
              <label htmlFor={level} className="text-sm text-white/90">
                {level}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Button className="w-full bg-white/10 text-white hover:bg-white/20">Apply Filters</Button>
    </div>
  );
};