import { useEffect, useState } from "react";
import { ExternalLink, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";
import { ImageUpload } from "@/components/settings/image-upload";
import { TemplateSelector } from "@/components/settings/template-selector";
import { GhostModeToggle } from "@/components/settings/ghost-mode-toggle";
import { WebhookSettings } from "@/components/settings/webhook-settings";
import { CustomLinksEditor } from "@/components/settings/custom-links-editor";
import { PresetManager } from "@/components/settings/preset-manager";
import { FocalPointPicker } from "@/components/settings/focal-point-picker";
import { useUsernameAvailability } from "@/hooks/use-username-availability";
import { Check, AlertCircle } from "lucide-react";
import type { CustomLink } from "@/types/profile";

export default function SettingsPage() {
    const { user: authUser } = useAuth();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [ghostSaving, setGhostSaving] = useState(false);
    const [activeTemplate, setActiveTemplate] = useState("premium-gradient");
    const [customLinks, setCustomLinks] = useState<CustomLink[]>([]);

    const {
        username,
        status: usernameStatus,
        message: usernameMessage,
        checkUsername,
        isAvailable
    } = useUsernameAvailability(user?.slug || "");

    useEffect(() => {
        async function fetchProfile() {
            if (!authUser) return;
            const { data: profile } = await supabase
                .from("users")
                .select("*")
                .eq("auth_user_id", authUser.id)
                .single();

            const p = profile || { name: "", email: authUser.email, id: authUser.id } as any;
            setUser(p);
            setActiveTemplate(p?.active_template || "premium-gradient");
            setCustomLinks(p?.custom_links || []);
            setLoading(false);
        }
        fetchProfile();
    }, [authUser]);

    async function handleSave(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSaving(true);
        if (!authUser) return;

        const formData = new FormData(e.currentTarget);
        const updates = {
            auth_user_id: authUser.id,
            slug: formData.get("slug") as string,
            name: formData.get("name") as string,
            job_title: formData.get("title") as string,
            bio: formData.get("bio") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string,
            website: formData.get("website") as string,
            linkedin_url: formData.get("linkedin") as string,
            active_template: activeTemplate,
            background_color: formData.get("background_color") as string || "#0a0a0a",
            custom_links: customLinks,
            updated_at: new Date().toISOString(),
        };

        const { error } = await supabase.from("users").upsert(updates as any, { onConflict: "auth_user_id" });

        if (error) {
            alert(error.message);
        } else {
            alert("Profil aktualisiert!");
            setUser({ ...user, ...updates });
        }
        setSaving(false);
    }

    async function handleImageUploaded(type: "profile" | "banner", url: string) {
        if (!authUser) return;
        try {
            const field = type === "profile" ? "profile_pic" : "banner_pic";
            const { error } = await supabase.from("users").upsert({
                auth_user_id: authUser.id,
                email: user?.email || authUser.email,
                [field]: url,
                updated_at: new Date().toISOString()
            } as any, { onConflict: "auth_user_id" });
            if (error) { alert(`Fehler beim Speichern: ${error.message}`); return; }
            setUser({ ...user, [field]: url });
            alert(type === "profile" ? "Profilbild aktualisiert!" : "Banner aktualisiert!");
        } catch (err: any) {
            alert(`Ein unerwarteter Fehler ist aufgetreten: ${err.message || err}`);
        }
    }

    async function handleImageRemoved(type: "profile" | "banner") {
        if (!authUser) return;
        try {
            const field = type === "profile" ? "profile_pic" : "banner_pic";
            const { error } = await supabase.from("users").upsert({
                auth_user_id: authUser.id,
                email: user?.email || authUser.email,
                [field]: null,
                updated_at: new Date().toISOString()
            } as any, { onConflict: "auth_user_id" });
            if (error) { alert(`Fehler beim Löschen: ${error.message}`); return; }
            setUser({ ...user, [field]: null });
            alert("Bild erfolgreich entfernt.");
        } catch (err: any) {
            alert(`Ein unerwarteter Fehler ist aufgetreten: ${err.message || err}`);
        }
    }

    async function handleGhostModeChange(enabled: boolean, until: string | null) {
        setGhostSaving(true);
        const { error } = await supabase
            .from("users")
            .update({ ghost_mode: enabled, ghost_mode_until: until })
            .eq("auth_user_id", authUser?.id || "");
        if (!error) setUser({ ...user, ghost_mode: enabled, ghost_mode_until: until });
        setGhostSaving(false);
    }

    async function handleBackgroundColorSave(color: string) {
        if (!authUser) return;
        await supabase.from("users").update({ background_color: color, updated_at: new Date().toISOString() } as any).eq("auth_user_id", authUser.id);
    }

    async function handleBackgroundImageUpload(file: File | undefined | null) {
        if (!file || !authUser) return;
        const ext = file.name.split(".").pop();
        const path = `${authUser.id}/background.${ext}`;
        const { error: uploadError } = await supabase.storage.from("profile-images").upload(path, file, { upsert: true });
        if (uploadError) { alert(`Upload fehlgeschlagen: ${uploadError.message}`); return; }
        const { data: urlData } = supabase.storage.from("profile-images").getPublicUrl(path);
        const url = urlData.publicUrl + `?t=${Date.now()}`;
        const { error } = await supabase.from("users").update({ background_image: url, updated_at: new Date().toISOString() } as any).eq("auth_user_id", authUser.id);
        if (error) { alert(error.message); return; }
        setUser({ ...user, background_image: url });
    }

    async function handleBackgroundImageRemove() {
        if (!authUser) return;
        const { error } = await supabase.from("users").update({ background_image: null, updated_at: new Date().toISOString() } as any).eq("auth_user_id", authUser.id);
        if (!error) setUser({ ...user, background_image: null });
    }

    async function handleBannerColorSave(color: string) {
        if (!authUser) return;
        await supabase.from("users").update({ banner_color: color, updated_at: new Date().toISOString() } as any).eq("auth_user_id", authUser.id);
    }

    async function handleAccentColorSave(color: string) {
        if (!authUser) return;
        setUser({ ...user, accent_color: color });
        await supabase.from("users").update({ accent_color: color, updated_at: new Date().toISOString() } as any).eq("auth_user_id", authUser.id);
    }

    async function handleMesfeFeatureSave(field: string, value: any) {
        if (!authUser) return;
        setUser({ ...user, [field]: value });
        await supabase.from("users").update({ [field]: value, updated_at: new Date().toISOString() } as any).eq("auth_user_id", authUser.id);
    }

    function getCurrentPresetConfig() {
        return {
            active_template: activeTemplate,
            accent_color: user?.accent_color || "#4f46e5",
            background_color: user?.background_color || "#0a0a0a",
            banner_color: user?.banner_color || "#4f46e5",
            custom_links: customLinks,
            coupon_code: user?.coupon_code || "",
            coupon_description: user?.coupon_description || "",
            countdown_target: user?.countdown_target || null,
            countdown_label: user?.countdown_label || "",
        };
    }

    async function handlePresetActivate(presetData: Record<string, any>) {
        if (!authUser) return;
        const updates = {
            ...presetData,
            updated_at: new Date().toISOString(),
        };
        const { error } = await supabase.from("users").update(updates as any).eq("auth_user_id", authUser.id);
        if (!error) {
            setUser({ ...user, ...presetData });
            setActiveTemplate(presetData.active_template || activeTemplate);
            setCustomLinks(presetData.custom_links || []);
            alert("Preset aktiviert!");
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Einstellungen</h1>
                <p className="text-muted-foreground">Verwalten Sie Ihr Profil und Integrationen.</p>
            </div>

            {/* Profile Images */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle>Profilbilder</CardTitle>
                    <CardDescription>Laden Sie ein Profilbild und Banner für Ihre digitale Visitenkarte hoch.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <ImageUpload type="profile" currentUrl={user?.profile_pic} authUserId={authUser?.id || ""} onUploaded={(url) => handleImageUploaded("profile", url)} onRemoved={() => handleImageRemoved("profile")} objectPosition={user?.profile_pic_position || "50% 50%"} />
                    {user?.profile_pic && (
                        <FocalPointPicker
                            imageUrl={user.profile_pic}
                            position={user?.profile_pic_position || "50% 50%"}
                            onChange={(pos) => handleMesfeFeatureSave("profile_pic_position", pos)}
                            aspectRatio="1/1"
                            label="Profilbild-Ausschnitt anpassen"
                        />
                    )}
                    <ImageUpload type="banner" currentUrl={user?.banner_pic} authUserId={authUser?.id || ""} onUploaded={(url) => handleImageUploaded("banner", url)} onRemoved={() => handleImageRemoved("banner")} objectPosition={user?.banner_pic_position || "50% 50%"} />
                    {user?.banner_pic && (
                        <FocalPointPicker
                            imageUrl={user.banner_pic}
                            position={user?.banner_pic_position || "50% 50%"}
                            onChange={(pos) => handleMesfeFeatureSave("banner_pic_position", pos)}
                            aspectRatio="4/1"
                            label="Banner-Ausschnitt anpassen"
                        />
                    )}
                </CardContent>
            </Card>

            {/* Profile Form */}
            <form onSubmit={handleSave}>
                <Card className="bg-card border-border mb-8">
                    <CardHeader>
                        <CardTitle>Persönliches Profil</CardTitle>
                        <CardDescription>Diese Daten erscheinen auf Ihrer digitalen Visitenkarte.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="slug">Username / Handle (für Ihre URL)</Label>
                            <div className="space-y-2">
                                <div className="relative">
                                    <Input id="slug" name="slug" value={username} onChange={(e) => checkUsername(e.target.value)} placeholder="fabian" className={`bg-input border-border pr-10 ${usernameStatus === 'available' ? 'border-green-500 ring-green-500/20' : usernameStatus === 'taken' || usernameStatus === 'invalid' ? 'border-red-500 ring-red-500/20' : ''}`} />
                                    <div className="absolute right-3 top-2.5">
                                        {usernameStatus === 'loading' && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                                        {usernameStatus === 'available' && <Check className="w-4 h-4 text-green-500" />}
                                        {(usernameStatus === 'taken' || usernameStatus === 'invalid') && <AlertCircle className="w-4 h-4 text-red-500" />}
                                    </div>
                                </div>
                                {usernameMessage && (
                                    <p className={`text-xs ${usernameStatus === 'available' ? 'text-green-500' : usernameStatus === 'taken' || usernameStatus === 'invalid' ? 'text-red-500' : 'text-muted-foreground'}`}>{usernameMessage}</p>
                                )}
                                <div className="flex justify-between items-center">
                                    <p className="text-[10px] text-muted-foreground">Ihre öffentliche URL: <code className="bg-muted px-1 rounded">nfc.wear/p/{username || "..."}</code></p>
                                    {user?.slug && (
                                        <Button type="button" variant="outline" size="sm" asChild title="Profil öffnen">
                                            <a href={`/p/${user.slug}`} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="h-3 w-3 mr-1" /> Öffnen
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="grid gap-2"><Label htmlFor="name">Name</Label><Input id="name" name="name" defaultValue={user?.name} className="bg-input border-border" /></div>
                        <div className="grid gap-2"><Label htmlFor="title">Job Title</Label><Input id="title" name="title" defaultValue={user?.job_title} className="bg-input border-border" /></div>
                        <div className="grid gap-2"><Label htmlFor="bio">Bio</Label><Textarea id="bio" name="bio" defaultValue={user?.bio} className="bg-input border-border" /></div>
                        <div className="grid gap-2"><Label htmlFor="email">Kontakt E-Mail (öffentlich)</Label><Input id="email" name="email" type="email" defaultValue={user?.email} className="bg-input border-border" /></div>
                        <div className="grid gap-2"><Label htmlFor="phone">Telefon</Label><Input id="phone" name="phone" type="tel" defaultValue={user?.phone} className="bg-input border-border" /></div>
                        <div className="grid gap-2"><Label htmlFor="website">Webseite</Label><Input id="website" name="website" defaultValue={user?.website} className="bg-input border-border" /></div>
                        <div className="grid gap-2"><Label htmlFor="linkedin">LinkedIn URL</Label><Input id="linkedin" name="linkedin" defaultValue={user?.linkedin_url} className="bg-input border-border" /></div>
                        <Button type="submit" className="w-fit bg-primary text-primary-foreground hover:bg-primary/90" disabled={saving || (!isAvailable && username !== user?.slug)}>
                            {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                            Profil Speichern
                        </Button>
                    </CardContent>
                </Card>
            </form>

            {/* Custom Links */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle>Zusätzliche Links</CardTitle>
                    <CardDescription>Fügen Sie eigene Links hinzu (z.B. Calendly, Portfolio, Social Media).</CardDescription>
                </CardHeader>
                <CardContent>
                    <CustomLinksEditor links={customLinks} onChange={setCustomLinks} />
                    <p className="text-xs text-muted-foreground mt-3">Klicken Sie &quot;Profil Speichern&quot; oben, um die Links zu übernehmen.</p>
                </CardContent>
            </Card>

            {/* Accent Color */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle>Button-Farbe</CardTitle>
                    <CardDescription>Passen Sie die Akzentfarbe für Buttons und Icons in Ihrem Profil an.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            value={user?.accent_color || "#4f46e5"}
                            onChange={(e) => handleAccentColorSave(e.target.value)}
                            className="w-12 h-10 rounded-lg border border-border cursor-pointer bg-transparent"
                        />
                        <span className="text-sm text-muted-foreground font-mono">{user?.accent_color || "#4f46e5"}</span>
                        <div className="flex gap-2 ml-auto">
                            {["#4f46e5", "#2563eb", "#7c3aed", "#dc2626", "#059669", "#d97706", "#ec4899", "#06b6d4"].map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    className={`w-8 h-8 rounded-full border-2 transition-all ${user?.accent_color === color ? "border-blue-500 scale-110" : "border-border hover:border-zinc-400"}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => handleAccentColorSave(color)}
                                />
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Messe-Features */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle>Messe-Features</CardTitle>
                    <CardDescription>Gutscheincodes, Countdown-Timer und mehr für Events und Messen.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Coupon */}
                    <div className="space-y-3">
                        <Label className="text-base font-medium">Gutscheincode</Label>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label htmlFor="coupon-code" className="text-xs text-muted-foreground">Code</Label>
                                <Input
                                    id="coupon-code"
                                    placeholder="MESSE2026"
                                    value={user?.coupon_code || ""}
                                    onChange={(e) => handleMesfeFeatureSave("coupon_code", e.target.value)}
                                    className="bg-input border-border font-mono"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="coupon-desc" className="text-xs text-muted-foreground">Beschreibung</Label>
                                <Input
                                    id="coupon-desc"
                                    placeholder="10% Rabatt auf Ihren Einkauf"
                                    value={user?.coupon_description || ""}
                                    onChange={(e) => handleMesfeFeatureSave("coupon_description", e.target.value)}
                                    className="bg-input border-border"
                                />
                            </div>
                        </div>
                        {user?.coupon_code && (
                            <Button type="button" variant="ghost" size="sm" className="text-red-400" onClick={() => { handleMesfeFeatureSave("coupon_code", null); handleMesfeFeatureSave("coupon_description", null); }}>
                                <X className="h-3 w-3 mr-1" /> Gutschein entfernen
                            </Button>
                        )}
                    </div>

                    {/* Countdown */}
                    <div className="space-y-3">
                        <Label className="text-base font-medium">Countdown-Timer</Label>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label htmlFor="countdown-target" className="text-xs text-muted-foreground">Zieldatum & Uhrzeit</Label>
                                <Input
                                    id="countdown-target"
                                    type="datetime-local"
                                    value={user?.countdown_target ? new Date(user.countdown_target).toISOString().slice(0, 16) : ""}
                                    onChange={(e) => handleMesfeFeatureSave("countdown_target", e.target.value ? new Date(e.target.value).toISOString() : null)}
                                    className="bg-input border-border"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="countdown-label" className="text-xs text-muted-foreground">Label</Label>
                                <Input
                                    id="countdown-label"
                                    placeholder="Event startet in..."
                                    value={user?.countdown_label || ""}
                                    onChange={(e) => handleMesfeFeatureSave("countdown_label", e.target.value)}
                                    className="bg-input border-border"
                                />
                            </div>
                        </div>
                        {user?.countdown_target && (
                            <Button type="button" variant="ghost" size="sm" className="text-red-400" onClick={() => { handleMesfeFeatureSave("countdown_target", null); handleMesfeFeatureSave("countdown_label", null); }}>
                                <X className="h-3 w-3 mr-1" /> Timer entfernen
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Template Selector */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle>Profil-Vorlage</CardTitle>
                    <CardDescription>
                        Wählen Sie ein Design für Ihre digitale Visitenkarte.
                        {user?.slug && (
                            <a href={`/p/${user.slug}`} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-400 hover:text-blue-300 inline-flex items-center gap-1">
                                Vorschau <ExternalLink className="h-3 w-3" />
                            </a>
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <TemplateSelector activeTemplateId={activeTemplate} onSelect={setActiveTemplate} />
                    <p className="text-xs text-muted-foreground mt-3">Klicken Sie &quot;Profil Speichern&quot; oben, um die Vorlage zu übernehmen.</p>
                </CardContent>
            </Card>

            {/* Presets */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle>Profil-Presets</CardTitle>
                    <CardDescription>Speichern Sie verschiedene Konfigurationen und wechseln Sie schnell zwischen Events.</CardDescription>
                </CardHeader>
                <CardContent>
                    {user?.id && (
                        <PresetManager
                            userId={user.id}
                            currentConfig={getCurrentPresetConfig()}
                            onActivate={handlePresetActivate}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Background Settings */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle>Profil-Hintergrund</CardTitle>
                    <CardDescription>Wählen Sie eine Hintergrundfarbe oder laden Sie ein Hintergrundbild für Ihr Profil hoch.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="bg-color">Hintergrundfarbe</Label>
                        <div className="flex items-center gap-3">
                            <input type="color" id="bg-color" value={user?.background_color || "#0a0a0a"} onChange={(e) => { setUser({ ...user, background_color: e.target.value }); handleBackgroundColorSave(e.target.value); }} className="w-12 h-10 rounded-lg border border-border cursor-pointer bg-transparent" />
                            <span className="text-sm text-muted-foreground font-mono">{user?.background_color || "#0a0a0a"}</span>
                            <div className="flex gap-2 ml-auto">
                                {["#0a0a0a", "#1a1a2e", "#0f172a", "#1c1917", "#052e16"].map((color) => (
                                    <button key={color} type="button" className={`w-8 h-8 rounded-full border-2 transition-all ${user?.background_color === color ? "border-blue-500 scale-110" : "border-border hover:border-zinc-400"}`} style={{ backgroundColor: color }} onClick={() => { setUser({ ...user, background_color: color }); handleBackgroundColorSave(color); }} />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Hintergrundbild</Label>
                        {user?.background_image ? (
                            <div className="relative rounded-xl overflow-hidden border border-border">
                                <img src={user.background_image} alt="Background" className="w-full h-32 object-cover" style={{ objectPosition: user?.background_position || '50% 50%' }} />
                                <Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => handleBackgroundImageRemove()}>
                                    <X className="h-4 w-4 mr-1" /> Entfernen
                                </Button>
                            </div>
                        ) : (
                            <div>
                                <label className="flex flex-col items-center justify-center h-28 rounded-xl border-2 border-dashed border-border hover:border-zinc-400 cursor-pointer transition-colors">
                                    <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                                    <span className="text-sm text-muted-foreground">Bild hochladen</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleBackgroundImageUpload(e.target.files?.[0])} />
                                </label>
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground">Das Hintergrundbild wird hinter der Profilkarte angezeigt. Empfohlene Größe: 1080x1920px.</p>
                        {user?.background_image && (
                            <FocalPointPicker
                                imageUrl={user.background_image}
                                position={user?.background_position || "50% 50%"}
                                onChange={(pos) => handleMesfeFeatureSave("background_position", pos)}
                                aspectRatio="9/16"
                                label="Hintergrund-Ausschnitt anpassen"
                            />
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="banner-color">Banner-Farbe</Label>
                        <p className="text-xs text-muted-foreground">Wird als farbiger Banner angezeigt, wenn kein Banner-Bild hochgeladen ist.</p>
                        <div className="flex items-center gap-3">
                            <input type="color" id="banner-color" value={user?.banner_color || "#4f46e5"} onChange={(e) => { setUser({ ...user, banner_color: e.target.value }); handleBannerColorSave(e.target.value); }} className="w-12 h-10 rounded-lg border border-border cursor-pointer bg-transparent" />
                            <span className="text-sm text-muted-foreground font-mono">{user?.banner_color || "#4f46e5"}</span>
                            <div className="flex gap-2 ml-auto">
                                {["#4f46e5", "#2563eb", "#7c3aed", "#dc2626", "#059669", "#d97706"].map((color) => (
                                    <button key={color} type="button" className={`w-8 h-8 rounded-full border-2 transition-all ${user?.banner_color === color ? "border-blue-500 scale-110" : "border-border hover:border-zinc-400"}`} style={{ backgroundColor: color }} onClick={() => { setUser({ ...user, banner_color: color }); handleBannerColorSave(color); }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Ghost Mode */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle>Ghost-Modus</CardTitle>
                    <CardDescription>Machen Sie Ihr Profil temporär unsichtbar für NFC-Scanner.</CardDescription>
                </CardHeader>
                <CardContent>
                    <GhostModeToggle ghostMode={user?.ghost_mode || false} ghostModeUntil={user?.ghost_mode_until || null} onChange={handleGhostModeChange} saving={ghostSaving} />
                </CardContent>
            </Card>

            {/* Webhook Integration */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle>Integrationen</CardTitle>
                    <CardDescription>Verbinden Sie externe Tools wie Zapier oder Make.</CardDescription>
                </CardHeader>
                <CardContent>
                    <WebhookSettings webhookUrl={user?.webhook_url || null} authUserId={authUser?.id || ""} email={user?.email || authUser?.email || ""} onChange={(url) => setUser({ ...user, webhook_url: url })} />
                </CardContent>
            </Card>
        </div>
    );
}
