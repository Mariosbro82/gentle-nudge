import { useState } from "react";
import { Ghost } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface GhostModeToggleProps {
    ghostMode: boolean;
    ghostModeUntil: string | null;
    onChange: (enabled: boolean, until: string | null) => void;
    saving?: boolean;
}

const DURATION_OPTIONS = [
    { label: "Unbegrenzt", value: null },
    { label: "1 Stunde", value: 1 },
    { label: "4 Stunden", value: 4 },
    { label: "24 Stunden", value: 24 },
    { label: "3 Tage", value: 72 },
    { label: "7 Tage", value: 168 },
] as const;

function computeUntil(hours: number | null): string | null {
    if (hours === null) return null;
    const d = new Date();
    d.setHours(d.getHours() + hours);
    return d.toISOString();
}

function getRemainingText(until: string | null): string | null {
    if (!until) return null;
    const diff = new Date(until).getTime() - Date.now();
    if (diff <= 0) return null;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 24) return `${Math.floor(hours / 24)} Tage übrig`;
    if (hours > 0) return `${hours}h ${minutes}min übrig`;
    return `${minutes} Minuten übrig`;
}

export function GhostModeToggle({ ghostMode, ghostModeUntil, onChange, saving }: GhostModeToggleProps) {
    const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
    const remainingText = ghostMode ? getRemainingText(ghostModeUntil) : null;

    function handleToggle(checked: boolean) {
        if (checked) {
            onChange(true, computeUntil(selectedDuration));
        } else {
            onChange(false, null);
        }
    }

    function handleDurationChange(hours: number | null) {
        setSelectedDuration(hours);
        if (ghostMode) {
            onChange(true, computeUntil(hours));
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${ghostMode ? "bg-violet-500/20" : "bg-zinc-800"}`}>
                        <Ghost className={`h-5 w-5 ${ghostMode ? "text-violet-400" : "text-zinc-500"}`} />
                    </div>
                    <div>
                        <Label className="text-base cursor-pointer">Ghost-Modus</Label>
                        <p className="text-xs text-zinc-500">
                            {ghostMode
                                ? remainingText
                                    ? `Aktiv - ${remainingText}`
                                    : "Aktiv - Unbegrenzt"
                                : "Profil für Scanner unsichtbar machen"}
                        </p>
                    </div>
                </div>
                <Switch
                    checked={ghostMode}
                    onCheckedChange={handleToggle}
                    disabled={saving}
                />
            </div>

            {ghostMode && (
                <div className="pl-[52px] space-y-2">
                    <p className="text-xs text-zinc-500">Dauer:</p>
                    <div className="flex flex-wrap gap-2">
                        {DURATION_OPTIONS.map((opt) => {
                            const isSelected =
                                (!ghostModeUntil && opt.value === null) ||
                                (selectedDuration === opt.value && ghostMode);
                            return (
                                <button
                                    key={opt.label}
                                    type="button"
                                    onClick={() => handleDurationChange(opt.value)}
                                    disabled={saving}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                        isSelected
                                            ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                                            : "bg-zinc-800 text-zinc-400 border border-white/5 hover:border-white/10"
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            );
                        })}
                    </div>
                    <p className="text-xs text-zinc-600 mt-1">
                        Im Ghost-Modus sehen Scanner nur eine Platzhalter-Seite.
                    </p>
                </div>
            )}
        </div>
    );
}
