import { Link } from "react-router-dom";
import { Twitter, Linkedin, Instagram, ShieldCheck, Server, Lock } from "lucide-react";
import logoImg from "@/assets/logo.png";

export function Footer() {
    return (
        <footer className="relative overflow-hidden border-t border-white/[0.06]">
            {/* Background layers */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-black/40" />
            <div className="absolute inset-0 backdrop-blur-sm" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/[0.04] rounded-full blur-[120px]" />

            <div className="relative container mx-auto px-6 pt-20 pb-10">
                {/* Top: Large brand statement */}
                <div className="mb-16">
                    <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
                        <img src={logoImg} alt="NFCwear Logo" className="w-10 h-10 object-contain group-hover:scale-105 transition-transform" />
                        <div>
                            <span className="text-2xl font-extrabold text-foreground tracking-tight">NFCwear</span>
                            <span className="text-muted-foreground/60 ml-2 text-sm">by severmore</span>
                        </div>
                    </Link>
                    <p className="text-muted-foreground/70 text-sm leading-relaxed max-w-md">
                        Corporate Fashion trifft NFC-Technologie. <br />
                        Wir machen euer Team zur Wachstumsmaschine.
                    </p>
                </div>

                {/* Link Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                    <div>
                        <h4 className="text-foreground/80 font-semibold mb-5 text-xs tracking-[0.2em] uppercase">Produkt</h4>
                        <ul className="space-y-3">
                            <li><Link to="/shop" className="text-muted-foreground/60 hover:text-foreground text-sm transition-colors">Kollektion</Link></li>
                            <li><Link to="/platform" className="text-muted-foreground/60 hover:text-foreground text-sm transition-colors">Technologie</Link></li>
                            <li><Link to="/pricing" className="text-muted-foreground/60 hover:text-foreground text-sm transition-colors">Preise</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-foreground/80 font-semibold mb-5 text-xs tracking-[0.2em] uppercase">Unternehmen</h4>
                        <ul className="space-y-3">
                            <li><Link to="/about" className="text-muted-foreground/60 hover:text-foreground text-sm transition-colors">Über uns</Link></li>
                            <li><Link to="/careers" className="text-muted-foreground/60 hover:text-foreground text-sm transition-colors">Karriere</Link></li>
                            <li><Link to="/contact" className="text-muted-foreground/60 hover:text-foreground text-sm transition-colors">Kontakt</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-foreground/80 font-semibold mb-5 text-xs tracking-[0.2em] uppercase">Rechtliches</h4>
                        <ul className="space-y-3">
                            <li><Link to="/privacy" className="text-muted-foreground/60 hover:text-foreground text-sm transition-colors">Datenschutz</Link></li>
                            <li><Link to="/terms" className="text-muted-foreground/60 hover:text-foreground text-sm transition-colors">AGB</Link></li>
                            <li><Link to="/imprint" className="text-muted-foreground/60 hover:text-foreground text-sm transition-colors">Impressum</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-foreground/80 font-semibold mb-5 text-xs tracking-[0.2em] uppercase">Social</h4>
                        <div className="flex gap-3">
                            {[
                                { icon: Twitter, href: "https://x.com" },
                                { icon: Linkedin, href: "https://www.linkedin.com/company/severmore-ug-haftungsbeschr%C3%A4nkt/posts/?feedView=all&viewAsMember=" },
                                { icon: Instagram, href: "https://www.instagram.com/severmore.clo/" },
                            ].map(({ icon: Icon, href }) => (
                                <a
                                    key={href}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-muted-foreground/50 hover:text-foreground hover:bg-white/[0.08] hover:border-white/[0.12] hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Trust bar – glass card */}
                <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-xl px-6 py-4 mb-10">
                    <div className="flex flex-wrap items-center justify-center gap-8">
                        {[
                            { icon: ShieldCheck, label: "100% DSGVO konform" },
                            { icon: Server, label: "Hosted in Germany" },
                            { icon: Lock, label: "Enterprise-Grade Security" },
                        ].map(({ icon: Icon, label }) => (
                            <div key={label} className="flex items-center gap-2 text-xs text-muted-foreground/50 font-medium">
                                <Icon size={14} />
                                <span>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-3 pt-2">
                    <p className="text-muted-foreground/40 text-xs">
                        © 2026 NFCwear by severmore. Alle Rechte vorbehalten.
                    </p>
                    <p className="text-muted-foreground/40 text-xs flex items-center gap-2">
                        Mit Präzision gefertigt in Deutschland 🇩🇪
                    </p>
                </div>
            </div>
        </footer>
    );
}
