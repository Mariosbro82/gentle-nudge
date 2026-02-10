import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Mail, AlertCircle, CheckCircle } from "lucide-react";
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
            setSuccessMessage("Ein Link zum Zurücksetzen wurde an Ihre E-Mail gesendet.");
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center p-4 pt-20">
                <div className="w-full max-w-md">
                    <Card className="bg-card border-border shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600" />
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold text-foreground">Passwort vergessen?</CardTitle>
                            <CardDescription>Geben Sie Ihre E-Mail-Adresse ein, um einen Link zum Zurücksetzen zu erhalten.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">E-Mail Adresse</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="ihre@email.de"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
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

                                <Button type="submit" className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-all duration-200" disabled={isLoading || !!successMessage}>
                                    {isLoading ? <Loader2 className="animate-spin" /> : "Link anfordern"}
                                </Button>

                                <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
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
