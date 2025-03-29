
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Link2, Clock, Globe, Linkedin } from "lucide-react";

interface CompanyDetailsProps {
  name: string;
  industry: string;
  country: string;
  employeeCount: string;
  annualRevenue: string;
  website: string;
  linkedin?: string;
  keywords?: string;
  isEcoVadisCertified: boolean;
  certificationLevel: string | null;
  publicationDate?: string;
  sourceLink?: string;
  lastVerified?: string;
  logo: string;
}

export const CompanyDetails = ({
  name,
  industry,
  country,
  employeeCount,
  annualRevenue,
  website,
  linkedin,
  keywords,
  isEcoVadisCertified,
  certificationLevel,
  publicationDate,
  sourceLink,
  lastVerified,
  logo,
}: CompanyDetailsProps) => {
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
    <div className="space-y-4">
      <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-sm text-gray-900">Certification Information</h4>
        <div className="grid gap-2 text-sm">
          <div className="flex items-center gap-2">
            {isEcoVadisCertified ? (
              <Badge className={getCertificationColor(certificationLevel)}>
                {certificationLevel}
              </Badge>
            ) : (
              <Badge variant="destructive" className="bg-[#f26868] text-white">
                ⚠️ Certification Not Found
              </Badge>
            )}
          </div>
          {isEcoVadisCertified && (
            <>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Published: {publicationDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Link2 className="h-4 w-4 text-gray-500" />
                <a href={sourceLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-hover">
                  Source Link
                </a>
              </div>
            </>
          )}
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>Last Verified: {lastVerified}</span>
          </div>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-sm text-gray-700">Industry</h4>
          <p className="text-sm">{industry}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-gray-700">Location</h4>
          <p className="text-sm">{country}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-gray-700">Size</h4>
          <p className="text-sm">{employeeCount} employees</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-gray-700">Annual Revenue</h4>
          <p className="text-sm">{annualRevenue}</p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold text-sm text-gray-700">Links</h4>
        <div className="space-y-2">
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary hover:text-primary-hover text-sm"
          >
            <Globe className="h-4 w-4" />
            Website
          </a>
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:text-primary-hover text-sm"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
          )}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-sm text-gray-700 mb-2">Keywords</h4>
        <div className="flex flex-wrap gap-2">
          {keywords?.split(',').map((keyword, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {keyword.trim()}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
