import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Loader2, ArrowRight, Sparkles, Copy, Circle } from "lucide-react";
import { OnboardingData } from "@/types/onboarding";
import { QRCodeCanvas } from "qrcode.react";
import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";
import { cn } from "@/lib/utils";

import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface CompletionStepProps {
    data: OnboardingData;
    onComplete: () => Promise<void>;
    isSubmitting: boolean;
    error?: string | null;
}

export function CompletionStep({ data, onComplete, isSubmitting, error }: CompletionStepProps) {
    const { user: _user } = useAuth();
    const [copied, setCopied] = useState(false);

    // We try to use the slug from user metadata first, but for now we'll construct a likely one
    // In a real scenario we'd pass the actual slug here
    const profileUrl = `nfc.severmore.de/p/${data.displayName?.toLowerCase().replace(/\s+/g, '-') || 'user'}`;
    const fullUrl = `https://${profileUrl}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="text-center space-y-8">
            {/* Success Animation */}
            <div className="relative mx-auto w-24 h-24 mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full blur-2xl opacity-30 animate-pulse" />
                <div className="relative bg-gradient-to-br from-green-400 to-emerald-600 rounded-full w-full h-full flex items-center justify-center">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
            </div>

            {/* Congratulations Text */}
            <div className="space-y-3">
                <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-3">
                    <Sparkles className="w-8 h-8 text-yellow-400" />
                    Herzlichen Glückwunsch!
                </h1>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                    Ihr Profil ist bereit! Hier ist Ihr persönlicher Link.
                </p>
            </div>

            {/* Error Alert */}
            {error && (
                <Alert variant="destructive" className="max-w-md mx-auto text-left">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Fehler</AlertTitle>
                    <AlertDescription>
                        {error}
                    </AlertDescription>
                </Alert>
            )}

            {/* Link & QR Code Section */}
            <Card className="bg-card p-6 max-w-md mx-auto overflow-hidden border-border">
                <div className="flex flex-col items-center gap-6">
                    <div className="bg-white p-2 rounded-xl shadow-lg border border-gray-100">
                        <QRCodeCanvas value={fullUrl} size={150} level={"H"} />
                    </div>

                    <div className="w-full space-y-2">
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Ihr Profil Link</p>
                        <div className="flex items-center gap-2 bg-muted border border-border p-1 pl-4 rounded-lg">
                            <span className="flex-1 text-left text-foreground font-medium truncate">{profileUrl}</span>
                            <Button
                                size="sm"
                                variant={copied ? "default" : "secondary"}
                                onClick={handleCopy}
                                className={cn(
                                    "transition-all",
                                    copied ? "bg-green-500 hover:bg-green-600 text-white" : ""
                                )}
                            >
                                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* 3 Quick Wins Checklist */}
            <div className="max-w-md mx-auto bg-card rounded-lg p-5 border border-border">
                <h3 className="font-semibold text-foreground mb-4 text-left">3 Quick Wins für den Start:</h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-left">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-muted-foreground">Teilen Sie Ihre Karte mit 3 Personen heute</span>
                    </div>
                    {!data.automationInterest && (
                        <div className="flex items-center gap-3 text-left opacity-70">
                            <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            <span className="text-muted-foreground">Automatisierung einrichten</span>
                        </div>
                    )}
                    <div className="flex items-center gap-3 text-left opacity-70">
                        <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">Bestellen Sie Ihr NFC-Produkt</span>
                    </div>
                </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                    onClick={() => window.open(fullUrl, '_blank')}
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-auto text-lg px-8 py-6"
                >
                    Meine Karte ansehen
                </Button>

                <Button
                    onClick={onComplete}
                    disabled={isSubmitting}
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold shadow-lg shadow-purple-500/20"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Wird gespeichert...
                        </>
                    ) : (
                        <>
                            Zum Dashboard
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
