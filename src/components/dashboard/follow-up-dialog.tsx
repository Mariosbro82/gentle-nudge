import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Mail, Clock, Zap } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface FollowUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: {
    id: string;
    lead_name: string | null;
    lead_email: string | null;
  } | null;
  defaults?: {
    subject?: string;
    body_html?: string;
    delay_hours?: number;
  };
  onScheduled?: () => void;
}

const DEFAULT_SUBJECT = "Schön, Sie kennengelernt zu haben, {lead_name}!";
const DEFAULT_BODY = `<p>Hallo {lead_name},</p>
<p>vielen Dank für den Austausch! Hier sind wie versprochen meine Kontaktdaten.</p>
<p>Ich freue mich auf den weiteren Kontakt.</p>
<p>Viele Grüße,<br/>{sender_name}<br/>{company_name}</p>`;

export function FollowUpDialog({
  open,
  onOpenChange,
  lead,
  defaults,
  onScheduled,
}: FollowUpDialogProps) {
  const [subject, setSubject] = useState(defaults?.subject || DEFAULT_SUBJECT);
  const [bodyHtml, setBodyHtml] = useState(defaults?.body_html || DEFAULT_BODY);
  const [delayHours, setDelayHours] = useState(defaults?.delay_hours || 24);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDelayLabel = (hours: number) => {
    if (hours >= 168) return "1 Woche";
    if (hours >= 48) return `${Math.floor(hours / 24)} Tage`;
    if (hours >= 24) return "1 Tag";
    return `${hours} Stunden`;
  };

  const placeholders = [
    { key: "{lead_name}", desc: "Name des Kontakts" },
    { key: "{lead_email}", desc: "E-Mail des Kontakts" },
    { key: "{sender_name}", desc: "Dein Name" },
    { key: "{sender_email}", desc: "Deine E-Mail" },
    { key: "{company_name}", desc: "Firmenname" },
  ];

  async function handleSchedule() {
    if (!lead) return;
    setSending(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Nicht angemeldet");

      const res = await fetch(
        "https://owxuoejwnxspzuleeyqi.supabase.co/functions/v1/send-follow-up",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            mode: "schedule",
            lead_id: lead.id,
            subject,
            body_html: bodyHtml,
            delay_hours: delayHours,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fehler beim Planen");

      onScheduled?.();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto sm:max-w-lg w-[calc(100%-2rem)] mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-purple-500" />
            Follow-Up an {lead.lead_name || lead.lead_email}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Delay Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Versand nach:
              </Label>
              <span className="text-sm font-semibold text-purple-500">
                {getDelayLabel(delayHours)}
              </span>
            </div>
            <Slider
              value={[delayHours]}
              min={1}
              max={168}
              step={1}
              onValueChange={(v) => setDelayHours(v[0])}
            />
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <Label>Betreff</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Betreff der E-Mail..."
            />
          </div>

          {/* Body */}
          <div className="space-y-1.5">
            <Label>Inhalt (HTML)</Label>
            <Textarea
              value={bodyHtml}
              onChange={(e) => setBodyHtml(e.target.value)}
              rows={8}
              placeholder="E-Mail Inhalt..."
              className="font-mono text-sm"
            />
          </div>

          {/* Placeholders */}
          <div className="bg-muted/50 p-3 rounded-lg space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1">
              <Zap className="w-3 h-3" /> Verfügbare Platzhalter:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {placeholders.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setBodyHtml((prev) => prev + p.key)}
                  className="text-xs bg-background border border-border px-2 py-1 rounded hover:bg-accent transition-colors"
                  title={p.desc}
                >
                  {p.key}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button
            onClick={handleSchedule}
            disabled={sending || !subject || !bodyHtml}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {sending ? "Wird geplant..." : "Follow-Up planen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
