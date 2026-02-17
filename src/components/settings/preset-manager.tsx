import { useEffect, useState } from "react";
import { Save, Trash2, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";

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
}

export function PresetManager({ userId, currentConfig, onActivate }: Props) {
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
        // Deactivate all, activate this one
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

            {/* List presets */}
            {presets.length > 0 && (
                <div className="space-y-2">
                    {presets.map((preset) => (
                        <div
                            key={preset.id}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                                preset.is_active
                                    ? "border-blue-500/50 bg-blue-500/5"
                                    : "border-border bg-card hover:bg-accent/30"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                {preset.is_active && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
                                <div>
                                    <p className="text-sm font-medium">{preset.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(preset.created_at).toLocaleDateString("de-DE")}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                {!preset.is_active && (
                                    <Button type="button" variant="ghost" size="sm" onClick={() => activatePreset(preset)}>
                                        <Zap className="h-4 w-4 mr-1" /> Aktivieren
                                    </Button>
                                )}
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-sm"
                                    onClick={() => deletePreset(preset.id)}
                                    className="text-red-400 hover:text-red-300"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
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
