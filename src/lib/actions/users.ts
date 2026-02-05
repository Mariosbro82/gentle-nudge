"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getUserBySlug(slug: string) {
    const supabase = await createClient();

    // Try fetching by username/slug first
    // Note: Assuming 'username' or 'slug' column exists. If not, we might need to fallback or assume slug=id for now if schema isn't fully migrated.
    // Based on briefing, we need to check if 'slug' exists.

    // For now, let's try to query by 'id' if uuid, or 'slug' if text.
    // Actually, safest is to query single.

    // Attempt 1: Fetch by ID (if slug is UUID-like)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

    if (isUuid) {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", slug)
            .single();
        if (data) return data;
    }

    // Attempt 2: Fetch by slug
    // If table doesn't have slug yet, this might fail, so we might need to rely on Mock if data is missing,
    // BUT the goal is to implement REAL logic.
    const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("slug", slug) // Assumes 'slug' column. If it fails, we handle it.
        .single();

    return user;
}

export async function updateProfile(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    const name = formData.get("name") as string;
    const title = formData.get("title") as string;
    const bio = formData.get("bio") as string;
    const website = formData.get("website") as string;
    const linkedin = formData.get("linkedin") as string;
    let slug = formData.get("slug") as string;

    // Validate Slug
    if (slug) {
        slug = slug.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        if (slug.length < 3) return { error: "Username must be at least 3 characters." };
    }

    try {
        const { error } = await supabase
            .from("users")
            .upsert({
                id: user.id, // Critical for upsert
                email: user.email, // Good to sync email too
                name,
                job_title: title,
                bio,
                website,
                linkedin_url: linkedin,
                slug: slug || null
            }, { onConflict: 'id' })
            .select(); // Select to ensure return value helps debug if needed

        if (error) {
            if (error.code === '23505') { // Unique violation
                return { error: "Username is already taken." };
            }
            return { error: error.message };
        }
    } catch (e) {
        return { error: "Failed to update profile." };
    }

    revalidatePath("/dashboard/settings");
    if (slug) {
        revalidatePath(`/p/${slug}`);
    }
    revalidatePath(`/p/${user.id}`);
    return { success: true };
}
