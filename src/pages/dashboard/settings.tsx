import { useEffect, useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
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

export default function SettingsPage() {
    const { user: authUser } = useAuth();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [ghostSaving, setGhostSaving] = useState(false);
    const [activeTemplate, setActiveTemplate] = useState("premium-gradient");

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
        const field = type === "profile" ? "profile_pic" : "banner_pic";
        await supabase.from("users").upsert({
            auth_user_id: authUser.id,
            email: user?.email || authUser.email,
            [field]: url,
            updated_at: new Date().toISOString()
        } as any, { onConflict: "auth_user_id" });
        setUser({ ...user, [field]: url });
    }

    async function handleImageRemoved(type: "profile" | "banner") {
        if (!authUser) return;
        const field = type === "profile" ? "profile_pic" : "banner_pic";
        await supabase.from("users").upsert({
            auth_user_id: authUser.id,
            email: user?.email || authUser.email,
            [field]: null,
            updated_at: new Date().toISOString()
        } as any, { onConflict: "auth_user_id" });
        setUser({ ...user, [field]: null });
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
                            <div className="flex gap-2">
                                <Input id="slug" name="slug" defaultValue={user?.slug} placeholder="fabian" className="bg-input border-border" />
                                {user?.slug && (
                                    <Button type="button" variant="outline" size="icon" asChild title="Profil öffnen">
                                        <a href={`/p/${user.slug}`} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </Button>
                                )}
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                                Ihre öffentliche URL: <code className="bg-muted px-1 rounded">nfc.wear/p/{user?.slug || "..."}</code>
                            </p>
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
                        <Button type="submit" className="w-fit bg-primary text-primary-foreground hover:bg-primary/90" disabled={saving}>
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
