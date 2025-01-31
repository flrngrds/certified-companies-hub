import { useState } from "react";
import { CompanyCard } from "@/components/CompanyCard";
import { Filters } from "@/components/Filters";
import { SearchFilters } from "@/components/SearchFilters";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, ArrowLeft, ArrowRight } from "lucide-react";

// Mock data for demonstration
const LATEST_COMPANIES = [
  {
    name: "TechCorp Solutions",
    website: "www.techcorp.com",
    certificationLevel: "Gold",
    employeeCount: "500-1000",
    industry: "Technology",
    country: "United States",
    isNew: true,
  },
  {
    name: "Green Energy Co",
    website: "www.greenenergy.com",
    certificationLevel: "Platinum",
    employeeCount: "1000+",
    industry: "Energy",
    country: "Germany",
    isNew: true,
  },
  {
    name: "BuildRight Construction",
    website: "www.buildright.com",
    certificationLevel: "Silver",
    employeeCount: "100-500",
    industry: "Construction",
    country: "United Kingdom",
    isNew: true,
  },
];

const ALL_COMPANIES = [
  ...LATEST_COMPANIES,
  {
    name: "HealthCare Plus",
    website: "www.healthcareplus.com",
    certificationLevel: "Gold",
    employeeCount: "500-1000",
    industry: "Healthcare",
    country: "Canada",
  },
  {
    name: "Global Logistics",
    website: "www.globallogistics.com",
    certificationLevel: "Platinum",
    employeeCount: "1000+",
    industry: "Transportation",
    country: "France",
  },
  {
    name: "EcoFriendly Solutions",
    website: "www.ecofriendly.com",
    certificationLevel: "Gold",
    employeeCount: "100-500",
    industry: "Environmental",
    country: "Australia",
  },
  {
    name: "Digital Innovations",
    website: "www.digitalinnovations.com",
    certificationLevel: "Silver",
    employeeCount: "100-500",
    industry: "Technology",
    country: "Japan",
  },
  {
    name: "Smart Manufacturing",
    website: "www.smartmanufacturing.com",
    certificationLevel: "Gold",
    employeeCount: "500-1000",
    industry: "Manufacturing",
    country: "Germany",
  },
  {
    name: "Cloud Services Pro",
    website: "www.cloudservicespro.com",
    certificationLevel: "Platinum",
    employeeCount: "100-500",
    industry: "Technology",
    country: "United States",
  },
];

const Index = () => {
  const isMobile = useIsMobile();
  const [showFilters, setShowFilters] = useState(!isMobile);
  const [currentPage, setCurrentPage] = useState(0);
  const companiesPerPage = 9;

  const totalPages = Math.ceil(ALL_COMPANIES.length / companiesPerPage);
  const paginatedCompanies = ALL_COMPANIES.slice(
    currentPage * companiesPerPage,
    (currentPage + 1) * companiesPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">CertifyDB</h1>
            <Button variant="ghost">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside
            className={`md:w-64 flex-shrink-0 transition-all duration-200 ease-in-out ${
              showFilters ? "block" : "hidden md:block"
            }`}
          >
            <Filters />
          </aside>

          <div className="flex-1 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Certified Companies</h2>
              <Button
                variant="outline"
                className="md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>

            <section className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-medium mb-6 text-gray-900">Latest Verified Companies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {LATEST_COMPANIES.map((company, index) => (
                  <CompanyCard key={index} {...company} />
                ))}
              </div>
            </section>

            <SearchFilters />

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="hover:bg-primary-light"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <span className="text-sm font-medium text-gray-700">
                Page {currentPage + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
                }
                disabled={currentPage === totalPages - 1}
                className="hover:bg-primary-light"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            <section className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-medium mb-6 text-gray-900">All Companies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedCompanies.map((company, index) => (
                  <CompanyCard key={index} {...company} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;