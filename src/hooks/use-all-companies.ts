
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Company } from "@/types/company";
import { transformCertifiedCompanyData, transformNonCertifiedCompanyData } from "@/utils/company-transformers";

export interface CompanyFilters {
  industry?: string;
  country?: string;
  companySize?: string;
  certLevel?: string;
  searchTerm?: string;
}

export const useAllCompanies = (
  page: number, 
  limit: number,
  isEcoVadisCertified: boolean = true,
  filters?: CompanyFilters
) => {
  return useQuery({
    queryKey: ["allCompanies", page, limit, isEcoVadisCertified, filters],
    queryFn: async () => {
      console.log("Fetching all companies with filters:", filters);
      let query = supabase
        .from(isEcoVadisCertified ? "EcoVadis-certified" : "Non-EcoVadis-certified")
        .select("*", { count: "exact" });

      // Apply filters
      if (filters?.industry) {
        query = query.ilike('Industry', `%${filters.industry}%`);
      }
      if (filters?.country) {
        query = query.ilike('Country', `%${filters.country}%`);
      }
      if (isEcoVadisCertified && filters?.certLevel) {
        query = query.ilike('Niveau', `%${filters.certLevel}%`);
      }
      if (filters?.companySize) {
        // Convert size range to numbers for comparison
        const [min, max] = filters.companySize.split('-').map(Number);
        if (max) {
          query = query.gte('Employees', min).lte('Employees', max);
        } else {
          // Handle "1000+" case
          query = query.gte('Employees', min);
        }
      }
      if (filters?.searchTerm) {
        query = query.ilike(isEcoVadisCertified ? 'Entreprise' : 'Company', `%${filters.searchTerm}%`);
      }

      // Add pagination
      const from = page * limit;
      const to = from + limit - 1;
      
      const { data, error, count } = await query
        .order(isEcoVadisCertified ? 'Entreprise' : 'Company')
        .range(from, to);

      if (error) {
        console.error("Error fetching all companies:", error);
        throw error;
      }

      console.log("All companies data:", data);
      return {
        companies: data ? data.map(isEcoVadisCertified ? transformCertifiedCompanyData : transformNonCertifiedCompanyData) : [],
        total: count || 0,
      };
    },
  });
};
