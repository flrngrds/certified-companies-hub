
import { CompanyCard } from "@/components/CompanyCard";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface Company {
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
}

interface LatestCompaniesProps {
  companies: Company[];
}

export const LatestCompanies = ({
  companies
}: LatestCompaniesProps) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-900">Latest Companies</h2>
          <Badge variant="secondary" className="text-white animate-fade-in bg-indigo-500 hover:bg-indigo-400">
            Recently Added
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.length === 0 ? (
          <div className="col-span-3 text-center py-8 text-gray-500">
            Loading latest companies...
          </div>
        ) : (
          companies.map((company, index) => (
            <CompanyCard
              key={index}
              name={company.name}
              website={company.website}
              certificationLevel={company.certificationLevel}
              employeeCount={company.employeeCount}
              industry={company.industry}
              country={company.country}
              isNew={true}
              logo={company.logo}
              description={company.description}
              publicationDate={company.publicationDate}
              sourceLink={company.sourceLink}
              lastVerified={company.lastVerified}
              keywords={company.keywords}
              linkedin={company.linkedin}
              annualRevenue={company.annualRevenue}
              isEcoVadisCertified={true}
            />
          ))
        )}
      </div>
    </div>
  );
};
