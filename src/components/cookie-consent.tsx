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
                <div className="relative rounded-2xl border border-border/60 bg-background/95 backdrop-blur-xl shadow-2xl shadow-black/20 p-5 md:p-6">
                    {/* Close button */}
                    <button
                        onClick={handleEssentialOnly}
                        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Schließen"
                    >
                        <X className="h-4 w-4" />
                    </button>

                    {/* Header */}
                    <div className="flex items-center gap-2.5 mb-3">
                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10">
                            <Cookie className="h-4 w-4 text-primary" />
                        </div>
                        <h3 className="font-semibold text-sm text-foreground">Cookie-Einstellungen</h3>
                    </div>

                    {/* Text */}
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">
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
                        <div className="mb-4 space-y-2.5 text-xs text-muted-foreground">
                            <div className="rounded-lg bg-muted/50 p-3 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-foreground">Essenzielle Cookies</span>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">Immer aktiv</span>
                                </div>
                                <p>Notwendig für Login, Sitzungsverwaltung und Sicherheitsfunktionen (Supabase Auth).</p>
                            </div>
                            <div className="rounded-lg bg-muted/50 p-3 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-foreground">Funktionale Cookies</span>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">Optional</span>
                                </div>
                                <p>Speichern Ihre Einstellungen wie Passwort-Gate-Status und Theme-Präferenzen für ein besseres Nutzungserlebnis.</p>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2.5">
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
                            className="flex-1 h-9 text-xs font-semibold rounded-xl"
                        >
                            Nur essenzielle
                        </Button>
                    </div>

                    {/* Privacy link */}
                    <p className="text-[10px] text-muted-foreground mt-3 text-center">
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
