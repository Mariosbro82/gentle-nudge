import { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  Send,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  RefreshCw,
  Shield,
  Clock,
} from "lucide-react";

interface Lead {
  id: string;
  lead_name: string | null;
  lead_email: string | null;
  notes: string | null;
  sentiment: string | null;
  marketing_consent: boolean | null;
  created_at: string | null;
}

interface UserProfile {
  id: string;
  name: string | null;
  company_name: string | null;
  job_title: string | null;
  reply_to_email: string | null;
  email: string;
}

export default function CampaignsPage() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [tone, setTone] = useState("professionell");
  const [language, setLanguage] = useState("Deutsch");
  const [generatedSubject, setGeneratedSubject] = useState("");
  const [generatedBody, setGeneratedBody] = useState("");
  const [delayHours, setDelayHours] = useState("0");
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  async function loadData() {
    const { data: userData } = await supabase
      .from("users")
      .select("id, name, company_name, job_title, reply_to_email, email")
      .eq("auth_user_id", user!.id)
      .maybeSingle();

    if (userData) {
      setProfile(userData);
      // Only load leads with marketing consent
      const { data: leadsData } = await supabase
        .from("leads")
        .select("id, lead_name, lead_email, notes, sentiment, marketing_consent, created_at")
        .eq("captured_by_user_id", userData.id)
        .eq("marketing_consent", true)
        .order("created_at", { ascending: false });

      setLeads(leadsData || []);
    }
  }

  async function generateEmail() {
    if (!selectedLead || !profile) return;
    setGenerating(true);
    setError("");
    setSent(false);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("generate-followup", {
        body: {
          leadName: selectedLead.lead_name,
          leadEmail: selectedLead.lead_email,
          leadNotes: selectedLead.notes,
          senderName: profile.name,
          senderCompany: profile.company_name,
          senderJobTitle: profile.job_title,
          tone,
          language,
        },
      });

      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);

      setGeneratedSubject(data.subject || "");
      setGeneratedBody(data.body || "");
    } catch (e: any) {
      setError(e.message || "Fehler bei der E-Mail-Generierung");
    } finally {
      setGenerating(false);
    }
  }

  async function sendFollowUp() {
    if (!selectedLead || !profile || !generatedSubject || !generatedBody) return;
    setSending(true);
    setError("");

    try {
      const hours = parseInt(delayHours) || 0;
      const scheduledAt = new Date(Date.now() + hours * 60 * 60 * 1000);
      const { error: insertError } = await supabase.from("follow_up_emails").insert({
        lead_id: selectedLead.id,
        user_id: profile.id,
        subject: generatedSubject,
        body_html: generatedBody,
        delay_hours: hours,
        status: "pending",
        scheduled_at: scheduledAt.toISOString(),
      });

      if (insertError) throw insertError;
      setSent(true);
    } catch (e: any) {
      setError(e.message || "Fehler beim Senden");
    } finally {
      setSending(false);
    }
  }

  const consentLeadCount = leads.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Kampagnen</h1>
        <p className="text-muted-foreground mt-1">
          KI-generierte Follow-up E-Mails für deine Kontakte
        </p>
      </div>

      {/* DSGVO Info */}
      <Card className="p-4 border-l-4 border-l-green-500 bg-green-500/5">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">DSGVO-konform</p>
            <p className="text-xs text-muted-foreground mt-1">
              Nur Kontakte mit ausdrücklicher Einwilligung (Opt-in) werden hier angezeigt.
              {consentLeadCount > 0
                ? ` ${consentLeadCount} Kontakt${consentLeadCount !== 1 ? "e" : ""} mit Einwilligung.`
                : " Noch keine Kontakte mit Einwilligung."}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Lead Selection & Settings */}
        <div className="space-y-4">
          <Card className="p-5 space-y-4">
            <h2 className="font-semibold text-foreground">Kontakt auswählen</h2>

            {leads.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Keine Kontakte mit Marketing-Einwilligung vorhanden.
              </p>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {leads.map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => {
                      setSelectedLead(lead);
                      setGeneratedSubject("");
                      setGeneratedBody("");
                      setSent(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedLead?.id === lead.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm text-foreground">
                          {lead.lead_name || "Unbekannt"}
                        </span>
                      </div>
                      {lead.sentiment && (
                        <Badge
                          variant="outline"
                          className={
                            lead.sentiment === "hot"
                              ? "border-red-500/30 text-red-500"
                              : lead.sentiment === "warm"
                              ? "border-yellow-500/30 text-yellow-500"
                              : "border-blue-500/30 text-blue-500"
                          }
                        >
                          {lead.sentiment}
                        </Badge>
                      )}
                    </div>
                    {lead.lead_email && (
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {lead.lead_email}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-5 space-y-4">
            <h2 className="font-semibold text-foreground">Einstellungen</h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Tonalität</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professionell">Professionell</SelectItem>
                    <SelectItem value="freundlich">Freundlich</SelectItem>
                    <SelectItem value="direkt">Direkt</SelectItem>
                    <SelectItem value="locker">Locker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Sprache</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Deutsch">Deutsch</SelectItem>
                    <SelectItem value="Englisch">Englisch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-xs flex items-center gap-1"><Clock className="h-3 w-3" /> Zeitversatz</Label>
              <Select value={delayHours} onValueChange={setDelayHours}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Sofort senden</SelectItem>
                  <SelectItem value="1">Nach 1 Stunde</SelectItem>
                  <SelectItem value="6">Nach 6 Stunden</SelectItem>
                  <SelectItem value="12">Nach 12 Stunden</SelectItem>
                  <SelectItem value="24">Nach 1 Tag</SelectItem>
                  <SelectItem value="48">Nach 2 Tagen</SelectItem>
                  <SelectItem value="72">Nach 3 Tagen</SelectItem>
                  <SelectItem value="168">Nach 1 Woche</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={generateEmail}
              disabled={!selectedLead || generating}
              className="w-full gap-2"
            >
              {generating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {generating ? "Generiere..." : "E-Mail mit KI erstellen"}
            </Button>
          </Card>
        </div>

        {/* Right: Generated Email Preview */}
        <Card className="p-5 space-y-4">
          <h2 className="font-semibold text-foreground">E-Mail Vorschau</h2>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {sent && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
              <p className="text-sm text-green-500">E-Mail wurde geplant und wird in Kürze gesendet!</p>
            </div>
          )}

          <div>
            <Label className="text-xs">Betreff</Label>
            <Input
              value={generatedSubject}
              onChange={(e) => setGeneratedSubject(e.target.value)}
              placeholder="Wird von der KI generiert..."
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-xs">Inhalt</Label>
            <Textarea
              value={generatedBody.replace(/<[^>]*>/g, "")}
              onChange={(e) => setGeneratedBody(`<p>${e.target.value.replace(/\n/g, "</p><p>")}</p>`)}
              placeholder="Wird von der KI generiert..."
              className="mt-1 min-h-[200px]"
            />
          </div>

          {generatedBody && (
            <div>
              <Label className="text-xs mb-2 block">HTML-Vorschau</Label>
              <div
                className="p-4 rounded-lg bg-muted/50 border border-border text-sm prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(generatedBody, {
                  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'span', 'div'],
                  ALLOWED_ATTR: ['href', 'target', 'rel', 'style'],
                  ALLOWED_URI_REGEXP: /^https?:/i
                }) }}
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={generateEmail}
              disabled={!selectedLead || generating}
              className="flex-1 gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Neu generieren
            </Button>
            <Button
              onClick={sendFollowUp}
              disabled={!generatedSubject || !generatedBody || sending || sent}
              className="flex-1 gap-2"
            >
              {sending ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {sent ? "Geplant ✓" : parseInt(delayHours) > 0 ? "Planen" : "Senden"}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Die E-Mail wird über dein konfiguriertes Follow-up-System versendet.
          </p>
        </Card>
      </div>
    </div>
  );
}
