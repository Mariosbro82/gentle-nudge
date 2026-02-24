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
        { id: 'minimalist-card', name: 'Minimalistisch', description: 'Professionell & Klar' },
        { id: 'premium-gradient', name: 'Premium', description: 'Modern & Mutig' },
        { id: 'event-badge', name: 'Event Badge', description: 'Dynamisch & Live' },
    ] as const;

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Wählen Sie Ihr Design</h2>
                <p className="text-muted-foreground text-sm">Sie können dies jederzeit im Dashboard ändern.</p>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {templates.map((template) => {
                    const isSelected = data.selectedTemplate === template.id;
                    return (
                        <motion.div
                            key={template.id}
                            whileHover={{ y: -4 }}
                            whileTap={{ scale: 0.98 }}
                            className={cn(
                                "relative cursor-pointer rounded-xl border-2 transition-all overflow-hidden",
                                isSelected
                                    ? "border-primary ring-2 ring-primary/20"
                                    : "border-transparent hover:border-border"
                            )}
                            onClick={() => updateData({ selectedTemplate: template.id as any })}
                        >
                            {isSelected && (
                                <div className="absolute top-2 right-2 z-20">
                                    <CheckCircle className="w-5 h-5 text-primary fill-background" />
                                </div>
                            )}

                            <div className="pointer-events-none">
                                <TemplatePreview
                                    template={template.id as any}
                                    user={{
                                        name: data.displayName || "Max Mustermann",
                                        title: data.tagline || "CEO & Founder",
                                        avatar: data.profilePic,
                                        company: data.companyName || "Severmore GmbH",
                                    }}
                                />
                            </div>

                            <div className="p-2 text-center bg-card">
                                <h3 className={cn("text-xs font-semibold", isSelected ? "text-primary" : "text-foreground")}>
                                    {template.name}
                                </h3>
                                <p className="text-[10px] text-muted-foreground">{template.description}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="flex justify-between items-center pt-2">
                <Button variant="ghost" onClick={onBack} className="text-muted-foreground hover:text-foreground">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Zurück
                </Button>
                <Button onClick={onNext}>
                    Weiter <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>
        </div>
    );
};
