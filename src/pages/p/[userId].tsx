import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase/client";
import { GhostPage } from "@/components/profile/ghost-page";
import { getTemplate } from "@/components/profile/templates";
import type { ProfileUser } from "@/types/profile";
import { logProfileView } from "@/lib/api/analytics";

// Type for the public_profiles view (excludes sensitive fields)
interface PublicProfile {
    id: string;
    name: string | null;
    slug: string | null;
    job_title: string | null;
    bio: string | null;
    profile_pic: string | null;
    banner_pic: string | null;
    company_name: string | null;
    social_links: Record<string, string> | null;
    active_template: string | null;
    ghost_mode: boolean | null;
    ghost_mode_until: string | null;
    website: string | null;
    linkedin_url: string | null;
    view_count: number | null;
    email: string | null;
    phone: string | null;
}

export default function ProfilePage() {
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<ProfileUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchUser() {
            if (!userId) return;

            // Use public_profiles view to avoid exposing sensitive fields like webhook_url, notes, auth_user_id
            let { data } = await supabase.from("public_profiles" as any).select("*").eq("slug", userId).single() as { data: PublicProfile | null };

            if (!data) {
                const result = await supabase.from("public_profiles" as any).select("*").eq("id", userId).single() as { data: PublicProfile | null };
                data = result.data;
            }

            if (data) {
                logProfileView(data.id);
            }

            if (data) {
                setUser({
                    id: data.id,
                    name: data.name || "No Name",
                    title: data.job_title || "",
                    company: data.company_name || "",
                    bio: data.bio || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    website: data.website || "",
                    linkedin: (data.social_links as any)?.linkedin || data.linkedin_url || "",
                    avatar: data.profile_pic || "",
                    banner: data.banner_pic || "",
                    activeTemplate: data.active_template || "premium-gradient",
                    ghostMode: data.ghost_mode || false,
                    ghostModeUntil: data.ghost_mode_until || null,
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

    const isGhosted =
        user.ghostMode &&
        (!user.ghostModeUntil || new Date(user.ghostModeUntil) > new Date());

    if (isGhosted) {
        return <GhostPage />;
    }

    const Template = getTemplate(user.activeTemplate);
    return <Template user={user} />;
}
