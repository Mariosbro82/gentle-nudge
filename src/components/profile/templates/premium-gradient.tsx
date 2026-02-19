import { Mail, Phone, Globe, Linkedin, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/profile/contact-form";
import { CustomLinksDisplay } from "@/components/profile/shared/custom-links-display";
import { CouponDisplay } from "@/components/profile/shared/coupon-display";
import { CountdownDisplay } from "@/components/profile/shared/countdown-display";
import { VideoGreeting } from "@/components/profile/shared/video-greeting";
import { ResourcesSection } from "@/components/profile/shared/resources-section";
import type { TemplateProps } from "@/types/profile";
import { ensureAbsoluteUrl } from "@/lib/utils";

function generateVCard(user: { name: string; title: string; company: string; email: string; phone: string; website: string; linkedin: string }) {
    const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${user.name}`,
        `TITLE:${user.title}`,
        `ORG:${user.company}`,
    ];
    if (user.email) lines.push(`EMAIL:${user.email}`);
    if (user.phone) lines.push(`TEL:${user.phone}`);
    if (user.website) lines.push(`URL:${ensureAbsoluteUrl(user.website)}`);
    if (user.linkedin) lines.push(`URL:${ensureAbsoluteUrl(user.linkedin)}`);
    lines.push("END:VCARD");
    return lines.join("\n");
}

function handleAddToContacts(user: { name: string; title: string; company: string; email: string; phone: string; website: string; linkedin: string }) {
    const vcard = generateVCard(user);
    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${user.name.replace(/\s+/g, "_")}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
}

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
                <div className="bg-white/[0.06] backdrop-blur-2xl backdrop-saturate-150 rounded-2xl p-6 shadow-2xl shadow-black/40 border border-white/[0.12] ring-1 ring-white/[0.05]">
                    {/* Avatar or Video Greeting */}
                    <div className="flex justify-center -mt-12 mb-4">
                        {user.videoUrl ? (
                            <VideoGreeting videoUrl={user.videoUrl} />
                        ) : (
                            <div className="w-24 h-24 rounded-xl bg-zinc-800 border-4 border-zinc-900 flex items-center justify-center text-2xl font-bold text-white overflow-hidden shadow-lg">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" style={{ objectPosition: user.profilePicPosition || '50% 50%' }} />
                                ) : (
                                    user.name.charAt(0).toUpperCase()
                                )}
                            </div>
                        )}
                    </div>

                    {/* Name & Title */}
                    <div className="text-center mb-5">
                        <h1 className="text-2xl font-bold">{user.name}</h1>
                        {(user.title || user.company) && (
                            <p className="text-zinc-400 text-sm mt-1">
                                {user.title}{user.title && user.company ? " at " : ""}{user.company}
                            </p>
                        )}
                    </div>

                    {user.bio && <p className="text-zinc-400 text-sm text-center mb-5 leading-relaxed">{user.bio}</p>}

                    {user.countdownTarget && <CountdownDisplay target={user.countdownTarget} label={user.countdownLabel} accentColor={accent} />}
                    {user.couponCode && <CouponDisplay code={user.couponCode} description={user.couponDescription} accentColor={accent} />}

                    {/* Contact Info with Icons */}
                    <div className="space-y-1 mb-5">
                        {user.phone && (
                            <a href={`tel:${user.phone}`} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors group">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${accent}20` }}>
                                    <Phone className="h-4 w-4" style={{ color: accent }} />
                                </div>
                                <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">{user.phone}</span>
                            </a>
                        )}
                        {user.email && (
                            <a href={`mailto:${user.email}`} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors group">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${accent}20` }}>
                                    <Mail className="h-4 w-4" style={{ color: accent }} />
                                </div>
                                <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">{user.email}</span>
                            </a>
                        )}
                        {user.website && (
                            <a href={ensureAbsoluteUrl(user.website)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors group">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${accent}20` }}>
                                    <Globe className="h-4 w-4" style={{ color: accent }} />
                                </div>
                                <span className="text-sm text-zinc-300 group-hover:text-white transition-colors truncate">{user.website.replace(/^https?:\/\//, '')}</span>
                            </a>
                        )}
                        {user.linkedin && (
                            <a href={ensureAbsoluteUrl(user.linkedin)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors group">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${accent}20` }}>
                                    <Linkedin className="h-4 w-4" style={{ color: accent }} />
                                </div>
                                <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">LinkedIn</span>
                            </a>
                        )}
                    </div>

                    {/* Add to Contacts Button */}
                    <Button
                        className="w-full rounded-xl py-5 text-sm font-semibold mb-4"
                        style={{ backgroundColor: accent }}
                        onClick={() => handleAddToContacts(user)}
                    >
                        <UserPlus className="mr-2 h-4 w-4" /> Kontakt speichern
                    </Button>

                    {/* Custom Links */}
                    {user.customLinks.length > 0 && (
                        <div className="space-y-2 mb-4">
                            <CustomLinksDisplay links={user.customLinks} accentColor={accent} variant="button" />
                        </div>
                    )}

                    <ContactForm recipientUserId={user.id} recipientName={user.name} />

                    <ResourcesSection userId={user.id} accentColor={accent} />
                </div>
            </div>
        </div>
    );
}
