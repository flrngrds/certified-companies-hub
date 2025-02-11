
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Filters } from "@/components/Filters";
import { SearchFilters } from "@/components/SearchFilters";
import { Header } from "@/components/Header";
import { LatestCompanies } from "@/components/LatestCompanies";
import { CompaniesList } from "@/components/CompaniesList";
import { useLatestCompanies, useAllCompanies } from "@/hooks/use-companies";
import { useToast } from "@/components/ui/use-toast";
import { Disclaimer } from "@/components/Disclaimer";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const COMPANIES_PER_PAGE = 9;

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showFilters, setShowFilters] = useState(!isMobile);
  const [currentPage, setCurrentPage] = useState(0);
  const [isEcoVadisCertified, setIsEcoVadisCertified] = useState(true);
  const { toast } = useToast();
  
  const [filters, setFilters] = useState({
    industry: "",
    country: "",
    companySize: "",
    certLevel: "",
    searchTerm: "",
  });

  // Check authentication status when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access the dashboard.",
          variant: "destructive",
        });
        navigate("/login");
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate("/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const { data: latestCompanies, isLoading: isLoadingLatest, error: latestError } = useLatestCompanies(isEcoVadisCertified);
  const { data: allCompaniesData, isLoading: isLoadingAll, error: allError } = useAllCompanies(
    currentPage,
    COMPANIES_PER_PAGE,
    isEcoVadisCertified,
    filters
  );

  // Handle errors using useEffect instead of during render
  useEffect(() => {
    if (latestError || allError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load companies data. Please try again later.",
      });
    }
  }, [latestError, allError, toast]);

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

  const handleCertificationTypeChange = (certified: boolean) => {
    setIsEcoVadisCertified(certified);
    handleResetFilters();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Overlay when sidebar is shown on mobile */}
      {showFilters && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setShowFilters(false)}
        />
      )}
      
      {/* Mobile Toggle Button - Fixed position */}
      {isMobile && (
        <Button
          variant="secondary"
          size="icon"
          className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg bg-primary hover:bg-primary/90"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Menu className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 z-40 h-screen bg-[#006A60] text-white w-64 transition-transform duration-300 ease-in-out ${
          showFilters ? "translate-x-0" : "-translate-x-full"
        } ${!isMobile ? "translate-x-0" : ""}`}
      >
        <div className="p-4 overflow-y-auto h-full">
          <h1 className="text-2xl font-bold text-white mb-8">VadiBase</h1>
          <Filters 
            onFilterChange={handleFilterUpdate} 
            onResetFilters={handleResetFilters}
            onCertificationTypeChange={handleCertificationTypeChange}
            isEcoVadisCertified={isEcoVadisCertified}
          />
        </div>
      </aside>

      {/* Main Content */}
      <div className={`${!isMobile ? "pl-64" : ""} w-full`}>
        <Header onToggleFilters={() => setShowFilters(!showFilters)} />
        <main className="w-full px-4 py-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {!isEcoVadisCertified && <Disclaimer />}
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
                totalCompanies={allCompaniesData?.total}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
