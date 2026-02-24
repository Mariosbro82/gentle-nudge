import { Sparkles, Users, BarChart3, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeStepProps {
    onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
    const features = [
        {
            icon: Users,
            title: "Digitale Visitenkarte",
            description: "Kontaktdaten teilen mit einem Tap",
        },
        {
            icon: BarChart3,
            title: "Analytics & Insights",
            description: "Sehen Sie, wer Ihr Profil besucht",
        },
        {
            icon: Zap,
            title: "Automatische Follow-ups",
            description: "Kontakte automatisch nachfassen",
        },
    ];

    return (
        <div className="text-center space-y-8">
            {/* Logo */}
            <div className="relative mx-auto w-20 h-20">
                <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-xl opacity-50 animate-pulse" />
                <div className="relative bg-primary rounded-2xl w-full h-full flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-primary-foreground" />
                </div>
            </div>

            {/* Text */}
            <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                    Willkommen bei NFCwear
                </h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                    Richten Sie Ihr digitales Profil in nur 3 Schritten ein — dauert weniger als 2 Minuten.
                </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {features.map((feature, i) => (
                    <div key={i} className="bg-card border border-border rounded-xl p-5 text-left">
                        <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center mb-3">
                            <feature.icon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-foreground text-sm mb-1">{feature.title}</h3>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <Button onClick={onNext} size="lg" className="px-8 py-6 text-base font-semibold w-full sm:w-auto">
                Profil einrichten
                <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
        </div>
    );
}
