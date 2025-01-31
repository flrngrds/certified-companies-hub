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
    isNew: true,
  },
  {
    name: "Green Energy Co",
    website: "www.greenenergy.com",
    certificationLevel: "Platinum",
    employeeCount: "1000+",
    industry: "Energy",
    isNew: true,
  },
  {
    name: "BuildRight Construction",
    website: "www.buildright.com",
    certificationLevel: "Silver",
    employeeCount: "100-500",
    industry: "Construction",
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
  },
  {
    name: "Global Logistics",
    website: "www.globallogistics.com",
    certificationLevel: "Platinum",
    employeeCount: "1000+",
    industry: "Transportation",
  },
  {
    name: "EcoFriendly Solutions",
    website: "www.ecofriendly.com",
    certificationLevel: "Gold",
    employeeCount: "100-500",
    industry: "Environmental",
  },
  // ... Adding more companies to reach 10
  {
    name: "Digital Innovations",
    website: "www.digitalinnovations.com",
    certificationLevel: "Silver",
    employeeCount: "100-500",
    industry: "Technology",
  },
  {
    name: "Smart Manufacturing",
    website: "www.smartmanufacturing.com",
    certificationLevel: "Gold",
    employeeCount: "500-1000",
    industry: "Manufacturing",
  },
  {
    name: "Cloud Services Pro",
    website: "www.cloudservicespro.com",
    certificationLevel: "Platinum",
    employeeCount: "100-500",
    industry: "Technology",
  },
  {
    name: "Sustainable Foods",
    website: "www.sustainablefoods.com",
    certificationLevel: "Silver",
    employeeCount: "500-1000",
    industry: "Food & Beverage",
  },
];

const Index = () => {
  const isMobile = useIsMobile();
  const [showFilters, setShowFilters] = useState(!isMobile);
  const [currentPage, setCurrentPage] = useState(0);
  const companiesPerPage = 10;

  const totalPages = Math.ceil(ALL_COMPANIES.length / companiesPerPage);
  const paginatedCompanies = ALL_COMPANIES.slice(
    currentPage * companiesPerPage,
    (currentPage + 1) * companiesPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
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
          {/* Filters Sidebar */}
          <aside
            className={`md:w-64 flex-shrink-0 transition-all duration-200 ease-in-out ${
              showFilters ? "block" : "hidden md:block"
            }`}
          >
            <Filters />
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Certified Companies</h2>
              <Button
                variant="outline"
                className="md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>

            {/* Latest Verified Companies Section */}
            <section>
              <h3 className="text-lg font-medium mb-4">Latest Verified Companies</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {LATEST_COMPANIES.map((company, index) => (
                  <CompanyCard key={index} {...company} />
                ))}
              </div>
            </section>

            <SearchFilters />

            {/* All Companies Section with Pagination */}
            <section>
              <h3 className="text-lg font-medium mb-4">All Companies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedCompanies.map((company, index) => (
                  <CompanyCard key={index} {...company} />
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
                  }
                  disabled={currentPage === totalPages - 1}
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;