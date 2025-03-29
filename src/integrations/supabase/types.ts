export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      blog: {
        Row: {
          content: string | null
          created_at: string
          id: number
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: number
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: number
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      "EcoVadis-certified": {
        Row: {
          "Annual Revenue": string | null
          Calcul: string | null
          Certifiée: string | null
          City: string | null
          "Company location": string | null
          Country: string | null
          "Date de création": string | null
          "Date de modification": string | null
          Employees: number | null
          Entreprise: string
          Founded: number | null
          id: number
          image: string | null
          Industry: string | null
          Keywords: string | null
          "Last verified": string | null
          Libellé: string | null
          Lien: string | null
          LinkedIn: string | null
          Logo: string | null
          Niveau: string | null
          "Publication source": string | null
          "Remove website": string | null
          Street: string | null
          Website: string | null
        }
        Insert: {
          "Annual Revenue"?: string | null
          Calcul?: string | null
          Certifiée?: string | null
          City?: string | null
          "Company location"?: string | null
          Country?: string | null
          "Date de création"?: string | null
          "Date de modification"?: string | null
          Employees?: number | null
          Entreprise: string
          Founded?: number | null
          id?: number
          image?: string | null
          Industry?: string | null
          Keywords?: string | null
          "Last verified"?: string | null
          Libellé?: string | null
          Lien?: string | null
          LinkedIn?: string | null
          Logo?: string | null
          Niveau?: string | null
          "Publication source"?: string | null
          "Remove website"?: string | null
          Street?: string | null
          Website?: string | null
        }
        Update: {
          "Annual Revenue"?: string | null
          Calcul?: string | null
          Certifiée?: string | null
          City?: string | null
          "Company location"?: string | null
          Country?: string | null
          "Date de création"?: string | null
          "Date de modification"?: string | null
          Employees?: number | null
          Entreprise?: string
          Founded?: number | null
          id?: number
          image?: string | null
          Industry?: string | null
          Keywords?: string | null
          "Last verified"?: string | null
          Libellé?: string | null
          Lien?: string | null
          LinkedIn?: string | null
          Logo?: string | null
          Niveau?: string | null
          "Publication source"?: string | null
          "Remove website"?: string | null
          Street?: string | null
          Website?: string | null
        }
        Relationships: []
      }
      "Non-EcoVadis-certified": {
        Row: {
          "# Employees": string | null
          "Annual Revenue": number | null
          Calcul: string | null
          Certifiée: string | null
          City: string | null
          Company: string
          "Company Location": string | null
          Country: string | null
          "Date de création": string | null
          "Date de modification": string | null
          Employees: number | null
          Founded: number | null
          id: number
          image: string | null
          Industry: string | null
          Keywords: string | null
          "Last verified": string | null
          Lien: string | null
          Location: string | null
          Logo: string | null
          Niveau: string | null
          "Publication source": string | null
          Street: string | null
          Website: string | null
        }
        Insert: {
          "# Employees"?: string | null
          "Annual Revenue"?: number | null
          Calcul?: string | null
          Certifiée?: string | null
          City?: string | null
          Company: string
          "Company Location"?: string | null
          Country?: string | null
          "Date de création"?: string | null
          "Date de modification"?: string | null
          Employees?: number | null
          Founded?: number | null
          id?: number
          image?: string | null
          Industry?: string | null
          Keywords?: string | null
          "Last verified"?: string | null
          Lien?: string | null
          Location?: string | null
          Logo?: string | null
          Niveau?: string | null
          "Publication source"?: string | null
          Street?: string | null
          Website?: string | null
        }
        Update: {
          "# Employees"?: string | null
          "Annual Revenue"?: number | null
          Calcul?: string | null
          Certifiée?: string | null
          City?: string | null
          Company?: string
          "Company Location"?: string | null
          Country?: string | null
          "Date de création"?: string | null
          "Date de modification"?: string | null
          Employees?: number | null
          Founded?: number | null
          id?: number
          image?: string | null
          Industry?: string | null
          Keywords?: string | null
          "Last verified"?: string | null
          Lien?: string | null
          Location?: string | null
          Logo?: string | null
          Niveau?: string | null
          "Publication source"?: string | null
          Street?: string | null
          Website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      "Reported Error": {
        Row: {
          certification_level: string | null
          client_id: string | null
          company_name: string | null
          created_at: string
          id: number
          message: string | null
          publication_date: string | null
          source_url: string | null
        }
        Insert: {
          certification_level?: string | null
          client_id?: string | null
          company_name?: string | null
          created_at?: string
          id?: number
          message?: string | null
          publication_date?: string | null
          source_url?: string | null
        }
        Update: {
          certification_level?: string | null
          client_id?: string | null
          company_name?: string | null
          created_at?: string
          id?: number
          message?: string | null
          publication_date?: string | null
          source_url?: string | null
        }
        Relationships: []
      }
      stripe_customers: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          id: string
          price_id: string | null
          stripe_customer_id: string | null
          subscription_id: string | null
          subscription_status: string | null
          trial_end: string | null
          updated_at: string | null
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          id: string
          price_id?: string | null
          stripe_customer_id?: string | null
          subscription_id?: string | null
          subscription_status?: string | null
          trial_end?: string | null
          updated_at?: string | null
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          price_id?: string | null
          stripe_customer_id?: string | null
          subscription_id?: string | null
          subscription_status?: string | null
          trial_end?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
