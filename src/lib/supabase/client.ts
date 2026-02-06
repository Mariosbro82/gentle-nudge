import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables not set. Using placeholder values.");
}

export const supabase = createSupabaseClient<Database>(
    supabaseUrl || "https://placeholder.supabase.co",
    supabaseAnonKey || "placeholder",
    {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
        },
    }
);

// Helper to get current user
export async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
}

// Helper to get user profile with company info
export async function getUserProfile(userId: string) {
    const { data, error } = await supabase
        .from("users")
        .select("*, company:companies(*)")
        .eq("id", userId)
        .single();

    if (error) return null;
    return data;
}

// Helper to get user's chips (filtered by user or company)
export async function getUserChips(userId: string, companyId?: string | null) {
    let query = supabase.from("chips").select("*, assigned_user:users(name)");

    if (companyId) {
        query = query.eq("company_id", companyId);
    } else {
        query = query.eq("assigned_user_id", userId);
    }

    const { data, error } = await query;
    if (error) return [];
    return data || [];
}

// Helper to get user's chip IDs
export async function getUserChipIds(userId: string, companyId?: string | null): Promise<string[]> {
    const chips = await getUserChips(userId, companyId);
    return chips.map(c => c.id);
}

// Legacy export for compatibility
export function createClient() {
    return supabase;
}
