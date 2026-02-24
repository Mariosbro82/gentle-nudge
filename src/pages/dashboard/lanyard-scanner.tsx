import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { createWorker } from "tesseract.js";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";
import {
    ScanLine, CheckCircle2, XCircle, Camera, CameraOff,
    Users, Zap, Pause, Play, CreditCard, QrCode, Loader2, ImageIcon,
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

type ScanMode = "qr" | "card";

// ─── vCard / MeCard / plain text parser ───
function parseVCard(text: string): ParsedContact {
    const result: ParsedContact = { raw: text };

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
        const match = (key: string) => {
            const regex = new RegExp(`${key}:([^;]+)`);
            return text.match(regex)?.[1]?.trim();
        };
        result.name = match("N");
        result.email = match("EMAIL");
        result.phone = match("TEL");
        result.company = match("ORG");
    } else if (text.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
        result.email = text.trim();
    } else if (text.startsWith("http")) {
        result.website = text.trim();
    } else {
        result.name = text.trim().substring(0, 200);
    }

    return result;
}

// ─── OCR text → contact info parser ───
function parseBusinessCardText(text: string): ParsedContact {
    const result: ParsedContact = { raw: text };
    const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean);

    // Email
    const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.-]{2,}/i);
    if (emailMatch) result.email = emailMatch[0].toLowerCase();

    // Phone: various formats
    const phoneMatch = text.match(/(?:\+?\d{1,3}[\s.-]?)?\(?\d{2,5}\)?[\s.-]?\d{2,5}[\s.-]?\d{2,6}/);
    if (phoneMatch) {
        const cleaned = phoneMatch[0].replace(/[^\d+]/g, "");
        if (cleaned.length >= 6) result.phone = phoneMatch[0].trim();
    }

    // Website
    const urlMatch = text.match(/(?:www\.|https?:\/\/)[\w.-]+\.\w{2,}/i);
    if (urlMatch) result.website = urlMatch[0].startsWith("http") ? urlMatch[0] : `https://${urlMatch[0]}`;

    // Try to find name: usually the first line that's not a company keyword, phone, email, url
    const skipPatterns = [/^tel/i, /^fax/i, /^mail/i, /^e-?mail/i, /^www\./i, /^http/i, /@/, /^\+?\d{4,}/, /gmbh|ag|ug|inc|ltd|co\.|kg|ohg|mbh/i];

    for (const line of lines) {
        if (skipPatterns.some((p) => p.test(line))) continue;
        // Likely a name: 2-4 words, each capitalized, no digits
        if (/^[A-ZÄÖÜ][a-zäöüß]+(?:\s+[A-ZÄÖÜ][a-zäöüß]+){0,3}$/.test(line)) {
            if (!result.name) {
                result.name = line;
                continue;
            }
        }
        // Likely a title/position
        if (!result.title && result.name && /manager|director|ceo|cto|cfo|head|leiter|geschäftsf|berater|consultant|sales|marketing|engineer|developer/i.test(line)) {
            result.title = line;
            continue;
        }
        // Likely a company name
        if (!result.company && /gmbh|ag|ug|inc|ltd|co\.|kg|ohg|mbh|group|consulting|solutions|tech|digital|media|services/i.test(line)) {
            result.company = line;
        }
    }

    // Fallback: first non-matched line as name
    if (!result.name && lines.length > 0) {
        const candidate = lines.find((l) => !skipPatterns.some((p) => p.test(l)) && l.length > 2 && l.length < 60);
        if (candidate) result.name = candidate;
    }

    return result;
}

