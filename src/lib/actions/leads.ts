"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ActionState = {
    error?: string;
    success?: boolean;
    data?: any;
};

export async function captureLead(formData: FormData, ownerId: string): Promise<ActionState> {
    const supabase = await createClient();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const linkedin = formData.get("linkedin") as string;
    const message = formData.get("message") as string;

    if (!name || !email) {
        return { error: "Name and Email are required" };
    }

    try {
        // 1. Insert into leads table
        // Note: 'notes' field holds the message and linkedin
        const { data, error } = await supabase
            .from("leads")
            .insert({
                lead_name: name,
                lead_email: email,
                captured_by_user_id: ownerId,
                notes: `${message || ''}${linkedin ? ` | LinkedIn: ${linkedin}` : ''}`.trim() || null,
                sentiment: 'warm' // Default sentiment (valid enum: hot, warm, cold)
            })
            .select()
            .single();

        if (error) {
            console.error("Supabase Error:", error);
            return { error: "Failed to save lead. Please try again." };
        }

        revalidatePath("/dashboard/leads");
        return { success: true, data };

    } catch (e) {
        console.error("Server Error:", e);
        return { error: "Internal Server Error" };
    }
}

export async function updateLeadSentiment(leadId: string, sentiment: string, note?: string): Promise<ActionState> {
    const supabase = await createClient();

    const { error } = await supabase
        .from("leads")
        .update({
            sentiment,
            notes: note ? note : undefined // Append or update notes logic could be complex, simple update for now
        })
        .eq("id", leadId);

    if (error) return { error: error.message };

    revalidatePath("/dashboard/leads");
    return { success: true };
}
