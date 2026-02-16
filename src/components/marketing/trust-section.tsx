import React from 'react';
import { motion } from 'framer-motion';

const TrustIcon = ({ children, delay }: { children: React.ReactNode; delay: number }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="w-24 h-24 mb-6 rounded-2xl bg-card border border-border flex items-center justify-center relative overflow-hidden group shadow-2xl"
    >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {children}
    </motion.div>
);

const TrustCard = ({ icon, title, description, delay }: { icon: React.ReactNode; title: string; description: string; delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
        className="flex flex-col items-center text-center p-8 rounded-3xl bg-background border border-border relative overflow-hidden hover:border-foreground/20 transition-colors duration-300"
    >
        {/* Glow effect */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />

        <TrustIcon delay={delay + 0.2}>{icon}</TrustIcon>

        <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">{title}</h3>
        <p className="text-muted-foreground leading-relaxed text-sm max-w-sm">{description}</p>
    </motion.div>
);

export function TrustSection() {
    return (
        <section className="py-24 bg-background relative z-30">
            <div className="container mx-auto px-6">

                <div className="text-center mb-24 max-w-2xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground mb-6"
                    >
                        Trust by Design.<br />Security by Default.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground text-lg"
                    >
                        Enterprise-Grade Compliance, Privacy-First Architecture und Industrial Durability.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* 1. DSGVO / Privacy Icon */}
                    <TrustCard
                        delay={0.1}
                        title="DSGVO & Data Sovereignty"
                        description="Vollständig DSGVO-konform mit EU-Hosting. End-to-End Encryption, Data Residency in Deutschland und SOC 2 Type II konforme Infrastruktur."
                        icon={
                            <svg viewBox="0 0 24 24" className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <motion.path
                                    initial={{ pathLength: 0 }}
                                    whileInView={{ pathLength: 1 }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                    d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                                />
                                <motion.path
                                    initial={{ pathLength: 0 }}
                                    whileInView={{ pathLength: 1 }}
                                    transition={{ duration: 0.5, delay: 1, ease: "easeOut" }}
                                    d="M9 12l2 2 4-4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        }
                    />

                    {/* 2. Ghost Mode Icon */}
                    <TrustCard
                        delay={0.2}
                        title="Ghost Mode™"
                        description="Granulare Privacy Controls mit Opt-in/Opt-out Toggle. Temporäre oder permanente Device-Deaktivierung – User-centric Data Governance."
                        icon={
                            <svg viewBox="0 0 24 24" className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <motion.path
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ duration: 1 }}
                                    d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                                />
                                <motion.circle
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                    cx="12" cy="12" r="3"
                                />
                                <motion.path
                                    initial={{ pathLength: 0 }}
                                    whileInView={{ pathLength: 1 }}
                                    transition={{ duration: 0.5, delay: 0.8 }}
                                    d="M3 3l18 18"
                                    className="stroke-red-500/80"
                                    strokeWidth="2"
                                />
                            </svg>
                        }
                    />

                    {/* 3. Washing Guarantee Icon */}
                    <TrustCard
                        delay={0.3}
                        title="365-Day Durability SLA"
                        description="IP67-rated NFC-Module mit garantierter Funktionalität über 500+ Industriewaschzyklen. Hardware Warranty inklusive."
                        icon={
                            <svg viewBox="0 0 24 24" className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="1.5">
                                {/* Water drop shape */}
                                <motion.path
                                    initial={{ pathLength: 0 }}
                                    whileInView={{ pathLength: 1 }}
                                    transition={{ duration: 1.5 }}
                                    d="M12 22a7 7 0 007-7c0-2-1-3.9-3-5.5S12 5 12 5s-4 2.5-4 4.5S8 13 8 15a7 7 0 004 7z"
                                />
                                {/* Chip inside drop */}
                                <motion.rect
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.8, duration: 0.4 }}
                                    x="10" y="12" width="4" height="6" rx="1"
                                    className="fill-cyan-400/20 stroke-cyan-400"
                                />
                                {/* Sparkles */}
                                <motion.path
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ delay: 1.2, repeat: Infinity, repeatType: "reverse", duration: 1 }}
                                    d="M16 8l2-2m-2 2l-2-2"
                                    strokeWidth="1"
                                />
                            </svg>
                        }
                    />

                </div>
            </div>
        </section>
    );
}
