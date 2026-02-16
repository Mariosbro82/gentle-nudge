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
import { useUsernameAvailability } from "@/hooks/use-username-availability";
import { Check, AlertCircle } from "lucide-react";

export default function SettingsPage() {
    const { user: authUser } = useAuth();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [ghostSaving, setGhostSaving] = useState(false);
    const [activeTemplate, setActiveTemplate] = useState("premium-gradient");

    // Username checker
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
                email: user?.email || authUser.email, // Important: email is required for upsert if it's a new row, though unlikely here
                [field]: url,
                updated_at: new Date().toISOString()
            } as any, { onConflict: "auth_user_id" });

            if (error) {
                console.error("Error saving image URL:", error);
                alert(`Fehler beim Speichern: ${error.message}`);
                return;
            }

            setUser({ ...user, [field]: url });
            alert(type === "profile" ? "Profilbild aktualisiert!" : "Banner aktualisiert!");
        } catch (err: any) {
            console.error("Unexpected error:", err);
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

            if (error) {
                console.error("Error removing image:", error);
                alert(`Fehler beim Löschen: ${error.message}`);
                return;
            }

            setUser({ ...user, [field]: null });
            alert("Bild erfolgreich entfernt.");
        } catch (err: any) {
            console.error("Unexpected error:", err);
            alert(`Ein unerwarteter Fehler ist aufgetreten: ${err.message || err}`);
        }
    }

    async function handleGhostModeChange(enabled: boolean, until: string | null) {
        setGhostSaving(true);
        const { error } = await supabase
            .from("users")
            .update({ ghost_mode: enabled, ghost_mode_until: until })
            .eq("auth_user_id", authUser?.id || "");

        if (!error) {
            setUser({ ...user, ghost_mode: enabled, ghost_mode_until: until });
        }
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
                    <ImageUpload
                        type="profile"
                        currentUrl={user?.profile_pic}
                        authUserId={authUser?.id || ""}
                        onUploaded={(url) => handleImageUploaded("profile", url)}
                        onRemoved={() => handleImageRemoved("profile")}
                    />
                    <ImageUpload
                        type="banner"
                        currentUrl={user?.banner_pic}
                        authUserId={authUser?.id || ""}
                        onUploaded={(url) => handleImageUploaded("banner", url)}
                        onRemoved={() => handleImageRemoved("banner")}
                    />
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
                                    <Input
                                        id="slug"
                                        name="slug"
                                        value={username}
                                        onChange={(e) => checkUsername(e.target.value)}
                                        placeholder="fabian"
                                        className={`bg-input border-border pr-10 ${usernameStatus === 'available' ? 'border-green-500 ring-green-500/20' :
                                            usernameStatus === 'taken' || usernameStatus === 'invalid' ? 'border-red-500 ring-red-500/20' : ''
                                            }`}
                                    />
                                    <div className="absolute right-3 top-2.5">
                                        {usernameStatus === 'loading' && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                                        {usernameStatus === 'available' && <Check className="w-4 h-4 text-green-500" />}
                                        {(usernameStatus === 'taken' || usernameStatus === 'invalid') && <AlertCircle className="w-4 h-4 text-red-500" />}
                                    </div>
                                </div>

                                {usernameMessage && (
                                    <p className={`text-xs ${usernameStatus === 'available' ? 'text-green-500' :
                                        usernameStatus === 'taken' || usernameStatus === 'invalid' ? 'text-red-500' : 'text-muted-foreground'
                                        }`}>
                                        {usernameMessage}
                                    </p>
                                )}

                                <div className="flex justify-between items-center">
                                    <p className="text-[10px] text-muted-foreground">
                                        Ihre öffentliche URL: <code className="bg-muted px-1 rounded">nfc.wear/p/{username || "..."}</code>
                                    </p>
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
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" defaultValue={user?.name} className="bg-input border-border" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="title">Job Title</Label>
                            <Input id="title" name="title" defaultValue={user?.job_title} className="bg-input border-border" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea id="bio" name="bio" defaultValue={user?.bio} className="bg-input border-border" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Kontakt E-Mail (öffentlich)</Label>
                            <Input id="email" name="email" type="email" defaultValue={user?.email} className="bg-input border-border" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Telefon</Label>
                            <Input id="phone" name="phone" type="tel" defaultValue={user?.phone} className="bg-input border-border" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="website">Webseite</Label>
                            <Input id="website" name="website" defaultValue={user?.website} className="bg-input border-border" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="linkedin">LinkedIn URL</Label>
                            <Input id="linkedin" name="linkedin" defaultValue={user?.linkedin_url} className="bg-input border-border" />
                        </div>
                        <Button type="submit" className="w-fit bg-primary text-primary-foreground hover:bg-primary/90" disabled={saving || (!isAvailable && username !== user?.slug)}>
                            {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                            Profil Speichern
                        </Button>
                    </CardContent>
                </Card>
            </form>

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
                    <TemplateSelector
                        activeTemplateId={activeTemplate}
                        onSelect={setActiveTemplate}
                    />
                    <p className="text-xs text-muted-foreground mt-3">
                        Klicken Sie &quot;Profil Speichern&quot; oben, um die Vorlage zu übernehmen.
                    </p>
                </CardContent>
            </Card>

            {/* Background Settings */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle>Profil-Hintergrund</CardTitle>
                    <CardDescription>Wählen Sie eine Hintergrundfarbe oder laden Sie ein Hintergrundbild für Ihr Profil hoch.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Background Color */}
                    <div className="space-y-2">
                        <Label htmlFor="bg-color">Hintergrundfarbe</Label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                id="bg-color"
                                value={user?.background_color || "#0a0a0a"}
                                onChange={(e) => {
                                    setUser({ ...user, background_color: e.target.value });
                                    handleBackgroundColorSave(e.target.value);
                                }}
                                className="w-12 h-10 rounded-lg border border-border cursor-pointer bg-transparent"
                            />
                            <span className="text-sm text-muted-foreground font-mono">{user?.background_color || "#0a0a0a"}</span>
                            <div className="flex gap-2 ml-auto">
                                {["#0a0a0a", "#1a1a2e", "#0f172a", "#1c1917", "#052e16"].map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        className={`w-8 h-8 rounded-full border-2 transition-all ${user?.background_color === color ? "border-blue-500 scale-110" : "border-border hover:border-zinc-400"}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => {
                                            setUser({ ...user, background_color: color });
                                            handleBackgroundColorSave(color);
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Background Image */}
                    <div className="space-y-2">
                        <Label>Hintergrundbild</Label>
                        {user?.background_image ? (
                            <div className="relative rounded-xl overflow-hidden border border-border">
                                <img src={user.background_image} alt="Background" className="w-full h-32 object-cover" />
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-2 right-2"
                                    onClick={() => handleBackgroundImageRemove()}
                                >
                                    <X className="h-4 w-4 mr-1" /> Entfernen
                                </Button>
                            </div>
                        ) : (
                            <div>
                                <label className="flex flex-col items-center justify-center h-28 rounded-xl border-2 border-dashed border-border hover:border-zinc-400 cursor-pointer transition-colors">
                                    <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                                    <span className="text-sm text-muted-foreground">Bild hochladen</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleBackgroundImageUpload(e.target.files?.[0])}
                                    />
                                </label>
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Das Hintergrundbild wird hinter der Profilkarte angezeigt. Empfohlene Größe: 1080x1920px.
                        </p>
                    </div>

                    {/* Banner Color */}
                    <div className="space-y-2">
                        <Label htmlFor="banner-color">Banner-Farbe</Label>
                        <p className="text-xs text-muted-foreground">Wird als farbiger Banner angezeigt, wenn kein Banner-Bild hochgeladen ist.</p>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                id="banner-color"
                                value={user?.banner_color || "#4f46e5"}
                                onChange={(e) => {
                                    setUser({ ...user, banner_color: e.target.value });
                                    handleBannerColorSave(e.target.value);
                                }}
                                className="w-12 h-10 rounded-lg border border-border cursor-pointer bg-transparent"
                            />
                            <span className="text-sm text-muted-foreground font-mono">{user?.banner_color || "#4f46e5"}</span>
                            <div className="flex gap-2 ml-auto">
                                {["#4f46e5", "#2563eb", "#7c3aed", "#dc2626", "#059669", "#d97706"].map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        className={`w-8 h-8 rounded-full border-2 transition-all ${user?.banner_color === color ? "border-blue-500 scale-110" : "border-border hover:border-zinc-400"}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => {
                                            setUser({ ...user, banner_color: color });
                                            handleBannerColorSave(color);
                                        }}
                                    />
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
                    <GhostModeToggle
                        ghostMode={user?.ghost_mode || false}
                        ghostModeUntil={user?.ghost_mode_until || null}
                        onChange={handleGhostModeChange}
                        saving={ghostSaving}
                    />
                </CardContent>
            </Card>

            {/* Webhook Integration */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle>Integrationen</CardTitle>
                    <CardDescription>Verbinden Sie externe Tools wie Zapier oder Make.</CardDescription>
                </CardHeader>
                <CardContent>
                    <WebhookSettings
                        webhookUrl={user?.webhook_url || null}
                        authUserId={authUser?.id || ""}
                        email={user?.email || authUser?.email || ""}
                        onChange={(url) => setUser({ ...user, webhook_url: url })}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
