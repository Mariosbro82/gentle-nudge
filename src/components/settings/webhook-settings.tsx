import { useState } from "react";
import { Webhook, Loader2, CheckCircle, XCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/client";

interface WebhookSettingsProps {
    webhookUrl: string | null;
    authUserId: string;
    email: string;
    onChange: (url: string | null) => void;
}

function isValidWebhookUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        return parsed.protocol === "https:";
    } catch {
        return false;
    }
}

export function WebhookSettings({ webhookUrl, authUserId, email, onChange }: WebhookSettingsProps) {
    const [url, setUrl] = useState(webhookUrl || "");
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

    const isActive = !!webhookUrl;
    const urlChanged = url !== (webhookUrl || "");
    const urlValid = url === "" || isValidWebhookUrl(url);

    async function handleSave() {
        const trimmed = url.trim();

        if (trimmed && !isValidWebhookUrl(trimmed)) {
            alert("Bitte geben Sie eine gültige HTTPS-URL ein.");
            return;
        }

        setSaving(true);
        const newUrl = trimmed || null;

        const payload = {
            auth_user_id: authUserId,
            email: email,
            webhook_url: newUrl,
            updated_at: new Date().toISOString()
        };

        const { error } = await supabase
            .from("users")
            .upsert(payload as any, { onConflict: "auth_user_id" });

        if (error) {
            alert(error.message);
        } else {
            onChange(newUrl);
            alert(newUrl ? "Webhook-URL gespeichert!" : "Webhook-URL entfernt.");
        }
        setSaving(false);
    }

    async function handleTest() {
        if (!webhookUrl) return;

        setTesting(true);
        setTestResult(null);

        const { data, error } = await supabase.rpc<any>("test_webhook", {
            url: webhookUrl
        } as any);

        if (error) {
            setTestResult({ success: false, message: error.message || "Fehler beim Senden." });
        } else if ((data as any)?.success) {
            setTestResult({ success: true, message: `Erfolgreich gesendet (Status ${(data as any).status_code}).` });
        } else {
            setTestResult({ success: false, message: (data as any)?.error || "Webhook hat nicht geantwortet." });
        }
        setTesting(false);
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isActive ? "bg-blue-500/20" : "bg-zinc-800"}`}>
                    <Webhook className={`h-5 w-5 ${isActive ? "text-blue-400" : "text-zinc-500"}`} />
                </div>
                <div>
                    <Label className="text-base">Webhook-Integration</Label>
                    <p className="text-xs text-zinc-500">
                        {isActive ? (
                            <span className="flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />
                                Aktiv – Neue Leads werden automatisch gesendet
                            </span>
                        ) : (
                            "Leads automatisch an Zapier, Make oder andere Tools senden"
                        )}
                    </p>
                </div>
            </div>

            <div className="space-y-3 pl-[52px]">
                <div className="space-y-1.5">
                    <Label htmlFor="webhook-url" className="text-sm text-zinc-400">Webhook-URL</Label>
                    <Input
                        id="webhook-url"
                        type="url"
                        placeholder="https://hooks.zapier.com/hooks/catch/..."
                        value={url}
                        onChange={(e) => {
                            setUrl(e.target.value);
                            setTestResult(null);
                        }}
                        className="bg-black/50 border-white/10"
                    />
                    {url && !urlValid && (
                        <p className="text-xs text-red-400">Bitte geben Sie eine gültige HTTPS-URL ein.</p>
                    )}
                </div>

                <div className="flex gap-2">
                    <Button
                        type="button"
                        onClick={handleSave}
                        disabled={saving || !urlChanged || (!!url && !urlValid)}
                        className="bg-white text-black hover:bg-zinc-200"
                        size="sm"
                    >
                        {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                        {url ? "Speichern" : "Entfernen"}
                    </Button>
                    {isActive && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleTest}
                            disabled={testing || urlChanged}
                            className="border-white/10"
                        >
                            {testing ? (
                                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                            ) : (
                                <Send className="mr-2 h-4 w-4" />
                            )}
                            Test senden
                        </Button>
                    )}
                </div>

                {testResult && (
                    <div className={`flex items-center gap-2 text-xs ${testResult.success ? "text-green-400" : "text-red-400"}`}>
                        {testResult.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                        {testResult.message}
                    </div>
                )}

                <div className="rounded-lg bg-zinc-800/50 border border-white/5 p-3 space-y-1.5">
                    <p className="text-xs font-medium text-zinc-300">So funktioniert es:</p>
                    <ol className="text-xs text-zinc-500 space-y-1 list-decimal list-inside">
                        <li>Erstellen Sie in Zapier einen <strong className="text-zinc-400">Webhooks by Zapier → Catch Hook</strong></li>
                        <li>Kopieren Sie die generierte URL und fügen Sie sie oben ein</li>
                        <li>Jeder neue Lead wird automatisch als JSON an diese URL gesendet</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
