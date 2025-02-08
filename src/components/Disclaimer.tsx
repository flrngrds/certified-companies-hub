
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const Disclaimer = () => {
  return (
    <Alert className="bg-amber-50 border-amber-200 mb-8">
      <AlertTriangle className="h-5 w-5 text-amber-500" />
      <AlertDescription className="text-amber-800 ml-2">
        VadiBase employs an advanced data analysis system that aggregates information from publicly accessible sources to present EcoVadis certification details. As a result, certain companies classified as "Non-certified" may indeed be certified. We encourage users to conduct independent verifications of each company's certification status.
      </AlertDescription>
    </Alert>
  );
};
