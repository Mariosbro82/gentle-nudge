import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Upload, User, Linkedin, Globe, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";
import type { OnboardingData } from "../OnboardingWizard";

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
                <h2 className="text-3xl font-bold text-white">Ihr Profil einrichten</h2>
                <p className="text-zinc-400">
                    Personalisieren Sie Ihre digitale Visitenkarte.
                </p>
            </div>

            <Card className="bg-zinc-900/50 border-white/5">
                <CardContent className="p-6 space-y-6">
                    {/* Profile Picture */}
                    <div className="flex flex-col items-center space-y-4">
                        <Label className="text-white self-start">Profilbild</Label>
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
                                    className="w-32 h-32 rounded-full bg-zinc-800 border-2 border-dashed border-white/20 flex flex-col items-center justify-center hover:border-white/40 transition-all"
                                >
                                    {uploading ? (
                                        <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Upload className="w-6 h-6 text-zinc-500 mb-2" />
                                            <span className="text-xs text-zinc-500">Hochladen</span>
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
                        <Label className="text-white flex items-center gap-2">
                            <User className="w-4 h-4 text-zinc-500" />
                            Anzeigename
                        </Label>
                        <Input
                            value={data.displayName}
                            onChange={(e) => updateData({ displayName: e.target.value })}
                            placeholder="z.B. Max Mustermann"
                            className="bg-zinc-800 border-white/10 text-white"
                        />
                    </div>

                    {/* Tagline */}
                    <div className="space-y-2">
                        <Label className="text-white">Tagline / Titel</Label>
                        <Input
                            value={data.tagline}
                            onChange={(e) => updateData({ tagline: e.target.value })}
                            placeholder="z.B. CEO @ Severmore | Digital Innovation"
                            className="bg-zinc-800 border-white/10 text-white"
                        />
                    </div>

                    {/* Social Links (optional) */}
                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <Label className="text-white">Social Links (optional)</Label>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Linkedin className="w-5 h-5 text-blue-400" />
                                <Input
                                    value={data.socialLinks.linkedin || ""}
                                    onChange={(e) =>
                                        updateData({
                                            socialLinks: { ...data.socialLinks, linkedin: e.target.value },
                                        })
                                    }
                                    placeholder="linkedin.com/in/username"
                                    className="bg-zinc-800 border-white/10 text-white flex-1"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <Globe className="w-5 h-5 text-green-400" />
                                <Input
                                    value={data.socialLinks.website || ""}
                                    onChange={(e) =>
                                        updateData({
                                            socialLinks: { ...data.socialLinks, website: e.target.value },
                                        })
                                    }
                                    placeholder="ihre-website.de"
                                    className="bg-zinc-800 border-white/10 text-white flex-1"
                                />
                            </div>
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
