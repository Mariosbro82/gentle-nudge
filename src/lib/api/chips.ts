import { supabase } from "@/lib/supabase/client";

export interface Chip {
    id: string;
    uid: string;
    active_mode: string | null;
    company_id?: string | null;
    assigned_user_id?: string | null;
    target_url?: string | null;
    menu_data?: any;
    last_scan?: string | null;
    assigned_user?: { name: string | null } | null;
}

/**
 * Get all chips for user/company
 */
export async function getChips(userId: string, companyId?: string | null): Promise<Chip[]> {
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

/**
 * Add a new chip
 */
export async function addChip(chip: {
    uid: string;
    company_id?: string | null;
    assigned_user_id: string;
    active_mode?: string;
}) {
    // Clean UID
    const cleanUid = chip.uid.replace(/[:\-\s]/g, "").toUpperCase();

    const { data, error } = await supabase
        .from("chips")
        .insert([{
            uid: cleanUid,
            company_id: chip.company_id || null,
            assigned_user_id: chip.assigned_user_id,
            active_mode: (chip.active_mode || "corporate") as "corporate" | "hospitality" | "campaign",
        }])
        .select()
        .single();

    if (error) {
        if (error.code === '23505') {
            return { error: "This chip UID is already registered." };
        }
        return { error: error.message };
    }

    return { data };
}

/**
 * Update a chip (requires password verification first)
 */
export async function updateChip(chipId: string, updates: Record<string, any>) {
    const { error } = await supabase
        .from("chips")
        .update(updates as any)
        .eq("id", chipId);

    if (error) {
        return { error: error.message };
    }

    return { success: true };
}

/**
 * Delete a chip (requires password verification first)
 */
export async function deleteChip(chipId: string) {
    const { error } = await supabase
        .from("chips")
        .delete()
        .eq("id", chipId);

    if (error) {
        return { error: error.message };
    }

    return { success: true };
}

/**
 * Get chip by UID (for NFC tap handling)
 */
export async function getChipByUid(uid: string) {
    const { data, error } = await supabase
        .from("chips")
        .select(`
      *,
      company:companies(*),
      assigned_user:users(*)
    `)
        .eq("uid", uid)
        .single();

    if (error) return null;
    return data;
}

/**
 * Verify user password via server-side edge function
 */
export async function verifyPassword(_email: string, password: string): Promise<boolean> {
    const { data, error } = await supabase.functions.invoke('verify-user-password', {
        body: { password },
    });
    if (error) return false;
    return data?.valid === true;
}
