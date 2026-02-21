import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { UserPlus, Send, CheckCircle, Link, ChevronDown, ChevronUp } from "lucide-react";
import { submitLead } from "@/lib/api/analytics";

interface ContactFormProps {
  recipientUserId: string;
  recipientName: string;
}

export function ContactForm({ recipientUserId, recipientName }: ContactFormProps) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showLinks, setShowLinks] = useState(false);
  const [consent, setConsent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    website: "",
    linkedin: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !consent) return;

    setSubmitting(true);

    const notes = [
      form.message && `Nachricht: ${form.message}`,
      form.website && `Website: ${form.website}`,
      form.linkedin && `LinkedIn: ${form.linkedin}`,
    ]
      .filter(Boolean)
      .join("\n");

    const { success } = await submitLead({
      captured_by_user_id: recipientUserId,
      lead_name: form.name.trim(),
      lead_email: form.email.trim(),
      lead_phone: form.phone.trim() || undefined,
      notes: notes || undefined,
      marketing_consent: consent,
    });

    setSubmitting(false);
    if (success) {
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div
        className="mt-6 rounded-2xl border border-green-500/20 p-6 text-center"
        style={{
          background: 'rgba(34, 197, 94, 0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <CheckCircle className="mx-auto mb-3 h-10 w-10 text-green-400" />
        <h3 className="text-lg font-semibold text-white">Kontakt gesendet!</h3>
        <p className="mt-1 text-sm text-white/60">
          {recipientName} hat deine Kontaktdaten erhalten.
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <div className="mt-6 space-y-3">
        <Button
          onClick={() => setOpen(true)}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Kontakt austauschen
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 space-y-4 rounded-2xl border border-white/[0.15] ring-1 ring-white/[0.08] p-5 overflow-hidden relative"
      style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.60) 100%)',
        backdropFilter: 'blur(60px) saturate(180%)',
        WebkitBackdropFilter: 'blur(60px) saturate(180%)',
      }}
    >
      {/* Glass highlight */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)',
      }} />

      <h3 className="relative z-10 text-center text-lg font-semibold text-white drop-shadow-md">
        Kontaktdaten senden
      </h3>
      <p className="relative z-10 text-center text-sm text-white/80 drop-shadow-sm">
        Teile deine Infos mit {recipientName}
      </p>

      <div className="relative z-10 space-y-3">
        <div>
          <Label htmlFor="contact-name" className="text-white/90 drop-shadow-sm">Name *</Label>
          <Input
            id="contact-name"
            placeholder="Dein Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            maxLength={100}
            className="bg-black/30 border-white/[0.15] text-white placeholder:text-white/40 focus:border-white/30"
          />
        </div>

        <div>
          <Label htmlFor="contact-email" className="text-white/90 drop-shadow-sm">E-Mail *</Label>
          <Input
            id="contact-email"
            type="email"
            placeholder="deine@email.de"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            maxLength={255}
            className="bg-black/30 border-white/[0.15] text-white placeholder:text-white/40 focus:border-white/30"
          />
        </div>

        <div>
          <Label htmlFor="contact-phone" className="text-white/90 drop-shadow-sm">Telefon</Label>
          <Input
            id="contact-phone"
            type="tel"
            placeholder="+49 123 456789"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            maxLength={30}
            className="bg-black/30 border-white/[0.15] text-white placeholder:text-white/40 focus:border-white/30"
          />
        </div>

        <div>
          <Label htmlFor="contact-message" className="text-white/90 drop-shadow-sm">Nachricht</Label>
          <Textarea
            id="contact-message"
            placeholder="Hallo, wir haben uns auf der Messe getroffen..."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            maxLength={500}
            className="min-h-[80px] bg-black/30 border-white/[0.15] text-white placeholder:text-white/40 focus:border-white/30"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowLinks(!showLinks)}
          className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors drop-shadow-sm"
        >
          <Link className="h-3.5 w-3.5" />
          Links hinzufügen
          {showLinks ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>

        {showLinks && (
          <div className="space-y-3 pl-1">
            <div>
          <Label htmlFor="contact-website" className="text-white/90 drop-shadow-sm">Website</Label>
              <Input
                id="contact-website"
                type="url"
                placeholder="https://deine-website.de"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                maxLength={255}
                className="bg-black/30 border-white/[0.15] text-white placeholder:text-white/40 focus:border-white/30"
              />
            </div>
            <div>
              <Label htmlFor="contact-linkedin" className="text-white/90 drop-shadow-sm">LinkedIn</Label>
              <Input
                id="contact-linkedin"
                type="url"
                placeholder="https://linkedin.com/in/dein-profil"
                value={form.linkedin}
                onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                maxLength={255}
                className="bg-black/30 border-white/[0.15] text-white placeholder:text-white/40 focus:border-white/30"
              />
            </div>
          </div>
         )}

        {/* DSGVO Consent */}
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 rounded border-white/20"
          />
          <span className="text-xs text-white/70 leading-relaxed drop-shadow-sm">
            Ich stimme zu, dass meine Daten zur Kontaktaufnahme gespeichert und verarbeitet werden. *
          </span>
        </label>
      </div>

      <div className="relative z-10 flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1 border-white/15 text-white/80 hover:bg-white/10 hover:text-white bg-transparent"
          onClick={() => setOpen(false)}
        >
          Abbrechen
        </Button>
        <Button
          type="submit"
          disabled={submitting || !form.name || !form.email || !consent}
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
        >
          {submitting ? (
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Senden
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
