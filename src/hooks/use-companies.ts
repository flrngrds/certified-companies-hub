import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Company {
  Entreprise: string;
  Niveau: string;
  Employees: number;
  Country: string;
  Website: string;
  "Date de création": string;
}

export const useLatestCompanies = () => {
  return useQuery({
    queryKey: ["latest-companies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("EcoVadis-certified")
        .select("Entreprise, Niveau, Employees, Country, Website, \"Date de création\"")
        .order("Date de création", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data as Company[];
    },
  });
};

export const useAllCompanies = (page: number, pageSize: number) => {
  return useQuery({
    queryKey: ["all-companies", page],
    queryFn: async () => {
      const { data, error, count } = await supabase
        .from("EcoVadis-certified")
        .select("Entreprise, Niveau, Employees, Country, Website", { count: "exact" })
        .order("Entreprise")
        .range(page * pageSize, (page + 1) * pageSize - 1);

      if (error) throw error;
      return {
        companies: data as Company[],
        total: count || 0,
      };
    },
  });
};