import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Loader2, ArrowRight, Sparkles } from "lucide-react";
import type { OnboardingData } from "../OnboardingWizard";

interface CompletionStepProps {
    data: OnboardingData;
    onComplete: () => void;
    isSubmitting: boolean;
}

export function CompletionStep({ data, onComplete, isSubmitting }: CompletionStepProps) {
    const completedItems = [
        data.industry && "Branche ausgewählt",
        data.useCase && "Nutzungszweck definiert",
        data.companyName && "Unternehmen hinzugefügt",
        data.teamSize && "Teamgröße angegeben",
        data.displayName && "Profilname eingestellt",
        data.profilePic && "Profilbild hochgeladen",
    ].filter(Boolean);

    return (
        <div className="text-center space-y-8">
            {/* Success Animation */}
            <div className="relative mx-auto w-32 h-32">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full blur-2xl opacity-30 animate-pulse" />
                <div className="relative bg-gradient-to-br from-green-400 to-emerald-600 rounded-full w-full h-full flex items-center justify-center">
                    <CheckCircle2 className="w-16 h-16 text-white" />
                </div>
            </div>

            {/* Congratulations Text */}
            <div className="space-y-3">
                <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
                    <Sparkles className="w-8 h-8 text-yellow-400" />
                    Herzlichen Glückwunsch!
                    <Sparkles className="w-8 h-8 text-yellow-400" />
                </h1>
                <p className="text-lg text-zinc-400 max-w-md mx-auto">
                    Ihr Profil ist eingerichtet und bereit für den Einsatz.
                    Willkommen bei NFCwear!
                </p>
            </div>

            {/* Progress Summary */}
            {completedItems.length > 0 && (
                <Card className="bg-zinc-900/50 border-white/5 p-6 max-w-md mx-auto">
                    <h3 className="font-semibold text-white mb-4 text-left">Was Sie eingerichtet haben:</h3>
                    <ul className="space-y-2">
                        {completedItems.map((item, index) => (
                            <li key={index} className="flex items-center gap-3 text-left">
                                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                                <span className="text-zinc-300">{item}</span>
                            </li>
                        ))}
                    </ul>
                </Card>
            )}

            {/* CTA Button */}
            <Button
                onClick={onComplete}
                disabled={isSubmitting}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold shadow-lg shadow-purple-500/20"
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

            <p className="text-xs text-zinc-600">
                Sie können alle Einstellungen später im Dashboard ändern.
            </p>
        </div>
    );
}
