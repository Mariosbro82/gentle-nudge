import { useEffect, useState } from "react";
import { Loader2, Upload, X, Building2, Lock, Unlock, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";
import { useOrgTemplate, type OrgTemplateConfig } from "@/hooks/use-org-template";
import { TooltipProvider } from "@/components/ui/tooltip";

const LOCKABLE_FIELDS = [
    { key: "profile_pic", label: "Mitarbeitern erlauben, eigenes Profilbild hochzuladen" },
    { key: "custom_links", label: "Mitarbeitern erlauben, eigene Links hinzuzufügen" },
    { key: "custom_greeting", label: "Mitarbeitern erlauben, den Begrüßungstext zu ändern" },
    { key: "bio", label: "Mitarbeitern erlauben, die Bio zu ändern" },
    { key: "design", label: "Mitarbeitern erlauben, Farben & Design anzupassen" },
    { key: "social_links", label: "Mitarbeitern erlauben, Social-Media-Links zu ändern" },
    { key: "banner", label: "Mitarbeitern erlauben, ein eigenes Banner hochzuladen" },
];

export default function CorporateDesignPage() {
    const { user: authUser } = useAuth();
    const { orgId, orgName, isOrgAdmin, templateConfig, loading: orgLoading } = useOrgTemplate();

    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState<OrgTemplateConfig>({
        global_colors: { background: "#0a0a0a", banner: "#4f46e5", accent: "#4f46e5" },
        company_logo_url: "",
        mandatory_links: [],
        locked_fields: [],
    });

    // Sync from DB
    useEffect(() => {
        if (templateConfig) {
            setConfig({
                global_colors: templateConfig.global_colors || { background: "#0a0a0a", banner: "#4f46e5", accent: "#4f46e5" },
                company_logo_url: templateConfig.company_logo_url || "",
                mandatory_links: templateConfig.mandatory_links || [],
                locked_fields: templateConfig.locked_fields || [],
            });
        }
    }, [templateConfig]);

    async function handleSave() {
        if (!orgId) return;
        setSaving(true);
        const { error } = await supabase
            .from("organizations")
            .update({ template_config: config as any, updated_at: new Date().toISOString() })
            .eq("id", orgId);

        if (error) {
            alert(`Fehler: ${error.message}`);
        } else {
            alert("Corporate Design gespeichert!");
        }
        setSaving(false);
    }

    function toggleLockedField(fieldKey: string) {
        setConfig(prev => {
            const locked = prev.locked_fields || [];
            const isLocked = locked.includes(fieldKey);
            return {
                ...prev,
                locked_fields: isLocked
                    ? locked.filter(f => f !== fieldKey)
                    : [...locked, fieldKey],
            };
        });
    }

    function addMandatoryLink() {
        setConfig(prev => ({
            ...prev,
            mandatory_links: [...(prev.mandatory_links || []), { title: "", url: "" }],
        }));
    }

    function updateMandatoryLink(index: number, field: "title" | "url", value: string) {
        setConfig(prev => {
            const links = [...(prev.mandatory_links || [])];
            links[index] = { ...links[index], [field]: value };
            return { ...prev, mandatory_links: links };
        });
    }

    function removeMandatoryLink(index: number) {
        setConfig(prev => ({
            ...prev,
            mandatory_links: (prev.mandatory_links || []).filter((_, i) => i !== index),
        }));
    }

    async function handleLogoUpload(file: File) {
        if (!authUser || !orgId) return;
        const ext = file.name.split(".").pop();
        const path = `org-logos/${orgId}/logo.${ext}`;
        const { error: uploadError } = await supabase.storage.from("profile-images").upload(path, file, { upsert: true });
        if (uploadError) { alert(`Upload fehlgeschlagen: ${uploadError.message}`); return; }
        const { data: urlData } = supabase.storage.from("profile-images").getPublicUrl(path);
        const url = urlData.publicUrl + `?t=${Date.now()}`;
        setConfig(prev => ({ ...prev, company_logo_url: url }));
    }

    if (orgLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        );
    }

    if (!orgId || !isOrgAdmin) {
        return (
            <div className="flex items-center justify-center h-64 text-center">
                <div>
                    <Building2 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <h2 className="text-lg font-semibold text-foreground">Kein Zugriff</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Sie benötigen Admin-Rechte in einer Organisation, um auf diese Seite zuzugreifen.
                    </p>
                </div>
            </div>
        );
    }

    const lockedFields = config.locked_fields || [];

    return (
        <TooltipProvider>
        <div className="max-w-3xl space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">Corporate Design & Policies</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Globales Design für <span className="font-medium text-foreground">{orgName}</span> festlegen und Mitarbeiter-Rechte steuern.
                </p>
            </div>

            {/* ─── Global Colors ─── */}
            <Card className="rounded-xl border-border/50">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Firmenfarben</CardTitle>
                    <CardDescription>Diese Farben werden für alle Mitarbeiter-Profile übernommen.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Hintergrund</Label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={config.global_colors?.background || "#0a0a0a"}
                                    onChange={(e) => setConfig(prev => ({
                                        ...prev,
                                        global_colors: { ...prev.global_colors, background: e.target.value },
                                    }))}
                                    className="w-10 h-9 rounded-lg border border-border cursor-pointer bg-transparent"
                                />
                                <span className="text-xs text-muted-foreground font-mono">{config.global_colors?.background}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Banner</Label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={config.global_colors?.banner || "#4f46e5"}
                                    onChange={(e) => setConfig(prev => ({
                                        ...prev,
                                        global_colors: { ...prev.global_colors, banner: e.target.value },
                                    }))}
                                    className="w-10 h-9 rounded-lg border border-border cursor-pointer bg-transparent"
                                />
                                <span className="text-xs text-muted-foreground font-mono">{config.global_colors?.banner}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Akzent</Label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={config.global_colors?.accent || "#4f46e5"}
                                    onChange={(e) => setConfig(prev => ({
                                        ...prev,
                                        global_colors: { ...prev.global_colors, accent: e.target.value },
                                    }))}
                                    className="w-10 h-9 rounded-lg border border-border cursor-pointer bg-transparent"
                                />
                                <span className="text-xs text-muted-foreground font-mono">{config.global_colors?.accent}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ─── Company Logo ─── */}
            <Card className="rounded-xl border-border/50">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Firmenlogo</CardTitle>
                    <CardDescription>Wird auf allen Mitarbeiter-Profilen angezeigt.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {config.company_logo_url ? (
                        <div className="relative inline-block">
                            <img src={config.company_logo_url} alt="Logo" className="h-16 rounded-lg border border-border bg-muted/30 object-contain p-2" />
                            <button
                                type="button"
                                onClick={() => setConfig(prev => ({ ...prev, company_logo_url: "" }))}
                                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center h-24 rounded-xl border-2 border-dashed border-border hover:border-muted-foreground/30 cursor-pointer transition-colors">
                            <Upload className="h-5 w-5 text-muted-foreground mb-1.5" />
                            <span className="text-xs text-muted-foreground">Logo hochladen</span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])} />
                        </label>
                    )}
                </CardContent>
            </Card>

            {/* ─── Mandatory Links ─── */}
            <Card className="rounded-xl border-border/50">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Pflicht-Links</CardTitle>
                    <CardDescription>Diese Links erscheinen auf jedem Mitarbeiter-Profil und können nicht entfernt werden.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {(config.mandatory_links || []).map((link, i) => (
                        <div key={i} className="flex gap-2 items-start">
                            <div className="flex-1 grid grid-cols-2 gap-2">
                                <Input
                                    placeholder="Titel (z.B. Firmenseite)"
                                    value={link.title}
                                    onChange={(e) => updateMandatoryLink(i, "title", e.target.value)}
                                    className="bg-input border-border"
                                />
                                <Input
                                    placeholder="https://..."
                                    value={link.url}
                                    onChange={(e) => updateMandatoryLink(i, "url", e.target.value)}
                                    className="bg-input border-border"
                                />
                            </div>
                            <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => removeMandatoryLink(i)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addMandatoryLink} className="gap-1.5">
                        <Plus className="h-3.5 w-3.5" /> Link hinzufügen
                    </Button>
                </CardContent>
            </Card>

            {/* ─── Field Locks (Permissions) ─── */}
            <Card className="rounded-xl border-border/50">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Lock className="h-4 w-4" /> Rechte & Einschränkungen
                    </CardTitle>
                    <CardDescription>Steuern Sie, welche Felder Mitarbeiter auf ihrem Profil selbst ändern dürfen.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-1">
                    {LOCKABLE_FIELDS.map((field) => {
                        const isAllowed = !lockedFields.includes(field.key);
                        return (
                            <div key={field.key} className="flex items-center justify-between py-3 px-1 rounded-lg hover:bg-accent/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    {isAllowed ? (
                                        <Unlock className="h-4 w-4 text-emerald-500" />
                                    ) : (
                                        <Lock className="h-4 w-4 text-destructive" />
                                    )}
                                    <span className="text-sm">{field.label}</span>
                                </div>
                                <Switch
                                    checked={isAllowed}
                                    onCheckedChange={() => toggleLockedField(field.key)}
                                />
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            {/* ─── Save Button ─── */}
            <div className="sticky bottom-4 z-50 flex justify-end pb-2">
                <Button size="lg" className="rounded-xl shadow-lg" onClick={handleSave} disabled={saving}>
                    {saving && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                    Corporate Design speichern
                </Button>
            </div>
        </div>
        </TooltipProvider>
    );
}
