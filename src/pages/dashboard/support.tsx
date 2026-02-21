import { useEffect, useState } from "react";
import { HelpCircle, Plus, Send, Loader2, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";

interface Ticket {
    id: string;
    subject: string;
    message: string;
    status: string;
    priority: string;
    admin_reply: string | null;
    created_at: string;
    updated_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; icon: typeof Clock; className: string }> = {
    open: { label: "Offen", icon: AlertCircle, className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
    in_progress: { label: "In Bearbeitung", icon: Clock, className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
    resolved: { label: "Gelöst", icon: CheckCircle2, className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
    closed: { label: "Geschlossen", icon: CheckCircle2, className: "bg-muted text-muted-foreground border-border" },
};

export default function SupportPage() {
    const { user: authUser } = useAuth();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newSubject, setNewSubject] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [newPriority, setNewPriority] = useState("normal");
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        if (!authUser) return;
        (async () => {
            const { data: profile } = await supabase
                .from("users")
                .select("id")
                .eq("auth_user_id", authUser.id)
                .single();
            if (profile) {
                setUserId(profile.id);
                const { data } = await supabase
                    .from("support_tickets" as any)
                    .select("*")
                    .eq("user_id", profile.id)
                    .order("created_at", { ascending: false });
                setTickets((data as any[]) || []);
            }
            setLoading(false);
        })();
    }, [authUser]);

    async function handleCreate() {
        if (!userId || !newSubject.trim() || !newMessage.trim()) return;
        setCreating(true);
        const { data, error } = await supabase
            .from("support_tickets" as any)
            .insert({
                user_id: userId,
                subject: newSubject.trim(),
                message: newMessage.trim(),
                priority: newPriority,
            } as any)
            .select()
            .single();

        if (!error && data) {
            setTickets([data as any, ...tickets]);
            setNewSubject("");
            setNewMessage("");
            setNewPriority("normal");
            setDialogOpen(false);
        } else {
            alert("Fehler beim Erstellen: " + (error?.message || "Unbekannt"));
        }
        setCreating(false);
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Support</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">Erstellen und verfolgen Sie Support-Anfragen.</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-xl">
                            <Plus className="h-4 w-4 mr-2" /> Neues Ticket
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Support-Ticket erstellen</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="ticket-subject">Betreff</Label>
                                <Input
                                    id="ticket-subject"
                                    placeholder="Kurze Beschreibung des Problems"
                                    value={newSubject}
                                    onChange={(e) => setNewSubject(e.target.value)}
                                    className="bg-input border-border"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="ticket-priority">Priorität</Label>
                                <Select value={newPriority} onValueChange={setNewPriority}>
                                    <SelectTrigger className="bg-input border-border">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Niedrig</SelectItem>
                                        <SelectItem value="normal">Normal</SelectItem>
                                        <SelectItem value="high">Hoch</SelectItem>
                                        <SelectItem value="urgent">Dringend</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="ticket-message">Nachricht</Label>
                                <Textarea
                                    id="ticket-message"
                                    placeholder="Beschreiben Sie Ihr Anliegen detailliert..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="bg-input border-border min-h-[120px] resize-none"
                                />
                            </div>
                            <Button
                                onClick={handleCreate}
                                disabled={creating || !newSubject.trim() || !newMessage.trim()}
                                className="w-full rounded-xl"
                            >
                                {creating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                                Ticket absenden
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {tickets.length === 0 ? (
                <Card className="rounded-xl border-border/50">
                    <CardContent className="py-12 text-center">
                        <HelpCircle className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">Noch keine Support-Tickets erstellt.</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">Klicken Sie auf "Neues Ticket" um eine Anfrage zu erstellen.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {tickets.map((ticket) => {
                        const statusConf = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;
                        const StatusIcon = statusConf.icon;
                        return (
                            <Card key={ticket.id} className="rounded-xl border-border/50">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="text-base">{ticket.subject}</CardTitle>
                                            <CardDescription className="mt-1">
                                                {new Date(ticket.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                                            </CardDescription>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {ticket.priority === "urgent" && (
                                                <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 text-xs">Dringend</Badge>
                                            )}
                                            {ticket.priority === "high" && (
                                                <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20 text-xs">Hoch</Badge>
                                            )}
                                            <Badge variant="outline" className={`${statusConf.className} text-xs`}>
                                                <StatusIcon className="h-3 w-3 mr-1" />
                                                {statusConf.label}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{ticket.message}</p>
                                    {ticket.admin_reply && (
                                        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 mt-3">
                                            <p className="text-xs font-medium text-primary mb-1">Antwort vom Support:</p>
                                            <p className="text-sm text-foreground whitespace-pre-wrap">{ticket.admin_reply}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
