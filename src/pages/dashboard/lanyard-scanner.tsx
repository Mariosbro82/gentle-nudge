import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";
import {
    ScanLine, CheckCircle2, XCircle, Camera, CameraOff,
    Users, Zap, Pause, Play
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ParsedContact {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    title?: string;
    website?: string;
    raw: string;
}

interface ScanResult {
    id: string;
    contact: ParsedContact;
    status: "success" | "error" | "duplicate";
    message: string;
    timestamp: Date;
}

function parseVCard(text: string): ParsedContact {
    const result: ParsedContact = { raw: text };

    // Check if it's a vCard
    if (text.includes("BEGIN:VCARD")) {
        const lines = text.split(/\r?\n/);
        for (const line of lines) {
            const upper = line.toUpperCase();
            if (upper.startsWith("FN:") || upper.startsWith("FN;")) {
                result.name = line.substring(line.indexOf(":") + 1).trim();
            } else if (upper.startsWith("N:") || upper.startsWith("N;")) {
                if (!result.name) {
                    const parts = line.substring(line.indexOf(":") + 1).split(";");
                    result.name = [parts[1], parts[0]].filter(Boolean).join(" ").trim();
                }
            } else if (upper.startsWith("EMAIL")) {
                result.email = line.substring(line.indexOf(":") + 1).trim();
            } else if (upper.startsWith("TEL")) {
                result.phone = line.substring(line.indexOf(":") + 1).trim();
            } else if (upper.startsWith("ORG")) {
                result.company = line.substring(line.indexOf(":") + 1).split(";")[0].trim();
            } else if (upper.startsWith("TITLE")) {
                result.title = line.substring(line.indexOf(":") + 1).trim();
            } else if (upper.startsWith("URL")) {
                result.website = line.substring(line.indexOf(":") + 1).trim();
            }
        }
    } else if (text.includes("MECARD:")) {
        // MeCard format
        const match = (key: string) => {
            const regex = new RegExp(`${key}:([^;]+)`);
            return text.match(regex)?.[1]?.trim();
        };
        result.name = match("N");
        result.email = match("EMAIL");
        result.phone = match("TEL");
        result.company = match("ORG");
    } else if (text.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
        // Plain email
        result.email = text.trim();
    } else if (text.startsWith("http")) {
        // URL
        result.website = text.trim();
    } else {
        // Plain text – try to use as name
        result.name = text.trim().substring(0, 200);
    }

    return result;
}

export default function LanyardScannerPage() {
    const { user } = useAuth();
    const [scanning, setScanning] = useState(false);
    const [paused, setPaused] = useState(false);
    const [results, setResults] = useState<ScanResult[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [totalCreated, setTotalCreated] = useState(0);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const processedCodes = useRef<Set<string>>(new Set());
    const containerRef = useRef<HTMLDivElement>(null);

    // Fetch user profile id
    useEffect(() => {
        if (!user) return;
        supabase
            .from("users")
            .select("id")
            .eq("auth_user_id", user.id)
            .single()
            .then(({ data }) => {
                if (data) setUserId(data.id);
            });
    }, [user]);

    const addResult = useCallback((result: ScanResult) => {
        setResults((prev) => [result, ...prev].slice(0, 50));
    }, []);

    const handleScan = useCallback(
        async (decodedText: string) => {
            if (!userId) return;

            // Deduplicate within session
            if (processedCodes.current.has(decodedText)) return;
            processedCodes.current.add(decodedText);

            const contact = parseVCard(decodedText);
            const resultId = crypto.randomUUID();

            // Check for duplicate in DB by email
            if (contact.email) {
                const { data: existing } = await supabase
                    .from("leads")
                    .select("id")
                    .eq("captured_by_user_id", userId)
                    .eq("lead_email", contact.email)
                    .maybeSingle();

                if (existing) {
                    addResult({
                        id: resultId,
                        contact,
                        status: "duplicate",
                        message: `${contact.name || contact.email} bereits vorhanden`,
                        timestamp: new Date(),
                    });
                    return;
                }
            }

            // Build notes from extra fields
            const noteParts: string[] = [];
            if (contact.title) noteParts.push(`Position: ${contact.title}`);
            if (contact.company) noteParts.push(`Firma: ${contact.company}`);
            if (contact.website) noteParts.push(`Web: ${contact.website}`);
            noteParts.push(`[Lanyard-Scan]`);

            const { error } = await supabase.from("leads").insert({
                captured_by_user_id: userId,
                lead_name: contact.name || null,
                lead_email: contact.email || null,
                lead_phone: contact.phone || null,
                notes: noteParts.join(" | "),
                sentiment: "warm" as const,
                marketing_consent: false,
            });

            if (error) {
                addResult({
                    id: resultId,
                    contact,
                    status: "error",
                    message: `Fehler: ${error.message}`,
                    timestamp: new Date(),
                });
            } else {
                setTotalCreated((c) => c + 1);
                addResult({
                    id: resultId,
                    contact,
                    status: "success",
                    message: `${contact.name || contact.email || "Kontakt"} gespeichert`,
                    timestamp: new Date(),
                });
            }
        },
        [userId, addResult]
    );

    const startScanner = useCallback(async () => {
        if (!containerRef.current) return;
        setCameraError(null);

        try {
            const scanner = new Html5Qrcode("lanyard-scanner-view", {
                formatsToSupport: [
                    Html5QrcodeSupportedFormats.QR_CODE,
                    Html5QrcodeSupportedFormats.CODE_128,
                    Html5QrcodeSupportedFormats.CODE_39,
                    Html5QrcodeSupportedFormats.EAN_13,
                    Html5QrcodeSupportedFormats.EAN_8,
                    Html5QrcodeSupportedFormats.DATA_MATRIX,
                    Html5QrcodeSupportedFormats.AZTEC,
                    Html5QrcodeSupportedFormats.PDF_417,
                ],
                verbose: false,
            });

            scannerRef.current = scanner;

            await scanner.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 280, height: 280 },
                    aspectRatio: 1,
                },
                (decodedText) => {
                    handleScan(decodedText);
                },
                () => {
                    // scan failure - ignore, keep scanning
                }
            );

            setScanning(true);
            setPaused(false);
        } catch (err: any) {
            console.error("Camera error:", err);
            setCameraError(
                err?.message?.includes("NotAllowed")
                    ? "Kamera-Zugriff verweigert. Bitte erlauben Sie den Zugriff in den Browser-Einstellungen."
                    : "Kamera konnte nicht gestartet werden. Stellen Sie sicher, dass ein Gerät mit Kamera verwendet wird."
            );
        }
    }, [handleScan]);

    const stopScanner = useCallback(async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop();
                scannerRef.current.clear();
            } catch {
                // ignore
            }
            scannerRef.current = null;
        }
        setScanning(false);
        setPaused(false);
    }, []);

    const togglePause = useCallback(async () => {
        if (!scannerRef.current) return;
        if (paused) {
            await scannerRef.current.resume();
            setPaused(false);
        } else {
            await scannerRef.current.pause(true);
            setPaused(true);
        }
    }, [paused]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop().catch(() => {});
            }
        };
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold tracking-tight">Lanyard Scanner</h1>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                            <Zap size={10} /> Live
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Scannen Sie QR-Codes und Barcodes auf Event-Badges – Kontakte werden automatisch als Leads gespeichert.
                    </p>
                </div>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-border/50 bg-card p-4 text-center">
                    <p className="text-2xl font-bold text-foreground">{totalCreated}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Neue Leads</p>
                </div>
                <div className="rounded-xl border border-border/50 bg-card p-4 text-center">
                    <p className="text-2xl font-bold text-foreground">
                        {results.filter((r) => r.status === "duplicate").length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">Duplikate</p>
                </div>
                <div className="rounded-xl border border-border/50 bg-card p-4 text-center">
                    <p className="text-2xl font-bold text-foreground">{processedCodes.current.size}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Gescannt</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Camera view */}
                <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
                    <div className="p-4 border-b border-border/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Camera size={16} className="text-primary" />
                            <h3 className="text-sm font-semibold">Kamera</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            {scanning && (
                                <button
                                    onClick={togglePause}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted hover:bg-muted/80 transition-colors"
                                >
                                    {paused ? <Play size={12} /> : <Pause size={12} />}
                                    {paused ? "Fortsetzen" : "Pausieren"}
                                </button>
                            )}
                            <button
                                onClick={scanning ? stopScanner : startScanner}
                                className={cn(
                                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                                    scanning
                                        ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                                )}
                            >
                                {scanning ? (
                                    <><CameraOff size={12} /> Stoppen</>
                                ) : (
                                    <><Camera size={12} /> Starten</>
                                )}
                            </button>
                        </div>
                    </div>

                    <div ref={containerRef} className="relative aspect-square bg-black">
                        <div id="lanyard-scanner-view" className="w-full h-full" />

                        {!scanning && !cameraError && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                    <ScanLine size={36} className="text-primary" />
                                </div>
                                <p className="text-sm font-medium text-white/80">
                                    Kamera starten, um Lanyards zu scannen
                                </p>
                                <p className="text-xs text-white/50 mt-1">
                                    QR-Codes, Barcodes & vCards werden automatisch erkannt
                                </p>
                            </div>
                        )}

                        {cameraError && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                                <XCircle size={36} className="text-destructive mb-3" />
                                <p className="text-sm text-white/80">{cameraError}</p>
                            </div>
                        )}

                        {scanning && paused && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <p className="text-sm font-medium text-white/80">Pausiert</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Results feed */}
                <div className="rounded-xl border border-border/50 bg-card">
                    <div className="p-4 border-b border-border/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users size={16} className="text-primary" />
                            <h3 className="text-sm font-semibold">Erkannte Kontakte</h3>
                        </div>
                        {results.length > 0 && (
                            <button
                                onClick={() => {
                                    setResults([]);
                                    processedCodes.current.clear();
                                }}
                                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Zurücksetzen
                            </button>
                        )}
                    </div>

                    <div className="max-h-[480px] overflow-y-auto divide-y divide-border/30">
                        {results.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <ScanLine className="w-10 h-10 text-muted-foreground/30 mb-3" />
                                <p className="text-sm text-muted-foreground">
                                    Noch keine Scans
                                </p>
                                <p className="text-xs text-muted-foreground/60 mt-0.5">
                                    Scannen Sie einen Badge, um loszulegen
                                </p>
                            </div>
                        ) : (
                            results.map((r) => (
                                <div key={r.id} className="flex items-start gap-3 p-3 hover:bg-muted/30 transition-colors">
                                    <div
                                        className={cn(
                                            "mt-0.5 h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                                            r.status === "success" && "bg-emerald-500/10 text-emerald-500",
                                            r.status === "duplicate" && "bg-amber-500/10 text-amber-500",
                                            r.status === "error" && "bg-destructive/10 text-destructive"
                                        )}
                                    >
                                        {r.status === "success" && <CheckCircle2 size={16} />}
                                        {r.status === "duplicate" && <Users size={16} />}
                                        {r.status === "error" && <XCircle size={16} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">
                                            {r.contact.name || r.contact.email || "Unbekannt"}
                                        </p>
                                        {r.contact.company && (
                                            <p className="text-xs text-muted-foreground truncate">{r.contact.company}</p>
                                        )}
                                        <p className="text-xs text-muted-foreground/70 mt-0.5">{r.message}</p>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground shrink-0">
                                        {r.timestamp.toLocaleTimeString("de-DE", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                        })}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
