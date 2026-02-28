import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Cookie, X } from "lucide-react";

const CONSENT_KEY = "nfcwear_cookie_consent";

export function CookieConsent() {
    const [visible, setVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem(CONSENT_KEY);
        if (!consent) {
            // Small delay so it doesn't flash on page load
            const timer = setTimeout(() => setVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    function handleAcceptAll() {
        localStorage.setItem(CONSENT_KEY, "accepted");
        setVisible(false);
    }

    function handleEssentialOnly() {
        localStorage.setItem(CONSENT_KEY, "essential");
        setVisible(false);
    }

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6 pointer-events-none">
            <div className="max-w-lg mx-auto md:mx-0 md:ml-4 pointer-events-auto">
                <div className="relative rounded-2xl border border-white/[0.08] bg-black/60 backdrop-blur-[60px] backdrop-saturate-[180%] shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-5 md:p-6">
                    {/* Radial glow */}
                    <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.06),transparent_70%)] pointer-events-none" />

                    {/* Close button */}
                    <button
                        onClick={handleEssentialOnly}
                        className="absolute top-3 right-3 z-10 text-white/40 hover:text-white/80 transition-colors"
                        aria-label="Schließen"
                    >
                        <X className="h-4 w-4 drop-shadow" />
                    </button>

                    {/* Header */}
                    <div className="relative flex items-center gap-2.5 mb-3">
                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-white/[0.08] border border-white/[0.06]">
                            <Cookie className="h-4 w-4 text-primary drop-shadow" />
                        </div>
                        <h3 className="font-semibold text-sm text-white drop-shadow">Cookie-Einstellungen</h3>
                    </div>

                    {/* Text */}
                    <p className="relative text-xs text-white/50 leading-relaxed mb-4 drop-shadow">
                        Wir verwenden essenzielle Cookies für die Funktion der Website (Authentifizierung, Sitzungsverwaltung). 
                        {!showDetails && (
                            <>
                                {" "}
                                <button 
                                    onClick={() => setShowDetails(true)} 
                                    className="text-primary hover:underline"
                                >
                                    Mehr erfahren
                                </button>
                            </>
                        )}
                    </p>

                    {/* Details */}
                    {showDetails && (
                        <div className="relative mb-4 space-y-2.5 text-xs text-white/50">
                            <div className="rounded-lg bg-white/[0.04] border border-white/[0.06] p-3 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-white/80">Essenzielle Cookies</span>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/15 text-primary font-medium">Immer aktiv</span>
                                </div>
                                <p>Notwendig für Login, Sitzungsverwaltung und Sicherheitsfunktionen (Supabase Auth).</p>
                            </div>
                            <div className="rounded-lg bg-white/[0.04] border border-white/[0.06] p-3 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-white/80">Funktionale Cookies</span>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-white/40 font-medium">Optional</span>
                                </div>
                                <p>Speichern Ihre Einstellungen wie Passwort-Gate-Status und Theme-Präferenzen für ein besseres Nutzungserlebnis.</p>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="relative flex gap-2.5">
                        <Button
                            onClick={handleAcceptAll}
                            size="sm"
                            className="flex-1 h-9 text-xs font-semibold rounded-xl"
                        >
                            Alle akzeptieren
                        </Button>
                        <Button
                            onClick={handleEssentialOnly}
                            variant="outline"
                            size="sm"
                            className="flex-1 h-9 text-xs font-semibold rounded-xl border-white/[0.1] text-white/70 hover:text-white hover:bg-white/[0.06]"
                        >
                            Nur essenzielle
                        </Button>
                    </div>

                    {/* Privacy link */}
                    <p className="relative text-[10px] text-white/30 mt-3 text-center">
                        Weitere Informationen in unserer{" "}
                        <Link to="/privacy" className="text-primary hover:underline">
                            Datenschutzerklärung
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
