"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addChip(formData: FormData) {
    const supabase = await createClient();

    // Get logged-in user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "Unauthorized" };
    }

    const uid = formData.get("uid") as string;
    const company_id = formData.get("company_id") as string;

    if (!uid) {
        return { error: "UID is required" };
    }

    const { error } = await supabase.from("chips").insert({
        uid,
        company_id: company_id || null,
        assigned_user_id: user.id, // Always assign to current user
        active_mode: "corporate"
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/dashboard/devices");
    return { success: true };
}

export async function editChip(formData: FormData) {
    const supabase = await createClient();

    // Get logged-in user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "Unauthorized" };
    }

    const chipId = formData.get("chipId") as string;
    const uid = formData.get("uid") as string;
    const activeMode = formData.get("active_mode") as string;
    const password = formData.get("password") as string;

    if (!chipId || !password) {
        return { error: "Chip ID and password are required" };
    }

    // Verify password by re-authenticating
    const { error: authError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: password
    });

    if (authError) {
        return { error: "Falsches Passwort" };
    }

    // Verify chip belongs to user
    const { data: chip } = await supabase
        .from("chips")
        .select("assigned_user_id")
        .eq("id", chipId)
        .single();

    if (!chip || chip.assigned_user_id !== user.id) {
        return { error: "Chip not found or unauthorized" };
    }

    // Update chip
    const updateData: any = {};
    if (uid) updateData.uid = uid;
    if (activeMode) updateData.active_mode = activeMode;

    const { error } = await supabase
        .from("chips")
        .update(updateData)
        .eq("id", chipId);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/dashboard/devices");
    return { success: true };
}

export async function deleteChip(formData: FormData) {
    const supabase = await createClient();

    // Get logged-in user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "Unauthorized" };
    }

    const chipId = formData.get("chipId") as string;
    const password = formData.get("password") as string;

    if (!chipId || !password) {
        return { error: "Chip ID and password are required" };
    }

    // Verify password by re-authenticating
    const { error: authError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: password
    });

    if (authError) {
        return { error: "Falsches Passwort" };
    }

    // Verify chip belongs to user
    const { data: chip } = await supabase
        .from("chips")
        .select("assigned_user_id")
        .eq("id", chipId)
        .single();

    if (!chip || chip.assigned_user_id !== user.id) {
        return { error: "Chip not found or unauthorized" };
    }

    // Delete chip
    const { error } = await supabase
        .from("chips")
        .delete()
        .eq("id", chipId);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/dashboard/devices");
    return { success: true };
}
