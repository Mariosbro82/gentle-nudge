import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import Papa from "papaparse";
import { supabase } from "@/lib/supabase/client";
import { Download, Loader2, Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ChipImportRow {
    uid: string;
    mode?: string;
    status?: "pending" | "success" | "duplicate" | "error";
    message?: string;
}

export function BulkImportDialog() {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [previewData, setPreviewData] = useState<ChipImportRow[]>([]);
    const [importing, setImporting] = useState(false);
    const [results, setResults] = useState<{ success: number; failed: number } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetState = () => {
        setFile(null);
        setPreviewData([]);
        setResults(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setResults(null);
        parseFile(selectedFile);
    };

    const parseFile = (file: File) => {

        if (file.name.endsWith(".csv")) {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    const rows = results.data as any[];
                    const validRows = rows
                        .filter((row) => row.uid) // Basic validation: must have uid
                        .map((row) => ({
                            uid: row.uid.trim(),
                            mode: row.mode?.trim() || "corporate", // Default mode
                            status: "pending" as const,
                        }));
                    setPreviewData(validRows);
                },
                error: (error) => {
                    console.error("CSV Parse Error:", error);
                    alert("Fehler beim Lesen der CSV-Datei.");
                },
        });
        } else {
            alert("Nicht unterstütztes Dateiformat. Bitte nutzen Sie eine .csv Datei.");
        }
    };

    const handleImport = async () => {
        if (previewData.length === 0) return;

        setImporting(true);
        let successCount = 0;
        let failCount = 0;
        const updatedData = [...previewData];

        // Process in chunks or one by one? 
        // For simplicity and better error reporting per item, we'll do one by one or small batches.
        // Given supabase rate limits, let's try to insert safely. 
        // Actually, "insert if not exists" is tricky with simple insert.
        // We'll check for duplicates first using upsert or select?
        // User rule: "Skip existing and report them".

        // Get all existing UIDs first to minimize DB calls? 
        // If list is huge (thousands), this might be heavy. 
        // Let's loop for now, optimization later if needed.

        for (let i = 0; i < updatedData.length; i++) {
            const row = updatedData[i];

            try {
                // Check if exists
                const { data: existing } = await supabase
                    .from("chips")
                    .select("id")
                    .eq("uid", row.uid)
                    .single();

                if (existing) {
                    updatedData[i] = { ...row, status: "duplicate", message: "Chip existiert bereits" };
                    failCount++;
                } else {
                    // Start transaction / insert
                    const { error } = await supabase.from("chips").insert({
                        uid: row.uid,
                        active_mode: row.mode?.toLowerCase() === "hospitality" ? "hospitality" :
                            row.mode?.toLowerCase() === "campaign" ? "campaign" : "corporate",
                        // Default values will be handled by DB defaults if not specified
                    });

                    if (error) {
                        updatedData[i] = { ...row, status: "error", message: error.message };
                        failCount++;
                    } else {
                        updatedData[i] = { ...row, status: "success", message: "Importiert" };
                        successCount++;
                    }
                }
            } catch (err: any) {
                updatedData[i] = { ...row, status: "error", message: err.message || "Unknown error" };
                failCount++;
            }
        }

        setPreviewData(updatedData);
        setResults({ success: successCount, failed: failCount });
        setImporting(false);
    };

    const downloadTemplate = () => {
        const csvContent = "data:text/csv;charset=utf-8,uid,mode\n04:A1:B2:C3:D4:E5:F6,corporate\n04:11:22:33:44:55:66,hospitality";
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "nfc_import_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <Dialog open={open} onOpenChange={(val) => {
            if (!val) resetState();
            setOpen(val);
        }}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Massenimport
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-zinc-950 border-zinc-800 text-zinc-100">
                <DialogHeader>
                    <DialogTitle>NFC Chips importieren</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Laden Sie eine CSV Datei hoch, um mehrere Chips gleichzeitig anzulegen.
                    </DialogDescription>
                </DialogHeader>

                {!results ? (
                    <div className="space-y-4 py-4">
                        <div className="flex items-center gap-4">
                            <Button variant="secondary" size="sm" onClick={downloadTemplate} className="gap-2">
                                <Download className="h-4 w-4" /> Vorlage herunterladen
                            </Button>
                        </div>

                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="file">Datei auswählen</Label>
                            <Input
                                id="file"
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                                className="bg-zinc-900 border-zinc-700"
                            />
                        </div>

                        {previewData.length > 0 && (
                            <div className="border border-zinc-800 rounded-md">
                                <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 font-medium text-sm flex justify-between">
                                    <span>Vorschau ({previewData.length} Einträge)</span>
                                </div>
                                <ScrollArea className="h-[200px]">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-zinc-500 bg-zinc-950/50 sticky top-0">
                                            <tr>
                                                <th className="px-4 py-2">UID</th>
                                                <th className="px-4 py-2">Mode</th>
                                                <th className="px-4 py-2">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {previewData.map((row, i) => (
                                                <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-900/50">
                                                    <td className="px-4 py-2 font-mono">{row.uid}</td>
                                                    <td className="px-4 py-2">{row.mode}</td>
                                                    <td className="px-4 py-2 text-zinc-500">Bereit</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </ScrollArea>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4 py-4">
                        <Alert className={results.failed === 0 ? "border-green-500/50 bg-green-500/10" : "border-yellow-500/50 bg-yellow-500/10"}>
                            {results.failed === 0 ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4 text-yellow-500" />}
                            <AlertTitle>{results.success} Chips erfolgreich importiert</AlertTitle>
                            <AlertDescription>
                                {results.failed > 0 && `${results.failed} Einträge übersprungen (Duplikate oder Fehler).`}
                            </AlertDescription>
                        </Alert>

                        <ScrollArea className="h-[300px] border border-zinc-800 rounded-md">
                            <table className="w-full text-sm text-left">
                                <thead className="text-zinc-500 bg-zinc-950/50 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-2">UID</th>
                                        <th className="px-4 py-2">Status</th>
                                        <th className="px-4 py-2">Info</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {previewData.map((row, i) => (
                                        <tr key={i} className={`border-b border-zinc-800/50 ${row.status === 'success' ? 'bg-green-500/5' :
                                                row.status === 'duplicate' ? 'bg-yellow-500/5' :
                                                    row.status === 'error' ? 'bg-red-500/5' : ''
                                            }`}>
                                            <td className="px-4 py-2 font-mono">{row.uid}</td>
                                            <td className="px-4 py-2">
                                                {row.status === 'success' && <span className="text-green-500">OK</span>}
                                                {row.status === 'duplicate' && <span className="text-yellow-500">Duplikat</span>}
                                                {row.status === 'error' && <span className="text-red-500">Fehler</span>}
                                            </td>
                                            <td className="px-4 py-2 text-zinc-400">{row.message}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </ScrollArea>
                    </div>
                )}

                <DialogFooter>
                    {results ? (
                        <Button onClick={() => setOpen(false)}>Schließen</Button>
                    ) : (
                        <>
                            <Button variant="ghost" onClick={() => setOpen(false)}>Abbrechen</Button>
                            <Button onClick={handleImport} disabled={!file || previewData.length === 0 || importing}>
                                {importing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Import Starten
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
