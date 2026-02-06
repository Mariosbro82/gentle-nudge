import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";

interface Lead {
    id: string;
    lead_name: string | null;
    lead_email: string | null;
    sentiment: string | null;
    created_at: string | null;
    users?: { name: string | null } | null;
}

export default function LeadsPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [leads, setLeads] = useState<Lead[]>([]);

    useEffect(() => {
        async function fetchLeads() {
            if (!user) return;

            // First get the user's profile ID
            const { data: profile } = await supabase
                .from("users")
                .select("id")
                .eq("auth_user_id", user.id)
                .single();

            if (!profile) {
                setLoading(false);
                return;
            }

            const { data } = await supabase
                .from("leads")
                .select("*, users(name)")
                .eq("captured_by_user_id", profile.id)
                .order("created_at", { ascending: false });

            setLeads(data || []);
            setLoading(false);
        }

        fetchLeads();
    }, [user]);

    function exportToCSV() {
        if (!leads.length) return;

        const headers = ["Name", "Email", "Stimmung", "Erfasst von", "Datum"];
        const rows = leads.map((lead) => [
            lead.lead_name,
            lead.lead_email,
            lead.sentiment,
            (lead.users as any)?.name || "-",
            new Date(lead.created_at || '').toLocaleDateString(),
        ]);

        const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `leads_${new Date().toISOString().split("T")[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    }

    function syncWithCRM() {
        alert("CRM-Sync kommt bald!");
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Kontakte</h1>
                    <p className="text-zinc-500">Erfasste Kontakte aus dem Visitenkarten-Modus.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-white/10" onClick={exportToCSV}>
                        <Download size={16} className="mr-2" /> Export CSV
                    </Button>
                    <Button variant="outline" className="border-white/10" onClick={syncWithCRM}>
                        <RefreshCw size={16} className="mr-2" /> CRM Sync
                    </Button>
                </div>
            </div>

            <div className="rounded-md border border-white/5 bg-zinc-900/50">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/5 hover:bg-white/5">
                            <TableHead>Name</TableHead>
                            <TableHead>E-Mail</TableHead>
                            <TableHead>Stimmung</TableHead>
                            <TableHead>Erfasst von</TableHead>
                            <TableHead>Datum</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leads.map((lead) => (
                            <TableRow key={lead.id} className="border-white/5 hover:bg-white/5">
                                <TableCell className="font-medium text-white">{lead.lead_name}</TableCell>
                                <TableCell className="text-zinc-400">{lead.lead_email}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={
                                            lead.sentiment === "hot"
                                                ? "border-green-500 text-green-400 bg-green-500/10"
                                                : lead.sentiment === "warm"
                                                    ? "border-yellow-500 text-yellow-400 bg-yellow-500/10"
                                                    : "border-red-500 text-red-400 bg-red-500/10"
                                        }
                                    >
                                        {lead.sentiment}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-zinc-400">{(lead.users as any)?.name || "-"}</TableCell>
                                <TableCell className="text-zinc-500">{new Date(lead.created_at || '').toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                        {leads.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-zinc-500">
                                    Noch keine Kontakte erfasst.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
