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
    if (!form.name || !form.email) return;

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
    });

    setSubmitting(false);
    if (success) {
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className="mt-6 rounded-2xl border border-green-500/20 bg-green-500/5 p-6 text-center">
        <CheckCircle className="mx-auto mb-3 h-10 w-10 text-green-400" />
        <h3 className="text-lg font-semibold text-foreground">Kontakt gesendet!</h3>
        <p className="mt-1 text-sm text-muted-foreground">
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
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Kontakt austauschen
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-5">
      <h3 className="text-center text-lg font-semibold text-foreground">
        Kontaktdaten senden
      </h3>
      <p className="text-center text-sm text-muted-foreground">
        Teile deine Infos mit {recipientName}
      </p>

      <div className="space-y-3">
        <div>
          <Label htmlFor="contact-name">Name *</Label>
          <Input
            id="contact-name"
            placeholder="Dein Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            maxLength={100}
          />
        </div>

        <div>
          <Label htmlFor="contact-email">E-Mail *</Label>
          <Input
            id="contact-email"
            type="email"
            placeholder="deine@email.de"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            maxLength={255}
          />
        </div>

        <div>
          <Label htmlFor="contact-phone">Telefon</Label>
          <Input
            id="contact-phone"
            type="tel"
            placeholder="+49 123 456789"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            maxLength={30}
          />
        </div>

        <div>
          <Label htmlFor="contact-message">Nachricht</Label>
          <Textarea
            id="contact-message"
            placeholder="Hallo, wir haben uns auf der Messe getroffen..."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            maxLength={500}
            className="min-h-[80px]"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowLinks(!showLinks)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Link className="h-3.5 w-3.5" />
          Links hinzufügen
          {showLinks ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>

        {showLinks && (
          <div className="space-y-3 pl-1">
            <div>
              <Label htmlFor="contact-website">Website</Label>
              <Input
                id="contact-website"
                type="url"
                placeholder="https://deine-website.de"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                maxLength={255}
              />
            </div>
            <div>
              <Label htmlFor="contact-linkedin">LinkedIn</Label>
              <Input
                id="contact-linkedin"
                type="url"
                placeholder="https://linkedin.com/in/dein-profil"
                value={form.linkedin}
                onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                maxLength={255}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => setOpen(false)}
        >
          Abbrechen
        </Button>
        <Button
          type="submit"
          disabled={submitting || !form.name || !form.email}
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
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
