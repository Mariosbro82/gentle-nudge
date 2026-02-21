"use client";

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
                <div className="text-center mb-16">
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono mb-4 inline-block">
                        HARDWARE SPECS
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground">High-End Technologie</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((f, i) => (
                        <div key={i} className="p-6 rounded-2xl glass-card hover:border-blue-500/30 transition-all hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
                                {f.icon}
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-2 hyphens-auto">{f.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
