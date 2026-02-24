import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, KeyRound, ArrowLeft } from "lucide-react";
import { SidebarDashboard } from "@/components/ui/sidebar-dashboard";
import { Navbar } from "@/components/marketing/navbar";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [ssoMode, setSsoMode] = useState(false);
    const [ssoEmail, setSsoEmail] = useState("");
    const [ssoLoading, setSsoLoading] = useState(false);
    const [privacyConsent, setPrivacyConsent] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as any)?.from?.pathname || "/dashboard";

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setIsLoading(false);
        } else {
            navigate(from, { replace: true });
        }
    };

    const handleSignUp = async () => {
        if (!privacyConsent) {
            setError("Bitte akzeptieren Sie die Datenschutzerklärung, um fortzufahren.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            setError(error.message);
            setIsLoading(false);
        } else {
            setSuccessMessage("Account created! Check your email to confirm your account.");
            setIsLoading(false);
        }
    };

    const handleSsoLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setSsoLoading(true);
        setError(null);

        const domain = ssoEmail.split("@")[1];
        if (!domain) {
            setError("Bitte geben Sie eine gültige Firmen-E-Mail-Adresse ein.");
            setSsoLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase.auth.signInWithSSO({ domain });

            if (error) {
                if (error.message.includes("No SSO provider") || error.message.includes("not found")) {
                    setError(`Die Domain "${domain}" ist nicht für Single Sign-On registriert. Bitte kontaktieren Sie Ihren Administrator.`);
                } else {
                    setError(error.message);
                }
                setSsoLoading(false);
                return;
            }

            if (data?.url) {
                window.location.href = data.url;
            }
        } catch {
            setError("SSO-Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.");
            setSsoLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center p-4 pt-20">
                <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                    {/* Left Column: Login Form */}
                    <div className="flex flex-col justify-center h-full space-y-8">
                        <div className="text-center lg:text-left">
                            <h1 className="text-3xl font-bold text-foreground mb-2">Willkommen zurück</h1>
                            <p className="text-muted-foreground">Verwalten Sie Ihre NFC-Chips und Kampagnen zentral.</p>
                        </div>

                        <Card className="bg-card border-border shadow-2xl">
                            <CardHeader className="space-y-1">
                                <CardTitle className="text-2xl font-bold text-foreground">
                                    {ssoMode ? "SSO Login" : "Login"}
                                </CardTitle>
                                <CardDescription>
                                    {ssoMode
                                        ? "Melden Sie sich mit Ihrem Unternehmenskonto an."
                                        : "Geben Sie Ihre Zugangsdaten ein."}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {ssoMode ? (
                                    /* SSO Login Form */
                                    <form onSubmit={handleSsoLogin} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="sso-email">Firmen-E-Mail-Adresse</Label>
                                            <Input
                                                id="sso-email"
                                                type="email"
                                                placeholder="vorname@firma.de"
                                                value={ssoEmail}
                                                onChange={(e) => setSsoEmail(e.target.value)}
                                                className="bg-input border-border text-foreground"
                                                required
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Wir leiten Sie zum Identity Provider Ihres Unternehmens weiter.
                                            </p>
                                        </div>

                                        {error && (
                                            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">{error}</div>
                                        )}

                                        <Button
                                            type="submit"
                                            className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                                            disabled={ssoLoading}
                                        >
                                            {ssoLoading ? <Loader2 className="animate-spin" /> : "Weiter mit SSO"}
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="w-full text-muted-foreground hover:text-foreground"
                                            onClick={() => { setSsoMode(false); setError(null); }}
                                        >
                                            <ArrowLeft className="mr-2 h-4 w-4" /> Zurück zum Standard-Login
                                        </Button>
                                    </form>
                                ) : (
                                    /* Standard Login Form */
                                    <div className="space-y-4">
                                        <form onSubmit={handleLogin} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="admin@severmore.de"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="bg-input border-border text-foreground"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <Label htmlFor="password">Passwort</Label>
                                                    <Link to="/forgot-password" className="text-xs text-primary hover:text-primary/80">Vergessen?</Link>
                                                </div>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="bg-input border-border text-foreground"
                                                    required
                                                />
                                            </div>

                                            {error && (
                                                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">{error}</div>
                                            )}

                                            {successMessage && (
                                                <div className="p-3 rounded-md bg-green-500/10 border border-green-500/20 text-green-500 text-sm">{successMessage}</div>
                                            )}

                                            {/* DSGVO Consent for Registration */}
                                            <label className="flex items-start gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={privacyConsent}
                                                    onChange={(e) => setPrivacyConsent(e.target.checked)}
                                                    className="mt-1 rounded border-border"
                                                />
                                                <span className="text-xs text-muted-foreground leading-relaxed">
                                                    Ich habe die{" "}
                                                    <Link to="/privacy" className="text-primary hover:underline" target="_blank">
                                                        Datenschutzerklärung
                                                    </Link>{" "}
                                                    und die{" "}
                                                    <Link to="/terms" className="text-primary hover:underline" target="_blank">
                                                        AGB
                                                    </Link>{" "}
                                                    gelesen und akzeptiere diese.
                                                </span>
                                            </label>

                                            <div className="flex gap-4 pt-2">
                                                <Button type="submit" className="flex-1 h-10 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" disabled={isLoading}>
                                                    {isLoading ? <Loader2 className="animate-spin" /> : "Anmelden"}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="flex-1 h-10 border-border text-foreground hover:bg-accent font-semibold"
                                                    onClick={handleSignUp}
                                                    disabled={isLoading || !privacyConsent}
                                                >
                                                    {isLoading ? <Loader2 className="animate-spin" /> : "Registrieren"}
                                                </Button>
                                            </div>
                                        </form>

                                        {/* SSO Divider */}
                                        <div className="relative my-2">
                                            <div className="absolute inset-0 flex items-center">
                                                <span className="w-full border-t border-border" />
                                            </div>
                                            <div className="relative flex justify-center text-xs uppercase">
                                                <span className="bg-card px-2 text-muted-foreground">oder</span>
                                            </div>
                                        </div>

                                        {/* SSO Button */}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full h-10 border-border text-foreground hover:bg-accent font-medium"
                                            onClick={() => { setSsoMode(true); setError(null); setSuccessMessage(null); }}
                                        >
                                            <KeyRound className="mr-2 h-4 w-4" /> Mit Single Sign-On (SSO) anmelden
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Dashboard Preview Sidebar */}
                    <div className="hidden lg:block h-full pl-8">
                        <div className="sticky top-24">
                            <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                Ihr Dashboard im Überblick
                            </h2>
                            <SidebarDashboard />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}