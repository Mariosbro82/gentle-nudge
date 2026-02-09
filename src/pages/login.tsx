import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { SidebarNews } from "@/components/ui/sidebar-news";
import { Navbar } from "@/components/marketing/navbar";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
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
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setIsLoading(false);
        } else {
            setSuccessMessage("Account created! Check your email to confirm your account.");
            setIsLoading(false);
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
                                <CardTitle className="text-2xl font-bold text-foreground">Login</CardTitle>
                                <CardDescription>Geben Sie Ihre Zugangsdaten ein.</CardDescription>
                            </CardHeader>
                            <CardContent>
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
                                            <Link to="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300">Vergessen?</Link>
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
                                        <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
                                    )}

                                    {successMessage && (
                                        <div className="p-3 rounded-md bg-green-500/10 border border-green-500/20 text-green-500 text-sm">{successMessage}</div>
                                    )}

                                    <div className="flex gap-4 pt-2">
                                        <Button type="submit" className="flex-1 h-10 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" disabled={isLoading}>
                                            {isLoading ? <Loader2 className="animate-spin" /> : "Anmelden"}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="flex-1 h-10 border-border text-foreground hover:bg-accent font-semibold"
                                            onClick={handleSignUp}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? <Loader2 className="animate-spin" /> : "Registrieren"}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: News / Status Sidebar */}
                    <div className="hidden lg:block h-full pl-8">
                        <div className="sticky top-24">
                            <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                System Status & Updates
                            </h2>
                            <SidebarNews />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
