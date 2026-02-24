import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, ArrowRight, Sparkles, Copy, Zap, Clock, Mail, Smartphone } from "lucide-react";
import { OnboardingData } from "@/types/onboarding";
import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface CompletionStepProps {
    data: OnboardingData;
    updateData: (updates: Partial<OnboardingData>) => void;
    onComplete: () => Promise<void>;
    isSubmitting: boolean;
    error?: string | null;
}

export function CompletionStep({ data, updateData, onComplete, isSubmitting, error }: CompletionStepProps) {
    const [copied, setCopied] = useState(false);

    const slug = data.slug || data.displayName?.toLowerCase().replace(/\s+/g, '-') || 'user';
    const profileUrl = `nfcwear.de/p/${slug}`;
    const fullUrl = `https://${profileUrl}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getDelayLabel = (hours: number) => {
        if (hours >= 168) return '1 Woche';
        if (hours >= 48) return `${Math.round(hours / 24)} Tage`;
        return `${hours} Stunden`;
    };

    return (
        <div className="space-y-6">
            {/* Success header */}
            <div className="text-center space-y-3">
                <div className="relative mx-auto w-16 h-16">
                    <div className="absolute inset-0 bg-green-500/30 rounded-full blur-xl animate-pulse" />
                    <div className="relative bg-gradient-to-br from-green-400 to-emerald-600 rounded-full w-full h-full flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center justify-center gap-2">
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                    Fast geschafft!
                </h1>
                <p className="text-muted-foreground text-sm">Ihr Profil ist bereit. Hier ist Ihr persönlicher Link.</p>
            </div>

            {error && (
                <Alert variant="destructive" className="text-left">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Fehler</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Profile Link + QR */}
            <div className="bg-card border border-border rounded-xl p-5 flex flex-col sm:flex-row items-center gap-5">
                <div className="bg-white p-2 rounded-lg shadow-sm shrink-0">
                    <QRCodeCanvas value={fullUrl} size={100} level="H" />
                </div>
                <div className="flex-1 w-full space-y-2">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Ihr Profil-Link</p>
                    <div className="flex items-center gap-2 bg-muted border border-border p-1 pl-3 rounded-lg">
                        <span className="flex-1 text-foreground text-sm font-medium truncate">{profileUrl}</span>
                        <Button size="sm" variant={copied ? "default" : "secondary"} onClick={handleCopy}
                            className={cn("transition-all shrink-0", copied ? "bg-green-500 hover:bg-green-600 text-white" : "")}>
                            {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Follow-up automation */}
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-foreground">Auto Follow-up</h3>
                            <p className="text-[11px] text-muted-foreground">Automatisch E-Mails nach Kontaktaustausch</p>
                        </div>
                    </div>
                    <Switch
                        checked={data.automationInterest}
                        onCheckedChange={(checked) => updateData({ automationInterest: checked })}
                    />
                </div>

                {data.automationInterest && (
                    <div className="space-y-3 pt-2 border-t border-border">
                        {/* Visual flow */}
                        <div className="flex items-center justify-center gap-3 text-muted-foreground py-2">
                            <div className="flex flex-col items-center gap-1">
                                <Smartphone className="w-4 h-4" />
                                <span className="text-[9px]">Scan</span>
                            </div>
                            <div className="w-6 h-px bg-border" />
                            <div className="flex flex-col items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span className="text-[9px]">{getDelayLabel(data.automationDelayHours || 24)}</span>
                            </div>
                            <div className="w-6 h-px bg-border" />
                            <div className="flex flex-col items-center gap-1 text-primary">
                                <Mail className="w-4 h-4" />
                                <span className="text-[9px]">E-Mail</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <Label className="text-muted-foreground">Verzögerung</Label>
                                <span className="font-medium text-foreground">{getDelayLabel(data.automationDelayHours || 24)}</span>
                            </div>
                            <Slider
                                defaultValue={[data.automationDelayHours || 24]}
                                max={168}
                                min={6}
                                step={1}
                                onValueChange={(v) => updateData({ automationDelayHours: v[0], automationInterest: true })}
                            />
                        </div>

                        <p className="text-[10px] text-muted-foreground bg-muted rounded-lg p-2 flex items-start gap-1.5">
                            <Zap className="w-3 h-3 shrink-0 mt-0.5 text-primary" />
                            Pro-Tipp: 24h Follow-ups haben 3x höhere Rücklaufquoten. Texte können Sie im Dashboard anpassen.
                        </p>
                        <p className="text-[10px] text-muted-foreground bg-muted/50 rounded-lg p-2 flex items-start gap-1.5">
                            🔒 DSGVO-konform: Follow-ups werden nur an Kontakte gesendet, die dem Marketing-Opt-in aktiv zugestimmt haben.
                        </p>
                    </div>
                )}
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-3 pt-2">
                <Button onClick={onComplete} disabled={isSubmitting} size="lg"
                    className="w-full py-6 text-base font-semibold">
                    {isSubmitting ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Wird gespeichert...</>
                    ) : (
                        <><ArrowRight className="w-4 h-4 mr-2" /> Zum Dashboard</>
                    )}
                </Button>
                <Button variant="ghost" onClick={() => window.open(fullUrl, '_blank')} className="text-muted-foreground text-sm">
                    Profil-Vorschau öffnen ↗
                </Button>
            </div>
        </div>
    );
}
