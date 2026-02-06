import { useEffect, useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";

export default function SettingsPage() {
    const { user: authUser } = useAuth();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function fetchProfile() {
            if (!authUser) return;

            const { data: profile } = await supabase
                .from("users")
                .select("*")
                .eq("auth_user_id", authUser.id)
                .single();

            setUser(profile || { name: "", email: authUser.email, id: authUser.id });
            setLoading(false);
        }

        fetchProfile();
    }, [authUser]);

    async function handleSave(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSaving(true);

        const formData = new FormData(e.currentTarget);
        const updates = {
            slug: formData.get("slug") as string,
            name: formData.get("name") as string,
            job_title: formData.get("title") as string,
            bio: formData.get("bio") as string,
            website: formData.get("website") as string,
            linkedin_url: formData.get("linkedin") as string,
        };

        const { error } = await supabase.from("users").update(updates).eq("auth_user_id", authUser?.id || "");

        if (error) {
            alert(error.message);
        } else {
            alert("Profil aktualisiert!");
            setUser({ ...user, ...updates });
        }
        setSaving(false);
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
                <p className="text-zinc-500">Verwalten Sie Ihr Profil und Integrationen.</p>
            </div>

            <form onSubmit={handleSave}>
                <Card className="bg-zinc-900/50 border-white/5 mb-8">
                    <CardHeader>
                        <CardTitle>Persönliches Profil</CardTitle>
                        <CardDescription>Diese Daten erscheinen auf Ihrer digitalen Visitenkarte.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="slug">Username / Handle (für Ihre URL)</Label>
                            <div className="flex gap-2">
                                <Input id="slug" name="slug" defaultValue={user?.slug} placeholder="fabian" className="bg-black/50 border-white/10" />
                                {user?.slug && (
                                    <Button type="button" variant="outline" size="icon" asChild title="Profil öffnen">
                                        <a href={`/p/${user.slug}`} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </Button>
                                )}
                            </div>
                            <p className="text-[10px] text-zinc-500">
                                Ihre öffentliche URL: <code className="bg-white/10 px-1 rounded">nfc.wear/p/{user?.slug || "..."}</code>
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" defaultValue={user?.name} className="bg-black/50 border-white/10" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="title">Job Title</Label>
                            <Input id="title" name="title" defaultValue={user?.job_title} className="bg-black/50 border-white/10" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea id="bio" name="bio" defaultValue={user?.bio} className="bg-black/50 border-white/10" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="website">Webseite</Label>
                            <Input id="website" name="website" defaultValue={user?.website} className="bg-black/50 border-white/10" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="linkedin">LinkedIn URL</Label>
                            <Input id="linkedin" name="linkedin" defaultValue={user?.linkedin_url} className="bg-black/50 border-white/10" />
                        </div>
                        <Button type="submit" className="w-fit bg-white text-black hover:bg-zinc-200" disabled={saving}>
                            {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                            Profil Speichern
                        </Button>
                    </CardContent>
                </Card>
            </form>

            <Card className="bg-zinc-900/50 border-white/5 disabled opacity-60">
                <CardHeader>
                    <CardTitle>Globale Integrationen (Coming Soon)</CardTitle>
                    <CardDescription>Verbinden Sie Ihre externen Tools.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pointer-events-none">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Salesforce CRM</Label>
                            <p className="text-sm text-zinc-500">Kontakte automatisch mit Salesforce synchronisieren.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-yellow-500" />
                            <span className="text-xs text-zinc-500 uppercase">Ausstehend</span>
                            <Button variant="outline" size="sm" className="ml-2 border-white/10">
                                Verbinden
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
