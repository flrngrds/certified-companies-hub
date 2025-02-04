import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useLatestCompanies = () => {
  return useQuery({
    queryKey: ["latestCompanies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("EcoVadis-certified")
        .select("Entreprise, Niveau, Employees, Country, Website")
        .order("Date de création", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });
};

export const useAllCompanies = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["allCompanies", page],
    queryFn: async () => {
      // First get total count
      const { count } = await supabase
        .from("EcoVadis-certified")
        .select("*", { count: "exact", head: true });

      // Then get paginated data
      const { data, error } = await supabase
        .from("EcoVadis-certified")
        .select("Entreprise, Niveau, Employees, Country, Website")
        .order("Entreprise")
        .range(page * limit, (page + 1) * limit - 1);

      if (error) throw error;
      return {
        companies: data,
        total: count || 0,
      };
    },
  });
};