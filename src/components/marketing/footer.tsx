import { Link } from "react-router-dom";
import { Twitter, Linkedin, Instagram } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-background border-t border-border pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="inline-block mb-6">
                            <span className="text-2xl font-bold text-foreground">NFCwear</span>
                            <span className="text-muted-foreground ml-2">by severmore</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-sm">
                            Wir machen euer Team zur Wachstumsmaschine. <br />
                            Corporate Fashion trifft NFC-Technologie.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all">
                                <Linkedin size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all">
                                <Instagram size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Spacer Column (optional, or just using grid gaps) */}
                    <div className="hidden lg:block lg:col-span-1" />

                    {/* Product Column */}
                    <div>
                        <h4 className="text-foreground font-bold mb-6 uppercase text-sm tracking-wider">Produkt</h4>
                        <ul className="space-y-4">
                            <li><Link to="/products" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Kollektion</Link></li>
                            <li><Link to="/tech" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Technologie</Link></li>
                            <li><Link to="/pricing" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Preise</Link></li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h4 className="text-foreground font-bold mb-6 uppercase text-sm tracking-wider">Unternehmen</h4>
                        <ul className="space-y-4">
                            <li><Link to="/company" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Über uns</Link></li>
                            <li><Link to="/careers" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Karriere</Link></li>
                            <li><Link to="/contact" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Kontakt</Link></li>
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div>
                        <h4 className="text-foreground font-bold mb-6 uppercase text-sm tracking-wider">Rechtliches</h4>
                        <ul className="space-y-4">
                            <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Datenschutz</Link></li>
                            <li><Link to="/terms" className="text-muted-foreground hover:text-foreground text-sm transition-colors">AGB</Link></li>
                            <li><Link to="/imprint" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Impressum</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
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
