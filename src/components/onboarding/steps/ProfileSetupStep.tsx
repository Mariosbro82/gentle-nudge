import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Upload, User, X, Check, Loader2, AlertCircle, Building2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";
import { OnboardingData } from "@/types/onboarding";
import { useUsernameAvailability } from "@/hooks/use-username-availability";

interface ProfileSetupStepProps {
    data: OnboardingData;
    updateData: (updates: Partial<OnboardingData>) => void;
    onNext: () => void;
    onBack: () => void;
}

export function ProfileSetupStep({ data, updateData, onNext, onBack }: ProfileSetupStepProps) {
    const { user } = useAuth();
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        username,
        status: usernameStatus,
        message: usernameMessage,
        checkUsername,
    } = useUsernameAvailability("");

    useEffect(() => {
        if (username !== data.slug) {
            updateData({ slug: username });
        }
    }, [username]);

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
            const { data: urlData } = supabase.storage.from("profile-images").getPublicUrl(filePath);
            updateData({ profilePic: urlData.publicUrl });
        } catch (error) {
            console.error("Upload error:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Ihr Profil einrichten</h2>
                <p className="text-muted-foreground text-sm">Die wichtigsten Infos für Ihre digitale Visitenkarte.</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 sm:p-6 space-y-5">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                        {data.profilePic ? (
                            <div className="relative">
                                <img src={data.profilePic} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-border" />
                                <button type="button" onClick={() => updateData({ profilePic: null })}
                                    className="absolute -top-1 -right-1 bg-destructive rounded-full p-0.5 hover:bg-destructive/80 transition-colors">
                                    <X className="w-3 h-3 text-white" />
                                </button>
                            </div>
                        ) : (
                            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                                className="w-20 h-20 rounded-full bg-muted border-2 border-dashed border-border flex flex-col items-center justify-center hover:border-muted-foreground/50 transition-all">
                                {uploading ? (
                                    <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                                ) : (
                                    <>
                                        <Upload className="w-5 h-5 text-muted-foreground mb-1" />
                                        <span className="text-[10px] text-muted-foreground">Foto</span>
                                    </>
                                )}
                            </button>
                        )}
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </div>
                    <div className="flex-1 space-y-2">
                        <Label className="text-foreground text-xs">Anzeigename *</Label>
                        <Input
                            value={data.displayName}
                            onChange={(e) => updateData({ displayName: e.target.value })}
                            placeholder="Max Mustermann"
                            className="bg-input border-border"
                        />
                    </div>
                </div>

                {/* Username */}
                <div className="space-y-1.5">
                    <Label className="text-foreground text-xs flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-muted-foreground" />
                        Benutzername (Ihre URL)
                    </Label>
                    <div className="relative">
                        <Input
                            value={username}
                            onChange={(e) => checkUsername(e.target.value)}
                            placeholder="max.mustermann"
                            className={`bg-input border-border pr-9 ${usernameStatus === 'available' ? 'border-green-500/50' :
                                usernameStatus === 'taken' || usernameStatus === 'invalid' ? 'border-destructive/50' : ''}`}
                        />
                        <div className="absolute right-3 top-2.5">
                            {usernameStatus === 'loading' && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                            {usernameStatus === 'available' && <Check className="w-4 h-4 text-green-500" />}
                            {(usernameStatus === 'taken' || usernameStatus === 'invalid') && <AlertCircle className="w-4 h-4 text-destructive" />}
                        </div>
                    </div>
                    {usernameMessage && (
                        <p className={`text-[11px] ${usernameStatus === 'available' ? 'text-green-500' :
                            usernameStatus === 'taken' || usernameStatus === 'invalid' ? 'text-destructive' : 'text-muted-foreground'}`}>
                            {usernameMessage}
                        </p>
                    )}
                    <p className="text-[10px] text-muted-foreground">nfcwear.de/p/{username || "ihr-name"}</p>
                </div>

                {/* Tagline */}
                <div className="space-y-1.5">
                    <Label className="text-foreground text-xs">Titel / Position</Label>
                    <Input
                        value={data.tagline}
                        onChange={(e) => updateData({ tagline: e.target.value })}
                        placeholder="z.B. CEO @ Severmore"
                        className="bg-input border-border"
                    />
                </div>

                {/* Company */}
                <div className="space-y-1.5">
                    <Label className="text-foreground text-xs flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                        Unternehmen (optional)
                    </Label>
                    <Input
                        value={data.companyName}
                        onChange={(e) => updateData({ companyName: e.target.value })}
                        placeholder="z.B. Severmore GmbH"
                        className="bg-input border-border"
                    />
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
                <Button variant="ghost" onClick={onBack} className="text-muted-foreground hover:text-foreground">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Zurück
                </Button>
                <Button onClick={onNext} disabled={!data.displayName}>
                    Weiter <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>
        </div>
    );
}
