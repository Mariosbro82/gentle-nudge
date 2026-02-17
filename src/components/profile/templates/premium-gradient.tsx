import { Mail, Phone, Globe, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/profile/contact-form";
import { CustomLinksDisplay } from "@/components/profile/shared/custom-links-display";
import { CouponDisplay } from "@/components/profile/shared/coupon-display";
import { CountdownDisplay } from "@/components/profile/shared/countdown-display";
import type { TemplateProps } from "@/types/profile";
import { ensureAbsoluteUrl } from "@/lib/utils";

export function PremiumGradientTemplate({ user }: TemplateProps) {
    const bgStyle: React.CSSProperties = user.backgroundImage
        ? { backgroundImage: `url(${user.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: user.backgroundPosition || 'center' }
        : { backgroundColor: user.backgroundColor || '#000000' };

    const accent = user.accentColor || '#4f46e5';

    return (
        <div className="min-h-screen text-white" style={bgStyle}>
            {user.banner ? (
                <div className="h-44 bg-cover bg-center" style={{ backgroundImage: `url(${user.banner})`, backgroundPosition: user.bannerPicPosition || '50% 50%' }} />
            ) : (
                <div className="h-44" style={{ background: `linear-gradient(135deg, ${user.bannerColor || '#4f46e5'}, ${user.bannerColor || '#4f46e5'}88)` }} />
            )}

            <div className="max-w-lg mx-auto px-4 -mt-20">
                <div className="bg-zinc-900 rounded-2xl p-6 shadow-2xl shadow-black/50">
                    <div className="flex justify-center -mt-12 mb-4">
                        <div className="w-24 h-24 rounded-full bg-zinc-800 border-4 border-zinc-900 flex items-center justify-center text-2xl font-bold text-white overflow-hidden">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" style={{ objectPosition: user.profilePicPosition || '50% 50%' }} />
                            ) : (
                                user.name.charAt(0).toUpperCase()
                            )}
                        </div>
                    </div>

                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold">{user.name}</h1>
                        {user.title && <p className="text-zinc-400">{user.title}</p>}
                        {user.company && <p className="text-zinc-500 text-sm">{user.company}</p>}
                    </div>

                    {user.bio && <p className="text-zinc-400 text-sm text-center mb-6">{user.bio}</p>}

                    {user.countdownTarget && <CountdownDisplay target={user.countdownTarget} label={user.countdownLabel} accentColor={accent} />}
                    {user.couponCode && <CouponDisplay code={user.couponCode} description={user.couponDescription} accentColor={accent} />}

                    <div className="space-y-3">
                        {user.email && (
                            <Button asChild className="w-full" style={{ backgroundColor: accent }}>
                                <a href={`mailto:${user.email}`}><Mail className="mr-2 h-4 w-4" /> E-Mail senden</a>
                            </Button>
                        )}
                        {user.phone && (
                            <Button asChild variant="outline" className="w-full border-white/10">
                                <a href={`tel:${user.phone}`}><Phone className="mr-2 h-4 w-4" /> Anrufen</a>
                            </Button>
                        )}
                        {user.website && (
                            <Button asChild variant="outline" className="w-full border-white/10">
                                <a href={ensureAbsoluteUrl(user.website)} target="_blank" rel="noopener noreferrer"><Globe className="mr-2 h-4 w-4" /> Website</a>
                            </Button>
                        )}
                        {user.linkedin && (
                            <Button asChild variant="outline" className="w-full border-white/10">
                                <a href={ensureAbsoluteUrl(user.linkedin)} target="_blank" rel="noopener noreferrer"><Linkedin className="mr-2 h-4 w-4" /> LinkedIn</a>
                            </Button>
                        )}
                        <CustomLinksDisplay links={user.customLinks} accentColor={accent} variant="button" />
                    </div>

                    <ContactForm recipientUserId={user.id} recipientName={user.name} />
                </div>
            </div>
        </div>
    );
}