export default function LanyardScannerPage() {
    const { user } = useAuth();
    const [scanMode, setScanMode] = useState<ScanMode>("qr");
    const [scanning, setScanning] = useState(false);
    const [paused, setPaused] = useState(false);
    const [results, setResults] = useState<ScanResult[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [totalCreated, setTotalCreated] = useState(0);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const processedCodes = useRef<Set<string>>(new Set());
    const containerRef = useRef<HTMLDivElement>(null);

    // Card scanner state
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [cardCameraActive, setCardCameraActive] = useState(false);
    const [ocrProcessing, setOcrProcessing] = useState(false);
    const [ocrProgress, setOcrProgress] = useState(0);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

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

    // ─── Save contact as lead ───
    const saveContact = useCallback(
        async (contact: ParsedContact, source: string) => {
            if (!userId) return;

            const resultId = crypto.randomUUID();

            // Duplicate check
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

            const noteParts: string[] = [];
            if (contact.title) noteParts.push(`Position: ${contact.title}`);
            if (contact.company) noteParts.push(`Firma: ${contact.company}`);
            if (contact.website) noteParts.push(`Web: ${contact.website}`);
            noteParts.push(`[${source}]`);

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

    // ─── QR scan handler ───
    const handleScan = useCallback(
        async (decodedText: string) => {
            if (!userId) return;
            if (processedCodes.current.has(decodedText)) return;
            processedCodes.current.add(decodedText);
            const contact = parseVCard(decodedText);
            await saveContact(contact, "Lanyard-Scan");
        },
        [userId, saveContact]
    );

    // ─── QR Scanner controls ───
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
                { fps: 10, qrbox: { width: 280, height: 280 }, aspectRatio: 1 },
                (decodedText) => handleScan(decodedText),
                () => {}
            );

            setScanning(true);
            setPaused(false);
        } catch (err: any) {
            console.error("Camera error:", err);
            setCameraError(
                err?.message?.includes("NotAllowed")
                    ? "Kamera-Zugriff verweigert. Bitte erlauben Sie den Zugriff in den Browser-Einstellungen."
                    : "Kamera konnte nicht gestartet werden."
            );
        }
    }, [handleScan]);

    const stopScanner = useCallback(async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop();
                scannerRef.current.clear();
            } catch {}
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

    // ─── Card camera controls ───
    const startCardCamera = useCallback(async () => {
        setCameraError(null);
        setCapturedImage(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }
            setCardCameraActive(true);
        } catch (err: any) {
            setCameraError(
                err?.name === "NotAllowedError"
                    ? "Kamera-Zugriff verweigert."
                    : "Kamera konnte nicht gestartet werden."
            );
        }
    }, []);

    const stopCardCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
        setCardCameraActive(false);
        setCapturedImage(null);
    }, []);

    const capturePhoto = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        setCapturedImage(dataUrl);
    }, []);

    const runOCR = useCallback(async () => {
        if (!capturedImage) return;
        setOcrProcessing(true);
        setOcrProgress(0);

        try {
            const worker = await createWorker("deu+eng", undefined, {
                logger: (m: any) => {
                    if (m.status === "recognizing text") {
                        setOcrProgress(Math.round(m.progress * 100));
                    }
                },
            });

            const { data } = await worker.recognize(capturedImage);
            await worker.terminate();

            const contact = parseBusinessCardText(data.text);
            await saveContact(contact, "Visitenkarten-Scan");
            setCapturedImage(null);
        } catch (err: any) {
            addResult({
                id: crypto.randomUUID(),
                contact: { raw: "" },
                status: "error",
                message: `OCR-Fehler: ${err.message || "Unbekannt"}`,
                timestamp: new Date(),
            });
        } finally {
            setOcrProcessing(false);
            setOcrProgress(0);
        }
    }, [capturedImage, saveContact, addResult]);

    // Handle file upload for business card
    const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            setCapturedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
        e.target.value = "";
    }, []);

    // Stop everything when switching modes
    useEffect(() => {
        if (scanMode === "qr") {
            stopCardCamera();
        } else {
            stopScanner();
        }
    }, [scanMode, stopCardCamera, stopScanner]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            scannerRef.current?.stop().catch(() => {});
            streamRef.current?.getTracks().forEach((t) => t.stop());
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
                        Scannen Sie QR-Codes, Barcodes oder Visitenkarten – Kontakte werden automatisch als Leads gespeichert.
                    </p>
                </div>
            </div>

            {/* Mode Switcher */}
            <div className="flex gap-1 p-1 rounded-xl bg-muted/50 border border-border/50 w-fit">
                <button
                    onClick={() => setScanMode("qr")}
                    className={cn(
                        "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                        scanMode === "qr"
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <QrCode size={16} />
                    QR / Barcode
                </button>
                <button
                    onClick={() => setScanMode("card")}
                    className={cn(
                        "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                        scanMode === "card"
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <CreditCard size={16} />
                    Visitenkarte
                </button>
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
                            {scanMode === "qr" ? <QrCode size={16} className="text-primary" /> : <CreditCard size={16} className="text-primary" />}
                            <h3 className="text-sm font-semibold">
                                {scanMode === "qr" ? "QR / Barcode Scanner" : "Visitenkartenscanner"}
                            </h3>
                        </div>
                        <div className="flex items-center gap-2">
                            {scanMode === "qr" ? (
                                <>
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
                                        {scanning ? <><CameraOff size={12} /> Stoppen</> : <><Camera size={12} /> Starten</>}
                                    </button>
                                </>
                            ) : (
                                <>
                                    {cardCameraActive && !capturedImage && (
                                        <button
                                            onClick={capturePhoto}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                                        >
                                            <Camera size={12} /> Foto aufnehmen
                                        </button>
                                    )}
                                    <button
                                        onClick={cardCameraActive ? stopCardCamera : startCardCamera}
                                        className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                                            cardCameraActive
                                                ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                                                : "bg-primary text-primary-foreground hover:bg-primary/90"
                                        )}
                                    >
                                        {cardCameraActive ? <><CameraOff size={12} /> Stoppen</> : <><Camera size={12} /> Kamera</>}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* QR Mode */}
                    {scanMode === "qr" && (
                        <div ref={containerRef} className="relative aspect-square bg-black">
                            <div id="lanyard-scanner-view" className="w-full h-full" />

                            {!scanning && !cameraError && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                        <ScanLine size={36} className="text-primary" />
                                    </div>
                                    <p className="text-sm font-medium text-white/80">Kamera starten, um Lanyards zu scannen</p>
                                    <p className="text-xs text-white/50 mt-1">QR-Codes, Barcodes & vCards werden automatisch erkannt</p>
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
                    )}

                    {/* Card Mode */}
                    {scanMode === "card" && (
                        <div className="relative aspect-[4/3] bg-black">
                            {/* Hidden canvas for capture */}
                            <canvas ref={canvasRef} className="hidden" />

                            {/* Live video feed */}
                            <video
                                ref={videoRef}
                                playsInline
                                muted
                                className={cn("w-full h-full object-cover", capturedImage && "hidden")}
                            />

                            {/* Captured image preview */}
                            {capturedImage && (
                                <div className="absolute inset-0">
                                    <img src={capturedImage} alt="Visitenkarte" className="w-full h-full object-contain bg-black" />

                                    {ocrProcessing && (
                                        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-3">
                                            <Loader2 size={32} className="text-primary animate-spin" />
                                            <p className="text-sm font-medium text-white">Text wird erkannt… {ocrProgress}%</p>
                                            <div className="w-48 h-1.5 rounded-full bg-white/20 overflow-hidden">
                                                <div
                                                    className="h-full bg-primary rounded-full transition-all duration-300"
                                                    style={{ width: `${ocrProgress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {!ocrProcessing && (
                                        <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                                            <button
                                                onClick={() => setCapturedImage(null)}
                                                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-medium bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm transition-colors"
                                            >
                                                Erneut aufnehmen
                                            </button>
                                            <button
                                                onClick={runOCR}
                                                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                                            >
                                                <ScanLine size={14} /> Text erkennen
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Idle state */}
                            {!cardCameraActive && !capturedImage && !cameraError && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                        <CreditCard size={36} className="text-primary" />
                                    </div>
                                    <p className="text-sm font-medium text-white/80">
                                        Visitenkarte scannen
                                    </p>
                                    <p className="text-xs text-white/50 mt-1 mb-4">
                                        Fotografieren Sie eine Visitenkarte – Name, E-Mail & Telefon werden automatisch erkannt
                                    </p>
                                    <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-white/10 text-white/80 hover:bg-white/20 cursor-pointer transition-colors">
                                        <ImageIcon size={14} />
                                        Bild hochladen
                                        <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                                    </label>
                                </div>
                            )}

                            {/* Camera guide overlay */}
                            {cardCameraActive && !capturedImage && (
                                <div className="absolute inset-0 pointer-events-none">
                                    <div className="absolute inset-8 border-2 border-dashed border-white/30 rounded-2xl" />
                                    <p className="absolute bottom-4 left-0 right-0 text-center text-xs text-white/60">
                                        Visitenkarte im Rahmen positionieren
                                    </p>
                                </div>
                            )}

                            {cameraError && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                                    <XCircle size={36} className="text-destructive mb-3" />
                                    <p className="text-sm text-white/80">{cameraError}</p>
                                </div>
                            )}
                        </div>
                    )}
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
                                <p className="text-sm text-muted-foreground">Noch keine Scans</p>
                                <p className="text-xs text-muted-foreground/60 mt-0.5">Scannen Sie einen Badge oder eine Visitenkarte</p>
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
