import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";
import { WelcomeStep } from "./steps/WelcomeStep";
import { PersonalizationStep } from "./steps/PersonalizationStep";
import { BusinessStep } from "./steps/BusinessStep";
import { ProfileSetupStep } from "./steps/ProfileSetupStep";
import { CompletionStep } from "./steps/CompletionStep";

export interface OnboardingData {
    // Personalization
    industry: string;
    useCase: string;
    referralSource: string;
    // Business
    companyName: string;
    teamSize: string;
    expectedContacts: string;
    // Profile
    displayName: string;
    tagline: string;
    profilePic: string | null;
    socialLinks: {
        linkedin?: string;
        twitter?: string;
        website?: string;
    };
}

const STEPS = [
    { id: 1, title: "Willkommen" },
    { id: 2, title: "Personalisierung" },
    { id: 3, title: "Business" },
    { id: 4, title: "Profil" },
    { id: 5, title: "Fertig" },
];

export function OnboardingWizard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [data, setData] = useState<OnboardingData>({
        industry: "",
        useCase: "",
        referralSource: "",
        companyName: "",
        teamSize: "",
        expectedContacts: "",
        displayName: "",
        tagline: "",
        profilePic: null,
        socialLinks: {},
    });

    const updateData = (updates: Partial<OnboardingData>) => {
        setData((prev) => ({ ...prev, ...updates }));
    };

    const nextStep = () => {
        if (currentStep < STEPS.length) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleComplete = async () => {
        if (!user) return;
        setIsSubmitting(true);

        try {
            // Get user's profile row
            const { data: profile } = await supabase
                .from("users")
                .select("id")
                .eq("auth_user_id", user.id)
                .single();

            if (!profile) {
                // Create user profile if it doesn't exist
                const { data: newProfile, error: createError } = await supabase
                    .from("users")
                    .insert({
                        auth_user_id: user.id,
                        email: user.email || "",
                        name: data.displayName || null,
                        job_title: data.tagline || null,
                        profile_pic: data.profilePic || null,
                        linkedin_url: data.socialLinks.linkedin || null,
                        website: data.socialLinks.website || null,
                        company_name: data.companyName || null,
                        has_completed_onboarding: true,
                    })
                    .select("id")
                    .single();

                if (createError) throw createError;

                // Save onboarding data (using type assertion for new table)
                await (supabase.from("onboarding_data" as any) as any).insert({
                    user_id: newProfile.id,
                    industry: data.industry || null,
                    use_case: data.useCase || null,
                    referral_source: data.referralSource || null,
                    company_name: data.companyName || null,
                    team_size: data.teamSize || null,
                    expected_contacts: data.expectedContacts || null,
                });
            } else {
                // Update existing profile
                await supabase
                    .from("users")
                    .update({
                        name: data.displayName || undefined,
                        job_title: data.tagline || undefined,
                        profile_pic: data.profilePic || undefined,
                        linkedin_url: data.socialLinks.linkedin || undefined,
                        website: data.socialLinks.website || undefined,
                        company_name: data.companyName || undefined,
                        has_completed_onboarding: true,
                        updated_at: new Date().toISOString(),
                    })
                    .eq("auth_user_id", user.id);

                // Save onboarding data (using type assertion for new table)
                await (supabase.from("onboarding_data" as any) as any).insert({
                    user_id: profile.id,
                    industry: data.industry || null,
                    use_case: data.useCase || null,
                    referral_source: data.referralSource || null,
                    company_name: data.companyName || null,
                    team_size: data.teamSize || null,
                    expected_contacts: data.expectedContacts || null,
                });
            }

            // Navigate to dashboard
            navigate("/dashboard", { replace: true });
        } catch (error) {
            console.error("Error completing onboarding:", error);
            // Still navigate even on error
            navigate("/dashboard", { replace: true });
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <WelcomeStep onNext={nextStep} />;
            case 2:
                return (
                    <PersonalizationStep
                        data={data}
                        updateData={updateData}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                );
            case 3:
                return (
                    <BusinessStep
                        data={data}
                        updateData={updateData}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                );
            case 4:
                return (
                    <ProfileSetupStep
                        data={data}
                        updateData={updateData}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                );
            case 5:
                return (
                    <CompletionStep
                        data={data}
                        onComplete={handleComplete}
                        isSubmitting={isSubmitting}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col">
            {/* Progress Bar */}
            <div className="w-full px-6 py-4">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-2">
                        {STEPS.map((step, index) => (
                            <div key={step.id} className="flex items-center flex-1">
                                <div
                                    className={`
                                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all
                                        ${currentStep >= step.id
                                            ? "bg-white text-black"
                                            : "bg-zinc-800 text-zinc-500"
                                        }
                                    `}
                                >
                                    {currentStep > step.id ? "✓" : step.id}
                                </div>
                                {index < STEPS.length - 1 && (
                                    <div
                                        className={`flex-1 h-0.5 mx-2 transition-all ${currentStep > step.id ? "bg-white" : "bg-zinc-800"
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-zinc-500">
                        {STEPS.map((step) => (
                            <span
                                key={step.id}
                                className={currentStep >= step.id ? "text-white" : ""}
                            >
                                {step.title}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Step Content */}
            <div className="flex-1 flex items-center justify-center p-6">
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
