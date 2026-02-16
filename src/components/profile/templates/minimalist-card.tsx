import { Mail, Phone, Globe, Linkedin } from "lucide-react";
import { ContactForm } from "@/components/profile/contact-form";
import type { TemplateProps } from "@/types/profile";
import { ensureAbsoluteUrl } from "@/lib/utils";

export function MinimalistCardTemplate({ user }: TemplateProps) {
    const bgStyle: React.CSSProperties = user.backgroundImage
        ? { backgroundImage: `url(${user.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : { backgroundColor: user.backgroundColor || '#0a0a0a' };

    return (
        <div className="min-h-screen text-white flex flex-col items-center justify-center px-4 py-12" style={bgStyle}>
            <div className="w-full max-w-md">
                {/* Banner strip */}
                {user.banner ? (
                    <div
                        className="h-24 rounded-t-3xl bg-cover bg-center"
                        style={{ backgroundImage: `url(${user.banner})` }}
                    />
                ) : (
                    <div className="h-6 rounded-t-3xl" style={{ backgroundColor: user.bannerColor || '#4f46e5' }} />
                )}

                {/* Card */}
                <div className={`bg-white/5 ${user.banner ? '' : 'rounded-t-2xl'} rounded-b-3xl p-8 border border-white/5`}>
                    {/* Avatar */}
                    <div className="flex justify-center mb-6">
                        <div className="w-28 h-28 rounded-full bg-zinc-800 flex items-center justify-center text-3xl font-light text-white overflow-hidden ring-2 ring-white/10">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                user.name.charAt(0).toUpperCase()
                            )}
                        </div>
                    </div>

                    {/* Name & Title */}
                    <div className="text-center mb-4">
                        <h1 className="text-2xl font-semibold tracking-tight">{user.name}</h1>
                        {user.title && (
                            <p className="text-zinc-400 text-sm mt-1">{user.title}</p>
                        )}
                        {user.company && (
                            <p className="text-zinc-500 text-xs mt-0.5">{user.company}</p>
                        )}
                    </div>

                    {/* Bio */}
                    {user.bio && (
                        <p className="text-zinc-400 text-sm text-center mb-6 max-w-xs mx-auto leading-relaxed">
                            {user.bio}
                        </p>
                    )}

                    {/* Divider */}
                    <div className="w-12 h-px bg-white/10 mx-auto mb-6" />

                    {/* Action pills - horizontal row */}
                    <div className="flex justify-center gap-3 flex-wrap mb-6">
                        {user.email && (
                            <a
                                href={`mailto:${user.email}`}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/10 text-sm hover:bg-white/5 transition-colors"
                            >
                                <Mail className="h-4 w-4 text-zinc-400" />
                                E-Mail
                            </a>
                        )}
                        {user.phone && (
                            <a
                                href={`tel:${user.phone}`}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/10 text-sm hover:bg-white/5 transition-colors"
                            >
                                <Phone className="h-4 w-4 text-zinc-400" />
                                Anrufen
                            </a>
                        )}
                        {user.website && (
                            <a
                                href={ensureAbsoluteUrl(user.website)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/10 text-sm hover:bg-white/5 transition-colors"
                            >
                                <Globe className="h-4 w-4 text-zinc-400" />
                                Web
                            </a>
                        )}
                        {user.linkedin && (
                            <a
                                href={ensureAbsoluteUrl(user.linkedin)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/10 text-sm hover:bg-white/5 transition-colors"
                            >
                                <Linkedin className="h-4 w-4 text-zinc-400" />
                                LinkedIn
                            </a>
                        )}
                    </div>

                    {/* Contact Exchange */}
                    <ContactForm recipientUserId={user.id} recipientName={user.name} />
                </div>
            </div>
        </div>
    );
}
