import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Building2, Users, MessageSquare } from "lucide-react";
import { OnboardingData } from "@/types/onboarding";

interface BusinessStepProps {
    data: OnboardingData;
    updateData: (updates: Partial<OnboardingData>) => void;
    onNext: () => void;
    onBack: () => void;
    onSkipAll: () => void;
}

const TEAM_SIZES = [
    { id: "solo", label: "Solo", description: "Einzelperson", icon: "👤" },
    { id: "2-10", label: "2-10", description: "Kleines Team", icon: "👥" },
    { id: "11-50", label: "11-50", description: "Mittelgroß", icon: "🏢" },
    { id: "50+", label: "50+", description: "Enterprise", icon: "🏙️" },
];

const CONTACT_RANGES = [
    { id: "1-10", label: "1-10 Kontakte" },
    { id: "11-50", label: "11-50 Kontakte" },
    { id: "51-100", label: "51-100 Kontakte" },
    { id: "100+", label: "100+ Kontakte" },
];

export function BusinessStep({
    data,
    updateData,
    onNext,
    onBack,
    onSkipAll
}: BusinessStepProps) {
    return (
        <div className="space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-foreground">Helfen Sie uns, Sie besser zu bedienen</h2>
                <p className="text-muted-foreground">
                    Wir empfehlen Ihnen die richtigen Funktionen und Pläne.
                </p>
            </div>

            <Card className="bg-card border-border">
                <CardContent className="p-6 space-y-6">
                    {/* Company Name */}
                    <div className="space-y-3">
                        <Label className="text-foreground flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-muted-foreground" />
                            Unternehmen (optional)
                        </Label>
                        <Input
                            value={data.companyName}
                            onChange={(e) => updateData({ companyName: e.target.value })}
                            placeholder="z.B. Severmore GmbH"
                            className="bg-input border-border text-foreground"
                        />
                    </div>

                    {/* Team Size */}
                    <div className="space-y-3">
                        <Label className="text-foreground flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            Teamgröße
                        </Label>
                        <div className="grid grid-cols-4 gap-2 sm:gap-3">
                            {TEAM_SIZES.map((size) => (
                                <button
                                    key={size.id}
                                    type="button"
                                    onClick={() => updateData({ teamSize: size.id })}
                                    className={`
                                        p-2 sm:p-4 rounded-xl text-center transition-all border min-w-0
                                        ${data.teamSize === size.id
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-muted/50 text-muted-foreground border-border hover:border-muted-foreground/50"
                                        }
                                    `}
                                >
                                    <span className="text-lg sm:text-2xl block mb-0.5">{size.icon}</span>
                                    <span className="font-semibold block text-xs sm:text-base leading-tight">{size.label}</span>
                                    <span className="text-[9px] sm:text-xs opacity-70 leading-tight block">{size.description}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Expected Contacts */}
                    <div className="space-y-3">
                        <Label className="text-foreground flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-muted-foreground" />
                            Erwartete Kontakte pro Monat
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                            {CONTACT_RANGES.map((range) => (
                                <button
                                    key={range.id}
                                    type="button"
                                    onClick={() => updateData({ expectedContacts: range.id })}
                                    className={`
                                        px-4 py-3 rounded-lg text-sm transition-all
                                        ${data.expectedContacts === range.id
                                            ? "bg-primary text-primary-foreground font-medium"
                                            : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                        }
                                    `}
                                >
                                    {range.label}
                                </button>
                            ))}
                        </div>
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
                        onClick={onSkipAll}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        Alles überspringen
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
