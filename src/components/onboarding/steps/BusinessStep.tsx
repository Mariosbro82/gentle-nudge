import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Building2, Users, MessageSquare } from "lucide-react";
import type { OnboardingData } from "../OnboardingWizard";

interface BusinessStepProps {
    data: OnboardingData;
    updateData: (updates: Partial<OnboardingData>) => void;
    onNext: () => void;
    onBack: () => void;
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
}: BusinessStepProps) {
    return (
        <div className="space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-white">Business Details</h2>
                <p className="text-zinc-400">
                    Optionale Informationen für ein maßgeschneidertes Erlebnis.
                </p>
            </div>

            <Card className="bg-zinc-900/50 border-white/5">
                <CardContent className="p-6 space-y-6">
                    {/* Company Name */}
                    <div className="space-y-3">
                        <Label className="text-white flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-zinc-500" />
                            Unternehmen (optional)
                        </Label>
                        <Input
                            value={data.companyName}
                            onChange={(e) => updateData({ companyName: e.target.value })}
                            placeholder="z.B. Severmore GmbH"
                            className="bg-zinc-800 border-white/10 text-white"
                        />
                    </div>

                    {/* Team Size */}
                    <div className="space-y-3">
                        <Label className="text-white flex items-center gap-2">
                            <Users className="w-4 h-4 text-zinc-500" />
                            Teamgröße
                        </Label>
                        <div className="grid grid-cols-4 gap-3">
                            {TEAM_SIZES.map((size) => (
                                <button
                                    key={size.id}
                                    type="button"
                                    onClick={() => updateData({ teamSize: size.id })}
                                    className={`
                                        p-4 rounded-xl text-center transition-all border
                                        ${data.teamSize === size.id
                                            ? "bg-white text-black border-white"
                                            : "bg-zinc-800/50 text-zinc-300 border-white/5 hover:border-white/20"
                                        }
                                    `}
                                >
                                    <span className="text-2xl block mb-1">{size.icon}</span>
                                    <span className="font-semibold block">{size.label}</span>
                                    <span className="text-xs opacity-70">{size.description}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Expected Contacts */}
                    <div className="space-y-3">
                        <Label className="text-white flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-zinc-500" />
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
                                            ? "bg-white text-black font-medium"
                                            : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
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
