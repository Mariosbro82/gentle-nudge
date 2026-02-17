import { Mail, Phone, Globe, Linkedin } from "lucide-react";
import { ContactForm } from "@/components/profile/contact-form";
import { CustomLinksDisplay } from "@/components/profile/shared/custom-links-display";
import { CouponDisplay } from "@/components/profile/shared/coupon-display";
import { CountdownDisplay } from "@/components/profile/shared/countdown-display";
import { VideoGreeting } from "@/components/profile/shared/video-greeting";
import { ResourcesSection } from "@/components/profile/shared/resources-section";
import type { TemplateProps } from "@/types/profile";
import { ensureAbsoluteUrl } from "@/lib/utils";

export function MinimalistCardTemplate({ user }: TemplateProps) {
    const bgStyle: React.CSSProperties = user.backgroundImage
        ? { backgroundImage: `url(${user.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: user.backgroundPosition || 'center' }
        : { backgroundColor: user.backgroundColor || '#0a0a0a' };

    const accent = user.accentColor || '#4f46e5';

    return (
        <div className="min-h-screen text-white flex flex-col items-center justify-center px-4 py-12" style={bgStyle}>
            <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
                {user.banner ? (
                    <div className="h-24 bg-cover bg-center" style={{ backgroundImage: `url(${user.banner})`, backgroundPosition: user.bannerPicPosition || '50% 50%' }} />
                ) : (
                    <div className="h-6" style={{ backgroundColor: user.bannerColor || '#4f46e5' }} />
                )}

                <div className="bg-zinc-900/95 backdrop-blur-sm p-8">
                    <div className="flex justify-center mb-6">
                        {user.videoUrl ? (
                            <VideoGreeting videoUrl={user.videoUrl} />
                        ) : (
                            <div className="w-28 h-28 rounded-full bg-zinc-800 flex items-center justify-center text-3xl font-light text-white overflow-hidden ring-2 ring-white/10">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" style={{ objectPosition: user.profilePicPosition || '50% 50%' }} />
                                ) : (
                                    user.name.charAt(0).toUpperCase()
                                )}
                            </div>
                        )}
                    </div>

                    <div className="text-center mb-4">
                        <h1 className="text-2xl font-semibold tracking-tight">{user.name}</h1>
                        {user.title && <p className="text-zinc-400 text-sm mt-1">{user.title}</p>}
                        {user.company && <p className="text-zinc-500 text-xs mt-0.5">{user.company}</p>}
                    </div>

                    {user.bio && <p className="text-zinc-400 text-sm text-center mb-6 max-w-xs mx-auto leading-relaxed">{user.bio}</p>}

                    {user.countdownTarget && <CountdownDisplay target={user.countdownTarget} label={user.countdownLabel} accentColor={accent} />}
                    {user.couponCode && <CouponDisplay code={user.couponCode} description={user.couponDescription} accentColor={accent} />}

                    <div className="w-12 h-px bg-white/10 mx-auto mb-6" />

                    <div className="flex justify-center gap-3 flex-wrap mb-6">
                        {user.email && (
                            <a href={`mailto:${user.email}`} className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/10 text-sm hover:bg-white/5 transition-colors" style={{ borderColor: `${accent}33` }}>
                                <Mail className="h-4 w-4" style={{ color: accent }} /> E-Mail
                            </a>
                        )}
                        {user.phone && (
                            <a href={`tel:${user.phone}`} className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/10 text-sm hover:bg-white/5 transition-colors" style={{ borderColor: `${accent}33` }}>
                                <Phone className="h-4 w-4" style={{ color: accent }} /> Anrufen
                            </a>
                        )}
                        {user.website && (
                            <a href={ensureAbsoluteUrl(user.website)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/10 text-sm hover:bg-white/5 transition-colors" style={{ borderColor: `${accent}33` }}>
                                <Globe className="h-4 w-4" style={{ color: accent }} /> Web
                            </a>
                        )}
                        {user.linkedin && (
                            <a href={ensureAbsoluteUrl(user.linkedin)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/10 text-sm hover:bg-white/5 transition-colors" style={{ borderColor: `${accent}33` }}>
                                <Linkedin className="h-4 w-4" style={{ color: accent }} /> LinkedIn
                            </a>
                        )}
                        <CustomLinksDisplay links={user.customLinks} accentColor={accent} variant="pill" />
                    </div>

                    <ContactForm recipientUserId={user.id} recipientName={user.name} />

                    <ResourcesSection userId={user.id} accentColor={accent} />
                </div>
            </div>
        </div>
    );
}
