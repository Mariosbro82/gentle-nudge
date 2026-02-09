import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { OnboardingData } from "@/types/onboarding";

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
                <h2 className="text-3xl font-bold text-foreground">Erzählen Sie uns von sich</h2>
                <div className="flex items-center justify-center gap-2 text-muted-foreground bg-muted py-1 px-3 rounded-full w-fit mx-auto text-sm">
                    <Info className="w-4 h-4 text-blue-400" />
                    <span>Wir nutzen dies, um die besten Funktionen für Sie zu empfehlen</span>
                </div>
            </div>

            <Card className="bg-card border-border">
                <CardContent className="p-6 space-y-6">
                    {/* Industry */}
                    <div className="space-y-3">
                        <Label className="text-foreground">In welcher Branche sind Sie tätig?</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {INDUSTRIES.map((industry) => (
                                <button
                                    key={industry}
                                    type="button"
                                    onClick={() => updateData({ industry })}
                                    className={`
                                        px-4 py-2 rounded-lg text-sm text-left transition-all
                                        ${data.industry === industry
                                            ? "bg-primary text-primary-foreground font-medium"
                                            : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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
                        <Label className="text-foreground">Wofür möchten Sie NFCwear nutzen?</Label>
                        <div className="grid grid-cols-2 gap-3">
                            {USE_CASES.map((useCase) => (
                                <button
                                    key={useCase.id}
                                    type="button"
                                    onClick={() => updateData({ useCase: useCase.id })}
                                    className={`
                                        p-4 rounded-xl text-left transition-all border
                                        ${data.useCase === useCase.id
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-muted/50 text-muted-foreground border-border hover:border-muted-foreground/50"
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
                    <div className="space-y-3 pt-6 border-t border-border">
                        <Label className="text-foreground">Wie haben Sie von uns erfahren?</Label>
                        <select
                            value={data.referralSource}
                            onChange={(e) => updateData({ referralSource: e.target.value })}
                            className="w-full bg-input border border-input rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
                    className="text-muted-foreground hover:text-foreground"
                >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Zurück
                </Button>
                <div className="flex gap-3">
                    <Button
                        variant="ghost"
                        onClick={onNext}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        Überspringen
                    </Button>
                    <Button
                        onClick={onNext}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        Weiter
                        <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
