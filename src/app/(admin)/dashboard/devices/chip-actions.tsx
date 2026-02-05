"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Loader2, AlertTriangle } from "lucide-react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { editChip, deleteChip } from "./actions";

interface ChipActionsProps {
    chip: {
        id: string;
        uid: string;
        active_mode: string;
    };
}

export function ChipActions({ chip }: ChipActionsProps) {
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleEdit(formData: FormData) {
        setLoading(true);
        setError(null);
        formData.append("chipId", chip.id);

        const res = await editChip(formData);

        if (res?.error) {
            setError(res.error);
            setLoading(false);
        } else {
            setLoading(false);
            setEditOpen(false);
        }
    }

    async function handleDelete(formData: FormData) {
        setLoading(true);
        setError(null);
        formData.append("chipId", chip.id);

        const res = await deleteChip(formData);

        if (res?.error) {
            setError(res.error);
            setLoading(false);
        } else {
            setLoading(false);
            setDeleteOpen(false);
        }
    }

    return (
        <div className="flex gap-1">
            {/* Edit Dialog */}
            <Dialog open={editOpen} onOpenChange={(o) => { setEditOpen(o); setError(null); }}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit size={16} />
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                    <DialogHeader>
                        <DialogTitle>Chip bearbeiten</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Ändern Sie die Einstellungen für diesen NFC-Chip.
                        </DialogDescription>
                    </DialogHeader>

                    <form action={handleEdit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="uid">Chip UID</Label>
                            <Input
                                name="uid"
                                defaultValue={chip.uid}
                                className="bg-black/50 border-white/10 font-mono"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="active_mode">Aktiver Modus</Label>
                            <Select name="active_mode" defaultValue={chip.active_mode}>
                                <SelectTrigger className="bg-black/50 border-white/10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                    <SelectItem value="corporate">Corporate</SelectItem>
                                    <SelectItem value="hospitality">Hospitality</SelectItem>
                                    <SelectItem value="event">Event</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2 pt-4 border-t border-white/10">
                            <Label htmlFor="password" className="text-orange-400">
                                Passwort zur Bestätigung
                            </Label>
                            <Input
                                name="password"
                                type="password"
                                placeholder="Ihr Kontо-Passwort"
                                className="bg-black/50 border-orange-500/30"
                                required
                            />
                            <p className="text-xs text-zinc-500">
                                Geben Sie Ihr Passwort ein, um die Änderungen zu bestätigen.
                            </p>
                        </div>

                        {error && (
                            <p className="text-red-400 text-sm">{error}</p>
                        )}

                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="ghost" onClick={() => setEditOpen(false)} disabled={loading}>
                                Abbrechen
                            </Button>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-500" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                                Speichern
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteOpen} onOpenChange={(o) => { setDeleteOpen(o); setError(null); }}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300">
                        <Trash size={16} />
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-400">
                            <AlertTriangle size={20} />
                            Chip löschen
                        </DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Diese Aktion kann nicht rückgängig gemacht werden. Alle Scan-Daten bleiben erhalten.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg my-4">
                        <p className="text-sm text-red-300">
                            Sie sind dabei, den Chip <span className="font-mono font-bold">****{chip.uid.slice(-4).toUpperCase()}</span> dauerhaft zu löschen.
                        </p>
                    </div>

                    <form action={handleDelete} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-red-400">
                                Passwort zur Bestätigung
                            </Label>
                            <Input
                                name="password"
                                type="password"
                                placeholder="Ihr Konto-Passwort"
                                className="bg-black/50 border-red-500/30"
                                required
                            />
                            <p className="text-xs text-zinc-500">
                                Geben Sie Ihr Passwort ein, um die Löschung zu bestätigen.
                            </p>
                        </div>

                        {error && (
                            <p className="text-red-400 text-sm">{error}</p>
                        )}

                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="ghost" onClick={() => setDeleteOpen(false)} disabled={loading}>
                                Abbrechen
                            </Button>
                            <Button type="submit" className="bg-red-600 hover:bg-red-500" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                                Endgültig löschen
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
