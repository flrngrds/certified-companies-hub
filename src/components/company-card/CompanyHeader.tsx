
import { Badge } from "@/components/ui/badge";
import { CompanyLogo } from "./CompanyLogo";

interface CompanyHeaderProps {
  name: string;
  logo: string;
  isNew: boolean;
  certificationLevel: string | null;
  isEcoVadisCertified: boolean;
}

export const CompanyHeader = ({ 
  name, 
  logo, 
  isNew, 
  certificationLevel,
  isEcoVadisCertified 
}: CompanyHeaderProps) => {
  const getCertificationColor = (level: string | null) => {
    if (!level) return 'bg-red-500 text-white';
    
    switch (level.toLowerCase()) {
      case 'gold':
        return 'bg-[#FFD700] text-black';
      case 'silver':
        return 'bg-[#C0C0C0] text-black';
      case 'bronze':
        return 'bg-[#CD7F32] text-white';
      case 'platinum':
        return 'bg-[#E5E4E2] text-black';
      default:
        return 'bg-primary-light text-primary';
    }
  };

  return (
    <div className="flex items-center justify-between space-y-0 pb-2">
      <div className="flex items-center gap-4">
        <CompanyLogo logo={logo} name={name} />
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg text-gray-900">{name}</h3>
          {isNew && (
            <Badge variant="outline" className="bg-success-light text-success w-fit mt-2 font-medium">
              Recently Added
            </Badge>
          )}
        </div>
      </div>
      {isEcoVadisCertified ? (
        <Badge
          variant="secondary"
          className={`font-medium border ${getCertificationColor(certificationLevel || '')}`}
        >
          {certificationLevel}
        </Badge>
      ) : (
        <Badge variant="destructive" className="font-medium bg-[#f26868] text-white">
          ⚠️ Not Found
        </Badge>
      )}
    </div>
  );
};
