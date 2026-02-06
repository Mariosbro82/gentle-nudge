import { supabase } from "@/lib/supabase/client";

export interface Lead {
    id: string;
    lead_name: string;
    lead_email: string;
    lead_phone?: string;
    sentiment?: string;
    notes?: string;
    captured_by_user_id: string;
    chip_id?: string;
    created_at: string;
    users?: { name: string } | null;
}

/**
 * Get all leads for a user
 */
export async function getLeads(userId: string): Promise<Lead[]> {
    const { data, error } = await supabase
        .from("leads")
        .select("*, users(name)")
        .eq("captured_by_user_id", userId)
        .order("created_at", { ascending: false });

    if (error) return [];
    return data || [];
}

/**
 * Create a new lead
 */
export async function createLead(lead: {
    lead_name: string;
    lead_email: string;
    lead_phone?: string;
    sentiment?: string;
    notes?: string;
    captured_by_user_id: string;
    chip_id?: string;
}) {
    const { data, error } = await supabase
        .from("leads")
        .insert(lead)
        .select()
        .single();

    if (error) {
        return { error: error.message };
    }

    return { data };
}

/**
 * Export leads to CSV format
 */
export function exportLeadsToCSV(leads: Lead[]): string {
    const headers = ["Name", "Email", "Phone", "Sentiment", "Notes", "Date"];
    const rows = leads.map(lead => [
        lead.lead_name,
        lead.lead_email,
        lead.lead_phone || "",
        lead.sentiment || "",
        lead.notes || "",
        new Date(lead.created_at).toLocaleDateString(),
    ]);

    return [
        headers.join(","),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");
}

/**
 * Download leads as CSV file
 */
export function downloadLeadsCSV(leads: Lead[]) {
    const csvContent = exportLeadsToCSV(leads);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `leads_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}

/**
 * Get lead count for user
 */
export async function getLeadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("captured_by_user_id", userId);

    if (error) return 0;
    return count || 0;
}
