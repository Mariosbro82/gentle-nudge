import { Sparkles, Users, BarChart3, Zap } from "lucide-react";
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
                <h1 className="text-4xl font-bold text-white">
                    Willkommen bei NFCwear
                </h1>
                <p className="text-lg text-zinc-400 max-w-md mx-auto">
                    Die Zukunft des Networkings beginnt jetzt. Lassen Sie uns Ihr Profil
                    in wenigen Schritten einrichten.
                </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 text-left hover:border-white/10 transition-all"
                    >
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4">
                            <feature.icon className="w-5 h-5 text-blue-400" />
                        </div>
                        <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                        <p className="text-sm text-zinc-500">{feature.description}</p>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <Button
                onClick={onNext}
                size="lg"
                className="bg-white text-black hover:bg-zinc-200 px-8 py-6 text-lg font-semibold"
            >
                Los geht's
            </Button>
        </div>
    );
}
