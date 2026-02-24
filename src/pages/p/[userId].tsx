import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase/client";
import { GhostPage } from "@/components/profile/ghost-page";
import { getTemplate } from "@/components/profile/templates";
import { LanguageSwitcher } from "@/components/profile/language-switcher";
import { LiveStatusBadge } from "@/components/profile/live-status-badge";
import { AiChat } from "@/components/profile/ai-chat";
import { WelcomeAnimation } from "@/components/profile/welcome-animation";
import { detectLanguage, t, type SupportedLang } from "@/lib/i18n";
import type { ProfileUser } from "@/types/profile";
import { logProfileView } from "@/lib/api/analytics";
import type { OrgTemplateConfig } from "@/hooks/use-org-template";

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
    hide_branding?: boolean | null;
}

export default function ProfilePage() {
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<ProfileUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [lang, setLang] = useState<SupportedLang>(detectLanguage());
    const [liveStatus, setLiveStatus] = useState<{ text: string | null; color: string | null }>({ text: null, color: null });
    const [profileId, setProfileId] = useState<string | null>(null);
    const [isReturning, setIsReturning] = useState(false);
    const [showGreeting, setShowGreeting] = useState(true);
    const [hideBranding, setHideBranding] = useState(false);

    const handleGreetingComplete = useCallback(() => setShowGreeting(false), []);

    // Contextual Memory: recognize returning visitors via localStorage
    useEffect(() => {
        if (!profileId) return;
        const key = `nfc_visit_${profileId}`;
        const prev = localStorage.getItem(key);
        if (prev) {
            const lastDate = new Date(prev).toDateString();
            const today = new Date().toDateString();
            if (lastDate === today) {
                setIsReturning(true);
            }
        }
        localStorage.setItem(key, new Date().toISOString());
    }, [profileId]);

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
                setHideBranding(data.hide_branding || false);
                setLiveStatus({ text: (data as any).live_status_text || null, color: (data as any).live_status_color || null });

                // Fetch org template config for corporate design merging
                let orgConfig: OrgTemplateConfig | null = null;
                const { data: membership } = await supabase
                    .from("organization_members")
                    .select("organization_id")
                    .eq("user_id", data.id)
                    .maybeSingle();
                
                if (membership?.organization_id) {
                    const { data: org } = await supabase
                        .from("organizations")
                        .select("template_config, logo_url")
                        .eq("id", membership.organization_id)
                        .single();
                    if (org?.template_config) {
                        orgConfig = org.template_config as OrgTemplateConfig;
                    }
                }

                // Merge: org config overrides user data for locked design fields
                const colors = orgConfig?.global_colors;
                const mandatoryLinks = orgConfig?.mandatory_links || [];
                const userLinks = data.custom_links || [];

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
                    backgroundColor: colors?.background || data.background_color || "#0a0a0a",
                    bannerColor: colors?.banner || data.banner_color || "#4f46e5",
                    accentColor: colors?.accent || data.accent_color || "#4f46e5",
                    customLinks: [
                        ...mandatoryLinks.map(l => ({ title: l.title, url: l.url })),
                        ...userLinks,
                    ],
                    couponCode: data.coupon_code || "",
                    couponDescription: data.coupon_description || "",
                    countdownTarget: data.countdown_target || null,
                    countdownLabel: data.countdown_label || "",
                    profilePicPosition: data.profile_pic_position || "50% 50%",
                    bannerPicPosition: data.banner_pic_position || "50% 50%",
                    backgroundPosition: data.background_position || "50% 50%",
                    videoUrl: (data as any).video_url || "",
                    customGreeting: (data as any).custom_greeting || "Willkommen auf meinem Profil 👋",
                    avatarStyle: (data as any).avatar_style || "image",
                    avatarEmoji: (data as any).avatar_emoji || "👋",
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
            {/* Welcome Animation (first visit only) */}
            {showGreeting && !isReturning && (
                <WelcomeAnimation user={user} onComplete={handleGreetingComplete} />
            )}

            {/* Returning visitor banner */}
            {isReturning && (
                <div className="fixed top-0 left-0 right-0 z-[60] bg-primary/90 backdrop-blur-sm text-primary-foreground text-center py-2.5 px-4 text-sm font-medium shadow-lg animate-fade-in">
                    👋 {t("welcome_back", lang)}
                </div>
            )}
            {/* Top bar with language switcher and live status */}
            <div className={`absolute ${isReturning ? 'top-14' : 'top-3'} left-3 right-3 z-50 flex items-center justify-between transition-all`}>
                <div>
                    {liveStatus.text && profileId && (
                        <LiveStatusBadge userId={profileId} initialText={liveStatus.text} initialColor={liveStatus.color} />
                    )}
                </div>
                <LanguageSwitcher currentLang={lang} onLangChange={setLang} />
            </div>

            <Template user={user} lang={lang} />

            {/* Affiliate / Powered by NFCwear footer */}
            {!hideBranding && (
                <div className="fixed bottom-0 left-0 right-0 z-40">
                    <a
                        href="https://nfcwear.de/contact"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2.5 bg-black/80 backdrop-blur-sm text-white/70 hover:text-white text-[11px] font-medium tracking-wide transition-colors"
                    >
                        <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-white/10 text-[9px] font-bold">N</span>
                        Powered by NFCwear
                    </a>
                </div>
            )}

            {/* AI Chat FAB */}
            {profileId && (
                <AiChat user={user} label={t("chat_with_ai", lang)} />
            )}
        </div>
    );
}
