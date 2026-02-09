import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Upload, User, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";
import { OnboardingData } from "@/types/onboarding";
import { TemplatePreview } from "../TemplatePreview";

interface ProfileSetupStepProps {
    data: OnboardingData;
    updateData: (updates: Partial<OnboardingData>) => void;
    onNext: () => void;
    onBack: () => void;
}

export function ProfileSetupStep({
    data,
    updateData,
    onNext,
    onBack,
}: ProfileSetupStepProps) {
    const { user } = useAuth();
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setUploading(true);
        try {
            const fileExt = file.name.split(".").pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const filePath = `profiles/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("profile-images")
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
                .from("profile-images")
                .getPublicUrl(filePath);

            updateData({ profilePic: urlData.publicUrl });
        } catch (error) {
            console.error("Upload error:", error);
        } finally {
            setUploading(false);
        }
    };

    const removeImage = () => {
        updateData({ profilePic: null });
    };

    return (
        <div className="space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-foreground">Ihr Profil einrichten</h2>
                <p className="text-muted-foreground">
                    Personalisieren Sie Ihre digitale Visitenkarte.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Form */}
                <Card className="bg-card border-border h-fit">
                    <CardContent className="p-6 space-y-6">
                        {/* Profile Picture */}
                        <div className="flex flex-col items-center space-y-4">
                            <Label className="text-foreground self-start">Profilbild</Label>
                            <div className="relative">
                                {data.profilePic ? (
                                    <div className="relative">
                                        <img
                                            src={data.profilePic}
                                            alt="Profile"
                                            className="w-32 h-32 rounded-full object-cover border-4 border-white/10"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors"
                                        >
                                            <X className="w-4 h-4 text-white" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="w-32 h-32 rounded-full bg-muted border-2 border-dashed border-border flex flex-col items-center justify-center hover:border-muted-foreground/50 transition-all"
                                    >
                                        {uploading ? (
                                            <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                                                <span className="text-xs text-muted-foreground">Hochladen</span>
                                            </>
                                        )}
                                    </button>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        {/* Display Name */}
                        <div className="space-y-2">
                            <Label className="text-foreground flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                Anzeigename
                            </Label>
                            <Input
                                value={data.displayName}
                                onChange={(e) => updateData({ displayName: e.target.value })}
                                placeholder="z.B. Max Mustermann"
                                className="bg-input border-border text-foreground"
                            />
                        </div>

                        {/* Tagline */}
                        <div className="space-y-2">
                            <Label className="text-foreground">Tagline / Titel</Label>
                            <Input
                                value={data.tagline}
                                onChange={(e) => updateData({ tagline: e.target.value })}
                                placeholder="z.B. CEO @ Severmore"
                                className="bg-input border-border text-foreground"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Right Column: Live Preview */}
                <div className="md:block space-y-4">
                    <Label className="text-muted-foreground text-sm uppercase tracking-wider block text-center mb-4">
                        Live Vorschau
                    </Label>
                    <div className="sticky top-4">
                        <TemplatePreview
                            template={data.selectedTemplate || 'minimalist-card'}
                            user={{
                                name: data.displayName || "Max Mustermann",
                                title: data.tagline || "CEO & Founder",
                                avatar: data.profilePic
                            }}
                            className="shadow-2xl"
                        />
                        <p className="text-center text-xs text-muted-foreground mt-4">
                            Dies ist eine Vorschau Ihres gewählten Designs
                        </p>
                    </div>
                </div>
            </div>

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
                        disabled={!data.displayName}
                    >
                        Weiter
                        <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
