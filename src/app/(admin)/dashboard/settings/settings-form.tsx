"use client";

import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { updateProfile } from "@/lib/actions/users";
// import { useToast } from "@/components/ui/use-toast"; // Ensure this mock/hook exists or remove if buggy

export function SettingsForm({ user }: { user: any }) {
    // const { toast } = useToast(); 

    async function handleSave(formData: FormData) {
        const res = await updateProfile(formData);
        if (res?.error) {
            alert(res.error);
        } else {
            alert("Profil aktualisiert!");
        }
    }

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Einstellungen</h1>
                <p className="text-zinc-500">Verwalten Sie Ihr Profil und Integrationen.</p>
            </div>

            {/* REAL PROFILE EDITOR */}
            <form action={handleSave}>
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
                                Ihre öffentliche URL: <code className="bg-white/10 px-1 rounded">nfc.wear/p/{user?.slug || '...'}</code>
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
                            <Input id="linkedin" name="linkedin" defaultValue={user?.linkedin_url || user?.social_links?.linkedin} className="bg-black/50 border-white/10" />
                        </div>
                        <Button type="submit" className="w-fit bg-white text-black hover:bg-zinc-200">
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
                    {/* Salesforce */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Salesforce CRM</Label>
                            <p className="text-sm text-zinc-500">Kontakte automatisch mit Salesforce synchronisieren.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-yellow-500" />
                            <span className="text-xs text-zinc-500 uppercase">Ausstehend</span>
                            <Button variant="outline" size="sm" className="ml-2 border-white/10">Verbinden</Button>
                        </div>
                    </div>
                    {/* ... other integrations kept as static ... */}
                </CardContent>
            </Card>
        </div>
    );
}