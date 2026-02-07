import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw } from "lucide-react";
import { BulkImportDialog } from "@/components/chips/bulk-import-dialog";

export default function ChipsPage() {
    const [chips, setChips] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchChips = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("chips")
            .select(`
                *,
                user:users(name, email)
            `)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching chips:", error);
        } else {
            setChips(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchChips();
    }, []);

    // Subscribe to realtime changes later if needed, or just manual refresh for now.

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Chip Management</h1>
                    <p className="text-zinc-500">Verwalten Sie Ihre physischen NFC Tags.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={fetchChips}>
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                    <BulkImportDialog />
                </div>
            </div>

            <Card className="bg-zinc-900/50 border-white/5">
                <CardHeader>
                    <CardTitle>Alle Chips ({chips.length})</CardTitle>
                    <CardDescription>Liste aller registrierten NFC Tags im System.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/5 hover:bg-white/5">
                                <TableHead className="text-zinc-400">UID</TableHead>
                                <TableHead className="text-zinc-400">Mode</TableHead>
                                <TableHead className="text-zinc-400">Zugewiesen an</TableHead>
                                <TableHead className="text-zinc-400">Erstellt am</TableHead>
                                <TableHead className="text-zinc-400 text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {chips.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24 text-zinc-500">
                                        Keine Chips gefunden. Importieren Sie welche!
                                    </TableCell>
                                </TableRow>
                            ) : (
                                chips.map((chip) => (
                                    <TableRow key={chip.id} className="border-white/5 hover:bg-white/5">
                                        <TableCell className="font-mono text-zinc-300">{chip.uid}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`capitalize ${chip.active_mode === 'corporate' ? 'border-blue-500/50 text-blue-400' :
                                                    chip.active_mode === 'hospitality' ? 'border-orange-500/50 text-orange-400' :
                                                        'border-purple-500/50 text-purple-400'
                                                }`}>
                                                {chip.active_mode || 'Standard'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-zinc-300">
                                            {chip.user?.name || chip.user?.email || <span className="text-zinc-600 italic">Unassigned</span>}
                                        </TableCell>
                                        <TableCell className="text-zinc-500">
                                            {new Date(chip.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                                                Bearbeiten
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
