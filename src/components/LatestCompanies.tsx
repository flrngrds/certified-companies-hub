
import { CompanyCard } from "@/components/CompanyCard";
import { Badge } from "@/components/ui/badge";
import { Globe, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";

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
            <Card key={index} className="border-2 rounded-lg bg-white hover:shadow-lg transition-shadow duration-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                      <img
                        src={company.logo || '/placeholder.svg'}
                        alt={`${company.name} logo`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-semibold text-lg text-gray-900">{company.name}</h3>
                      <Badge 
                        variant="outline" 
                        className="bg-green-100 text-green-700 w-fit mt-2 font-medium border-green-200"
                      >
                        Recently Added
                      </Badge>
                    </div>
                  </div>
                  {company.certificationLevel && (
                    <Badge
                      variant="secondary"
                      className={`font-medium border ${
                        company.certificationLevel.toLowerCase() === 'gold'
                          ? 'bg-[#FFD700] text-black'
                          : company.certificationLevel.toLowerCase() === 'silver'
                          ? 'bg-[#C0C0C0] text-black'
                          : company.certificationLevel.toLowerCase() === 'bronze'
                          ? 'bg-[#CD7F32] text-white'
                          : company.certificationLevel.toLowerCase() === 'platinum'
                          ? 'bg-[#E5E4E2] text-black'
                          : 'bg-primary-light text-primary'
                      }`}
                    >
                      {company.certificationLevel}
                    </Badge>
                  )}
                </div>
                
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                      {company.website.replace(/^https?:\/\//i, '')}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{company.country}</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button className="w-full bg-[#E2FFC8] hover:bg-[#d1f0b7] text-black py-2 rounded-md transition-colors">
                    See Details
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
