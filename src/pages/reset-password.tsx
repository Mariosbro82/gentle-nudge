import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
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
        // Listen for PASSWORD_RECOVERY event
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
            if (event === "PASSWORD_RECOVERY") {
                setIsRecoveryMode(true);
            }
        });

        // Also check if we're already in a recovery session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setIsRecoveryMode(true);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const validatePassword = (): string | null => {
        if (password.length < 6) {
            return "Das Passwort muss mindestens 6 Zeichen lang sein.";
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
            if (error.message.includes("expired") || error.message.includes("invalid")) {
                setError("Der Link ist abgelaufen oder ungültig. Bitte fordern Sie einen neuen Link an.");
            } else {
                setError(error.message);
            }
        } else {
            setSuccessMessage("Passwort erfolgreich geändert! Sie werden zum Login weitergeleitet...");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
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
                        <Card className="bg-card border-border shadow-2xl">
                            <CardHeader className="space-y-1">
                                <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                                    <AlertCircle className="h-6 w-6 text-yellow-500" />
                                    Überprüfung...
                                </CardTitle>
                                <CardDescription>
                                    Bitte warten Sie, während wir Ihren Reset-Link überprüfen.
                                    Falls Sie keinen gültigen Link haben, fordern Sie bitte einen neuen an.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-center py-4">
                                    <Loader2 className="h-8 w-8 animate-spin text-foreground" />
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
                    <Card className="bg-card border-border shadow-2xl">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold text-foreground">Neues Passwort setzen</CardTitle>
                            <CardDescription>Geben Sie Ihr neues Passwort ein.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdatePassword} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">Neues Passwort</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Mindestens 6 Zeichen"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="bg-input border-border text-foreground"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Passwort wiederholen"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="bg-input border-border text-foreground"
                                        required
                                    />
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
                                    {isLoading ? <Loader2 className="animate-spin" /> : "Passwort ändern"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
