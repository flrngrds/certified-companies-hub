
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Company } from "@/types/company";
import { transformCertifiedCompanyData, transformNonCertifiedCompanyData } from "@/utils/company-transformers";
import { parseDate } from "@/utils/date-utils";

export const useLatestCompanies = (isEcoVadisCertified: boolean = true) => {
  return useQuery({
    queryKey: ["latestCompanies", isEcoVadisCertified],
    queryFn: async () => {
      console.log(`Fetching latest ${isEcoVadisCertified ? 'certified' : 'non-certified'} companies...`);
      
      const { data, error } = await supabase
        .from(isEcoVadisCertified ? "EcoVadis-certified" : "Non-EcoVadis-certified")
        .select("*");

      if (error) {
        console.error("Error fetching latest companies:", error);
        throw error;
      }

      console.log("Raw companies data:", data);
      
      // Process the data on the client side to ensure proper date sorting
      let companies = data || [];
      
      // Custom sort function to handle date strings properly for Last verified field
      companies.sort((a, b) => {
        const dateA = parseDate(a["Last verified"]) || new Date(0);
        const dateB = parseDate(b["Last verified"]) || new Date(0);
        return dateB.getTime() - dateA.getTime(); // Descending order (newest first)
      });

      // Get the top 3 companies after sorting
      const latestCompanies = companies.slice(0, 3);
      console.log("Latest 3 companies after sorting by Last verified:", latestCompanies);
      
      return latestCompanies.map(isEcoVadisCertified ? transformCertifiedCompanyData : transformNonCertifiedCompanyData);
    },
  });
};
