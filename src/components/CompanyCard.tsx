import { Building2, Globe, Users, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CompanyCardProps {
  name: string;
  website: string;
  certificationLevel: string;
  employeeCount: string;
  industry: string;
  country: string;
  isNew?: boolean;
  logo?: string;
  description?: string;
  showAllDetails?: boolean;
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
  showAllDetails = false,
}: CompanyCardProps) => {
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
    <Card className="w-full bg-white hover:shadow-lg transition-shadow duration-200 border-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
            <img
              src={logo}
              alt={`${name} logo`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-lg text-gray-900">{name}</h3>
            {isNew && (
              <Badge variant="outline" className="bg-success-light text-success w-fit mt-2 font-medium">
                Recently Added
              </Badge>
            )}
          </div>
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
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full bg-primary hover:bg-primary-hover text-white">
              See Details
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-4">
                <img
                  src={logo}
                  alt={`${name} logo`}
                  className="w-12 h-12 rounded-full"
                />
                {name}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-4">
                <p className="text-sm text-gray-600">{description}</p>
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
                    <h4 className="font-semibold text-sm text-gray-700">Certification</h4>
                    <Badge
                      variant="secondary"
                      className={`mt-1 ${getCertificationColor(certificationLevel)}`}
                    >
                      {certificationLevel}
                    </Badge>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Website</h4>
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-hover text-sm font-medium"
                  >
                    {website}
                  </a>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};