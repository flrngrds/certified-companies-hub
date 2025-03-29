
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
      
      // For debugging - log each company with its verification date
      companies.forEach(company => {
        const companyName = isEcoVadisCertified 
          ? (company as any).Entreprise 
          : (company as any).Company;
        
        const verifiedDate = company["Last verified"];
        const parsedDate = parseDate(verifiedDate);
        
        console.log(`Company: ${companyName}, Last verified: ${verifiedDate}, Parsed date:`, 
          parsedDate ? parsedDate.toISOString() : 'null');
      });
      
      // Custom sort function to handle date strings properly for Last verified field
      companies.sort((a, b) => {
        // Get the original date strings
        const dateStrA = a["Last verified"];
        const dateStrB = b["Last verified"];
        
        // Parse them using our improved parseDate function
        const dateA = parseDate(dateStrA);
        const dateB = parseDate(dateStrB);
        
        console.log(`Comparing dates: 
          A: ${(a as any).Entreprise || (a as any).Company} - ${dateStrA} → ${dateA ? dateA.toISOString() : 'null'}
          B: ${(b as any).Entreprise || (b as any).Company} - ${dateStrB} → ${dateB ? dateB.toISOString() : 'null'}`);
        
        // Handle null dates (put them at the end)
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;
        
        // Sort in descending order (newest first)
        return dateB.getTime() - dateA.getTime();
      });

      // Get the top 3 companies after sorting
      const latestCompanies = companies.slice(0, 3);
      console.log("Latest 3 companies after sorting by Last verified:", latestCompanies.map(c => ({
        name: isEcoVadisCertified ? (c as any).Entreprise : (c as any).Company,
        lastVerified: c["Last verified"],
        parsedDate: parseDate(c["Last verified"])
      })));
      
      // Transform the data to our Company type
      return latestCompanies.map(isEcoVadisCertified 
        ? transformCertifiedCompanyData 
        : transformNonCertifiedCompanyData);
    },
  });
};
