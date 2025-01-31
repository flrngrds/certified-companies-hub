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
    <div className="w-full space-y-6 bg-white p-4 rounded-lg shadow-sm">
      <div className="space-y-4">
        <h3 className="font-medium">Certification Type</h3>
        <Select>
          <SelectTrigger>
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
        <h3 className="font-medium">Company Size</h3>
        <div className="space-y-2">
          {["1-50", "51-200", "201-500", "501-1000", "1000+"].map((size) => (
            <div key={size} className="flex items-center space-x-2">
              <Checkbox id={size} />
              <label htmlFor={size} className="text-sm text-secondary">
                {size} employees
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Certification Level</h3>
        <div className="space-y-2">
          {["Bronze", "Silver", "Gold", "Platinum"].map((level) => (
            <div key={level} className="flex items-center space-x-2">
              <Checkbox id={level} />
              <label htmlFor={level} className="text-sm text-secondary">
                {level}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Button className="w-full">Apply Filters</Button>
    </div>
  );
};