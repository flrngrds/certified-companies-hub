
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Download, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

const LeadsExport = () => {
  const [countries, setCountries] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const { data, error } = await supabase
        .from("EcoVadis-certified")
        .select("Country")
        .not("Country", "eq", null)
        .order("Country");

      if (error) throw error;

      const uniqueCountries = Array.from(new Set(data.map(item => item.Country)));
      setCountries(uniqueCountries);
    } catch (error) {
      console.error("Error fetching countries:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch countries. Please try again.",
      });
    }
  };

  const handleExport = async () => {
    if (!selectedCountry) {
      toast({
        variant: "destructive",
        title: "Country Required",
        description: "Please select a country before downloading leads.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("EcoVadis-certified")
        .select("*")
        .eq("Country", selectedCountry)
        .order("id", { ascending: false })
        .limit(15); // Changed from 20 to 15

      if (error) throw error;

      if (!data || data.length === 0) {
        toast({
          variant: "destructive",
          title: "No Data",
          description: "No companies found for the selected country.",
        });
        return;
      }

      // Format data for CSV
      const csvData = data.map(company => ({
        Company: company.Entreprise || "",
        Website: company.Website || "",
        Link: company.Lien || "", // Added Link column
        CertificationLevel: company.Niveau || "",
        Industry: company.Industry || "",
        Country: company.Country || "",
        Employees: company.Employees || "",
        "Annual Revenue": company["Annual Revenue"] || "",
        "Last Verified": company["Last verified"] || "",
        "LinkedIn": company.LinkedIn || "",
      }));

      // Convert to CSV
      const headers = Object.keys(csvData[0]);
      const csvString = [
        headers.join(","),
        ...csvData.map(row => 
          headers.map(header => 
            JSON.stringify(row[header as keyof typeof row] || "")
          ).join(",")
        )
      ].join("\n");

      // Create and download file
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `vadibase-leads-${selectedCountry.toLowerCase()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Success",
        description: "Leads exported successfully!",
      });
    } catch (error) {
      console.error("Error exporting leads:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to export leads. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-xl font-semibold text-gray-900">
              VadiBase
            </div>
            <div className="space-x-4">
              <Link to="/login">
                <Button variant="outline">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* SEO Meta Tag */}
        <meta name="robots" content="noindex" />
        
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="bg-white p-8 rounded-lg shadow-sm space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900">Export Company Leads</h1>
            
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Select Country
              </label>
              <Select
                value={selectedCountry}
                onValueChange={setSelectedCountry}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a country" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleExport}
              disabled={isLoading || !selectedCountry}
              className="w-full"
            >
              {isLoading ? (
                "Generating Export..."
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download Leads
                </>
              )}
            </Button>

            <p className="text-sm text-gray-500 mt-4">
              This will export the 15 most recently added companies from the selected country.
            </p>
          </div>
          
          {/* Call-to-action section */}
          <div className="bg-gradient-to-r from-primary to-primary-hover p-8 rounded-lg shadow-sm text-white">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Unlock Premium Leads Access</h2>
              <p className="text-white/90">
                With a VadiBase subscription, you can access unlimited leads, detailed company information, and advanced filtering options.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                <div className="flex items-start">
                  <div className="bg-white/20 p-1 rounded mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="text-sm">Unlimited exports</span>
                </div>
                <div className="flex items-start">
                  <div className="bg-white/20 p-1 rounded mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="text-sm">Advanced filters</span>
                </div>
                <div className="flex items-start">
                  <div className="bg-white/20 p-1 rounded mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="text-sm">Full contact details</span>
                </div>
                <div className="flex items-start">
                  <div className="bg-white/20 p-1 rounded mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="text-sm">Weekly new leads alerts</span>
                </div>
              </div>
              <Link to="/signup">
                <Button className="w-full mt-2 bg-white text-primary hover:bg-gray-100">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadsExport;
