import { CompanyCard } from "@/components/CompanyCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

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

interface CompaniesListProps {
  companies: Company[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalCompanies?: number;
}

export const CompaniesList = ({ 
  companies, 
  currentPage, 
  totalPages, 
  onPageChange,
  totalCompanies 
}: CompaniesListProps) => {
  return (
    <section className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">All Companies</h3>
        <span className="text-sm text-gray-600">
          {totalCompanies || companies.length} EcoVadis-certified companies
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company, index) => (
          <CompanyCard key={index} {...company} showAllDetails={true} />
        ))}
      </div>
      
      <div className="flex justify-center items-center gap-4 mt-6">
        {currentPage > 0 && (
          <Button
            variant="outline"
            onClick={() => onPageChange(Math.max(0, currentPage - 1))}
            className="hover:bg-primary hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
        )}
        <span className="text-sm font-medium text-gray-700">
          Page {currentPage + 1} of {totalPages}
        </span>
        {currentPage < totalPages - 1 && (
          <Button
            variant="outline"
            onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
            className="hover:bg-primary hover:text-white"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </section>
  );
};