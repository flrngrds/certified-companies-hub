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
  publicationDate?: string;
  sourceLink?: string;
  lastVerified?: string;
  keywords?: string;
  linkedin?: string;
  annualRevenue?: string;
}

const transformCompanyData = (data: any): Company => ({
  name: data.Entreprise || 'Unknown Company',
  website: data.Website || '#',
  certificationLevel: data.Niveau || 'Not Specified',
  employeeCount: data.Employees?.toString() || 'Not Specified',
  industry: data.Industry || 'Not Specified',
  country: data.Country || 'Not Specified',
  isNew: data["Date de création"] ? 
    new Date(data["Date de création"]) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) : 
    false,
  logo: data.image || '/placeholder.svg',
  description: data.Description || 'No description available.',
  publicationDate: data["Publication source"] || 'Not Specified',
  sourceLink: data.Lien || '#',
  lastVerified: data["Last verified"] || 'Not Specified',
  keywords: data.Keywords || 'No keywords available',
  linkedin: data.LinkedIn || '#',
  annualRevenue: data["Annual Revenue"] || 'Not Specified'
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
      if (filters?.industry) {
        query = query.ilike('Industry', `%${filters.industry}%`);
      }
      if (filters?.country) {
        query = query.ilike('Country', `%${filters.country}%`);
      }
      if (filters?.certLevel) {
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
        query = query.ilike('Entreprise', `%${filters.searchTerm}%`);
      }

      // Add pagination
      const from = page * limit;
      const to = from + limit - 1;
      
      const { data, error, count } = await query
        .order('Entreprise')
        .range(from, to);

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