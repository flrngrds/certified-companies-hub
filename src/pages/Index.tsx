import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filters } from "@/components/Filters";
import { SearchFilters } from "@/components/SearchFilters";
import { Header } from "@/components/Header";
import { LatestCompanies } from "@/components/LatestCompanies";
import { CompaniesList } from "@/components/CompaniesList";

// Move these to a separate data file if they grow larger
const LATEST_COMPANIES = [
  {
    name: "TechCorp Solutions",
    website: "www.techcorp.com",
    certificationLevel: "Gold",
    employeeCount: "500-1000",
    industry: "Technology",
    country: "United States",
    isNew: true,
    logo: "/placeholder.svg",
    description: "Leading provider of innovative technology solutions for enterprise businesses.",
  },
  {
    name: "Green Energy Co",
    website: "www.greenenergy.com",
    certificationLevel: "Platinum",
    employeeCount: "1000+",
    industry: "Energy",
    country: "Germany",
    isNew: true,
    logo: "/placeholder.svg",
    description: "Pioneering sustainable energy solutions for a greener future.",
  },
  {
    name: "BuildRight Construction",
    website: "www.buildright.com",
    certificationLevel: "Silver",
    employeeCount: "100-500",
    industry: "Construction",
    country: "United Kingdom",
    isNew: true,
    logo: "/placeholder.svg",
    description: "Expert construction services with a focus on quality and sustainability.",
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
    logo: "/placeholder.svg",
    description: "Innovative healthcare solutions provider focused on patient care.",
  },
  {
    name: "Global Logistics",
    website: "www.globallogistics.com",
    certificationLevel: "Platinum",
    employeeCount: "1000+",
    industry: "Transportation",
    country: "France",
    logo: "/placeholder.svg",
    description: "Leading logistics provider with a global reach.",
  },
  {
    name: "EcoFriendly Solutions",
    website: "www.ecofriendly.com",
    certificationLevel: "Gold",
    employeeCount: "100-500",
    industry: "Environmental",
    country: "Australia",
    logo: "/placeholder.svg",
    description: "Committed to sustainable practices and eco-friendly solutions.",
  },
  {
    name: "Digital Innovations",
    website: "www.digitalinnovations.com",
    certificationLevel: "Silver",
    employeeCount: "100-500",
    industry: "Technology",
    country: "Japan",
    logo: "/placeholder.svg",
    description: "Transforming businesses through digital innovation.",
  },
  {
    name: "Smart Manufacturing",
    website: "www.smartmanufacturing.com",
    certificationLevel: "Gold",
    employeeCount: "500-1000",
    industry: "Manufacturing",
    country: "Germany",
    logo: "/placeholder.svg",
    description: "Leading the way in smart manufacturing solutions.",
  },
  {
    name: "Cloud Services Pro",
    website: "www.cloudservicespro.com",
    certificationLevel: "Platinum",
    employeeCount: "100-500",
    industry: "Technology",
    country: "United States",
    logo: "/placeholder.svg",
    description: "Providing top-notch cloud services for businesses.",
  },
];

interface FilterState {
  industry: string;
  country: string;
  companySize: string;
  certLevel: string;
  searchTerm: string;
}

const Index = () => {
  const isMobile = useIsMobile();
  const [showFilters, setShowFilters] = useState(!isMobile);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedDashboard, setSelectedDashboard] = useState("certified");
  const [filters, setFilters] = useState<FilterState>({
    industry: "",
    country: "",
    companySize: "",
    certLevel: "",
    searchTerm: "",
  });
  const companiesPerPage = 9;

  const filterCompanies = (companies: typeof ALL_COMPANIES) => {
    return companies.filter((company) => {
      const matchesSearch = !filters.searchTerm || 
        company.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const matchesCountry = !filters.country || 
        company.country.toLowerCase() === filters.country.toLowerCase().replace(/-/g, ' ');
      const matchesSize = !filters.companySize || 
        company.employeeCount === filters.companySize;
      const matchesLevel = !filters.certLevel || filters.certLevel === 'all' || 
        company.certificationLevel.toLowerCase() === filters.certLevel.toLowerCase();
      const matchesIndustry = !filters.industry || 
        company.industry.toLowerCase() === filters.industry.toLowerCase();
      
      return matchesSearch && matchesCountry && matchesSize && matchesLevel && matchesIndustry;
    });
  };

  const filteredCompanies = filterCompanies(ALL_COMPANIES);
  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);
  const paginatedCompanies = filteredCompanies.slice(
    currentPage * companiesPerPage,
    (currentPage + 1) * companiesPerPage
  );

  const handleFilterUpdate = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(0);
  };

  const handleSearch = (searchTerm: string, certLevel: string) => {
    handleFilterUpdate({ searchTerm, certLevel });
  };

  const handleResetFilters = () => {
    setFilters({
      industry: "",
      country: "",
      companySize: "",
      certLevel: "",
      searchTerm: "",
    });
    setCurrentPage(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 z-30 h-screen bg-[#006A60] text-white w-64 flex-shrink-0 transition-all duration-200 ease-in-out overflow-y-auto ${
          showFilters ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4">
          <h1 className="text-2xl font-bold text-white mb-8">VadiBase</h1>
          <div className="space-y-6 mb-6">
            <Select value={selectedDashboard} onValueChange={setSelectedDashboard}>
              <SelectTrigger className="w-full bg-white text-gray-900 border-white/20">
                <SelectValue placeholder="Select Dashboard" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="certified">Certified-EcoVadis</SelectItem>
                <SelectItem value="non-certified">Non-EcoVadis-Certified</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Filters 
            onFilterChange={handleFilterUpdate} 
            onResetFilters={handleResetFilters}
          />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        <Header onToggleFilters={() => setShowFilters(!showFilters)} />
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            <LatestCompanies companies={LATEST_COMPANIES} />
            <SearchFilters onSearch={handleSearch} />
            <CompaniesList 
              companies={paginatedCompanies}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
