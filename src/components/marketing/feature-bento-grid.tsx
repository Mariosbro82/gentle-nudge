"use client";

import { motion } from "framer-motion";
import {
    Database,
    Share2,
    Slack,
    Webhook,
    ShieldCheck,
    Waves,
    ThermometerSun,
    Briefcase,
    Store,
    Lock,
    Unlock
} from "lucide-react";
import { useState, useEffect } from "react";

export function FeatureBentoGrid() {
    const [isGhostMode, setIsGhostMode] = useState(false);

    // Toggle ghost mode every 3 seconds for demo
    useEffect(() => {
        const interval = setInterval(() => {
            setIsGhostMode((prev) => !prev);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Unfair Advantages.
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                        Technologische Überlegenheit, die man spürt.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto auto-rows-[minmax(250px,auto)]">

                    {/* Kachel 1 (Large): Deep CRM Integration */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="md:col-span-2 md:row-span-2 rounded-3xl bg-zinc-900/.50 border border-white/10 p-8 flex flex-col justify-between overflow-hidden relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6 text-blue-400">
                                <Webhook size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Deep CRM Integration</h3>
                            <p className="text-zinc-400 mb-8">
                                Wir schreiben Leads direkt in Ihre Systeme via Webhook. Sparen Sie 5h Tipparbeit pro Messe.
                            </p>
                        </div>

                        {/* Visual: Simulated CRM Connection */}
                        <div className="relative mt-4 h-48 bg-zinc-950/50 rounded-xl border border-white/5 p-6 flex flex-col justify-center items-center gap-8">
                            {/* Connection Lines */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 200">
                                <path d="M200 100 L 80 50" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
                                <path d="M200 100 L 320 50" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
                                <path d="M200 100 L 80 150" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
                                <path d="M200 100 L 320 150" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
                            </svg>

                            <div className="relative z-10 bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                                <span className="font-bold text-white text-xl">N</span>
                            </div>

                            <div className="grid grid-cols-2 gap-x-32 gap-y-4 w-full px-8">
                                <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono bg-zinc-900 px-3 py-1.5 rounded-full border border-white/5">
                                    <Database size={12} /> Salesforce
                                </div>
                                <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono bg-zinc-900 px-3 py-1.5 rounded-full border border-white/5 justify-self-end">
                                    <Share2 size={12} /> HubSpot
                                </div>
                                <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono bg-zinc-900 px-3 py-1.5 rounded-full border border-white/5">
                                    <Slack size={12} /> Slack
                                </div>
                                <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono bg-zinc-900 px-3 py-1.5 rounded-full border border-white/5 justify-self-end">
                                    <Webhook size={12} /> Pipedrive
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Kachel 2 (Medium): Industrial Durability */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="md:col-span-2 md:row-span-1 rounded-3xl bg-zinc-900/50 border border-white/10 p-8 flex items-center justify-between relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10 max-w-[60%]">
                            <div className="flex items-center gap-2 mb-4">
                                <ShieldCheck className="text-orange-500" size={24} />
                                <h3 className="text-xl font-bold text-white">Industrial Durability</h3>
                            </div>
                            <p className="text-zinc-400 text-sm">
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

                    {/* Kachel 3 (Medium): Context Aware */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-1 md:row-span-1 rounded-3xl bg-zinc-900/50 border border-white/10 p-6 flex flex-col relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <h3 className="text-lg font-bold text-white mb-2">Context Aware</h3>
                        <p className="text-zinc-400 text-xs mb-4">
                            Der Chip weiß, wo er ist. Zeigen Sie im Büro Ihre Card, auf der Messe Ihren Pitch.
                        </p>

                        <div className="mt-auto flex border border-white/10 rounded-lg overflow-hidden h-24">
                            <div className="flex-1 bg-white/5 flex flex-col items-center justify-center border-r border-white/10">
                                <Briefcase size={20} className="text-purple-400 mb-2" />
                                <span className="text-[10px] text-zinc-400">Büro</span>
                            </div>
                            <div className="flex-1 bg-purple-500/10 flex flex-col items-center justify-center">
                                <Store size={20} className="text-white mb-2" />
                                <span className="text-[10px] text-white font-bold">Messe</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Kachel 4 (Small): Ghost Mode */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="md:col-span-1 md:row-span-1 rounded-3xl bg-zinc-900/50 border border-white/10 p-6 flex flex-col relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-bold text-white">Ghost Mode</h3>
                            <div className={`p-2 rounded-full ${isGhostMode ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'} transition-colors duration-500`}>
                                {isGhostMode ? <Lock size={16} /> : <Unlock size={16} />}
                            </div>
                        </div>
                        <p className="text-zinc-400 text-xs mt-auto">
                            Privatsphäre auf Knopfdruck. Deaktivieren Sie den Chip nach Feierabend.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
