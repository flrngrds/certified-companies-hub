
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
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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

      // Get unique countries
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
        .limit(20);

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
      <div className="container mx-auto px-4 py-8">
        {/* SEO Meta Tag */}
        <meta name="robots" content="noindex" />
        
        <div className="max-w-2xl mx-auto space-y-8">
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
                <SelectContent>
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
              This will export the 20 most recently added companies from the selected country.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadsExport;
