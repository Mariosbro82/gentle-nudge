"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
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
import { addChip } from "./actions";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function AddChipButton({ companies }: { companies: any[] }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(formData: FormData) {
        setLoading(true);
        setError(null);

        const res = await addChip(formData);

        if (res?.error) {
            setError(res.error);
            setLoading(false);
        } else {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-white text-black hover:bg-zinc-200">
                    <Plus size={18} className="mr-2" /> Chip hinzufügen
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                <DialogHeader>
                    <DialogTitle>Neuen NFC-Chip registrieren</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Geben Sie die UID des NTAG424 DNA Chips ein.
                    </DialogDescription>
                </DialogHeader>

                <form action={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="uid">Chip UID (Hex)</Label>
                        <Input name="uid" placeholder="04:A1:B2:C3:D4:E5:F6" className="bg-black/50 border-white/10 font-mono" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="company_id">Firma zuweisen</Label>
                        <Select name="company_id">
                            <SelectTrigger className="bg-black/50 border-white/10">
                                <SelectValue placeholder="Firma wählen" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                {companies.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm">{error}</p>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={loading}>Abbrechen</Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-500" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Chip erstellen"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
