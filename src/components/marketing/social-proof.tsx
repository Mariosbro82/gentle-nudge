"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const PRESS_LOGOS = [
    { src: "/images/press/abendblatt.png", alt: "Hamburger Abendblatt", href: "https://www.abendblatt.de/hamburg/wirtschaft/article408974473/hamburger-schueler-startup-severmore-unterstuetzt-kinderkrebshilfe.html" },
    { src: "/images/press/kreiszeitung.png", alt: "Kreiszeitung Wochenblatt", href: "https://www.kreiszeitung-wochenblatt.de/seevetal/c-wirtschaft/wlh-ehrt-fuenf-start-ups-fuer-starke-ideen_a380325" },
    { src: "/images/press/nord-wirtschaft.png", alt: "Nord Wirtschaft", href: "https://www.nordwirtschaft.de/funf-junge-unternehmen-aus-dem-landkreis-harburg-mit-dem-grundungspreis-2025-geehrt" },
    { src: "/images/press/landeszeitung.png", alt: "Landeszeitung", href: "https://www.landeszeitung.de/lokales/harburg-lk/winsen-luhe/nachhaltige-mode-aus-winsen-severmore-von-schuelern-fuer-schulen-SQPDRHJSW5HRNMU3TZBH6IGDBU.html" },
    { src: "/images/press/winsen-aktuell.png", alt: "Winsen Aktuell", href: "https://www.winsenaktuell.de/artikel/gruendungspreis-landkreis-harburg-2025-fuenf-junge-unternehmen-ausgezeichnet/" },
    { src: "/images/press/seevetal-aktuell.png", alt: "Seevetal Aktuell", href: "https://seevetal-aktuell.de/2025/11/11/gruendungspreis-junge-unternehmen-feiern-erfolge-in-seevetal/" },
];

const TESTIMONIALS = [
    {
        text: "Wir haben eine größere Menge an Shirts und Sweater zum Besticken in Auftrag gegeben. Super Service! Die Qualität ist sehr gut und der Stick ist überragend geworden. Die beiden Jungs leisten wirklich einen hervorragenden Job!",
        author: "Szymon Krol",
        role: "Unternehmenskunde",
        stars: 5,
    },
    {
        text: "Qualität ist top, Auswahl auch. Das sind schon 5 Sterne – und dann noch das System mit den Spenden gegen Krebs ist perfekt durchstrukturiert. Eigentlich müsste man hier 6 geben können.",
        author: "Cord Block",
        role: "Kunde",
        stars: 5,
    },
    {
        text: "Habe mir den Hoodie in Rot und den Strick Sweater bestellt – rundum zufrieden. Sehen toll aus und sitzen super bequem. Kann ich nur weiter empfehlen!",
        author: "Janek Fritsche",
        role: "Kunde",
        stars: 5,
    },
    {
        text: "Super Pullover, super Qualität! Macht man absolut nichts falsch mit und für diesen Preis gerechtfertigt!",
        author: "Jan",
        role: "Kunde",
        stars: 5,
    },
];

export function SocialProof() {
    return (
        <section className="py-24 bg-background border-t border-border/50 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">

                {/* Press Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-center mb-16"
                >
                    <p className="text-sm font-medium text-muted-foreground mb-8 uppercase tracking-widest">
                        Bekannt aus
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                        {PRESS_LOGOS.map((logo, idx) => (
                            <motion.a
                                key={idx}
                                href={logo.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.08 }}
                                className="grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300"
                            >
                                <img
                                    src={logo.src}
                                    alt={logo.alt}
                                    className="h-8 md:h-10 w-auto object-contain"
                                />
                            </motion.a>
                        ))}
                    </div>
                </motion.div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent my-16" />

                {/* Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="grid grid-cols-2 gap-6 mb-16 max-w-2xl mx-auto"
                >
                    {[
                        { value: "5/5", label: "Kundenbewertung", icon: "⭐" },
                        { value: "🏆", label: "Gründungspreis U21", icon: "" },
                    ].map((stat, i) => (
                        <div key={i} className="text-center p-4 rounded-xl glass-card shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                            <p className="text-2xl md:text-3xl font-extrabold text-foreground mb-1 tracking-tight">
                                {stat.icon && <span className="mr-1">{stat.icon}</span>}
                                {stat.value}
                            </p>
                            <p className="text-xs text-muted-foreground">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>

                {/* Customer Testimonials */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-center mb-12"
                >
                    <h3 className="text-2xl md:text-4xl font-extrabold text-foreground mb-3 tracking-tight leading-tight">
                        Das sagen unsere Kunden
                    </h3>
                    <div className="flex items-center justify-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                    </div>
                    <p className="text-sm text-muted-foreground">Rated 5/5 in Reviews</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {TESTIMONIALS.map((t, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
                            className="p-6 rounded-2xl glass-card relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-foreground/20"
                        >
                            <Quote className="w-8 h-8 text-muted-foreground/20 absolute top-4 right-4" />
                            <div className="flex gap-0.5 mb-3">
                                {[...Array(t.stars)].map((_, i) => (
                                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="text-sm text-foreground/90 leading-relaxed mb-4">
                                &quot;{t.text}&quot;
                            </p>
                            <div>
                                <span className="text-sm font-semibold text-foreground">{t.author}</span>
                                <span className="text-xs text-muted-foreground ml-2">{t.role}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/** Compact social proof bar for embedding in other sections */
export function SocialProofBar() {
    return (
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                5/5 Kundenbewertung
            </span>
            <span className="hidden md:inline text-border">|</span>
            <span>🏆 Gründungspreis U21 Gewinner</span>
        </div>
    );
}

/** Mini press logos strip for embedding */
export function PressLogosStrip() {
    return (
        <div className="flex flex-wrap items-center justify-center gap-6 opacity-40 hover:opacity-70 transition-opacity duration-300">
            {PRESS_LOGOS.slice(0, 4).map((logo, idx) => (
                <img key={idx} src={logo.src} alt={logo.alt} className="h-6 w-auto object-contain grayscale" />
            ))}
        </div>
    );
}
