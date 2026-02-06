import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

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
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-zinc-900 border-white/10">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-white">Severmore Admin</CardTitle>
                    <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
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
                            <Label htmlFor="password">Password</Label>
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

                        <div className="flex gap-4">
                            <Button type="submit" className="flex-1 bg-white text-black hover:bg-zinc-200" disabled={isLoading}>
                                {isLoading ? <Loader2 className="animate-spin" /> : "Sign In"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1 border-white/10 text-zinc-400"
                                onClick={handleSignUp}
                                disabled={isLoading}
                            >
                                Sign Up
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

        </div>
    );
}
