"use client";

import { motion } from "framer-motion";
import { Briefcase, Utensils, Megaphone, CheckCircle2 } from "lucide-react";

export function FeaturesSection() {
    const modes = [
        {
            id: "corporate",
            icon: Briefcase,
            title: "Vertrieb",
            subtitle: "Vom Hoodie zum Lead-Generator",
            description: "Digitale Visitenkarte und Lead-Capture für Sales-Teams. Verwandeln Sie jeden Mitarbeiterkontakt in einen CRM-Eintrag.",
            color: "blue",
            features: ["Digitale vCard", "2-Way Lead Capture", "LinkedIn Integration", "Recruiting Links"],
        },
        {
            id: "campaign",
            icon: Megaphone,
            title: "Events",
            subtitle: "Marketingkampagnen am Körper",
            description: "Steuern Sie alle Hoodies zentral für Events. Black Friday, Messen oder Produktlaunches mit einem Klick.",
            color: "purple",
            features: ["Zentrale Event-Steuerung", "Gutschein-Codes", "Countdown Landing Pages", "Zeitgesteuerte Weiterleitung"],
        },
        {
            id: "hospitality",
            icon: Utensils,
            title: "Bewertung",
            subtitle: "5-Sterne ohne Papierkarte",
            description: " Boosten Sie Google Reviews und Trinkgeld mit einem Scan. Ideal für Service-Personal und Gastronomie.",
            color: "orange",
            features: ["Google Bewertungs-Boost", "Digitale Speisekarte", "TripAdvisor Integration", "Smart Tipping (Stripe)"],
        },
    ];

    return (
        <section id="features" className="py-24 bg-black relative">
            <div className="container mx-auto px-4">

                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Ein Chip. <span className="text-blue-500">Drei Möglichkeiten.</span>
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                        Wechseln Sie den Modus in Echtzeit über das Severmore Dashboard. Ohne App. Ohne Aufwand.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {modes.map((mode, index) => (
                        <motion.div
                            key={mode.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="p-8 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-white/10 hover:bg-zinc-900/80 transition-all group"
                        >
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-${mode.color}-500/10 text-${mode.color}-500 group-hover:scale-110 transition-transform duration-300`}>
                                <mode.icon size={28} className={
                                    mode.color === 'blue' ? 'text-blue-400' :
                                        mode.color === 'orange' ? 'text-orange-400' : 'text-purple-400'
                                } />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2">{mode.title}</h3>
                            <p className={`text-sm font-medium mb-4 ${mode.color === 'blue' ? 'text-blue-400' :
                                mode.color === 'orange' ? 'text-orange-400' : 'text-purple-400'
                                }`}>
                                {mode.subtitle}
                            </p>

                            <p className="text-zinc-400 mb-8 leading-relaxed text-sm">
                                {mode.description}
                            </p>

                            <ul className="space-y-3">
                                {mode.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3 text-sm text-zinc-300">
                                        <CheckCircle2 size={16} className="text-zinc-600 group-hover:text-white transition-colors" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
