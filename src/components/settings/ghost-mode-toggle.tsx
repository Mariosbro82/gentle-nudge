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
    { label: "Benutzerdefiniert", value: -1 },
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
    const [customDate, setCustomDate] = useState<string>(
        ghostModeUntil ? new Date(ghostModeUntil).toISOString().slice(0, 16) : ""
    );
    const remainingText = ghostMode ? getRemainingText(ghostModeUntil) : null;

    function handleToggle(checked: boolean) {
        if (checked) {
            onChange(true, computeUntil(selectedDuration));
        } else {
            onChange(false, null);
            setSelectedDuration(null);
            setCustomDate("");
        }
    }

    function handleDurationChange(hours: number | null) {
        setSelectedDuration(hours);
        if (hours === -1) {
            // Custom mode - don't change until user picks a date
            return;
        }
        if (ghostMode) {
            onChange(true, computeUntil(hours));
        }
    }

    function handleCustomDateChange(value: string) {
        setCustomDate(value);
        if (value && ghostMode) {
            onChange(true, new Date(value).toISOString());
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${ghostMode ? "bg-violet-500/20" : "bg-muted"}`}>
                        <Ghost className={`h-5 w-5 ${ghostMode ? "text-violet-400" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                        <Label className="text-base cursor-pointer">Ghost-Modus</Label>
                        <p className="text-xs text-muted-foreground">
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
                <div className="pl-[52px] space-y-3">
                    <p className="text-xs text-muted-foreground">Dauer:</p>
                    <div className="flex flex-wrap gap-2">
                        {DURATION_OPTIONS.map((opt) => {
                            const isSelected =
                                selectedDuration === opt.value ||
                                (!ghostModeUntil && opt.value === null && selectedDuration === null);
                            return (
                                <button
                                    key={opt.label}
                                    type="button"
                                    onClick={() => handleDurationChange(opt.value)}
                                    disabled={saving}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${isSelected
                                            ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                                            : "bg-muted text-muted-foreground border border-border hover:border-muted-foreground/20"
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            );
                        })}
                    </div>

                    {selectedDuration === -1 && (
                        <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">Ghost-Modus aktiv bis:</label>
                            <input
                                type="datetime-local"
                                value={customDate}
                                onChange={(e) => handleCustomDateChange(e.target.value)}
                                min={new Date().toISOString().slice(0, 16)}
                                className="flex h-9 w-full max-w-xs rounded-md border border-border bg-input px-3 py-1 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                        </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                        Im Ghost-Modus sehen Scanner nur eine Platzhalter-Seite.
                    </p>
                </div>
            )}
        </div>
    );
}
