import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash, Loader2, AlertTriangle, Smartphone } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";
import { BulkImportDialog } from "@/components/chips/bulk-import-dialog";

interface Chip {
    id: string;
    uid: string;
    active_mode: string | null;
    last_scan: string | null;
    assigned_user?: { name: string | null } | null;
}

export default function DevicesPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [devices, setDevices] = useState<Chip[]>([]);
    const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedChip, setSelectedChip] = useState<Chip | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function fetchDevices() {
        if (!user) return;

        const { data: userProfile } = await supabase.from("users").select("id, company_id").eq("auth_user_id", user.id).single();

        let query = supabase.from("chips").select("*, assigned_user:users(name)");
        if (userProfile?.company_id) {
            query = query.eq("company_id", userProfile.company_id);
        } else {
            query = query.eq("assigned_user_id", userProfile?.id || "");
        }

        const { data } = await query;
        setDevices(data || []);

        const { data: companiesData } = await supabase.from("companies").select("id, name");
        setCompanies(companiesData || []);

        setLoading(false);
    }

    useEffect(() => {
        fetchDevices();
    }, [user]);

    async function handleAddChip(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setActionLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const uid = formData.get("uid") as string;
        const company_id = formData.get("company_id") as string;

        // Get the user's profile ID for assignment
        const { data: profile } = await supabase
            .from("users")
            .select("id")
            .eq("auth_user_id", user?.id || "")
            .single();

        const active_mode = formData.get("active_mode") as string;

        const { error: insertError } = await supabase.from("chips").insert({
            uid: uid.replace(/:/g, "").toUpperCase(),
            company_id: company_id || null,
            assigned_user_id: profile?.id || null,
            active_mode: (active_mode as "corporate" | "hospitality" | "campaign") || "corporate",
        });

        if (insertError) {
            setError(insertError.message);
        } else {
            await fetchDevices();
            setAddOpen(false);
        }
        setActionLoading(false);
    }

    async function handleEditChip(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setActionLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const password = formData.get("password") as string;

        // Verify password
        const { error: authError } = await supabase.auth.signInWithPassword({
            email: user?.email || "",
            password,
        });

        if (authError) {
            setError("Falsches Passwort");
            setActionLoading(false);
            return;
        }

        const { error: updateError } = await supabase
            .from("chips")
            .update({
                uid: formData.get("uid") as string,
                active_mode: (formData.get("active_mode") as string) as "corporate" | "hospitality" | "campaign",
            })
            .eq("id", selectedChip?.id || "");

        if (updateError) {
            setError(updateError.message);
        } else {
            await fetchDevices();
            setEditOpen(false);
        }
        setActionLoading(false);
    }

    async function handleDeleteChip(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setActionLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const password = formData.get("password") as string;

        // Verify password
        const { error: authError } = await supabase.auth.signInWithPassword({
            email: user?.email || "",
            password,
        });

        if (authError) {
            setError("Falsches Passwort");
            setActionLoading(false);
            return;
        }

        const { error: deleteError } = await supabase.from("chips").delete().eq("id", selectedChip?.id || "");

        if (deleteError) {
            setError(deleteError.message);
        } else {
            await fetchDevices();
            setDeleteOpen(false);
        }
        setActionLoading(false);
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-2"><div className="h-7 w-28 bg-muted/60 rounded-lg animate-pulse" /><div className="h-4 w-64 bg-muted/40 rounded animate-pulse" /></div>
                    <div className="h-9 w-36 bg-muted/60 rounded-lg animate-pulse" />
                </div>
                <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="p-4 border-b border-border/30 last:border-0 flex gap-4"><div className="h-4 flex-1 bg-muted/60 rounded animate-pulse" /><div className="h-4 flex-1 bg-muted/40 rounded animate-pulse" /><div className="h-4 w-20 bg-muted/40 rounded animate-pulse" /></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Geräte</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">Verwalten Sie alle NFC-Chips und deren aktive Modi.</p>
                </div>

                {/* Add Chip Dialog */}
                <Dialog open={addOpen} onOpenChange={setAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                            <Plus size={18} className="mr-2" /> Chip hinzufügen
                        </Button>
                    </DialogTrigger>
                    <BulkImportDialog />
                    <DialogContent className="bg-background border-border text-foreground">
                        <DialogHeader>
                            <DialogTitle>Neuen NFC-Chip registrieren</DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                Geben Sie die UID des NTAG424 DNA Chips ein.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddChip} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="uid">Chip UID (Hex)</Label>
                                <Input
                                    name="uid"
                                    placeholder="04:A1:B2:C3:D4:E5:F6"
                                    className="bg-input border-border font-mono"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company_id">Firma zuweisen</Label>
                                <Select name="company_id">
                                    <SelectTrigger className="bg-input border-border">
                                        <SelectValue placeholder="Firma wählen" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border-border text-popover-foreground">
                                        {companies.map((c) => (
                                            <SelectItem key={c.id} value={c.id}>
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="active_mode">Modus</Label>
                                <Select name="active_mode" defaultValue="corporate">
                                    <SelectTrigger className="bg-input border-border">
                                        <SelectValue placeholder="Modus wählen" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border-border text-popover-foreground">
                                        <SelectItem value="corporate">Corporate</SelectItem>
                                        <SelectItem value="hospitality">Hospitality</SelectItem>
                                        <SelectItem value="campaign">Campaign</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {error && <p className="text-red-400 text-sm">{error}</p>}
                            <div className="flex justify-end gap-2 pt-2">
                                <Button type="button" variant="ghost" onClick={() => setAddOpen(false)} disabled={actionLoading}>
                                    Abbrechen
                                </Button>
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-500" disabled={actionLoading}>
                                    {actionLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Chip erstellen"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-muted/50">
                            <TableHead>UID</TableHead>
                            <TableHead>Zugewiesen an</TableHead>
                            <TableHead>Aktiver Modus</TableHead>
                            <TableHead>Letzter Scan</TableHead>
                            <TableHead className="text-right">Aktionen</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {devices.map((device) => (
                            <TableRow key={device.id} className="border-border hover:bg-muted/50">
                                <TableCell className="font-mono text-muted-foreground">
                                    {device.uid ? `****${device.uid.slice(-4).toUpperCase()}` : "-"}
                                </TableCell>
                                <TableCell className="font-medium text-foreground">{device.assigned_user?.name || "-"}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={
                                            device.active_mode === "corporate"
                                                ? "border-blue-500 text-blue-400"
                                                : device.active_mode === "hospitality"
                                                    ? "border-orange-500 text-orange-400"
                                                    : "border-purple-500 text-purple-400"
                                        }
                                    >
                                        {device.active_mode}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {device.last_scan ? new Date(device.last_scan).toLocaleDateString() : "Nie"}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-1 justify-end">
                                        {/* Edit Button */}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => {
                                                setSelectedChip(device);
                                                setError(null);
                                                setEditOpen(true);
                                            }}
                                        >
                                            <Edit size={16} />
                                        </Button>
                                        {/* Delete Button */}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-400 hover:text-red-300"
                                            onClick={() => {
                                                setSelectedChip(device);
                                                setError(null);
                                                setDeleteOpen(true);
                                            }}
                                        >
                                            <Trash size={16} />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {devices.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="p-0">
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <div className="w-14 h-14 rounded-2xl bg-muted/50 border border-border/50 flex items-center justify-center mb-4">
                                            <Smartphone className="w-6 h-6 text-muted-foreground/50" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-foreground">Keine Geräte gefunden</h3>
                                        <p className="text-xs text-muted-foreground mt-1 max-w-xs">Registrieren Sie Ihren ersten NFC-Chip, um loszulegen.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="bg-background border-border text-foreground">
                    <DialogHeader>
                        <DialogTitle>Chip bearbeiten</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Ändern Sie die Einstellungen für diesen NFC-Chip.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditChip} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="uid">Chip UID</Label>
                            <Input
                                name="uid"
                                defaultValue={selectedChip?.uid}
                                className="bg-input border-border font-mono"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="active_mode">Aktiver Modus</Label>
                            <Select name="active_mode" defaultValue={selectedChip?.active_mode || undefined}>
                                <SelectTrigger className="bg-input border-border">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border text-popover-foreground">
                                    <SelectItem value="corporate">Corporate</SelectItem>
                                    <SelectItem value="hospitality">Hospitality</SelectItem>
                                    <SelectItem value="event">Event</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 pt-4 border-t border-border">
                            <Label htmlFor="password" className="text-orange-400">
                                Passwort zur Bestätigung
                            </Label>
                            <Input
                                name="password"
                                type="password"
                                placeholder="Ihr Konto-Passwort"
                                className="bg-input border-orange-500/30"
                                required
                            />
                            <p className="text-xs text-muted-foreground">Geben Sie Ihr Passwort ein, um die Änderungen zu bestätigen.</p>
                        </div>
                        {error && <p className="text-red-400 text-sm">{error}</p>}
                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="ghost" onClick={() => setEditOpen(false)} disabled={actionLoading}>
                                Abbrechen
                            </Button>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-500" disabled={actionLoading}>
                                {actionLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                                Speichern
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent className="bg-background border-border text-foreground">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-400">
                            <AlertTriangle size={20} />
                            Chip löschen
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Diese Aktion kann nicht rückgängig gemacht werden. Alle Scan-Daten bleiben erhalten.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg my-4">
                        <p className="text-sm text-red-300">
                            Sie sind dabei, den Chip{" "}
                            <span className="font-mono font-bold">****{selectedChip?.uid?.slice(-4).toUpperCase()}</span> dauerhaft zu
                            löschen.
                        </p>
                    </div>
                    <form onSubmit={handleDeleteChip} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-red-400">
                                Passwort zur Bestätigung
                            </Label>
                            <Input
                                name="password"
                                type="password"
                                placeholder="Ihr Konto-Passwort"
                                className="bg-input border-red-500/30"
                                required
                            />
                            <p className="text-xs text-muted-foreground">Geben Sie Ihr Passwort ein, um die Löschung zu bestätigen.</p>
                        </div>
                        {error && <p className="text-red-400 text-sm">{error}</p>}
                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="ghost" onClick={() => setDeleteOpen(false)} disabled={actionLoading}>
                                Abbrechen
                            </Button>
                            <Button type="submit" className="bg-red-600 hover:bg-red-500" disabled={actionLoading}>
                                {actionLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                                Endgültig löschen
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
