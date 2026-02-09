
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock, Mail, ArrowRight, Smartphone, ChevronLeft } from 'lucide-react';
import { OnboardingData } from '@/types/onboarding';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface AutomationPreviewStepProps {
    data: OnboardingData;
    updateData: (updates: Partial<OnboardingData>) => void;
    onNext: () => void;
    onBack: () => void;
}

export const AutomationPreviewStep = ({ data, updateData, onNext, onBack }: AutomationPreviewStepProps) => {
    const handleDelayChange = (value: number[]) => {
        updateData({
            automationDelayHours: value[0],
            automationInterest: true
        });
    };

    const getDelayLabel = (hours: number) => {
        if (hours === 168) return '1 Woche';
        return `${hours} Std`;
    };

    return (
        <div className="space-y-8">
            <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 rounded-full mb-2">
                    <Zap className="w-6 h-6 text-purple-500" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Automatisieren Sie Ihre Follow-Ups</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                    Verpassen Sie nie wieder einen Kontakt. Senden Sie automatisch Ihre Infos nach einem Treffen.
                </p>
            </div>

            {/* Visual Flow */}
            <div className="flex items-center justify-center gap-4 text-sm font-medium text-muted-foreground my-8">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                        <Smartphone className="w-5 h-5" />
                    </div>
                    <span>Scan</span>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground/50" />
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                        <Clock className="w-5 h-5" />
                    </div>
                    <span>Warten</span>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground/50" />
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-full flex items-center justify-center">
                        <Mail className="w-5 h-5" />
                    </div>
                    <span>E-Mail</span>
                </div>
            </div>

            {/* Interactive Slider */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground">Follow-up senden nach:</span>
                    <span className="text-sm font-bold text-purple-500">
                        {getDelayLabel(data.automationDelayHours || 24)}
                    </span>
                </div>

                <Slider
                    defaultValue={[data.automationDelayHours || 24]}
                    max={168}
                    min={6}
                    step={null}
                    // @ts-ignore - Slider marks prop issue
                    marks={[
                        { value: 6, label: '6h' },
                        { value: 24, label: '24h' },
                        { value: 48, label: '48h' },
                        { value: 168, label: '1W' },
                    ]}
                    onValueChange={handleDelayChange}
                    className="py-4"
                />

                <div className="bg-background border border-border rounded-lg p-4 shadow-sm text-sm">
                    <div className="border-b border-border pb-2 mb-2">
                        <span className="text-muted-foreground">Betreff:</span> Schön, Sie kennengelernt zu haben!
                    </div>
                    <div className="space-y-2 text-muted-foreground">
                        <p>Hallo {'{Name}'},</p>
                        <p>
                            vielen Dank für den Austausch heute! Hier sind wie versprochen meine Kontaktdaten.
                        </p>
                        <div className="mt-4 pt-4 border-t border-border flex gap-3 items-center">
                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-xs font-bold text-muted-foreground">
                                {(data.displayName || 'ME').slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-semibold text-foreground">{data.displayName || 'Max Mustermann'}</p>
                                <p className="text-xs text-muted-foreground">{data.companyName || 'Severmore GmbH'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 items-start bg-blue-500/10 p-3 rounded-lg text-xs text-blue-500">
                    <Zap className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>Pro-Tipp: 24-Stunden Follow-ups haben 3x höhere Rücklaufquoten.</p>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <button
                    onClick={() => {
                        updateData({ automationInterest: true });
                        onNext();
                    }}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                >
                    Später einrichten
                </button>
                <button
                    onClick={() => {
                        updateData({ automationInterest: false });
                        onNext();
                    }}
                    className="w-full py-3 text-muted-foreground hover:text-foreground font-medium transition-colors"
                >
                    Jetzt überspringen
                </button>
            </div>

            <div className="flex justify-start">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="text-gray-500 hover:text-gray-900"
                >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Zurück
                </Button>
            </div>
        </div>
    );
};
