
import { AlertOctagon } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { ErrorReportForm } from "./ErrorReportForm";
import { CompanyHeader } from "./company-card/CompanyHeader";
import { CompanyInfo } from "./company-card/CompanyInfo";
import { CompanyDetails } from "./company-card/CompanyDetails";

interface CompanyCardProps {
  name: string;
  website: string;
  certificationLevel: string | null;
  employeeCount: string;
  industry: string;
  country: string;
  isNew?: boolean;
  logo?: string;
  description?: string;
  publicationDate?: string;
  sourceLink?: string;
  lastVerified?: string;
  keywords?: string;
  linkedin?: string;
  annualRevenue?: string;
  showAllDetails?: boolean;
  isEcoVadisCertified?: boolean;
}

export const CompanyCard = ({
  name,
  website,
  certificationLevel,
  employeeCount,
  industry,
  country,
  isNew = false,
  logo = "/placeholder.svg",
  description = "No description available.",
  publicationDate,
  sourceLink,
  lastVerified,
  keywords,
  linkedin,
  annualRevenue,
  showAllDetails = false,
  isEcoVadisCertified = true,
}: CompanyCardProps) => {
  const [showErrorForm, setShowErrorForm] = useState(false);

  return (
    <Card className="w-full bg-white hover:shadow-lg transition-shadow duration-200 border-2">
      <CardHeader>
        <CompanyHeader
          name={name}
          logo={logo}
          isNew={isNew}
          certificationLevel={certificationLevel}
          isEcoVadisCertified={isEcoVadisCertified}
        />
      </CardHeader>
      <CardContent>
        <CompanyInfo
          website={website}
          employeeCount={employeeCount}
          industry={industry}
          country={country}
          showAllDetails={showAllDetails}
        />
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full bg-[#E2FFC8] hover:bg-[#d1f0b7] text-black">
              See Details
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            {!showErrorForm ? (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-4">
                    <img
                      src={logo}
                      alt={`${name} logo`}
                      className="w-12 h-12 rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                      }}
                    />
                    {name}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <CompanyDetails
                    name={name}
                    industry={industry}
                    country={country}
                    employeeCount={employeeCount}
                    annualRevenue={annualRevenue || ''}
                    website={website}
                    linkedin={linkedin}
                    keywords={keywords}
                    isEcoVadisCertified={isEcoVadisCertified}
                    certificationLevel={certificationLevel}
                    publicationDate={publicationDate}
                    sourceLink={sourceLink}
                    lastVerified={lastVerified}
                    logo={logo}
                  />
                  <Button
                    onClick={() => setShowErrorForm(true)}
                    variant="outline"
                    className="w-full flex items-center gap-2"
                  >
                    <AlertOctagon className="h-4 w-4" />
                    Report an Error
                  </Button>
                </div>
              </>
            ) : (
              <ErrorReportForm
                companyName={name}
                onBack={() => setShowErrorForm(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};
