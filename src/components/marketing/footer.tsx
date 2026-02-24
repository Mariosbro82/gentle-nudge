import { Link } from "react-router-dom";
import { Twitter, Linkedin, Instagram, ShieldCheck, Server, Lock } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-card/80 backdrop-blur-sm border-t border-border/50 pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="inline-block mb-6">
                            <span className="text-2xl font-extrabold text-foreground tracking-tight">NFCwear</span>
                            <span className="text-muted-foreground ml-2">by severmore</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-sm">
                            Wir machen euer Team zur Wachstumsmaschine. <br />
                            Corporate Fashion trifft NFC-Technologie.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { icon: Twitter, href: "https://x.com" },
                                { icon: Linkedin, href: "https://www.linkedin.com/company/severmore-ug-haftungsbeschr%C3%A4nkt/posts/?feedView=all&viewAsMember=" },
                                { icon: Instagram, href: "https://www.instagram.com/severmore.clo/" },
                            ].map(({ icon: Icon, href }) => (
                                <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:-translate-y-0.5 transition-all duration-300">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Spacer Column */}
                    <div className="hidden lg:block lg:col-span-1" />

                    {/* Product Column */}
                    <div>
                        <h4 className="text-foreground font-bold mb-6 uppercase text-xs tracking-[0.15em]">Produkt</h4>
                        <ul className="space-y-4">
                            <li><Link to="/shop" className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200">Kollektion</Link></li>
                            <li><Link to="/platform" className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200">Technologie</Link></li>
                            <li><Link to="/pricing" className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200">Preise</Link></li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h4 className="text-foreground font-bold mb-6 uppercase text-xs tracking-[0.15em]">Unternehmen</h4>
                        <ul className="space-y-4">
                            <li><Link to="/about" className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200">Über uns</Link></li>
                            <li><Link to="/careers" className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200">Karriere</Link></li>
                            <li><Link to="/contact" className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200">Kontakt</Link></li>
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div>
                        <h4 className="text-foreground font-bold mb-6 uppercase text-xs tracking-[0.15em]">Rechtliches</h4>
                        <ul className="space-y-4">
                            <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200">Datenschutz</Link></li>
                            <li><Link to="/terms" className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200">AGB</Link></li>
                            <li><Link to="/imprint" className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200">Impressum</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap items-center justify-center gap-6 mb-12 py-8 border-t border-b border-border/30">
                    {[
                        { icon: ShieldCheck, label: "100% DSGVO konform" },
                        { icon: Server, label: "Hosted in Germany" },
                        { icon: Lock, label: "Enterprise-Grade Security" },
                    ].map(({ icon: Icon, label }) => (
                        <div key={label} className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                            <Icon size={14} className="text-muted-foreground/60" />
                            <span>{label}</span>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-muted-foreground text-xs">
                        © 2026 NFCwear by severmore. Alle Rechte vorbehalten.
                    </p>
                    <p className="text-muted-foreground text-xs flex items-center gap-2">
                        Mit Präzision gefertigt in Deutschland 🇩🇪
                    </p>
                </div>
            </div>
        </footer>
    );
}
