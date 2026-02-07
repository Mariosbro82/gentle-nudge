import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as any)?.from?.pathname || "/dashboard";

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

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

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setIsLoading(false);
        } else {
            setError("Account created! Check your email (or proceed to dashboard if auto-confirmed).");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center p-4 pt-20">
                <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                    {/* Left Column: Login Form */}
                    <div className="flex flex-col justify-center h-full space-y-8">
                        <div className="text-center lg:text-left">
                            <h1 className="text-3xl font-bold text-white mb-2">Willkommen zurück</h1>
                            <p className="text-zinc-400">Verwalten Sie Ihre NFC-Chips und Kampagnen zentral.</p>
                        </div>

                        <Card className="bg-zinc-900 border-white/10 shadow-2xl">
                            <CardHeader className="space-y-1">
                                <CardTitle className="text-2xl font-bold text-white">Login</CardTitle>
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
                                            className="bg-black/50 border-white/10 text-white"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password">Passwort</Label>
                                            <a href="#" className="text-xs text-blue-400 hover:text-blue-300">Vergessen?</a>
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="bg-black/50 border-white/10 text-white"
                                            required
                                        />
                                    </div>

                                    {error && (
                                        <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
                                    )}

                                    <div className="flex gap-4 pt-2">
                                        <Button type="submit" className="flex-1 bg-white text-black hover:bg-zinc-200 font-semibold" disabled={isLoading}>
                                            {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Anmelden"}
                                        </Button>
                                    </div>
                                    <div className="text-center">
                                        <button
                                            type="button"
                                            className="text-sm text-zinc-500 hover:text-white transition-colors"
                                            onClick={handleSignUp}
                                            disabled={isLoading}
                                        >
                                            Noch kein Account? Registrieren
                                        </button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: News / Status Sidebar */}
                    <div className="hidden lg:block h-full pl-8">
                        <div className="sticky top-24">
                            <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
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
