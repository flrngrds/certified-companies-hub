import { useState } from "react";
import { CompanyCard } from "@/components/CompanyCard";
import { Filters } from "@/components/Filters";
import { SearchFilters } from "@/components/SearchFilters";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";

// Mock data for demonstration
const MOCK_COMPANIES = [
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
  },
  {
    name: "HealthCare Plus",
    website: "www.healthcareplus.com",
    certificationLevel: "Gold",
    employeeCount: "500-1000",
    industry: "Healthcare",
  },
];

const Index = () => {
  const isMobile = useIsMobile();
  const [showFilters, setShowFilters] = useState(!isMobile);

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

            <SearchFilters />

            <section>
              <h3 className="text-lg font-medium mb-4">Latest Verified Companies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_COMPANIES.map((company, index) => (
                  <CompanyCard key={index} {...company} />
                ))}
              </div>
            </section>

            <div className="flex justify-center mt-8">
              <Button variant="outline">Load More</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;