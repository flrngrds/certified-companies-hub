
import { Building2, Globe, Users, MapPin } from "lucide-react";

interface CompanyInfoProps {
  website: string;
  employeeCount: string;
  industry: string;
  country: string;
  showAllDetails: boolean;
}

export const CompanyInfo = ({
  website,
  employeeCount,
  industry,
  country,
  showAllDetails,
}: CompanyInfoProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center text-gray-700">
        <Globe className="h-4 w-4 mr-2 text-primary" />
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary-hover font-medium"
        >
          {website}
        </a>
      </div>
      {showAllDetails && (
        <>
          <div className="flex items-center text-gray-700">
            <Users className="h-4 w-4 mr-2 text-primary" />
            <span>{employeeCount} employees</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Building2 className="h-4 w-4 mr-2 text-primary" />
            <span>{industry}</span>
          </div>
        </>
      )}
      <div className="flex items-center text-gray-700">
        <MapPin className="h-4 w-4 mr-2 text-primary" />
        <span>{country}</span>
      </div>
    </div>
  );
};
