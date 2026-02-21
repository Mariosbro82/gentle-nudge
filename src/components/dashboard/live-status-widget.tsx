import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Radio, X } from "lucide-react";

interface StatusPreset {
  text: string;
  color: string;
  emoji: string;
}

const STATUS_PRESETS: StatusPreset[] = [
  { text: "Suche Investoren", color: "#22c55e", emoji: "🟢" },
  { text: "Nur auf einen Kaffee hier", color: "#eab308", emoji: "🟡" },
  { text: "In einem Meeting", color: "#ef4444", emoji: "🔴" },
  { text: "Offen für Gespräche", color: "#3b82f6", emoji: "🔵" },
  { text: "Keynote Speaker", color: "#a855f7", emoji: "🟣" },
];

interface LiveStatusWidgetProps {
  currentText: string | null;
  currentColor: string | null;
  userId: string;
  onUpdate: (text: string | null, color: string | null) => void;
}

export function LiveStatusWidget({ currentText, currentColor, userId: _userId, onUpdate }: LiveStatusWidgetProps) {
  const { user: authUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [customText, setCustomText] = useState("");
  const [customColor, setCustomColor] = useState("#22c55e");

  async function setStatus(text: string | null, color: string | null) {
    if (!authUser) return;
    setSaving(true);
    await supabase
      .from("users")
      .update({ live_status_text: text, live_status_color: color, updated_at: new Date().toISOString() } as any)
      .eq("auth_user_id", authUser.id);
    onUpdate(text, color);
    setSaving(false);
  }

  async function clearStatus() {
    await setStatus(null, null);
  }

  async function setCustomStatus() {
    if (!customText.trim()) return;
    await setStatus(customText.trim(), customColor);
    setCustomText("");
  }

  return (
    <Card className="rounded-xl border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Radio className="h-4 w-4 text-green-500" />
          Live Status
        </CardTitle>
        <CardDescription>Zeige Besuchern deinen aktuellen Status in Echtzeit.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current status */}
        {currentText && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: currentColor || '#22c55e' }} />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: currentColor || '#22c55e' }} />
              </span>
              <span className="text-sm font-medium text-foreground">{currentText}</span>
            </div>
            <Button variant="ghost" size="icon-xs" onClick={clearStatus} disabled={saving}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Presets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {STATUS_PRESETS.map((preset) => (
            <button
              key={preset.text}
              onClick={() => setStatus(preset.text, preset.color)}
              disabled={saving}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors border ${
                currentText === preset.text
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/50 hover:bg-muted/50 text-foreground"
              }`}
            >
              <span>{preset.emoji}</span>
              <span>{preset.text}</span>
            </button>
          ))}
        </div>

        {/* Custom status */}
        <div className="flex gap-2">
          <input
            type="color"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            className="w-9 h-9 rounded-lg border border-border cursor-pointer bg-transparent flex-shrink-0"
          />
          <Input
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Eigener Status..."
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && setCustomStatus()}
          />
          <Button size="sm" onClick={setCustomStatus} disabled={saving || !customText.trim()}>
            Setzen
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
