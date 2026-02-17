import { Mail, Phone, Globe, Linkedin, Briefcase } from "lucide-react";
import { ContactForm } from "@/components/profile/contact-form";
import { CustomLinksDisplay } from "@/components/profile/shared/custom-links-display";
import { CouponDisplay } from "@/components/profile/shared/coupon-display";
import { CountdownDisplay } from "@/components/profile/shared/countdown-display";
import { VideoGreeting } from "@/components/profile/shared/video-greeting";
import { ResourcesSection } from "@/components/profile/shared/resources-section";
import type { TemplateProps } from "@/types/profile";
import { ensureAbsoluteUrl } from "@/lib/utils";

export function EventBadgeTemplate({ user }: TemplateProps) {
    const bgStyle: React.CSSProperties = user.backgroundImage
        ? { backgroundImage: `url(${user.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: user.backgroundPosition || 'center' }
        : { backgroundColor: user.backgroundColor || '#09090b' };

    const accent = user.accentColor || '#7c3aed';

    return (
        <div className="min-h-screen text-white" style={bgStyle}>
            <div className="px-4 py-3" style={{ background: `linear-gradient(90deg, ${accent}, ${accent}cc, ${accent}88)` }}>
                <div className="max-w-lg mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="font-medium">Live Event</span>
                    </div>
                    <span className="text-xs text-white/70">Powered by Severmore</span>
                </div>
            </div>

            {user.banner ? (
                <div className="h-28 bg-cover bg-center" style={{ backgroundImage: `url(${user.banner})`, backgroundPosition: user.bannerPicPosition || '50% 50%' }} />
            ) : (
                <div className="h-28" style={{ background: `linear-gradient(to bottom, ${accent}4D, transparent)` }} />
            )}

            <div className="max-w-lg mx-auto px-4 -mt-12">
                <div className="bg-zinc-900 rounded-xl border border-white/10 overflow-hidden">
                    <div className="h-1" style={{ background: `linear-gradient(90deg, ${accent}, ${accent}cc, ${accent}66)` }} />
                    <div className="p-6">
                        <div className="flex items-start gap-4 mb-5">
                            {user.videoUrl ? (
                                <div className="flex-shrink-0">
                                    <VideoGreeting videoUrl={user.videoUrl} />
                                </div>
                            ) : (
                                <div className="w-20 h-20 rounded-xl bg-zinc-800 flex-shrink-0 flex items-center justify-center text-xl font-bold overflow-hidden border border-white/10">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" style={{ objectPosition: user.profilePicPosition || '50% 50%' }} />
                                    ) : (
                                        user.name.charAt(0).toUpperCase()
                                    )}
                                </div>
                            )}
                            <div className="min-w-0">
                                <h1 className="text-xl font-bold truncate">{user.name}</h1>
                                {user.title && (
                                    <p className="text-zinc-400 text-sm flex items-center gap-1.5 mt-0.5">
                                        <Briefcase className="h-3.5 w-3.5 flex-shrink-0" /> {user.title}
                                    </p>
                                )}
                                {user.company && <p className="text-zinc-500 text-xs mt-0.5">{user.company}</p>}
                            </div>
                        </div>

                        {user.bio && <p className="text-zinc-400 text-sm mb-5 leading-relaxed">{user.bio}</p>}

                        {user.countdownTarget && <CountdownDisplay target={user.countdownTarget} label={user.countdownLabel} accentColor={accent} />}
                        {user.couponCode && <CouponDisplay code={user.couponCode} description={user.couponDescription} accentColor={accent} />}

                        <div className="flex gap-2 mb-5">
                            {user.email && (
                                <a href={`mailto:${user.email}`} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-sm">
                                    <Mail className="h-4 w-4" /> E-Mail
                                </a>
                            )}
                            {user.phone && (
                                <a href={`tel:${user.phone}`} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-sm">
                                    <Phone className="h-4 w-4" /> Anrufen
                                </a>
                            )}
                            {user.linkedin && (
                                <a href={ensureAbsoluteUrl(user.linkedin)} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-sm">
                                    <Linkedin className="h-4 w-4" /> LinkedIn
                                </a>
                            )}
                        </div>

                        {user.website && (
                            <a href={ensureAbsoluteUrl(user.website)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-sm mb-5">
                                <Globe className="h-4 w-4" /> Website besuchen
                            </a>
                        )}

                        {user.customLinks.length > 0 && (
                            <div className="space-y-2 mb-5">
                                <CustomLinksDisplay links={user.customLinks} accentColor={accent} variant="button" />
                            </div>
                        )}

                        <ContactForm recipientUserId={user.id} recipientName={user.name} />

                        <ResourcesSection userId={user.id} accentColor={accent} />
                    </div>
                </div>
            </div>

            <div className="max-w-lg mx-auto px-4 py-6 text-center">
                <a href="https://nfc.severmore.de" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
                    Auch so eine Karte? &rarr; nfc.severmore.de
                </a>
            </div>
        </div>
    );
}
