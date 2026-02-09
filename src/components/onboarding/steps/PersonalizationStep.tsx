import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { OnboardingData } from "../OnboardingWizard";

interface PersonalizationStepProps {
    data: OnboardingData;
    updateData: (updates: Partial<OnboardingData>) => void;
    onNext: () => void;
    onBack: () => void;
}

const INDUSTRIES = [
    "Technologie & IT",
    "Marketing & Werbung",
    "Vertrieb & Sales",
    "Finanzen & Versicherung",
    "Beratung & Consulting",
    "Gesundheit & Medizin",
    "Immobilien",
    "Kunst & Design",
    "Bildung & Training",
    "Sonstiges",
];

const USE_CASES = [
    { id: "networking", label: "Networking & Events", emoji: "🤝" },
    { id: "sales", label: "Sales & Vertrieb", emoji: "💼" },
    { id: "branding", label: "Personal Branding", emoji: "✨" },
    { id: "team", label: "Team & Unternehmen", emoji: "👥" },
];

const REFERRAL_SOURCES = [
    "Google Suche",
    "Social Media (LinkedIn, Instagram, etc.)",
    "Empfehlung von Kollegen/Freunden",
    "Messe oder Event",
    "Online Werbung",
    "Artikel oder Blog",
    "Sonstiges",
];

export function PersonalizationStep({
    data,
    updateData,
    onNext,
    onBack,
}: PersonalizationStepProps) {
    return (
        <div className="space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-white">Erzählen Sie uns von sich</h2>
                <p className="text-zinc-400">
                    Diese Informationen helfen uns, Ihr Erlebnis zu personalisieren.
                </p>
            </div>

            <Card className="bg-zinc-900/50 border-white/5">
                <CardContent className="p-6 space-y-6">
                    {/* Industry */}
                    <div className="space-y-3">
                        <Label className="text-white">In welcher Branche sind Sie tätig?</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {INDUSTRIES.map((industry) => (
                                <button
                                    key={industry}
                                    type="button"
                                    onClick={() => updateData({ industry })}
                                    className={`
                                        px-4 py-2 rounded-lg text-sm text-left transition-all
                                        ${data.industry === industry
                                            ? "bg-white text-black font-medium"
                                            : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                                        }
                                    `}
                                >
                                    {industry}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Use Case */}
                    <div className="space-y-3">
                        <Label className="text-white">Wofür möchten Sie NFCwear nutzen?</Label>
                        <div className="grid grid-cols-2 gap-3">
                            {USE_CASES.map((useCase) => (
                                <button
                                    key={useCase.id}
                                    type="button"
                                    onClick={() => updateData({ useCase: useCase.id })}
                                    className={`
                                        p-4 rounded-xl text-left transition-all border
                                        ${data.useCase === useCase.id
                                            ? "bg-white text-black border-white"
                                            : "bg-zinc-800/50 text-zinc-300 border-white/5 hover:border-white/20"
                                        }
                                    `}
                                >
                                    <span className="text-2xl mb-2 block">{useCase.emoji}</span>
                                    <span className="font-medium">{useCase.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Referral Source */}
                    <div className="space-y-3">
                        <Label className="text-white">Wie haben Sie von uns erfahren?</Label>
                        <select
                            value={data.referralSource}
                            onChange={(e) => updateData({ referralSource: e.target.value })}
                            className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                        >
                            <option value="">Bitte auswählen...</option>
                            {REFERRAL_SOURCES.map((source) => (
                                <option key={source} value={source}>
                                    {source}
                                </option>
                            ))}
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="text-zinc-400 hover:text-white"
                >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Zurück
                </Button>
                <div className="flex gap-3">
                    <Button
                        variant="ghost"
                        onClick={onNext}
                        className="text-zinc-500 hover:text-white"
                    >
                        Überspringen
                    </Button>
                    <Button
                        onClick={onNext}
                        className="bg-white text-black hover:bg-zinc-200"
                    >
                        Weiter
                        <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
