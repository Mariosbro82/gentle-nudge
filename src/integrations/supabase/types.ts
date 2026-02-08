export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      campaign_overrides: {
        Row: {
          active: boolean | null
          company_id: string | null
          end_date: string | null
          id: string
          start_date: string | null
          target_url: string
        }
        Insert: {
          active?: boolean | null
          company_id?: string | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          target_url: string
        }
        Update: {
          active?: boolean | null
          company_id?: string | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          target_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_overrides_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      chips: {
        Row: {
          active_mode: Database["public"]["Enums"]["chip_mode"] | null
          assigned_user_id: string | null
          company_id: string | null
          created_at: string | null
          id: string
          last_scan: string | null
          menu_data: Json | null
          review_data: Json | null
          target_url: string | null
          uid: string
          vcard_data: Json | null
        }
        Insert: {
          active_mode?: Database["public"]["Enums"]["chip_mode"] | null
          assigned_user_id?: string | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          last_scan?: string | null
          menu_data?: Json | null
          review_data?: Json | null
          target_url?: string | null
          uid: string
          vcard_data?: Json | null
        }
        Update: {
          active_mode?: Database["public"]["Enums"]["chip_mode"] | null
          assigned_user_id?: string | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          last_scan?: string | null
          menu_data?: Json | null
          review_data?: Json | null
          target_url?: string | null
          uid?: string
          vcard_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "chips_assigned_user_id_fkey"
            columns: ["assigned_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chips_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_templates: {
        Row: {
          id: string
          name: string
          description: string | null
          preview_image: string | null
          config: Json | null
          is_active: boolean | null
          sort_order: number | null
          created_at: string | null
        }
        Insert: {
          id: string
          name: string
          description?: string | null
          preview_image?: string | null
          config?: Json | null
          is_active?: boolean | null
          sort_order?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          preview_image?: string | null
          config?: Json | null
          is_active?: boolean | null
          sort_order?: number | null
          created_at?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          created_at: string | null
          crm_config: Json | null
          id: string
          name: string
          plan: Database["public"]["Enums"]["plan_type"] | null
        }
        Insert: {
          created_at?: string | null
          crm_config?: Json | null
          id?: string
          name: string
          plan?: Database["public"]["Enums"]["plan_type"] | null
        }
        Update: {
          created_at?: string | null
          crm_config?: Json | null
          id?: string
          name?: string
          plan?: Database["public"]["Enums"]["plan_type"] | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          captured_by_user_id: string | null
          chip_id: string | null
          created_at: string | null
          follow_up_sent: boolean | null
          id: string
          lead_email: string | null
          lead_name: string | null
          lead_phone: string | null
          notes: string | null
          sentiment: Database["public"]["Enums"]["sentiment_type"] | null
        }
        Insert: {
          captured_by_user_id?: string | null
          chip_id?: string | null
          created_at?: string | null
          follow_up_sent?: boolean | null
          id?: string
          lead_email?: string | null
          lead_name?: string | null
          lead_phone?: string | null
          notes?: string | null
          sentiment?: Database["public"]["Enums"]["sentiment_type"] | null
        }
        Update: {
          captured_by_user_id?: string | null
          chip_id?: string | null
          created_at?: string | null
          follow_up_sent?: boolean | null
          id?: string
          lead_email?: string | null
          lead_name?: string | null
          lead_phone?: string | null
          notes?: string | null
          sentiment?: Database["public"]["Enums"]["sentiment_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_captured_by_user_id_fkey"
            columns: ["captured_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_chip_id_fkey"
            columns: ["chip_id"]
            isOneToOne: false
            referencedRelation: "chips"
            referencedColumns: ["id"]
          },
        ]
      }
      scans: {
        Row: {
          chip_id: string | null
          device_type: string | null
          id: string
          ip_address: string | null
          location_data: Json | null
          mode_at_scan: Database["public"]["Enums"]["chip_mode"] | null
          scanned_at: string | null
          user_agent: string | null
        }
        Insert: {
          chip_id?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          location_data?: Json | null
          mode_at_scan?: Database["public"]["Enums"]["chip_mode"] | null
          scanned_at?: string | null
          user_agent?: string | null
        }
        Update: {
          chip_id?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          location_data?: Json | null
          mode_at_scan?: Database["public"]["Enums"]["chip_mode"] | null
          scanned_at?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scans_chip_id_fkey"
            columns: ["chip_id"]
            isOneToOne: false
            referencedRelation: "chips"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          active_template: string | null
          auth_user_id: string | null
          banner_pic: string | null
          bio: string | null
          company_id: string | null
          company_name: string | null
          created_at: string | null
          email: string
          ghost_mode: boolean | null
          ghost_mode_until: string | null
          id: string
          job_title: string | null
          linkedin_url: string | null
          name: string | null
          phone: string | null
          profile_pic: string | null
          slug: string | null
          social_links: Json | null
          vcard_data: Json | null
          website: string | null
          webhook_url: string | null
        }
        Insert: {
          active_template?: string | null
          auth_user_id?: string | null
          banner_pic?: string | null
          bio?: string | null
          company_id?: string | null
          company_name?: string | null
          created_at?: string | null
          email: string
          ghost_mode?: boolean | null
          ghost_mode_until?: string | null
          id?: string
          job_title?: string | null
          linkedin_url?: string | null
          name?: string | null
          phone?: string | null
          profile_pic?: string | null
          slug?: string | null
          social_links?: Json | null
          vcard_data?: Json | null
          website?: string | null
          webhook_url?: string | null
        }
        Update: {
          active_template?: string | null
          auth_user_id?: string | null
          banner_pic?: string | null
          bio?: string | null
          company_id?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string
          ghost_mode?: boolean | null
          ghost_mode_until?: string | null
          id?: string
          job_title?: string | null
          linkedin_url?: string | null
          name?: string | null
          phone?: string | null
          profile_pic?: string | null
          slug?: string | null
          social_links?: Json | null
          vcard_data?: Json | null
          website?: string | null
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_id_from_auth: { Args: never; Returns: string }
    }
    Enums: {
      chip_mode: "corporate" | "hospitality" | "campaign"
      plan_type: "starter" | "pro" | "enterprise"
      sentiment_type: "hot" | "warm" | "cold"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      chip_mode: ["corporate", "hospitality", "campaign"],
      plan_type: ["starter", "pro", "enterprise"],
      sentiment_type: ["hot", "warm", "cold"],
    },
  },
} as const
