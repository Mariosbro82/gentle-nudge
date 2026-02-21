import { useEffect, useState, useMemo } from "react";
import { ExternalLink, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";
import { ImageUpload } from "@/components/settings/image-upload";
import { TemplateSelector } from "@/components/settings/template-selector";
import { GhostModeToggle } from "@/components/settings/ghost-mode-toggle";
import { WebhookSettings } from "@/components/settings/webhook-settings";
import { CustomLinksEditor } from "@/components/settings/custom-links-editor";
import { PresetManager } from "@/components/settings/preset-manager";
import { FocalPointPicker } from "@/components/settings/focal-point-picker";
import { VideoUpload } from "@/components/settings/video-upload";
import { FileVaultManager } from "@/components/settings/file-vault-manager";
import { PhonePreview3D } from "@/components/settings/phone-preview-3d";
import { LiveStatusWidget } from "@/components/dashboard/live-status-widget";
import { ModeSwitcher, ModeContent, type DashboardMode } from "@/components/settings/mode-switcher";
import { useUsernameAvailability } from "@/hooks/use-username-availability";
import { Check, AlertCircle } from "lucide-react";
import type { CustomLink, ProfileUser } from "@/types/profile";
import { FeatureGate } from "@/components/dashboard/feature-gate";
import type { PlanType } from "@/lib/plan-features";

export default function SettingsPage() {
    const { user: authUser } = useAuth();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [ghostSaving, setGhostSaving] = useState(false);
    const [activeTemplate, setActiveTemplate] = useState("premium-gradient");
    const [customLinks, setCustomLinks] = useState<CustomLink[]>([]);
    const [dashboardMode, setDashboardMode] = useState<DashboardMode>("corporate");
    const [userPlan, setUserPlan] = useState<PlanType>("starter");

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

            // Fetch plan from organization
            if (p?.id) {
                const { data: membership } = await supabase
                    .from("organization_members")
                    .select("organization_id")
                    .eq("user_id", p.id)
                    .maybeSingle();
                if (membership?.organization_id) {
                    const { data: org } = await supabase
                        .from("organizations")
                        .select("plan")
                        .eq("id", membership.organization_id)
                        .single();
                    if (org?.plan) setUserPlan(org.plan as PlanType);
                } else if (p?.company_id) {
                    const { data: company } = await supabase
                        .from("companies")
                        .select("plan")
                        .eq("id", p.company_id)
                        .single();
                    if (company?.plan) setUserPlan(company.plan as PlanType);
                }
            }

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
        setUser({ ...user, background_color: color });
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
        setUser({ ...user, banner_color: color });
        await supabase.from("users").update({ banner_color: color, updated_at: new Date().toISOString() } as any).eq("auth_user_id", authUser.id);
    }

    async function handleAccentColorSave(color: string) {
        if (!authUser) return;
        setUser({ ...user, accent_color: color });
        await supabase.from("users").update({ accent_color: color, updated_at: new Date().toISOString() } as any).eq("auth_user_id", authUser.id);
    }

    async function handleMesfeFeatureSave(field: string, value: any) {
        if (!authUser) return;
        setUser((prev: any) => ({ ...prev, [field]: value }));
        await supabase.from("users").update({ [field]: value, updated_at: new Date().toISOString() } as any).eq("auth_user_id", authUser.id);
    }

    async function handleMesfeFeatureBatchSave(updates: Record<string, any>) {
        if (!authUser) return;
        setUser((prev: any) => ({ ...prev, ...updates }));
        await supabase.from("users").update({ ...updates, updated_at: new Date().toISOString() } as any).eq("auth_user_id", authUser.id);
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
        }
    }

    const previewUser: ProfileUser = useMemo(() => ({
        id: user?.id || "",
        name: user?.name || "Ihr Name",
        title: user?.job_title || "",
        company: user?.company_name || "",
        bio: user?.bio || "",
        email: user?.email || "",
        phone: user?.phone || "",
        website: user?.website || "",
        linkedin: user?.linkedin_url || "",
        avatar: user?.profile_pic || "",
        banner: user?.banner_pic || "",
        activeTemplate: activeTemplate,
        ghostMode: false,
        ghostModeUntil: null,
        backgroundImage: user?.background_image || "",
        backgroundColor: user?.background_color || "#0a0a0a",
        bannerColor: user?.banner_color || "#4f46e5",
        accentColor: user?.accent_color || "#4f46e5",
        customLinks: customLinks,
        couponCode: user?.coupon_code || "",
        couponDescription: user?.coupon_description || "",
        countdownTarget: user?.countdown_target || null,
        countdownLabel: user?.countdown_label || "",
        profilePicPosition: user?.profile_pic_position || "50% 50%",
        bannerPicPosition: user?.banner_pic_position || "50% 50%",
        backgroundPosition: user?.background_position || "50% 50%",
        videoUrl: user?.video_url || "",
        customGreeting: user?.custom_greeting || "Willkommen auf meinem Profil 👋",
        avatarStyle: user?.avatar_style || "image",
        avatarEmoji: user?.avatar_emoji || "👋",
    }), [user, activeTemplate, customLinks]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
            {/* Settings Column */}
            <div className="flex-1 min-w-0 space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">Einstellungen</h1>
                    <p className="text-sm text-muted-foreground mt-1">Verwalten Sie Ihr Profil und Ihre Integrationen.</p>
                </div>

                <div className="sticky top-0 z-30 py-3 -mx-4 px-4 md:-mx-8 md:px-8 bg-background/80 backdrop-blur-xl border-b border-border/50">
                    <ModeSwitcher mode={dashboardMode} onChange={setDashboardMode} />
                </div>

                <form onSubmit={handleSave} className="contents">

                {/* ═══════ ERSCHEINUNGSBILD ═══════ */}
                <div className="pt-2">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Erscheinungsbild</h2>
                </div>

                {/* ─── Profilbilder ─── */}
                <Card className="rounded-xl border-border/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Profilbild</CardTitle>
                        <CardDescription>Wird als rundes Avatar auf Ihrer Visitenkarte angezeigt.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ImageUpload type="profile" currentUrl={user?.profile_pic} authUserId={authUser?.id || ""} onUploaded={(url) => handleImageUploaded("profile", url)} onRemoved={() => handleImageRemoved("profile")} objectPosition={user?.profile_pic_position || "50% 50%"} />
                        {user?.profile_pic && (
                            <FocalPointPicker
                                imageUrl={user.profile_pic}
                                position={user?.profile_pic_position || "50% 50%"}
                                onChange={(pos) => handleMesfeFeatureSave("profile_pic_position", pos)}
                                aspectRatio="1/1"
                                label="Ausschnitt anpassen"
                            />
                        )}
                    </CardContent>
                </Card>

                {/* ─── Banner ─── */}
                <Card className="rounded-xl border-border/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Banner</CardTitle>
                        <CardDescription>Der obere Bereich Ihres Profils. Bild oder Farbe wählbar.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ImageUpload type="banner" currentUrl={user?.banner_pic} authUserId={authUser?.id || ""} onUploaded={(url) => handleImageUploaded("banner", url)} onRemoved={() => handleImageRemoved("banner")} objectPosition={user?.banner_pic_position || "50% 50%"} />
                        {user?.banner_pic && (
                            <FocalPointPicker
                                imageUrl={user.banner_pic}
                                position={user?.banner_pic_position || "50% 50%"}
                                onChange={(pos) => handleMesfeFeatureSave("banner_pic_position", pos)}
                                aspectRatio="4/1"
                                label="Ausschnitt anpassen"
                            />
                        )}

                        <Separator className="my-2" />

                        <div className="space-y-2">
                            <Label htmlFor="banner-color">Banner-Farbe (Fallback)</Label>
                            <p className="text-xs text-muted-foreground">Wird angezeigt wenn kein Banner-Bild hochgeladen ist.</p>
                            <div className="flex flex-wrap items-center gap-3">
                                <input type="color" id="banner-color" value={user?.banner_color || "#4f46e5"} onChange={(e) => handleBannerColorSave(e.target.value)} className="w-10 h-9 rounded-lg border border-border cursor-pointer bg-transparent flex-shrink-0" />
                                <span className="text-xs text-muted-foreground font-mono">{user?.banner_color || "#4f46e5"}</span>
                                <div className="flex gap-1.5 flex-wrap">
                                    {["#4f46e5", "#2563eb", "#7c3aed", "#dc2626", "#059669", "#d97706"].map((color) => (
                                        <button key={color} type="button" className={`w-7 h-7 rounded-full border-2 transition-all ${user?.banner_color === color ? "border-primary scale-110" : "border-border hover:border-muted-foreground/30"}`} style={{ backgroundColor: color }} onClick={() => handleBannerColorSave(color)} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ─── Trennlinie zwischen Banner & Hintergrund ─── */}
                <div className="relative flex items-center gap-3 py-1">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium whitespace-nowrap">Seitenhintergrund</span>
                    <div className="flex-1 h-px bg-border" />
                </div>

                {/* ─── Hintergrund ─── */}
                <Card className="rounded-xl border-border/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Hintergrund</CardTitle>
                        <CardDescription>Der gesamte Hintergrund hinter der Profilkarte.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="bg-color">Hintergrundfarbe</Label>
                            <div className="flex flex-wrap items-center gap-3">
                                <input type="color" id="bg-color" value={user?.background_color || "#0a0a0a"} onChange={(e) => handleBackgroundColorSave(e.target.value)} className="w-10 h-9 rounded-lg border border-border cursor-pointer bg-transparent flex-shrink-0" />
                                <span className="text-xs text-muted-foreground font-mono">{user?.background_color || "#0a0a0a"}</span>
                                <div className="flex gap-1.5 flex-wrap">
                                    {["#0a0a0a", "#1a1a2e", "#0f172a", "#1c1917", "#052e16"].map((color) => (
                                        <button key={color} type="button" className={`w-7 h-7 rounded-full border-2 transition-all ${user?.background_color === color ? "border-primary scale-110" : "border-border hover:border-muted-foreground/30"}`} style={{ backgroundColor: color }} onClick={() => handleBackgroundColorSave(color)} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Separator className="my-2" />

                        <div className="space-y-2">
                            <Label>Hintergrundbild</Label>
                            {user?.background_image ? (
                                <div className="relative rounded-xl overflow-hidden border border-border">
                                    <img src={user.background_image} alt="Background" className="w-full h-28 sm:h-32 object-cover" style={{ objectPosition: user?.background_position || '50% 50%' }} />
                                    <Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => handleBackgroundImageRemove()}>
                                        <X className="h-3 w-3 mr-1" /> Entfernen
                                    </Button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center h-24 sm:h-28 rounded-xl border-2 border-dashed border-border hover:border-muted-foreground/30 cursor-pointer transition-colors">
                                    <Upload className="h-5 w-5 text-muted-foreground mb-1.5" />
                                    <span className="text-xs text-muted-foreground">Bild hochladen</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleBackgroundImageUpload(e.target.files?.[0])} />
                                </label>
                            )}
                            <p className="text-[10px] text-muted-foreground">Empfohlene Größe: 1080×1920px</p>
                            {user?.background_image && (
                                <FocalPointPicker
                                    imageUrl={user.background_image}
                                    position={user?.background_position || "50% 50%"}
                                    onChange={(pos) => handleMesfeFeatureSave("background_position", pos)}
                                    aspectRatio="9/16"
                                    label="Ausschnitt anpassen"
                                />
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* ═══════ PERSÖNLICHE DATEN ═══════ */}
                <div className="pt-2">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Persönliche Daten</h2>
                </div>

                {/* ─── Persönliches Profil ─── */}
                <Card className="rounded-xl border-border/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Persönliches Profil</CardTitle>
                        <CardDescription>Diese Daten erscheinen auf Ihrer digitalen Visitenkarte.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="slug">Username / Handle</Label>
                            <div className="relative">
                                <Input id="slug" name="slug" value={username} onChange={(e) => checkUsername(e.target.value)} placeholder="fabian" className={`bg-input border-border pr-10 ${usernameStatus === 'available' ? 'border-green-500/50 ring-1 ring-green-500/20' : usernameStatus === 'taken' || usernameStatus === 'invalid' ? 'border-red-500/50 ring-1 ring-red-500/20' : ''}`} />
                                <div className="absolute right-3 top-2.5">
                                    {usernameStatus === 'loading' && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                                    {usernameStatus === 'available' && <Check className="w-4 h-4 text-green-500" />}
                                    {(usernameStatus === 'taken' || usernameStatus === 'invalid') && <AlertCircle className="w-4 h-4 text-red-500" />}
                                </div>
                            </div>
                            {usernameMessage && (
                                <p className={`text-xs ${usernameStatus === 'available' ? 'text-green-500' : usernameStatus === 'taken' || usernameStatus === 'invalid' ? 'text-red-500' : 'text-muted-foreground'}`}>{usernameMessage}</p>
                            )}
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                <p className="text-[10px] text-muted-foreground">URL: <code className="bg-muted px-1 rounded">nfc.wear/p/{username || "..."}</code></p>
                                {user?.slug && (
                                    <Button type="button" variant="outline" size="sm" asChild>
                                        <a href={`/p/${user.slug}`} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="h-3 w-3 mr-1" /> Profil öffnen
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" defaultValue={user?.name} className="bg-input border-border" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="title">Job Title</Label>
                                <Input id="title" name="title" defaultValue={user?.job_title} className="bg-input border-border" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea id="bio" name="bio" defaultValue={user?.bio} className="bg-input border-border min-h-[80px]" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="email">E-Mail (öffentlich)</Label>
                                <Input id="email" name="email" type="email" defaultValue={user?.email} className="bg-input border-border" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="phone">Telefon</Label>
                                <Input id="phone" name="phone" type="tel" defaultValue={user?.phone} className="bg-input border-border" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="website">Webseite</Label>
                                <Input id="website" name="website" defaultValue={user?.website} className="bg-input border-border" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="linkedin">LinkedIn URL</Label>
                                <Input id="linkedin" name="linkedin" defaultValue={user?.linkedin_url} className="bg-input border-border" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ─── Custom Links ─── */}
                <Card className="rounded-xl border-border/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Zusätzliche Links</CardTitle>
                        <CardDescription>Calendly, Portfolio, Social Media etc.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CustomLinksEditor links={customLinks} onChange={setCustomLinks} />
                    </CardContent>
                </Card>

                {/* ─── Akzentfarbe ─── */}
                <Card className="rounded-xl border-border/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Button-Farbe</CardTitle>
                        <CardDescription>Akzentfarbe für Buttons und Icons.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap items-center gap-3">
                            <input
                                type="color"
                                value={user?.accent_color || "#4f46e5"}
                                onChange={(e) => handleAccentColorSave(e.target.value)}
                                className="w-10 h-9 rounded-lg border border-border cursor-pointer bg-transparent flex-shrink-0"
                            />
                            <span className="text-xs text-muted-foreground font-mono">{user?.accent_color || "#4f46e5"}</span>
                            <div className="flex gap-1.5 flex-wrap">
                                {["#4f46e5", "#2563eb", "#7c3aed", "#dc2626", "#059669", "#d97706", "#ec4899", "#06b6d4"].map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        className={`w-7 h-7 rounded-full border-2 transition-all ${user?.accent_color === color ? "border-primary scale-110" : "border-border hover:border-muted-foreground/30"}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleAccentColorSave(color)}
                                    />
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ═══════ MODE-SPECIFIC SECTIONS ═══════ */}
                <ModeContent mode={dashboardMode}>
                {dashboardMode === "corporate" && (
                <div className="space-y-8">
                <div className="pt-2">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Messe & Events</h2>
                </div>
                <Card className="rounded-xl border-border/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Messe-Features</CardTitle>
                        <CardDescription>Gutscheincodes und Countdown-Timer für Events.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        {/* Coupon */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">Gutscheincode</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="coupon-code" className="text-xs text-muted-foreground">Code</Label>
                                    <Input id="coupon-code" placeholder="MESSE2026" value={user?.coupon_code || ""} onChange={(e) => handleMesfeFeatureSave("coupon_code", e.target.value)} className="bg-input border-border font-mono" />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="coupon-desc" className="text-xs text-muted-foreground">Beschreibung</Label>
                                    <Input id="coupon-desc" placeholder="10% Rabatt" value={user?.coupon_description || ""} onChange={(e) => handleMesfeFeatureSave("coupon_description", e.target.value)} className="bg-input border-border" />
                                </div>
                            </div>
                            {user?.coupon_code && (
                                <Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive/80 -ml-2" onClick={() => handleMesfeFeatureBatchSave({ coupon_code: null, coupon_description: null })}>
                                    <X className="h-3 w-3 mr-1" /> Entfernen
                                </Button>
                            )}
                        </div>
                        <Separator />
                        {/* Countdown */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">Countdown-Timer</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="countdown-target" className="text-xs text-muted-foreground">Zieldatum</Label>
                                    <Input id="countdown-target" type="datetime-local" value={user?.countdown_target ? new Date(user.countdown_target).toISOString().slice(0, 16) : ""} onChange={(e) => handleMesfeFeatureSave("countdown_target", e.target.value ? new Date(e.target.value).toISOString() : null)} className="bg-input border-border" />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="countdown-label" className="text-xs text-muted-foreground">Label</Label>
                                    <Input id="countdown-label" placeholder="Event startet in..." value={user?.countdown_label || ""} onChange={(e) => handleMesfeFeatureSave("countdown_label", e.target.value)} className="bg-input border-border" />
                                </div>
                            </div>
                            {user?.countdown_target && (
                                <Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive/80 -ml-2" onClick={() => handleMesfeFeatureBatchSave({ countdown_target: null, countdown_label: null })}>
                                    <X className="h-3 w-3 mr-1" /> Entfernen
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
                </div>
                )}

                {dashboardMode === "campaign" && (
                <div className="space-y-8">
                <div className="pt-2">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Kampagnen</h2>
                </div>
                <Card className="rounded-xl border-border/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Kampagnen-Steuerung</CardTitle>
                        <CardDescription>Leiten Sie alle NFC-Chips auf eine zentrale URL um.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="campaign-url">Ziel-URL</Label>
                            <Input id="campaign-url" placeholder="https://ihre-landingpage.de/messe" className="bg-input border-border" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="campaign-start" className="text-xs text-muted-foreground">Startdatum</Label>
                                <Input id="campaign-start" type="datetime-local" className="bg-input border-border" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="campaign-end" className="text-xs text-muted-foreground">Enddatum</Label>
                                <Input id="campaign-end" type="datetime-local" className="bg-input border-border" />
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">Im Kampagnen-Modus werden alle Chips Ihres Teams auf diese URL umgeleitet. Perfekt für Messen und Events.</p>
                    </CardContent>
                </Card>
                </div>
                )}

                {dashboardMode === "hospitality" && (
                <div className="space-y-8">
                <div className="pt-2">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Bewertungen</h2>
                </div>
                <Card className="rounded-xl border-border/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Review-Einstellungen</CardTitle>
                        <CardDescription>Konfigurieren Sie Ihre Google-Bewertungsseite und weitere Plattformen.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="google-review-url">Google Maps URL</Label>
                            <Input id="google-review-url" placeholder="https://g.page/r/IhrUnternehmen/review" className="bg-input border-border" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="tripadvisor-url">TripAdvisor URL (optional)</Label>
                            <Input id="tripadvisor-url" placeholder="https://tripadvisor.com/..." className="bg-input border-border" />
                        </div>
                        <p className="text-xs text-muted-foreground">Im Bewertungs-Modus werden Kunden direkt zu Ihrem Google-Bewertungsprofil weitergeleitet. Ideal für Gastronomie und Hotels.</p>
                    </CardContent>
                </Card>
                </div>
                )}
                </ModeContent>

                {/* ═══════ VORLAGEN & ERWEITERT ═══════ */}
                <div className="pt-2">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Vorlagen & Erweitert</h2>
                </div>

                {/* ─── Template ─── */}
                <Card className="rounded-xl border-border/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Profil-Vorlage</CardTitle>
                        <CardDescription>
                            Design für Ihre digitale Visitenkarte.
                            {user?.slug && (
                                <a href={`/p/${user.slug}`} target="_blank" rel="noopener noreferrer" className="ml-2 text-primary hover:text-primary/80 inline-flex items-center gap-1 text-xs">
                                    Vorschau <ExternalLink className="h-3 w-3" />
                                </a>
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TemplateSelector activeTemplateId={activeTemplate} onSelect={setActiveTemplate} />
                    </CardContent>
                </Card>

                {/* ─── Presets ─── */}
                <Card className="rounded-xl border-border/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Profil-Presets</CardTitle>
                        <CardDescription>Konfigurationen speichern und schnell wechseln.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {user?.id && (
                            <PresetManager
                                userId={user.id}
                                currentConfig={getCurrentPresetConfig()}
                                onActivate={handlePresetActivate}
                                baseUser={previewUser}
                            />
                        )}
                    </CardContent>
                </Card>

                {/* ─── Welcome Screen & Avatar ─── */}
                <Card className="rounded-xl border-border/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Welcome Screen & Avatar</CardTitle>
                        <CardDescription>Begrüßungstext und Avatar-Stil für die Scan-Animation.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        {/* Avatar Style Toggle */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Avatar-Typ</Label>
                            <div className="inline-flex rounded-lg border border-border bg-muted/30 p-0.5">
                                <button
                                    type="button"
                                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${(user?.avatar_style || "image") === "image" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                                    onClick={() => handleMesfeFeatureSave("avatar_style", "image")}
                                >
                                    📷 Eigenes Foto
                                </button>
                                <button
                                    type="button"
                                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${user?.avatar_style === "emoji" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                                    onClick={() => handleMesfeFeatureSave("avatar_style", "emoji")}
                                >
                                    🎭 Emoji / Icon
                                </button>
                            </div>
                        </div>

                        {/* Conditional: Emoji picker */}
                        {user?.avatar_style === "emoji" && (
                            <div className="space-y-2">
                                <Label htmlFor="avatar-emoji">Emoji / Icon</Label>
                                <Input
                                    id="avatar-emoji"
                                    value={user?.avatar_emoji || "👋"}
                                    maxLength={4}
                                    onChange={(e) => handleMesfeFeatureSave("avatar_emoji", e.target.value)}
                                    className="bg-input border-border w-24 text-center text-2xl"
                                    placeholder="👋"
                                />
                                <div className="flex gap-2 flex-wrap">
                                    {["👋", "🚀", "💼", "🎯", "⚡", "🔥", "💎", "🤝"].map((em) => (
                                        <button
                                            key={em}
                                            type="button"
                                            className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center border transition-all ${user?.avatar_emoji === em ? "border-primary bg-primary/10 scale-110" : "border-border hover:border-muted-foreground/50"}`}
                                            onClick={() => handleMesfeFeatureSave("avatar_emoji", em)}
                                        >
                                            {em}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Conditional: Photo hint */}
                        {(user?.avatar_style || "image") === "image" && (
                            <p className="text-xs text-muted-foreground">Dein Profilbild wird als animierter Avatar in der Begrüßung gezeigt. Lade es oben unter "Profilbild" hoch.</p>
                        )}

                        <Separator />

                        {/* Custom Greeting */}
                        <div className="space-y-2">
                            <Label htmlFor="custom-greeting">Begrüßungstext</Label>
                            <Textarea
                                id="custom-greeting"
                                value={user?.custom_greeting || "Willkommen auf meinem Profil 👋"}
                                maxLength={60}
                                rows={2}
                                onChange={(e) => handleMesfeFeatureSave("custom_greeting", e.target.value)}
                                className="bg-input border-border resize-none"
                                placeholder="Hey, schön dich kennenzulernen!"
                            />
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] text-muted-foreground">
                                    Variablen: <code className="bg-muted px-1 rounded">{"{{name}}"}</code> = dein Name
                                </p>
                                <span className="text-[10px] text-muted-foreground">
                                    {(user?.custom_greeting || "Willkommen auf meinem Profil 👋").length}/60
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ─── Video Greeting ─── */}
                <FeatureGate feature="video_greeting" plan={userPlan} label="Video-Begrüßung">
                <Card className="rounded-xl border-border/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Video-Begrüßung</CardTitle>
                        <CardDescription>Kurzes Loom-Style Greeting-Video für Ihr Profil.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <VideoUpload
                            currentUrl={user?.video_url || null}
                            authUserId={authUser?.id || ""}
                            onUploaded={async (url) => {
                                await supabase.from("users").update({ video_url: url, updated_at: new Date().toISOString() } as any).eq("auth_user_id", authUser?.id || "");
                                setUser({ ...user, video_url: url });
                            }}
                            onRemoved={async () => {
                                await supabase.from("users").update({ video_url: null, updated_at: new Date().toISOString() } as any).eq("auth_user_id", authUser?.id || "");
                                setUser({ ...user, video_url: null });
                            }}
                        />
                    </CardContent>
                </Card>
                </FeatureGate>

                {/* ─── File Vault ─── */}
                <Card className="rounded-xl border-border/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Dateien / Ressourcen</CardTitle>
                        <CardDescription>PDFs, Dokumente und Dateien, die auf Ihrem Profil angezeigt werden.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {user?.id && (
                            <FileVaultManager userId={user.id} authUserId={authUser?.id || ""} />
                        )}
                    </CardContent>
                </Card>

                {/* ═══════ DATENSCHUTZ & INTEGRATIONEN ═══════ */}
                <div className="pt-2">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Datenschutz & Integrationen</h2>
                </div>

                {/* ─── Live Status ─── */}
                <LiveStatusWidget
                    currentText={user?.live_status_text || null}
                    currentColor={user?.live_status_color || null}
                    userId={user?.id || ""}
                    onUpdate={(text, color) => setUser({ ...user, live_status_text: text, live_status_color: color })}
                />

                {/* ─── Ghost Mode ─── */}
                <Card className="rounded-xl border-border/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Ghost-Modus</CardTitle>
                        <CardDescription>Profil temporär unsichtbar für Scanner.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <GhostModeToggle ghostMode={user?.ghost_mode || false} ghostModeUntil={user?.ghost_mode_until || null} onChange={handleGhostModeChange} saving={ghostSaving} />
                    </CardContent>
                </Card>

                {/* ─── Integrationen ─── */}
                <FeatureGate feature="webhooks" plan={userPlan} label="Webhook-Integration">
                <Card className="rounded-xl border-border/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Integrationen</CardTitle>
                        <CardDescription>Externe Tools wie Zapier oder Make verbinden.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <WebhookSettings webhookUrl={user?.webhook_url || null} authUserId={authUser?.id || ""} email={user?.email || authUser?.email || ""} onChange={(url) => setUser({ ...user, webhook_url: url })} />
                    </CardContent>
                </Card>
                </FeatureGate>

                {/* ─── Sticky Save ─── */}
                <div className="sticky bottom-4 z-50 flex justify-end pb-2">
                    <Button type="submit" size="lg" className="rounded-xl shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all" disabled={saving || (!isAvailable && username !== user?.slug)}>
                        {saving && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                        Profil Speichern
                    </Button>
                </div>

                </form>
            </div>

            {/* ─── Sticky 3D Phone Preview (Desktop) ─── */}
            <aside className="hidden lg:block w-[340px] flex-shrink-0">
                <div className="sticky top-24 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-[11px] text-muted-foreground font-medium tracking-wide">Live-Vorschau</p>
                    </div>
                    <div className="flex justify-center w-full">
                        <PhonePreview3D user={previewUser} scale={1} rotateY={0} rotateX={0} />
                    </div>
                    {user?.slug && (
                        <Button variant="outline" size="sm" className="mt-5 text-xs" asChild>
                            <a href={`/p/${user.slug}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3 mr-1.5" />
                                Profil öffnen
                            </a>
                        </Button>
                    )}
                </div>
            </aside>
        </div>
    );
}
