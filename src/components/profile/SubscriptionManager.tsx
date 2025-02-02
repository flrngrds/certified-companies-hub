import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const SubscriptionManager = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-2">Basic</h3>
          <p className="text-2xl font-bold mb-4">$9.99<span className="text-sm font-normal">/month</span></p>
          <ul className="space-y-2 mb-6">
            <li>✓ Basic features</li>
            <li>✓ Limited access</li>
            <li>✓ Email support</li>
          </ul>
          <Button className="w-full bg-primary text-white hover:bg-primary-hover">
            Select Plan
          </Button>
        </Card>

        <Card className="p-6 border-primary">
          <h3 className="text-xl font-semibold mb-2">Pro</h3>
          <p className="text-2xl font-bold mb-4">$29.99<span className="text-sm font-normal">/month</span></p>
          <ul className="space-y-2 mb-6">
            <li>✓ All Basic features</li>
            <li>✓ Full access</li>
            <li>✓ Priority support</li>
            <li>✓ Advanced analytics</li>
          </ul>
          <Button className="w-full bg-primary text-white hover:bg-primary-hover">
            Select Plan
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
          <p className="text-2xl font-bold mb-4">$99.99<span className="text-sm font-normal">/month</span></p>
          <ul className="space-y-2 mb-6">
            <li>✓ All Pro features</li>
            <li>✓ Custom solutions</li>
            <li>✓ 24/7 support</li>
            <li>✓ Dedicated manager</li>
          </ul>
          <Button className="w-full bg-primary text-white hover:bg-primary-hover">
            Contact Sales
          </Button>
        </Card>
      </div>
    </div>
  );
};