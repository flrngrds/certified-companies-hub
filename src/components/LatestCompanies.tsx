
import { CompanyCard } from "@/components/CompanyCard";
import { Badge } from "@/components/ui/badge";
interface Company {
  name: string;
  website: string;
  certificationLevel: string;
  employeeCount: string;
  industry: string;
  country: string;
  isNew?: boolean;
  logo?: string;
  description?: string;
}
interface LatestCompaniesProps {
  companies: Company[];
}
export const LatestCompanies = ({
  companies
}: LatestCompaniesProps) => {
  return <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-900">Latest Verified Companies</h2>
          <Badge variant="secondary" className="text-white animate-fade-in bg-indigo-500 hover:bg-indigo-400">
            Recently Verified
          </Badge>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company, index) => <CompanyCard key={index} {...company} showAllDetails={false} />)}
      </div>
    </div>;
};
