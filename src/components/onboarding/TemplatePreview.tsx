import { cn } from "@/lib/utils";
import { Mail, Phone, Globe, Linkedin, Briefcase, UserPlus, Share2 } from "lucide-react";

interface TemplatePreviewProps {
    template: 'minimalist-card' | 'premium-gradient' | 'event-badge';
    user: {
        name: string;
        title: string;
        avatar?: string | null;
        company?: string;
    };
    scale?: number;
    className?: string;
}

export const TemplatePreview = ({ template, user, className }: TemplatePreviewProps) => {
    const name = user.name || "Max Mustermann";
    const title = user.title || "CEO & Founder";
    const company = user.company || "Severmore GmbH";
    const initials = name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);

    const Avatar = ({ size = "w-14 h-14", rounded = "rounded-full", textSize = "text-lg" }: { size?: string; rounded?: string; textSize?: string }) => (
        user.avatar ? (
            <img src={user.avatar} alt={name} className={cn(size, rounded, "object-cover")} />
        ) : (
            <div className={cn(size, rounded, "flex items-center justify-center font-bold", textSize)}>
                {initials}
            </div>
        )
    );

    // Minimalist Card - Dark glass aesthetic
    if (template === 'minimalist-card') {
        return (
            <div className={cn("w-full aspect-[9/16] rounded-2xl overflow-hidden relative", className)} style={{ backgroundColor: '#0a0a0a' }}>
                {/* Thin accent bar */}
                <div className="h-1.5 w-full" style={{ backgroundColor: '#4f46e5' }} />

                <div className="p-5 flex flex-col items-center h-full"
                    style={{
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                    }}>
                    {/* Avatar */}
                    <div className="mt-6 mb-3">
                        <div className="w-16 h-16 rounded-full bg-zinc-800 ring-2 ring-white/15 overflow-hidden flex items-center justify-center text-white text-xl font-light">
                            <Avatar size="w-16 h-16" textSize="text-xl" />
                        </div>
                    </div>

                    {/* Name */}
                    <h3 className="text-white text-sm font-semibold tracking-tight">{name}</h3>
                    <p className="text-white/60 text-[10px] mt-0.5">{title}</p>
                    <p className="text-white/40 text-[9px]">{company}</p>

                    {/* Divider */}
                    <div className="w-8 h-px bg-white/15 my-3" />

                    {/* Contact pills */}
                    <div className="flex gap-1.5 flex-wrap justify-center">
                        {[
                            { icon: Mail, label: "E-Mail" },
                            { icon: Phone, label: "Anrufen" },
                            { icon: Globe, label: "Web" },
                        ].map(({ icon: Icon, label }) => (
                            <div key={label} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[8px] text-white/80"
                                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(79,70,229,0.2)' }}>
                                <Icon className="w-2.5 h-2.5" style={{ color: '#4f46e5' }} />
                                {label}
                            </div>
                        ))}
                    </div>

                    {/* Contact form placeholder */}
                    <div className="mt-auto w-full space-y-1.5 pb-2">
                        <div className="w-full h-5 rounded bg-white/[0.04] border border-white/[0.08]" />
                        <div className="w-full h-5 rounded bg-white/[0.04] border border-white/[0.08]" />
                        <div className="w-full h-6 rounded-md text-[8px] font-medium flex items-center justify-center text-white"
                            style={{ backgroundColor: '#4f46e5' }}>
                            Kontakt senden
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Premium Gradient - Dark luxury with gradient banner
    if (template === 'premium-gradient') {
        return (
            <div className={cn("w-full aspect-[9/16] rounded-2xl overflow-hidden relative", className)} style={{ backgroundColor: '#000' }}>
                {/* Gradient banner */}
                <div className="h-20" style={{ background: 'linear-gradient(135deg, #4f46e5, #4f46e588)' }} />
                <div className="h-px w-full bg-white/[0.12]" />

                <div className="px-4 -mt-8 relative z-10">
                    {/* Glass card */}
                    <div className="rounded-xl p-4 border border-white/[0.15] overflow-hidden"
                        style={{
                            background: 'linear-gradient(135deg, rgba(0,0,0,0.65), rgba(0,0,0,0.55))',
                            backdropFilter: 'blur(40px)',
                        }}>
                        {/* Highlight */}
                        <div className="absolute inset-0 pointer-events-none rounded-xl"
                            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)' }} />

                        {/* Avatar */}
                        <div className="flex justify-center -mt-7 mb-2 relative z-10">
                            <div className="w-12 h-12 rounded-lg bg-zinc-800 border-2 border-white/20 overflow-hidden flex items-center justify-center text-white text-sm font-bold">
                                <Avatar size="w-12 h-12" rounded="rounded-lg" textSize="text-sm" />
                            </div>
                        </div>

                        <div className="text-center mb-3 relative z-10">
                            <h3 className="text-white text-sm font-bold">{name}</h3>
                            <p className="text-white/60 text-[9px] mt-0.5">{title} bei {company}</p>
                        </div>

                        {/* Contact rows */}
                        <div className="space-y-1 mb-3 relative z-10">
                            {[
                                { icon: Phone, label: "+49 170 ****" },
                                { icon: Mail, label: "info@..." },
                                { icon: Linkedin, label: "LinkedIn" },
                            ].map(({ icon: Icon, label }) => (
                                <div key={label} className="flex items-center gap-2 px-2 py-1.5 rounded-lg"
                                    style={{ background: 'rgba(255,255,255,0.04)' }}>
                                    <div className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: 'rgba(79,70,229,0.15)' }}>
                                        <Icon className="w-2.5 h-2.5" style={{ color: '#4f46e5' }} />
                                    </div>
                                    <span className="text-[8px] text-white/80">{label}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA buttons */}
                        <div className="space-y-1.5 relative z-10">
                            <div className="w-full h-7 rounded-lg text-[8px] font-semibold flex items-center justify-center gap-1 text-white"
                                style={{ backgroundColor: '#4f46e5' }}>
                                <UserPlus className="w-2.5 h-2.5" /> Kontakt speichern
                            </div>
                            <div className="w-full h-7 rounded-lg text-[8px] font-semibold flex items-center justify-center gap-1 text-white/80 border border-white/15">
                                <Share2 className="w-2.5 h-2.5" /> Teilen
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Event Badge - Accent bar top, badge style
    if (template === 'event-badge') {
        const accent = '#7c3aed';
        return (
            <div className={cn("w-full aspect-[9/16] rounded-2xl overflow-hidden relative", className)} style={{ backgroundColor: '#09090b' }}>
                {/* Live event bar */}
                <div className="px-3 py-1.5 flex items-center justify-between"
                    style={{ background: `linear-gradient(90deg, ${accent}, ${accent}cc)` }}>
                    <div className="flex items-center gap-1 text-[8px] text-white font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        Live Event
                    </div>
                    <span className="text-[7px] text-white/70">NFCwear</span>
                </div>

                {/* Gradient fade */}
                <div className="h-14" style={{ background: `linear-gradient(to bottom, ${accent}30, transparent)` }} />

                <div className="px-3 -mt-6 relative z-10">
                    <div className="rounded-xl border border-white/[0.15] overflow-hidden"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.05))',
                            backdropFilter: 'blur(40px)',
                        }}>
                        <div className="h-0.5" style={{ background: `linear-gradient(90deg, ${accent}, ${accent}66)` }} />

                        <div className="p-4">
                            {/* Horizontal layout */}
                            <div className="flex items-start gap-3 mb-3">
                                <div className="w-11 h-11 rounded-lg bg-zinc-800 flex-shrink-0 overflow-hidden border border-white/15 flex items-center justify-center text-white text-xs font-bold">
                                    <Avatar size="w-11 h-11" rounded="rounded-lg" textSize="text-xs" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-white text-xs font-bold truncate">{name}</h3>
                                    <p className="text-white/60 text-[9px] flex items-center gap-1 mt-0.5">
                                        <Briefcase className="w-2.5 h-2.5 flex-shrink-0" /> {title}
                                    </p>
                                    <p className="text-white/40 text-[8px]">{company}</p>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-1.5 mb-3">
                                {[
                                    { icon: Mail, label: "E-Mail" },
                                    { icon: Phone, label: "Anrufen" },
                                    { icon: Linkedin, label: "LinkedIn" },
                                ].map(({ icon: Icon, label }) => (
                                    <div key={label} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-[7px] text-white/80"
                                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                        <Icon className="w-2.5 h-2.5" />
                                        {label}
                                    </div>
                                ))}
                            </div>

                            {/* Form placeholder */}
                            <div className="space-y-1.5">
                                <div className="w-full h-5 rounded bg-white/[0.04] border border-white/[0.08]" />
                                <div className="w-full h-5 rounded bg-white/[0.04] border border-white/[0.08]" />
                                <div className="w-full h-6 rounded-md text-[8px] font-medium flex items-center justify-center text-white"
                                    style={{ backgroundColor: accent }}>
                                    Kontakt senden
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};
