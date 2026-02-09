import { Sparkles, Users, BarChart3, Zap, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeStepProps {
    onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
    const features = [
        {
            icon: Users,
            title: "Digitale Visitenkarte",
            description: "Teilen Sie Ihre Kontaktdaten mit einem Tap",
        },
        {
            icon: BarChart3,
            title: "Analytics & Insights",
            description: "Sehen Sie, wer Ihr Profil besucht hat",
        },
        {
            icon: Zap,
            title: "Lead Capture",
            description: "Sammeln Sie Kontakte automatisch",
        },
    ];

    return (
        <div className="text-center space-y-8">
            {/* Animated Logo/Icon */}
            <div className="relative mx-auto w-24 h-24">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-50 animate-pulse" />
                <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl w-full h-full flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-white" />
                </div>
            </div>

            {/* Welcome Text */}
            <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-sm font-medium text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full mx-auto w-fit">
                    <Users className="w-3 h-3" />
                    <span>Schließen Sie sich über 5.000 Profis an</span>
                </div>
                <h1 className="text-4xl font-bold text-foreground">
                    Willkommen bei NFCwear
                </h1>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                    Die Zukunft des Networkings beginnt jetzt. Lassen Sie uns Ihr Profil
                    in wenigen Schritten einrichten.
                </p>
                <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm pt-2">
                    <Clock className="w-4 h-4" />
                    <span>7 schnelle Schritte • 2 Minuten</span>
                </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="bg-card border border-border rounded-xl p-6 text-left hover:border-muted-foreground/20 transition-all"
                    >
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-4">
                            <feature.icon className="w-5 h-5 text-blue-400" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <Button
                onClick={onNext}
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg font-semibold w-full sm:w-auto"
            >
                Jetzt starten
            </Button>
        </div>
    );
}
