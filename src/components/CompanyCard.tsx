import { Building2, Globe, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CompanyCardProps {
  name: string;
  website: string;
  certificationLevel: string;
  employeeCount: string;
  industry: string;
  isNew?: boolean;
}

export const CompanyCard = ({
  name,
  website,
  certificationLevel,
  employeeCount,
  industry,
  isNew = false,
}: CompanyCardProps) => {
  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg">{name}</h3>
          {isNew && (
            <Badge variant="outline" className="bg-success-light text-success w-fit mt-2">
              Recently Added
            </Badge>
          )}
        </div>
        <Badge
          variant="secondary"
          className="bg-primary-light text-primary font-medium"
        >
          {certificationLevel}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center text-secondary">
          <Globe className="h-4 w-4 mr-2" />
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-hover"
          >
            {website}
          </a>
        </div>
        <div className="flex items-center text-secondary">
          <Users className="h-4 w-4 mr-2" />
          <span>{employeeCount} employees</span>
        </div>
        <div className="flex items-center text-secondary">
          <Building2 className="h-4 w-4 mr-2" />
          <span>{industry}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          See Details
        </Button>
      </CardFooter>
    </Card>
  );
};