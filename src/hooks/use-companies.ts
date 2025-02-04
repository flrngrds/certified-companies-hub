import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Company {
  name: string;
  website: string;
  certificationLevel: string;
  employeeCount: string;
  industry: string;
  country: string;
  isNew?: boolean;
  logo?: string;
  description?: string;
}

const transformCompanyData = (data: any): Company => ({
  name: data.Entreprise || 'Unknown Company',
  website: data.Website || '#',
  certificationLevel: data.Niveau || 'Not Specified',
  employeeCount: data.Employees?.toString() || 'Not Specified',
  industry: data.Industry || 'Not Specified',
  country: data.Country || 'Not Specified',
  isNew: new Date(data["Date de création"]) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  logo: data.Logo || '/placeholder.svg',
  description: data.Description || 'No description available.'
});

export const useLatestCompanies = () => {
  return useQuery({
    queryKey: ["latestCompanies"],
    queryFn: async () => {
      console.log("Fetching latest companies...");
      const { data, error } = await supabase
        .from("EcoVadis-certified")
        .select("*")
        .order("Date de création", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Error fetching latest companies:", error);
        throw error;
      }

      console.log("Latest companies data:", data);
      return data ? data.map(transformCompanyData) : [];
    },
  });
};

export const useAllCompanies = (
  page: number, 
  limit: number,
  filters?: {
    industry?: string;
    country?: string;
    companySize?: string;
    certLevel?: string;
    searchTerm?: string;
  }
) => {
  return useQuery({
    queryKey: ["allCompanies", page, limit, filters],
    queryFn: async () => {
      console.log("Fetching all companies with filters:", filters);
      let query = supabase
        .from("EcoVadis-certified")
        .select("*", { count: "exact" });

      // Apply filters
      if (filters?.certLevel) {
        query = query.eq('Niveau', filters.certLevel);
      }
      if (filters?.country) {
        query = query.eq('Country', filters.country);
      }
      if (filters?.companySize) {
        // Convert size range to numbers for comparison
        const [min, max] = filters.companySize.split('-').map(Number);
        if (max) {
          query = query.gte('Employees', min).lte('Employees', max);
        } else {
          query = query.gte('Employees', min);
        }
      }
      if (filters?.searchTerm) {
        query = query.ilike('Entreprise', `%${filters.searchTerm}%`);
      }

      // Add pagination
      const { data, error, count } = await query
        .order('Entreprise')
        .range(page * limit, (page + 1) * limit - 1);

      if (error) {
        console.error("Error fetching all companies:", error);
        throw error;
      }

      console.log("All companies data:", data);
      return {
        companies: data ? data.map(transformCompanyData) : [],
        total: count || 0,
      };
    },
  });
};