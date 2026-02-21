import { useEffect, useState } from "react";
import { HelpCircle, Loader2, Send } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

interface Ticket {
    id: string;
    user_id: string;
    subject: string;
    message: string;
    status: string;
    priority: string;
    admin_reply: string | null;
    created_at: string;
    user_name?: string;
    user_email?: string;
}

const STATUS_COLORS: Record<string, string> = {
    open: "bg-amber-500/10 text-amber-500 border-amber-500/30",
    in_progress: "bg-blue-500/10 text-blue-500 border-blue-500/30",
    resolved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
    closed: "bg-zinc-800 text-zinc-400 border-zinc-700",
};

const PRIORITY_COLORS: Record<string, string> = {
    urgent: "bg-red-500/10 text-red-500 border-red-500/30",
    high: "bg-orange-500/10 text-orange-500 border-orange-500/30",
    normal: "bg-zinc-800 text-zinc-400 border-zinc-700",
    low: "bg-zinc-800 text-zinc-500 border-zinc-700",
};

export default function AdminSupportPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");
    const [saving, setSaving] = useState(false);

    async function fetchTickets() {
        setLoading(true);
        const { data: ticketData } = await supabase
            .from("support_tickets" as any)
            .select("*")
            .order("created_at", { ascending: false });

        if (ticketData) {
            // Fetch user info for each ticket
            const userIds = [...new Set((ticketData as any[]).map((t: any) => t.user_id))];
            const { data: users } = await supabase
                .from("users")
                .select("id, name, email")
                .in("id", userIds);

            const userMap = new Map((users || []).map((u: any) => [u.id, u]));
            const enriched = (ticketData as any[]).map((t: any) => {
                const u = userMap.get(t.user_id);
                return { ...t, user_name: u?.name || "Unknown", user_email: u?.email || "" };
            });
            setTickets(enriched);
        }
        setLoading(false);
    }

    useEffect(() => { fetchTickets(); }, []);

    async function updateTicketStatus(ticketId: string, status: string) {
        const updates: any = { status };
        if (status === "closed") updates.closed_at = new Date().toISOString();
        await supabase.from("support_tickets" as any).update(updates).eq("id", ticketId);
        setTickets(tickets.map(t => t.id === ticketId ? { ...t, ...updates } : t));
    }

    async function sendReply(ticketId: string) {
        if (!replyText.trim()) return;
        setSaving(true);
        await supabase
            .from("support_tickets" as any)
            .update({ admin_reply: replyText.trim(), status: "resolved" } as any)
            .eq("id", ticketId);
        setTickets(tickets.map(t => t.id === ticketId ? { ...t, admin_reply: replyText.trim(), status: "resolved" } : t));
        setReplyText("");
        setExpandedId(null);
        setSaving(false);
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                        <HelpCircle className="w-6 h-6 text-pink-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Support Tickets</h1>
                        <p className="text-zinc-500 text-sm">{tickets.filter(t => t.status === "open").length} offene Tickets</p>
                    </div>
                </div>
                <Button onClick={fetchTickets} variant="outline" className="border-zinc-800 bg-zinc-900 text-zinc-300">
                    Aktualisieren
                </Button>
            </div>

            <div className="border border-zinc-800 rounded-lg bg-zinc-950/50 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                            <TableHead className="text-zinc-400">Benutzer</TableHead>
                            <TableHead className="text-zinc-400">Betreff</TableHead>
                            <TableHead className="text-zinc-400">Priorität</TableHead>
                            <TableHead className="text-zinc-400">Status</TableHead>
                            <TableHead className="text-zinc-400">Erstellt</TableHead>
                            <TableHead className="text-right text-zinc-400">Aktionen</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                                    <Loader2 className="h-5 w-5 animate-spin inline mr-2" /> Laden...
                                </TableCell>
                            </TableRow>
                        ) : tickets.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                                    Keine Tickets vorhanden.
                                </TableCell>
                            </TableRow>
                        ) : (
                            tickets.map((ticket) => (
                                <>
                                    <TableRow key={ticket.id} className="border-zinc-800 hover:bg-zinc-900/50 cursor-pointer" onClick={() => setExpandedId(expandedId === ticket.id ? null : ticket.id)}>
                                        <TableCell>
                                            <div>
                                                <span className="text-white font-medium">{ticket.user_name}</span>
                                                <p className="text-xs text-zinc-500">{ticket.user_email}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-zinc-300 max-w-[200px] truncate">{ticket.subject}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`${PRIORITY_COLORS[ticket.priority] || PRIORITY_COLORS.normal} text-xs`}>
                                                {ticket.priority}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`${STATUS_COLORS[ticket.status] || STATUS_COLORS.open} text-xs`}>
                                                {ticket.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-zinc-500 text-sm">
                                            {new Date(ticket.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Select value={ticket.status} onValueChange={(v) => updateTicketStatus(ticket.id, v)}>
                                                <SelectTrigger className="w-[130px] bg-zinc-900 border-zinc-800 text-xs h-8" onClick={(e) => e.stopPropagation()}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-zinc-900 border-zinc-800">
                                                    <SelectItem value="open">Offen</SelectItem>
                                                    <SelectItem value="in_progress">In Bearbeitung</SelectItem>
                                                    <SelectItem value="resolved">Gelöst</SelectItem>
                                                    <SelectItem value="closed">Geschlossen</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                    </TableRow>
                                    {expandedId === ticket.id && (
                                        <TableRow key={`${ticket.id}-detail`} className="border-zinc-800 bg-zinc-900/30">
                                            <TableCell colSpan={6} className="py-4">
                                                <div className="space-y-4 max-w-2xl">
                                                    <div>
                                                        <p className="text-xs text-zinc-500 mb-1">Nachricht:</p>
                                                        <p className="text-sm text-zinc-300 whitespace-pre-wrap">{ticket.message}</p>
                                                    </div>
                                                    {ticket.admin_reply && (
                                                        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                                                            <p className="text-xs text-emerald-500 mb-1">Gesendete Antwort:</p>
                                                            <p className="text-sm text-zinc-300 whitespace-pre-wrap">{ticket.admin_reply}</p>
                                                        </div>
                                                    )}
                                                    <div className="space-y-2">
                                                        <p className="text-xs text-zinc-500">Antwort senden:</p>
                                                        <Textarea
                                                            placeholder="Antwort an den Benutzer..."
                                                            value={replyText}
                                                            onChange={(e) => setReplyText(e.target.value)}
                                                            className="bg-zinc-900 border-zinc-800 text-zinc-300 min-h-[80px] resize-none"
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                        <Button
                                                            size="sm"
                                                            onClick={(e) => { e.stopPropagation(); sendReply(ticket.id); }}
                                                            disabled={saving || !replyText.trim()}
                                                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                                        >
                                                            {saving ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Send className="h-3 w-3 mr-1" />}
                                                            Antworten & als gelöst markieren
                                                        </Button>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
