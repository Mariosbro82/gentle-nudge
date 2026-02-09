import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, RefreshCw, Flame } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";
import { getInterestedLeads } from "@/lib/api/analytics";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Lead {
    id: string;
    lead_name: string | null;
    lead_email: string | null;
    lead_phone: string | null;
    sentiment: string | null;
    notes: string | null;
    created_at: string | null;
    users?: { name: string | null } | null;
    is_interested?: boolean;
    recurring_views?: number;
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

            // Fetch leads and interested leads in parallel
            const [leadsResponse, interestedLeads] = await Promise.all([
                supabase
                    .from("leads")
                    .select("*, users(name)")
                    .eq("captured_by_user_id", profile.id)
                    .order("created_at", { ascending: false }),
                getInterestedLeads(profile.id)
            ]);

            const leadsData = leadsResponse.data || [];

            // Map interested leads to a lookup object
            const interestedMap = new Map();
            if (interestedLeads) {
                interestedLeads.forEach((l: any) => {
                    interestedMap.set(l.lead_id, l.recurring_views);
                });
            }

            // Merge data
            const mergedLeads = leadsData.map(lead => ({
                ...lead,
                is_interested: interestedMap.has(lead.id),
                recurring_views: interestedMap.get(lead.id) || 0
            }));

            setLeads(mergedLeads);
            setLoading(false);
        }

        fetchLeads();
    }, [user]);

    function exportToCSV() {
        if (!leads.length) return;

        const headers = ["Name", "Email", "Telefon", "Stimmung", "Interesse (Views)", "Nachricht", "Links", "Datum"];
        const rows = leads.map((lead) => {
            const notes = lead.notes || "";
            const lines = notes.split("\n").filter(Boolean);
            const message = lines.find((l: string) => l.startsWith("Nachricht: "))?.replace("Nachricht: ", "") || "";
            const links = lines.filter((l: string) => !l.startsWith("Nachricht: ")).join("; ");
            return [
                lead.lead_name,
                lead.lead_email,
                lead.lead_phone || "",
                lead.sentiment,
                lead.is_interested ? `Sehr hoch (${lead.recurring_views})` : "Normal",
                message,
                links,
                new Date(lead.created_at || '').toLocaleDateString(),
            ].map(v => `"${(v || '').replace(/"/g, '""')}"`);
        });

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

            <div className="rounded-md border border-border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-muted/50">
                            <TableHead>Name</TableHead>
                            <TableHead>E-Mail</TableHead>
                            <TableHead>Telefon</TableHead>
                            <TableHead>Stimmung</TableHead>
                            <TableHead>Nachricht & Links</TableHead>
                            <TableHead>Datum</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leads.map((lead) => {
                            const notes = lead.notes || "";
                            const lines = notes.split("\n").filter(Boolean);
                            const message = lines.find(l => l.startsWith("Nachricht: "))?.replace("Nachricht: ", "") || "";
                            const links = lines.filter(l => !l.startsWith("Nachricht: "));

                            return (
                                <TableRow key={lead.id} className="border-border hover:bg-muted/50">
                                    <TableCell className="font-medium text-foreground">
                                        <div className="flex items-center gap-2">
                                            {lead.lead_name}
                                            {lead.is_interested && (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <Badge variant="secondary" className="bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20 px-1.5 py-0 h-5">
                                                                <Flame size={10} className="mr-1" fill="currentColor" />
                                                                Heiß
                                                            </Badge>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Dieser Kontakt hat dein Profil {lead.recurring_views}x besucht!</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{lead.lead_email}</TableCell>
                                    <TableCell className="text-muted-foreground">{lead.lead_phone || "-"}</TableCell>
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
                                    <TableCell className="max-w-xs">
                                        {message && (
                                            <p className="text-sm text-foreground mb-1 truncate" title={message}>
                                                {message}
                                            </p>
                                        )}
                                        {links.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {links.map((link, i) => (
                                                    <a
                                                        key={i}
                                                        href={link.split(": ")[1]}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-blue-400 hover:underline"
                                                    >
                                                        {link.split(": ")[0]}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                        {!message && links.length === 0 && (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{new Date(lead.created_at || '').toLocaleDateString()}</TableCell>
                                </TableRow>
                            );
                        })}
                        {leads.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
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
