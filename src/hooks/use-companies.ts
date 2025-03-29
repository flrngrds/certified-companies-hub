import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Company {
  name: string;
  website: string;
  certificationLevel: string | null;
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
  isEcoVadisCertified?: boolean;
  addedAt?: string; // Pour capturer la date de création pour trier
}

const transformCertifiedCompanyData = (data: any): Company => {
  // Parse the creation date string into a Date object
  const creationDate = data["Date de création"] ? new Date(data["Date de création"].replace(/pm|am/i, '').trim()) : null;
  const isNew = creationDate ? 
    (new Date().getTime() - creationDate.getTime()) < (30 * 24 * 60 * 60 * 1000) : // Consider companies added in last 30 days as new
    false;

  return {
    name: data.Entreprise || 'Unknown Company',
    website: data.Website || '#',
    certificationLevel: data.Niveau || null,
    employeeCount: data.Employees?.toString() || 'Not Specified',
    industry: data.Industry || 'Not Specified',
    country: data.Country || 'Not Specified',
    isNew,
    logo: data.image || '/placeholder.svg',
    description: data.Description || 'No description available.',
    publicationDate: data["Publication source"] || 'Not Specified',
    sourceLink: data.Lien || '#',
    lastVerified: data["Last verified"] || 'Not Specified',
    keywords: data.Keywords || 'No keywords available',
    linkedin: data.LinkedIn || '#',
    annualRevenue: data["Annual Revenue"]?.toString() || 'Not Specified',
    isEcoVadisCertified: true,
    addedAt: data["Date de création"] || null
  };
};

const transformNonCertifiedCompanyData = (data: any): Company => {
  // Parse the creation date string into a Date object
  const creationDate = data["Date de création"] ? new Date(data["Date de création"].replace(/pm|am/i, '').trim()) : null;
  const isNew = creationDate ? 
    (new Date().getTime() - creationDate.getTime()) < (30 * 24 * 60 * 60 * 1000) : // Consider companies added in last 30 days as new
    false;

  return {
    name: data.Company || 'Unknown Company',
    website: data.Website || '#',
    certificationLevel: null,
    employeeCount: data.Employees?.toString() || 'Not Specified',
    industry: data.Industry || 'Not Specified',
    country: data.Country || 'Not Specified',
    isNew,
    logo: data.Logo || '/placeholder.svg',
    description: 'No description available.',
    lastVerified: data["Last verified"] || 'Not Specified',
    keywords: data.Keywords || 'No keywords available',
    annualRevenue: data["Annual Revenue"]?.toString() || 'Not Specified',
    isEcoVadisCertified: false,
    addedAt: data["Date de création"] || null
  };
};

export const useLatestCompanies = (isEcoVadisCertified: boolean = true) => {
  return useQuery({
    queryKey: ["latestCompanies", isEcoVadisCertified],
    queryFn: async () => {
      console.log(`Fetching latest ${isEcoVadisCertified ? 'certified' : 'non-certified'} companies...`);
      
      // Make sure to properly convert date strings for sorting
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
      
      // Custom sort function to handle date strings properly
      companies.sort((a, b) => {
        const dateA = a["Date de création"] ? new Date(a["Date de création"].replace(/pm|am/i, '').trim()) : new Date(0);
        const dateB = b["Date de création"] ? new Date(b["Date de création"].replace(/pm|am/i, '').trim()) : new Date(0);
        return dateB.getTime() - dateA.getTime(); // Descending order (newest first)
      });

      // Get the top 3 companies after sorting
      const latestCompanies = companies.slice(0, 3);
      console.log("Latest 3 companies after sorting:", latestCompanies);
      
      return latestCompanies.map(isEcoVadisCertified ? transformCertifiedCompanyData : transformNonCertifiedCompanyData);
    },
  });
};

export const useAllCompanies = (
  page: number, 
  limit: number,
  isEcoVadisCertified: boolean = true,
  filters?: {
    industry?: string;
    country?: string;
    companySize?: string;
    certLevel?: string;
    searchTerm?: string;
  }
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
