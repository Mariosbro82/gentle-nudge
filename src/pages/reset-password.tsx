import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, AlertCircle, Lock } from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isRecoveryMode, setIsRecoveryMode] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        // Check for PKCE code first (Supabase v2 default)
        const checkSession = async () => {
            const url = new URL(window.location.href);
            const code = url.searchParams.get("code");

            if (code) {
                // Exchange code for session
                const { error } = await supabase.auth.exchangeCodeForSession(code);
                if (error) {
                    setError("Der Link ist abgelaufen oder ungültig. Bitte fordern Sie einen neuen Link an.");
                    // Stop loading spinner by setting a timeout or handle error state directly
                    return;
                }
                // Success will trigger onAuthStateChange -> PASSWORD_RECOVERY
            } else {
                // Fallback: Check if we already have a session (e.g. implicitly)
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    setIsRecoveryMode(true);
                }
            }
        };

        checkSession();

        // Listen for PASSWORD_RECOVERY event
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
            if (event === "PASSWORD_RECOVERY") {
                setIsRecoveryMode(true);
            }
        });

        // Timeout to stop infinite loading if something goes wrong
        timeoutId = setTimeout(() => {
            if (!isRecoveryMode) {
                // Only show error if we haven't transitioned yet and no specific error exists
                setError((prev) => prev || "Zeitüberschreitung bei der Überprüfung. Bitte versuchen Sie es erneut.");
            }
        }, 10000); // 10 seconds timeout

        return () => {
            subscription.unsubscribe();
            clearTimeout(timeoutId);
        };
    }, [isRecoveryMode]);

    const validatePassword = (): string | null => {
        if (password.length < 8) {
            return "Das Passwort muss mindestens 8 Zeichen lang sein.";
        }
        if (password !== confirmPassword) {
            return "Die Passwörter stimmen nicht überein.";
        }
        return null;
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validatePassword();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            if (error.message.toLowerCase().includes("expired") || error.message.toLowerCase().includes("invalid")) {
                setError("Der Link ist abgelaufen oder ungültig. Bitte fordern Sie einen neuen Link an.");
            } else {
                setError(error.message);
            }
        } else {
            setSuccessMessage("Ihr Passwort wurde erfolgreich aktualisiert!");
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        }
        setIsLoading(false);
    };

    // Show waiting state if not in recovery mode yet
    if (!isRecoveryMode) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center p-4 pt-20">
                    <div className="w-full max-w-md">
                        <Card className="bg-card border-border shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500" />
                            <CardHeader className="space-y-1">
                                <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                                    <AlertCircle className="h-6 w-6 text-yellow-500" />
                                    Überprüfung...
                                </CardTitle>
                                <CardDescription>
                                    Bitte warten Sie, während wir Ihren Reset-Link verifizieren.
                                    Falls diese Seite nicht automatisch lädt, ist Ihr Link eventuell abgelaufen.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-center py-4">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full border-border text-foreground hover:bg-accent"
                                    onClick={() => navigate("/forgot-password")}
                                >
                                    Neuen Link anfordern
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center p-4 pt-20">
                <div className="w-full max-w-md">
                    <Card className="bg-card border-border shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-600" />
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold text-foreground">Neues Passwort setzen</CardTitle>
                            <CardDescription>Sichern Sie Ihren Account mit einem neuen Passwort.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdatePassword} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">Neues Passwort</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Mindestens 8 Zeichen"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="bg-input border-border text-foreground pl-10"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Passwort wiederholen"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="bg-input border-border text-foreground pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2">
                                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                        {error}
                                    </div>
                                )}

                                {successMessage && (
                                    <div className="p-3 rounded-md bg-green-500/10 border border-green-500/20 text-green-500 text-sm flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                        {successMessage}
                                    </div>
                                )}

                                <Button type="submit" className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" disabled={isLoading || !!successMessage}>
                                    {isLoading ? <Loader2 className="animate-spin" /> : "Passwort speichern"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
