import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase/client";
import { GhostPage } from "@/components/profile/ghost-page";
import { getTemplate } from "@/components/profile/templates";
import { LanguageSwitcher } from "@/components/profile/language-switcher";
import { LiveStatusBadge } from "@/components/profile/live-status-badge";
import { AiChat } from "@/components/profile/ai-chat";
import { detectLanguage, t, type SupportedLang } from "@/lib/i18n";
import type { ProfileUser } from "@/types/profile";
import { logProfileView } from "@/lib/api/analytics";

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
    background_image: string | null;
    background_color: string | null;
    banner_color: string | null;
    accent_color: string | null;
    custom_links: any[] | null;
    coupon_code: string | null;
    coupon_description: string | null;
    countdown_target: string | null;
    countdown_label: string | null;
    profile_pic_position: string | null;
    banner_pic_position: string | null;
    background_position: string | null;
    live_status_text?: string | null;
    live_status_color?: string | null;
}

export default function ProfilePage() {
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<ProfileUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [lang, setLang] = useState<SupportedLang>(detectLanguage());
    const [liveStatus, setLiveStatus] = useState<{ text: string | null; color: string | null }>({ text: null, color: null });
    const [profileId, setProfileId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUser() {
            if (!userId) return;

            let { data } = await supabase.from("public_profiles" as any).select("*").eq("slug", userId).single() as { data: PublicProfile | null };

            if (!data) {
                const result = await supabase.from("public_profiles" as any).select("*").eq("id", userId).single() as { data: PublicProfile | null };
                data = result.data;
            }

            if (data) {
                logProfileView(data.id);
                setProfileId(data.id);
                setLiveStatus({ text: (data as any).live_status_text || null, color: (data as any).live_status_color || null });
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
                    backgroundImage: data.background_image || "",
                    backgroundColor: data.background_color || "#0a0a0a",
                    bannerColor: data.banner_color || "#4f46e5",
                    accentColor: data.accent_color || "#4f46e5",
                    customLinks: data.custom_links || [],
                    couponCode: data.coupon_code || "",
                    couponDescription: data.coupon_description || "",
                    countdownTarget: data.countdown_target || null,
                    countdownLabel: data.countdown_label || "",
                    profilePicPosition: data.profile_pic_position || "50% 50%",
                    bannerPicPosition: data.banner_pic_position || "50% 50%",
                    backgroundPosition: data.background_position || "50% 50%",
                    videoUrl: (data as any).video_url || "",
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
    return (
        <div className="relative">
            {/* Top bar with language switcher and live status */}
            <div className="absolute top-3 left-3 right-3 z-50 flex items-center justify-between">
                <div>
                    {liveStatus.text && profileId && (
                        <LiveStatusBadge userId={profileId} initialText={liveStatus.text} initialColor={liveStatus.color} />
                    )}
                </div>
                <LanguageSwitcher currentLang={lang} onLangChange={setLang} />
            </div>

            <Template user={user} />

            {/* AI Chat FAB */}
            {profileId && (
                <AiChat user={user} label={t("chat_with_ai", lang)} />
            )}
        </div>
    );
}
