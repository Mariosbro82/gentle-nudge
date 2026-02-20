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
            <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-white/[0.15] ring-1 ring-white/[0.08]">
                {user.banner ? (
                    <div className="h-24 bg-cover bg-center" style={{ backgroundImage: `url(${user.banner})`, backgroundPosition: user.bannerPicPosition || '50% 50%' }} />
                ) : (
                    <div className="h-6" style={{ backgroundColor: user.bannerColor || '#4f46e5' }} />
                )}

                {/* Liquid Glass Panel */}
                <div
                    className="relative p-8 overflow-hidden"
                    style={{
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 100%)',
                        backdropFilter: 'blur(40px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                    }}
                >
                    {/* Glass highlight */}
                    <div className="absolute inset-0 pointer-events-none" style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%)',
                    }} />

                    <div className="relative z-10">
                        <div className="flex justify-center mb-6">
                            {user.videoUrl ? (
                                <VideoGreeting videoUrl={user.videoUrl} />
                            ) : (
                                <div className="w-28 h-28 rounded-full bg-zinc-800/80 flex items-center justify-center text-3xl font-light text-white overflow-hidden ring-2 ring-white/15 shadow-lg shadow-black/30">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" style={{ objectPosition: user.profilePicPosition || '50% 50%' }} />
                                    ) : (
                                        user.name.charAt(0).toUpperCase()
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="text-center mb-4">
                            <h1 className="text-2xl font-semibold tracking-tight text-white drop-shadow-sm">{user.name}</h1>
                            {user.title && <p className="text-white/65 text-sm mt-1">{user.title}</p>}
                            {user.company && <p className="text-white/50 text-xs mt-0.5">{user.company}</p>}
                        </div>

                        {user.bio && <p className="text-white/65 text-sm text-center mb-6 max-w-xs mx-auto leading-relaxed">{user.bio}</p>}

                        {user.countdownTarget && <CountdownDisplay target={user.countdownTarget} label={user.countdownLabel} accentColor={accent} />}
                        {user.couponCode && <CouponDisplay code={user.couponCode} description={user.couponDescription} accentColor={accent} />}

                        <div className="w-12 h-px bg-white/15 mx-auto mb-6" />

                        <div className="flex justify-center gap-3 flex-wrap mb-6">
                            {user.email && (
                                <a href={`mailto:${user.email}`} className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm text-white/90 hover:text-white hover:bg-white/10 transition-colors" style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${accent}33` }}>
                                    <Mail className="h-4 w-4" style={{ color: accent }} /> E-Mail
                                </a>
                            )}
                            {user.phone && (
                                <a href={`tel:${user.phone}`} className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm text-white/90 hover:text-white hover:bg-white/10 transition-colors" style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${accent}33` }}>
                                    <Phone className="h-4 w-4" style={{ color: accent }} /> Anrufen
                                </a>
                            )}
                            {user.website && (
                                <a href={ensureAbsoluteUrl(user.website)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm text-white/90 hover:text-white hover:bg-white/10 transition-colors" style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${accent}33` }}>
                                    <Globe className="h-4 w-4" style={{ color: accent }} /> Web
                                </a>
                            )}
                            {user.linkedin && (
                                <a href={ensureAbsoluteUrl(user.linkedin)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm text-white/90 hover:text-white hover:bg-white/10 transition-colors" style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${accent}33` }}>
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
        </div>
    );
}
