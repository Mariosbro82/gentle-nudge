

import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { TemplatePreview } from '../TemplatePreview';
import { OnboardingData } from '@/types/onboarding';
import { cn } from "@/lib/utils";

interface TemplateSelectionStepProps {
    data: OnboardingData;
    updateData: (updates: Partial<OnboardingData>) => void;
    onNext: () => void;
    onBack: () => void;
}

export const TemplateSelectionStep = ({ data, updateData, onNext, onBack }: TemplateSelectionStepProps) => {
    const templates = [
        {
            id: 'minimalist-card',
            name: 'Minimalistisch',
            description: 'Professionell & Klar',
        },
        {
            id: 'premium-gradient',
            name: 'Premium Gradient',
            description: 'Modern & Mutig',
        },
        {
            id: 'event-badge',
            name: 'Event Badge',
            description: 'Dynamisch & Networking',
        }
    ] as const;

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Wählen Sie Ihren Stil</h2>
                <p className="text-muted-foreground">
                    Sie können dies jederzeit ändern
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {templates.map((template) => {
                    const isSelected = data.selectedTemplate === template.id;

                    return (
                        <motion.div
                            key={template.id}
                            whileHover={{ y: -4 }}
                            className={cn(
                                "relative cursor-pointer rounded-xl border-2 transition-all p-2",
                                isSelected
                                    ? "border-green-500 bg-green-500/10"
                                    : "border-transparent hover:border-border bg-card"
                            )}
                            onClick={() => updateData({ selectedTemplate: template.id as any })}
                        >
                            {isSelected && (
                                <div className="absolute -top-3 -right-3 z-10 bg-background rounded-full p-1 shadow-sm">
                                    <CheckCircle className="w-6 h-6 text-green-500 fill-green-50" />
                                </div>
                            )}

                            <div className="mb-3 pointer-events-none">
                                <TemplatePreview
                                    template={template.id as any}
                                    user={{
                                        name: data.displayName || "Max Mustermann",
                                        title: data.tagline || "CEO",
                                        avatar: data.profilePic
                                    }}
                                    className="shadow-sm"
                                />
                            </div>

                            <div className="text-center pb-2">
                                <h3 className={cn(
                                    "font-semibold",
                                    isSelected ? "text-green-600" : "text-foreground"
                                )}>
                                    {template.name}
                                </h3>
                                <p className="text-xs text-muted-foreground">{template.description}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>


            <div className="flex justify-between items-center pt-4">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="text-zinc-500 hover:text-zinc-900"
                >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Zurück
                </Button>
                <Button
                    onClick={onNext}
                    className="bg-black text-white hover:bg-zinc-800"
                >
                    Weiter
                    <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div >
    );
};
