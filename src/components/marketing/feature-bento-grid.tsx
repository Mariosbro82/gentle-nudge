"use client";

import { motion } from "framer-motion";
import {
    Webhook,
    ShieldCheck,
    Waves,
    ThermometerSun,
    Briefcase,
    Store,
    Lock,
    Unlock,
    Bot,
    Video,
    Trophy,
    FileDown,
    Layers,
} from "lucide-react";
import { useState, useEffect } from "react";
import { InfiniteImageScroll } from "./ui/infinite-image-scroll";

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { delay, duration: 0.5, ease: "easeOut" as const },
});

export function FeatureBentoGrid() {
    const [isGhostMode, setIsGhostMode] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsGhostMode((prev) => !prev);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div {...fadeUp()} className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-6 tracking-tight leading-tight">
                        Unfair Advantages.
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Technologische Überlegenheit, die man spürt.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto auto-rows-[minmax(220px,auto)]">

                    {/* Kachel 1 (Large): Deep CRM Integration */}
                    <motion.div
                        {...fadeUp()}
                        className="md:col-span-2 md:row-span-2 rounded-3xl glass-card p-8 pb-28 md:pb-8 flex flex-col justify-between overflow-hidden relative group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute inset-x-0 bottom-0 h-24 md:h-40 z-0 mask-linear-gradient-to-t">
                            <InfiniteImageScroll
                                images={[
                                    { alt: "Salesforce", src: "/assets/integrations/salesforce.png" },
                                    { alt: "HubSpot", src: "/assets/integrations/hubspot.png" },
                                    { alt: "Pipedrive", src: "/assets/integrations/pipedrive.png" },
                                    { alt: "Zapier", src: "/assets/integrations/zapier.png" },
                                ]}
                                speed="slow"
                                direction="left"
                                className="w-full h-full"
                            />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6 text-blue-400">
                                <Webhook size={24} />
                            </div>
                            <h3 className="text-2xl font-extrabold text-foreground mb-2 tracking-tight">Deep CRM Integration</h3>
                            <p className="text-muted-foreground mb-8 relative z-20">
                                Wir schreiben Leads direkt in Ihre Systeme via Webhook. Sparen Sie 5h Tipparbeit pro Messe.
                            </p>
                        </div>
                    </motion.div>

                    {/* Kachel 2: Industrial Durability */}
                    <motion.div
                        {...fadeUp(0.1)}
                        className="md:col-span-2 md:row-span-1 rounded-3xl glass-card p-8 flex items-center justify-between relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative z-10 max-w-[60%]">
                            <div className="flex items-center gap-2 mb-4">
                                <ShieldCheck className="text-orange-500" size={24} />
                                <h3 className="text-xl font-extrabold text-foreground tracking-tight">Industrial Durability</h3>
                            </div>
                            <p className="text-muted-foreground text-sm">
                                Waschbar bis 90°C. Bügelfest. Unzerstörbarer PPS-Industrie-Standard.
                            </p>
                        </div>
                        <div className="relative z-10 flex gap-2">
                            <div className="w-16 h-16 rounded-xl bg-orange-500/10 flex flex-col items-center justify-center border border-orange-500/20 text-orange-400">
                                <ThermometerSun size={24} className="mb-1" />
                                <span className="text-[10px] font-bold">90°C</span>
                            </div>
                            <div className="w-16 h-16 rounded-xl bg-blue-500/10 flex flex-col items-center justify-center border border-blue-500/20 text-blue-400">
                                <Waves size={24} className="mb-1" />
                                <span className="text-[10px] font-bold">Water</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Kachel 3: Context Aware */}
                    <motion.div
                        {...fadeUp(0.2)}
                        className="md:col-span-1 md:row-span-1 rounded-3xl glass-card p-6 flex flex-col relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <h3 className="text-lg font-extrabold text-foreground mb-2 tracking-tight">Context Aware</h3>
                        <p className="text-muted-foreground text-xs mb-4">
                            Der Chip weiß, wo er ist. Zeigen Sie im Büro Ihre Card, auf der Messe Ihren Pitch.
                        </p>
                        <div className="mt-auto flex border border-border/50 rounded-lg overflow-hidden h-24">
                            <div className="flex-1 bg-muted/20 flex flex-col items-center justify-center border-r border-border/50">
                                <Briefcase size={20} className="text-purple-400 mb-2" />
                                <span className="text-[10px] text-muted-foreground">Büro</span>
                            </div>
                            <div className="flex-1 bg-purple-500/10 flex flex-col items-center justify-center">
                                <Store size={20} className="text-foreground mb-2" />
                                <span className="text-[10px] text-foreground font-bold">Messe</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Kachel 4: Ghost Mode */}
                    <motion.div
                        {...fadeUp(0.3)}
                        className="md:col-span-1 md:row-span-1 rounded-3xl glass-card p-6 flex flex-col relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-extrabold text-foreground tracking-tight">Ghost Mode</h3>
                            <div className={`p-2 rounded-full ${isGhostMode ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'} transition-colors duration-500`}>
                                {isGhostMode ? <Lock size={16} /> : <Unlock size={16} />}
                            </div>
                        </div>
                        <p className="text-muted-foreground text-xs mt-auto">
                            Privatsphäre auf Knopfdruck. Deaktivieren Sie den Chip nach Feierabend.
                        </p>
                    </motion.div>

                    {/* Kachel 5: KI-Assistent */}
                    <motion.div
                        {...fadeUp(0.1)}
                        className="md:col-span-2 md:row-span-1 rounded-3xl glass-card p-8 flex flex-col relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
                                <Bot size={24} />
                            </div>
                            <h3 className="text-xl font-extrabold text-foreground mb-2 tracking-tight">KI-Assistent</h3>
                            <p className="text-muted-foreground text-sm">
                                Ihr digitaler Klon antwortet auf Fragen – 24/7, trainiert mit Ihrem Wissen. Besucher chatten direkt auf Ihrem Profil.
                            </p>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-medium">Business</div>
                            <div className="px-3 py-1.5 rounded-full bg-muted/50 border border-border/50 text-[11px] text-muted-foreground">Eigene Wissensbasis</div>
                        </div>
                    </motion.div>

                    {/* Kachel 6: Video-Begrüßung */}
                    <motion.div
                        {...fadeUp(0.2)}
                        className="md:col-span-1 md:row-span-1 rounded-3xl glass-card p-6 flex flex-col relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center mb-4 text-pink-400">
                            <Video size={20} />
                        </div>
                        <h3 className="text-lg font-extrabold text-foreground mb-2 tracking-tight">Video-Begrüßung</h3>
                        <p className="text-muted-foreground text-xs">
                            Persönliches Loom-Style Greeting direkt auf Ihrer Visitenkarte. Maximale Persönlichkeit.
                        </p>
                    </motion.div>

                    {/* Kachel 7: Top-Performer Ranking */}
                    <motion.div
                        {...fadeUp(0.3)}
                        className="md:col-span-1 md:row-span-1 rounded-3xl glass-card p-6 flex flex-col relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4 text-amber-400">
                            <Trophy size={20} />
                        </div>
                        <h3 className="text-lg font-extrabold text-foreground mb-2 tracking-tight">Top-Performer</h3>
                        <p className="text-muted-foreground text-xs">
                            Gamification für Ihr Sales-Team. Wer sammelt die meisten Leads? Live-Ranking im Dashboard.
                        </p>
                    </motion.div>

                    {/* Kachel 8: Profil-Presets */}
                    <motion.div
                        {...fadeUp(0.1)}
                        className="md:col-span-2 md:row-span-1 rounded-3xl glass-card p-8 flex items-center gap-6 relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative z-10 flex-1">
                            <div className="flex items-center gap-2 mb-4">
                                <Layers className="text-cyan-400" size={24} />
                                <h3 className="text-xl font-extrabold text-foreground tracking-tight">Profil-Presets</h3>
                            </div>
                            <p className="text-muted-foreground text-sm">
                                Speichern Sie Konfigurationen für verschiedene Events. Ein Klick – und Ihr Profil wechselt vom Büro-Look zum Messe-Pitch.
                            </p>
                        </div>
                        <div className="relative z-10 flex flex-col gap-1.5 min-w-[120px]">
                            {["Messe CES", "Office", "Konferenz"].map((preset, i) => (
                                <div key={preset} className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${i === 0 ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" : "bg-muted/30 border-border/50 text-muted-foreground"}`}>
                                    {i === 0 && "● "}{preset}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Kachel 9: CSV Export */}
                    <motion.div
                        {...fadeUp(0.2)}
                        className="md:col-span-2 md:row-span-1 rounded-3xl glass-card p-8 flex items-center gap-6 relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative z-10 flex-1">
                            <div className="flex items-center gap-2 mb-4">
                                <FileDown className="text-indigo-400" size={24} />
                                <h3 className="text-xl font-extrabold text-foreground tracking-tight">CSV Export & Bulk Import</h3>
                            </div>
                            <p className="text-muted-foreground text-sm">
                                Exportieren Sie Leads als CSV für Ihr CRM. Enterprise-Kunden importieren hunderte Chips per CSV in Sekunden.
                            </p>
                        </div>
                        <div className="relative z-10 flex gap-2">
                            <div className="px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-400 font-medium">Business+</div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
