import { Building2, Globe, Users, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CompanyCardProps {
  name: string;
  website: string;
  certificationLevel: string;
  employeeCount: string;
  industry: string;
  country: string;
  isNew?: boolean;
}

export const CompanyCard = ({
  name,
  website,
  certificationLevel,
  employeeCount,
  industry,
  country,
  isNew = false,
}: CompanyCardProps) => {
  // Function to determine badge color based on certification level
  const getCertificationColor = (level: string) => {
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
    <Card className="w-full hover:shadow-lg transition-shadow duration-200 border-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg text-gray-900">{name}</h3>
          {isNew && (
            <Badge variant="outline" className="bg-success-light text-success w-fit mt-2 font-medium">
              Recently Added
            </Badge>
          )}
        </div>
        <Badge
          variant="secondary"
          className={`font-medium border ${getCertificationColor(certificationLevel)}`}
        >
          {certificationLevel}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
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
        <div className="flex items-center text-gray-700">
          <Users className="h-4 w-4 mr-2 text-primary" />
          <span>{employeeCount} employees</span>
        </div>
        <div className="flex items-center text-gray-700">
          <Building2 className="h-4 w-4 mr-2 text-primary" />
          <span>{industry}</span>
        </div>
        <div className="flex items-center text-gray-700">
          <MapPin className="h-4 w-4 mr-2 text-primary" />
          <span>{country}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full hover:bg-primary hover:text-white transition-colors">
          See Details
        </Button>
      </CardFooter>
    </Card>
  );
};