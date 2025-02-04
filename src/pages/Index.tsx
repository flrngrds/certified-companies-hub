import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filters } from "@/components/Filters";
import { SearchFilters } from "@/components/SearchFilters";
import { Header } from "@/components/Header";
import { LatestCompanies } from "@/components/LatestCompanies";
import { CompaniesList } from "@/components/CompaniesList";
import { useLatestCompanies, useAllCompanies } from "@/hooks/use-companies";
import { useToast } from "@/components/ui/use-toast";

const COMPANIES_PER_PAGE = 9;

const Index = () => {
  const isMobile = useIsMobile();
  const [showFilters, setShowFilters] = useState(!isMobile);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedDashboard, setSelectedDashboard] = useState("certified");
  const { toast } = useToast();
  
  const [filters, setFilters] = useState({
    industry: "",
    country: "",
    companySize: "",
    certLevel: "",
    searchTerm: "",
  });

  const { data: latestCompanies, isLoading: isLoadingLatest, error: latestError } = useLatestCompanies();
  const { data: allCompaniesData, isLoading: isLoadingAll, error: allError } = useAllCompanies(
    currentPage,
    COMPANIES_PER_PAGE,
    filters
  );

  if (latestError || allError) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to load companies data. Please try again later.",
    });
  }

  const handleFilterUpdate = (newFilters: Partial<typeof filters>) => {
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

      <div className="flex-1 md:ml-64">
        <Header onToggleFilters={() => setShowFilters(!showFilters)} />
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            {isLoadingLatest ? (
              <div>Loading latest companies...</div>
            ) : (
              <LatestCompanies companies={latestCompanies || []} />
            )}
            <SearchFilters onSearch={handleSearch} />
            {isLoadingAll ? (
              <div>Loading all companies...</div>
            ) : (
              <CompaniesList 
                companies={allCompaniesData?.companies || []}
                currentPage={currentPage}
                totalPages={Math.ceil((allCompaniesData?.total || 0) / COMPANIES_PER_PAGE)}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;