import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase/client";
import { CheckCircle2, Loader2, XCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

type VerificationState = "loading" | "success" | "error";

export default function AuthCallbackPage() {
    const [state, setState] = useState<VerificationState>("loading");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [countdown, setCountdown] = useState(3);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        async function handleCallback() {
            try {
                // Check for PKCE code in URL query params (Supabase v2 default)
                const code = searchParams.get("code");

                if (code) {
                    // Exchange the code for a session
                    const { error } = await supabase.auth.exchangeCodeForSession(code);
                    if (error) {
                        console.error("Code exchange error:", error);
                        setErrorMessage(error.message);
                        setState("error");
                        return;
                    }
                    setState("success");
                    return;
                }

                // Fallback: check for hash fragment (implicit flow / magic links)
                // Supabase client auto-detects hash tokens on page load
                // Give it a moment to process
                await new Promise(resolve => setTimeout(resolve, 500));

                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    console.error("Auth callback error:", error);
                    setErrorMessage(error.message);
                    setState("error");
                    return;
                }

                if (session) {
                    setState("success");
                } else {
                    // Try once more after a delay
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    const { data: { session: retrySession }, error: retryError } = await supabase.auth.getSession();

                    if (retryError) {
                        setErrorMessage(retryError.message);
                        setState("error");
                    } else if (retrySession) {
                        setState("success");
                    } else {
                        setErrorMessage("Die E-Mail-Bestätigung konnte nicht abgeschlossen werden. Der Link ist möglicherweise abgelaufen.");
                        setState("error");
                    }
                }
            } catch (err) {
                console.error("Unexpected error during auth callback:", err);
                setErrorMessage("Ein unerwarteter Fehler ist aufgetreten.");
                setState("error");
            }
        }

        handleCallback();
    }, [searchParams]);

    // Countdown and redirect on success
    useEffect(() => {
        if (state !== "success") return;

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate("/dashboard", { replace: true });
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [state, navigate]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Card Container */}
                <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl">
                    {/* Logo/Brand */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                            <Mail className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">E-Mail Bestätigung</h1>
                    </div>

                    {/* Loading State */}
                    {state === "loading" && (
                        <div className="text-center space-y-4">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/10">
                                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                            </div>
                            <p className="text-muted-foreground">
                                Ihre E-Mail wird verifiziert...
                            </p>
                        </div>
                    )}

                    {/* Success State */}
                    {state === "success" && (
                        <div className="text-center space-y-4">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 animate-in zoom-in duration-300">
                                <CheckCircle2 className="w-10 h-10 text-green-500" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold text-foreground">
                                    E-Mail erfolgreich bestätigt!
                                </h2>
                                <p className="text-muted-foreground">
                                    Ihr Konto wurde verifiziert. Sie werden in {countdown} Sekunden weitergeleitet...
                                </p>
                            </div>
                            <Button
                                onClick={() => navigate("/dashboard", { replace: true })}
                                className="w-full mt-4"
                            >
                                Zum Dashboard
                            </Button>
                        </div>
                    )}

                    {/* Error State */}
                    {state === "error" && (
                        <div className="text-center space-y-4">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10">
                                <XCircle className="w-10 h-10 text-red-500" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold text-foreground">
                                    Verifizierung fehlgeschlagen
                                </h2>
                                <p className="text-muted-foreground text-sm">
                                    {errorMessage || "Ein Fehler ist aufgetreten."}
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 mt-4">
                                <Button
                                    onClick={() => navigate("/login", { replace: true })}
                                    className="w-full"
                                >
                                    Zurück zum Login
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => window.location.reload()}
                                    className="w-full"
                                >
                                    Erneut versuchen
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-muted-foreground mt-6">
                    NFCwear by Severmore
                </p>
            </div>
        </div>
    );
}
