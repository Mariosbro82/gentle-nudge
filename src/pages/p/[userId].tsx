import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Globe, Linkedin } from "lucide-react";
import { ContactForm } from "@/components/profile/contact-form";

export default function ProfilePage() {
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchUser() {
            if (!userId) return;

            // Try to fetch by slug first
            let { data } = await supabase.from("users").select("*").eq("slug", userId).single();

            // If not found by slug, try by ID
            if (!data) {
                const result = await supabase.from("users").select("*").eq("id", userId).single();
                data = result.data;
            }

            if (data) {
                setUser({
                    name: data.name || "No Name",
                    title: data.job_title || "",
                    company: data.company_name || "",
                    bio: data.bio || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    website: data.website || "",
                    linkedin: (data.social_links as any)?.linkedin || data.linkedin_url || "",
                    avatar: data.profile_pic || "",
                    id: data.id,
                });
            } else {
                setError(true);
            }
            setLoading(false);
        }

        fetchUser();
    }, [userId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-500">User not found</h1>
                    <p className="text-zinc-500 mt-2">Could not find profile for: {userId}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Banner */}
            <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600" />

            {/* Profile Card */}
            <div className="max-w-lg mx-auto px-4 -mt-16">
                <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
                    {/* Avatar */}
                    <div className="flex justify-center -mt-12 mb-4">
                        <div className="w-24 h-24 rounded-full bg-zinc-800 border-4 border-zinc-900 flex items-center justify-center text-2xl font-bold text-white">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                user.name.charAt(0).toUpperCase()
                            )}
                        </div>
                    </div>

                    {/* Name & Title */}
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold">{user.name}</h1>
                        {user.title && <p className="text-zinc-400">{user.title}</p>}
                        {user.company && <p className="text-zinc-500 text-sm">{user.company}</p>}
                    </div>

                    {/* Bio */}
                    {user.bio && <p className="text-zinc-400 text-sm text-center mb-6">{user.bio}</p>}

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        {user.email && (
                            <Button asChild className="w-full bg-blue-600 hover:bg-blue-500">
                                <a href={`mailto:${user.email}`}>
                                    <Mail className="mr-2 h-4 w-4" /> E-Mail senden
                                </a>
                            </Button>
                        )}
                        {user.phone && (
                            <Button asChild variant="outline" className="w-full border-white/10">
                                <a href={`tel:${user.phone}`}>
                                    <Phone className="mr-2 h-4 w-4" /> Anrufen
                                </a>
                            </Button>
                        )}
                        {user.website && (
                            <Button asChild variant="outline" className="w-full border-white/10">
                                <a href={user.website} target="_blank" rel="noopener noreferrer">
                                    <Globe className="mr-2 h-4 w-4" /> Website
                                </a>
                            </Button>
                        )}
                        {user.linkedin && (
                            <Button asChild variant="outline" className="w-full border-white/10">
                                <a href={user.linkedin} target="_blank" rel="noopener noreferrer">
                                    <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
                                </a>
                            </Button>
                        )}
                    </div>

                    {/* Contact Exchange */}
                    <ContactForm recipientUserId={user.id} recipientName={user.name} />
                </div>
            </div>
        </div>
    );
}
