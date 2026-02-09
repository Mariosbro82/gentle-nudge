import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            setError(error.message);
        } else {
            setSuccessMessage("Password reset email sent! Check your inbox.");
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center p-4 pt-20">
                <div className="w-full max-w-md">
                    <Card className="bg-card border-border shadow-2xl">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold text-foreground">Passwort zurücksetzen</CardTitle>
                            <CardDescription>Geben Sie Ihre E-Mail-Adresse ein, um einen Link zum Zurücksetzen zu erhalten.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="ihre@email.de"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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

                                <Button type="submit" className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="animate-spin" /> : "E-Mail senden"}
                                </Button>

                                <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    <ArrowLeft className="h-4 w-4" />
                                    Zurück zum Login
                                </Link>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
