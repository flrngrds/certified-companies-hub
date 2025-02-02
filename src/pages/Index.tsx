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
    <div className="min-h-screen bg-gray-50">
      <SidebarProvider>
        <Sidebar variant="inset" className="bg-sidebar">
          <SidebarHeader>
            <h2 className="px-4 text-xl font-semibold text-white">VadiBase</h2>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="sidebar-section-title">MENU</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Overview">
                    <Grid className="text-sidebar-text" />
                    <span>Overview</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Statistics">
                    <BarChart2 className="text-sidebar-text" />
                    <span>Statistics</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Customers">
                    <Users className="text-sidebar-text" />
                    <span>Customers</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Product">
                    <Package className="text-sidebar-text" />
                    <span>Product</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Messages">
                    <MessageSquare className="text-sidebar-text" />
                    <span>Messages</span>
                    <span className="sidebar-badge">13</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Transactions">
                    <Mail className="text-sidebar-text" />
                    <span>Transactions</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="sidebar-section-title">GENERAL</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Settings">
                    <Settings className="text-sidebar-text" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Security">
                    <Shield className="text-sidebar-text" />
                    <span>Security</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className={`md:w-64 flex-shrink-0 transition-all duration-200 ease-in-out ${
            showFilters ? "block" : "hidden md:block"
          }`}>
            <div className="w-full space-y-6 bg-white p-4 rounded-lg shadow-sm mb-6">
              <Select value={selectedDashboard} onValueChange={setSelectedDashboard}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select Dashboard" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="certified">Certified-EcoVadis</SelectItem>
                  <SelectItem value="non-certified">Non-EcoVadis-Certified</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Filters />
          </aside>

          <div className="flex-1 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Latest Companies</h2>
              <Button
                variant="outline"
                className="md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {LATEST_COMPANIES.map((company, index) => (
                <CompanyCard key={index} {...company} />
              ))}
            </div>

            <SearchFilters />

            <section className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-medium mb-6 text-gray-900">All Companies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedCompanies.map((company, index) => (
                  <CompanyCard key={index} {...company} />
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
        </div>
      </main>
      </SidebarProvider>
    </div>
  );
};

export default Index;
