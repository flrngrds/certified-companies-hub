import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

export const SubscriptionManager = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 relative">
          <h3 className="text-xl font-semibold mb-2">Basic Plan</h3>
          <p className="text-4xl font-bold mb-1">$299<span className="text-sm font-normal">/month</span></p>
          <p className="text-sm text-gray-600 mb-4">No commitment</p>
          <Button className="w-full bg-primary text-white hover:bg-primary-hover mb-6">
            Get Started
          </Button>
          <h4 className="font-semibold mb-4">Features</h4>
          <ul className="space-y-3 text-xs">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Access to EcoVadis-Certified company database</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Access to database of verified but not certified companies</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Advanced search and filtering options</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Detailed company profile</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Real-Time updates</span>
            </li>
          </ul>
        </Card>

        <Card className="p-6 relative border-primary">
          <div className="absolute -top-3 right-4 bg-orange-400 text-white px-3 py-1 rounded-full text-sm">
            Most Popular 🎉
          </div>
          <h3 className="text-xl font-semibold mb-2">Premium Plan</h3>
          <p className="text-4xl font-bold mb-1">$279<span className="text-sm font-normal">/month</span></p>
          <p className="text-sm text-gray-600 mb-4">(billed semi-annually)</p>
          <Button className="w-full bg-primary text-white hover:bg-primary-hover mb-6">
            Get Started
          </Button>
          <h4 className="font-semibold mb-4">Features</h4>
          <ul className="space-y-3 text-xs">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Access to EcoVadis-Certified company database</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Access to database of verified but not certified companies</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Advanced search and filtering options</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Detailed company profile</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Real-Time updates</span>
            </li>
          </ul>
          <div className="mt-4">
            <h4 className="font-semibold mb-3">Everything our Basic plan plus..</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-orange-400 flex-shrink-0" />
                <span>Email alerts for new added companies</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-orange-400 flex-shrink-0" />
                <span>Priority support</span>
              </li>
            </ul>
          </div>
        </Card>

        <Card className="p-6 relative">
          <div className="absolute -top-3 right-4 bg-blue-900 text-white px-3 py-1 rounded-full text-sm">
            Best Deal 💰
          </div>
          <h3 className="text-xl font-semibold mb-2">Enterprise Plan</h3>
          <p className="text-4xl font-bold mb-1">$249<span className="text-sm font-normal">/month</span></p>
          <p className="text-sm text-gray-600 mb-4">(billed annually)</p>
          <Button className="w-full bg-primary text-white hover:bg-primary-hover mb-6">
            Get Started
          </Button>
          <h4 className="font-semibold mb-4">Features</h4>
          <ul className="space-y-3 text-xs">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Access to EcoVadis-Certified company database</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Access to database of verified but not certified companies</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Advanced search and filtering options</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Detailed company profile</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Real-Time updates</span>
            </li>
          </ul>
          <div className="mt-4">
            <h4 className="font-semibold mb-3">Everything our Basic plan plus..</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-orange-400 flex-shrink-0" />
                <span>Email alerts for new added companies</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-orange-400 flex-shrink-0" />
                <span>Priority support</span>
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};