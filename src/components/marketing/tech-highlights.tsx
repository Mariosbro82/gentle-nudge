"use client";

import { motion } from "framer-motion";
import { Cpu, ShieldCheck, Zap, Smartphone } from "lucide-react";

export function TechHighlights() {
    const features = [
        { icon: <Cpu />, title: "NTAG 424 DNA Chip", desc: "AES-128 verschlüsselter NFC-Controller mit Anti-Cloning Schutz. Der sicherste Consumer-NFC-Chip am Markt." },
        { icon: <ShieldCheck />, title: "SUN-Authentifizierung", desc: "Secure Unique NFC – jeder Tap generiert einen einzigartigen Code. Echtheit wird serverseitig in Millisekunden verifiziert." },
        { icon: <Smartphone />, title: "Ohne App", desc: "Funktioniert nativ mit allen modernen iPhones und Android-Geräten. Kein Download, kein Onboarding-Aufwand." },
        { icon: <Zap />, title: "Dynamic Routing", desc: "Ändere das Ziel des Chips jederzeit über das Dashboard. Von Visitenkarte zu Landingpage – mit einem Klick." }
    ];

    return (
        <section id="tech" className="py-24 bg-background">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-center mb-20"
                >
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono mb-4 inline-block">
                        HARDWARE SPECS
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight">High-End Technologie</h2>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                            className="p-6 rounded-2xl glass-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-blue-500/30"
                        >
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
                                {f.icon}
                            </div>
                            <h3 className="text-lg font-extrabold text-foreground mb-2 tracking-tight hyphens-auto">{f.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
