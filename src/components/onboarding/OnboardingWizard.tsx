import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";
import { WelcomeStep } from "./steps/WelcomeStep";
import { ProfileSetupStep } from "./steps/ProfileSetupStep";
import { TemplateSelectionStep } from "./steps/TemplateSelectionStep";
import { CompletionStep } from "./steps/CompletionStep";
import { OnboardingData } from "@/types/onboarding";

const STEPS = [
    { id: 1, title: "Willkommen" },
    { id: 2, title: "Profil" },
    { id: 3, title: "Design" },
    { id: 4, title: "Fertig" },
];

export function OnboardingWizard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<OnboardingData>({
        selectedTemplate: "minimalist-card",
        automationInterest: false,
        automationDelayHours: 24,
        industry: "",
        useCase: "",
        referralSource: "",
        companyName: "",
        teamSize: "",
        expectedContacts: "",
        displayName: "",
        slug: "",
        tagline: "",
        profilePic: null,
        socialLinks: {},
    });

    const updateData = (updates: Partial<OnboardingData>) => {
        setData((prev) => ({ ...prev, ...updates }));
    };

    const nextStep = () => {
        if (currentStep < STEPS.length) setCurrentStep((prev) => prev + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep((prev) => prev - 1);
    };

    const handleComplete = async () => {
        if (!user) return;
        setIsSubmitting(true);
        setError(null);

        try {
            const { data: profile, error: profileError } = await supabase
                .from("users")
                .select("id")
                .eq("auth_user_id", user.id)
                .single();

            if (profileError && profileError.code !== "PGRST116") throw profileError;

            if (!profile) {
                const { data: newProfile, error: createError } = await supabase
                    .from("users")
                    .insert({
                        auth_user_id: user.id,
                        email: user.email || "",
                        name: data.displayName || null,
                        slug: data.slug || null,
                        job_title: data.tagline || null,
                        profile_pic: data.profilePic || null,
                        company_name: data.companyName || null,
                        active_template: data.selectedTemplate,
                        has_completed_onboarding: true,
                        default_followup_delay_hours: data.automationInterest ? data.automationDelayHours : null,
                    })
                    .select("id")
                    .single();

                if (createError) throw createError;

                await (supabase.from("onboarding_data" as any) as any).insert({
                    user_id: newProfile.id,
                    selected_template: data.selectedTemplate,
                    automation_interest: data.automationInterest,
                    automation_delay_hours: data.automationDelayHours,
                    company_name: data.companyName || null,
                });
            } else {
                const { error: updateError } = await supabase
                    .from("users")
                    .update({
                        name: data.displayName || undefined,
                        slug: data.slug || undefined,
                        job_title: data.tagline || undefined,
                        profile_pic: data.profilePic || undefined,
                        company_name: data.companyName || undefined,
                        active_template: data.selectedTemplate,
                        has_completed_onboarding: true,
                        default_followup_delay_hours: data.automationInterest ? data.automationDelayHours : null,
                        updated_at: new Date().toISOString(),
                    })
                    .eq("auth_user_id", user.id);

                if (updateError) throw updateError;

                await (supabase.from("onboarding_data" as any) as any).insert({
                    user_id: profile.id,
                    selected_template: data.selectedTemplate,
                    automation_interest: data.automationInterest,
                    automation_delay_hours: data.automationDelayHours,
                    company_name: data.companyName || null,
                });
            }

            navigate("/dashboard", { replace: true });
        } catch (error: any) {
            console.error("Error completing onboarding:", error);
            setError(error.message || "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const stepContentRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        stepContentRef.current?.scrollTo({ top: 0, behavior: 'instant' });
    }, [currentStep]);

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <WelcomeStep onNext={nextStep} />;
            case 2:
                return (
                    <ProfileSetupStep
                        data={data}
                        updateData={updateData}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                );
            case 3:
                return (
                    <TemplateSelectionStep
                        data={data}
                        updateData={updateData}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                );
            case 4:
                return (
                    <CompletionStep
                        data={data}
                        updateData={updateData}
                        onComplete={handleComplete}
                        isSubmitting={isSubmitting}
                        error={error}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Progress */}
            <div className="w-full px-4 sm:px-6 pt-6 pb-2">
                <div className="max-w-xl mx-auto">
                    <div className="flex items-center gap-1">
                        {STEPS.map((step, index) => (
                            <React.Fragment key={step.id}>
                                <div className="flex flex-col items-center gap-1.5">
                                    <div className={`
                                        w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all
                                        ${currentStep >= step.id
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground"
                                        }
                                    `}>
                                        {currentStep > step.id ? "✓" : step.id}
                                    </div>
                                    <span className="text-[10px] text-muted-foreground hidden sm:block">{step.title}</span>
                                </div>
                                {index < STEPS.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-1 transition-all ${currentStep > step.id ? "bg-primary" : "bg-muted"}`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div ref={stepContentRef} className="flex-1 flex items-start sm:items-center justify-center p-4 sm:p-6 overflow-y-auto">
                <div className="w-full max-w-2xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {renderStep()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
