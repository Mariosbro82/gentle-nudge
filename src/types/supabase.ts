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
                    mode: string | null
                    review_data: Json | null
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
                    mode?: string | null
                    review_data?: Json | null
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
                    mode?: string | null
                    review_data?: Json | null
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
                    location: Json | null
                    location_data: Json | null
                    mode_at_scan: Database["public"]["Enums"]["chip_mode"] | null
                    scan_time: string | null
                    scanned_at: string | null
                    user_agent: string | null
                }
                Insert: {
                    chip_id?: string | null
                    device_type?: string | null
                    id?: string
                    ip_address?: string | null
                    location?: Json | null
                    location_data?: Json | null
                    mode_at_scan?: Database["public"]["Enums"]["chip_mode"] | null
                    scan_time?: string | null
                    scanned_at?: string | null
                    user_agent?: string | null
                }
                Update: {
                    chip_id?: string | null
                    device_type?: string | null
                    id?: string
                    ip_address?: string | null
                    location?: Json | null
                    location_data?: Json | null
                    mode_at_scan?: Database["public"]["Enums"]["chip_mode"] | null
                    scan_time?: string | null
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
                    auth_user_id: string | null
                    bio: string | null
                    company_id: string | null
                    company_name: string | null
                    created_at: string | null
                    email: string
                    ghost_mode: boolean | null
                    id: string
                    job_title: string | null
                    linkedin_url: string | null
                    name: string | null
                    profile_pic: string | null
                    slug: string | null
                    social_links: Json | null
                    vcard_data: Json | null
                    website: string | null
                }
                Insert: {
                    auth_user_id?: string | null
                    bio?: string | null
                    company_id?: string | null
                    company_name?: string | null
                    created_at?: string | null
                    email: string
                    ghost_mode?: boolean | null
                    id?: string
                    job_title?: string | null
                    linkedin_url?: string | null
                    name?: string | null
                    profile_pic?: string | null
                    slug?: string | null
                    social_links?: Json | null
                    vcard_data?: Json | null
                    website?: string | null
                }
                Update: {
                    auth_user_id?: string | null
                    bio?: string | null
                    company_id?: string | null
                    company_name?: string | null
                    created_at?: string | null
                    email?: string
                    ghost_mode?: boolean | null
                    id?: string
                    job_title?: string | null
                    linkedin_url?: string | null
                    name?: string | null
                    profile_pic?: string | null
                    slug?: string | null
                    social_links?: Json | null
                    vcard_data?: Json | null
                    website?: string | null
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
            [_ in never]: never
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

// Helper types for easier usage
export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]
export type TablesInsert<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"]
export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T]

// Convenience types
export type User = Tables<"users">
export type Chip = Tables<"chips">
export type Company = Tables<"companies">
export type Lead = Tables<"leads">
export type Scan = Tables<"scans">
export type CampaignOverride = Tables<"campaign_overrides">

export type ChipMode = Enums<"chip_mode">
export type PlanType = Enums<"plan_type">
export type SentimentType = Enums<"sentiment_type">
