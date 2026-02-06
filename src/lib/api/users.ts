import { supabase } from "@/lib/supabase/client";

/**
 * Get user by slug or ID
 */
export async function getUserBySlug(slug: string) {
    // Check if slug is a UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

    if (isUuid) {
        const { data } = await supabase
            .from("users")
            .select("*")
            .eq("id", slug)
            .single();
        if (data) return data;
    }

    // Try by slug
    const { data: user } = await supabase
        .from("users")
        .select("*")
        .eq("slug", slug)
        .single();

    return user;
}

/**
 * Update user profile
 */
export async function updateProfile(userId: string, updates: {
    name?: string;
    job_title?: string;
    bio?: string;
    website?: string;
    linkedin_url?: string;
    slug?: string;
}) {
    // Validate slug if provided
    if (updates.slug) {
        updates.slug = updates.slug.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        if (updates.slug.length < 3) {
            return { error: "Username must be at least 3 characters." };
        }
    }

    const { error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", userId);

    if (error) {
        if (error.code === '23505') {
            return { error: "Username is already taken." };
        }
        return { error: error.message };
    }

    return { success: true };
}

/**
 * Get user's leads
 */
export async function getUserLeads(userId: string) {
    const { data, error } = await supabase
        .from("leads")
        .select("*, users(name)")
        .eq("captured_by_user_id", userId)
        .order("created_at", { ascending: false });

    if (error) return [];
    return data || [];
}

/**
 * Get user's scans (for their chips)
 */
export async function getUserScans(chipIds: string[], daysBack: number = 30) {
    if (chipIds.length === 0) return [];

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const { data, error } = await supabase
        .from("scans")
        .select("*")
        .in("chip_id", chipIds)
        .gte("scanned_at", startDate.toISOString())
        .order("scanned_at", { ascending: false });

    if (error) return [];
    return data || [];
}
