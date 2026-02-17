import { useEffect, useState } from "react";
import { Save, Trash2, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";
import { PhonePreviewMini } from "@/components/settings/phone-preview-3d";
import type { ProfileUser } from "@/types/profile";

interface Preset {
    id: string;
    name: string;
    preset_data: Record<string, any>;
    is_active: boolean;
    created_at: string;
}

interface Props {
    userId: string;
    currentConfig: Record<string, any>;
    onActivate: (presetData: Record<string, any>) => void;
    baseUser: ProfileUser;
}

function buildPresetUser(baseUser: ProfileUser, presetData: Record<string, any>): ProfileUser {
    return {
        ...baseUser,
        activeTemplate: presetData.active_template || baseUser.activeTemplate,
        accentColor: presetData.accent_color || baseUser.accentColor,
        backgroundColor: presetData.background_color || baseUser.backgroundColor,
        bannerColor: presetData.banner_color || baseUser.bannerColor,
        customLinks: presetData.custom_links || baseUser.customLinks,
        couponCode: presetData.coupon_code || "",
        couponDescription: presetData.coupon_description || "",
        countdownTarget: presetData.countdown_target || null,
        countdownLabel: presetData.countdown_label || "",
    };
}

export function PresetManager({ userId, currentConfig, onActivate, baseUser }: Props) {
    const [presets, setPresets] = useState<Preset[]>([]);
    const [newName, setNewName] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPresets();
    }, [userId]);

    async function fetchPresets() {
        const { data } = await supabase
            .from("profile_presets" as any)
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });
        setPresets((data as any) || []);
        setLoading(false);
    }

    async function savePreset() {
        if (!newName.trim()) return;
        setSaving(true);
        await supabase.from("profile_presets" as any).insert({
            user_id: userId,
            name: newName.trim(),
            preset_data: currentConfig,
            is_active: false,
        } as any);
        setNewName("");
        await fetchPresets();
        setSaving(false);
    }

    async function activatePreset(preset: Preset) {
        await supabase.from("profile_presets" as any).update({ is_active: false } as any).eq("user_id", userId);
        await supabase.from("profile_presets" as any).update({ is_active: true } as any).eq("id", preset.id);
        onActivate(preset.preset_data);
        await fetchPresets();
    }

    async function deletePreset(id: string) {
        await supabase.from("profile_presets" as any).delete().eq("id", id);
        await fetchPresets();
    }

    if (loading) return <div className="h-8 flex items-center"><Loader2 className="h-4 w-4 animate-spin" /></div>;

    return (
        <div className="space-y-4">
            {/* Save current as preset */}
            <div className="flex gap-2">
                <Input
                    placeholder="Preset-Name (z.B. CES 2026)"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="bg-input border-border"
                />
                <Button type="button" onClick={savePreset} disabled={saving || !newName.trim()} size="sm">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
                    Speichern
                </Button>
            </div>

            {/* Preset Grid with 3D previews */}
            {presets.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {presets.map((preset) => {
                        const presetUser = buildPresetUser(baseUser, preset.preset_data);
                        return (
                            <div
                                key={preset.id}
                                className={`relative rounded-xl border-2 p-3 transition-all cursor-pointer group ${
                                    preset.is_active
                                        ? "border-blue-500 bg-blue-500/5"
                                        : "border-border bg-card hover:border-muted-foreground/30"
                                }`}
                                onClick={() => !preset.is_active && activatePreset(preset)}
                            >
                                {/* Mini 3D Phone Preview */}
                                <div className="flex justify-center mb-3">
                                    <PhonePreviewMini user={presetUser} />
                                </div>

                                {/* Preset Info */}
                                <div className="text-center">
                                    <p className="text-sm font-medium truncate">{preset.name}</p>
                                    <p className="text-[10px] text-muted-foreground">
                                        {new Date(preset.created_at).toLocaleDateString("de-DE")}
                                    </p>
                                </div>

                                {/* Active badge */}
                                {preset.is_active && (
                                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-blue-500 text-[9px] text-white font-medium">
                                        Aktiv
                                    </div>
                                )}

                                {/* Actions overlay */}
                                <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => { e.stopPropagation(); deletePreset(preset.id); }}
                                        className="h-6 w-6 text-red-400 hover:text-red-300 bg-background/80 backdrop-blur-sm"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>

                                {/* Activate hint */}
                                {!preset.is_active && (
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/40 backdrop-blur-[2px] rounded-xl">
                                        <div className="flex items-center gap-1 text-xs font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-full shadow-lg">
                                            <Zap className="h-3 w-3" /> Aktivieren
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {presets.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-2">
                    Noch keine Presets gespeichert. Speichern Sie Ihre aktuelle Konfiguration für schnellen Wechsel.
                </p>
            )}
        </div>
    );
}
