import { useState } from "react";
import { CompanyCard } from "@/components/CompanyCard";
import { Filters } from "@/components/Filters";
import { SearchFilters } from "@/components/SearchFilters";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, ArrowLeft, ArrowRight, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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

const Index = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(!isMobile);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedDashboard, setSelectedDashboard] = useState("certified");
  const companiesPerPage = 9;

  const totalPages = Math.ceil(ALL_COMPANIES.length / companiesPerPage);
  const paginatedCompanies = ALL_COMPANIES.slice(
    currentPage * companiesPerPage,
    (currentPage + 1) * companiesPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside 
        className={`fixed left-0 top-0 h-screen bg-[#006A60] text-white w-64 flex-shrink-0 transition-all duration-200 ease-in-out overflow-y-auto ${
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
          <Filters />
        </div>
      </aside>

      <div className="flex-1 md:ml-64">
        <header className="bg-white border-b shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                className="md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Menu className="h-6 w-6" />
              </Button>
              <div className="flex items-center gap-2 ml-auto">
                <Button 
                  variant="ghost" 
                  className="hover:bg-primary-light flex items-center gap-2"
                  onClick={() => navigate('/profile')}
                >
                  <User className="h-5 w-5 text-primary" />
                  <span className="text-primary">Profile</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Latest Companies</h2>
            </div>

            <div className="relative">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {LATEST_COMPANIES.map((company, index) => (
                    <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/5">
                      <CompanyCard {...company} showAllDetails={false} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
              </Carousel>
            </div>

            <SearchFilters />

            <section className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-medium mb-6 text-gray-900">All Companies</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {paginatedCompanies.map((company, index) => (
                  <CompanyCard key={index} {...company} showAllDetails={true} />
                ))}
              </div>
              
              <div className="flex justify-center items-center gap-4 mt-6">
                {currentPage > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
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
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
                    }
                    className="hover:bg-primary hover:text-white"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
