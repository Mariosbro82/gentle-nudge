"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

export function AnalyticsSection() {
    return (
        <section className="py-24 bg-muted/30 border-t border-border/50 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 flex flex-col items-center relative z-10">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-center mb-12 max-w-3xl"
                >
                    <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-mono mb-4 inline-block">
                        DATA DRIVEN MERCH
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-6 tracking-tight leading-tight">
                        Leads werden endlich <span className="text-green-400">messbar.</span>
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Auf Messen und Events sind Kontakte oft unsichtbar. Mit NFCwear sehen Sie live auf dem Dashboard, welcher Mitarbeiter performt und wer wirklich konvertiert.
                    </p>
                </motion.div>

                {/* Mock Dashboard Window */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full max-w-5xl rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
                >
                    {/* Window Header */}
                    <div className="h-10 bg-muted/50 border-b border-border/50 flex items-center px-4 gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                        <div className="ml-4 h-6 w-64 bg-background/50 rounded-sm border border-border/50 flex items-center px-2 text-xs text-muted-foreground font-mono">
                            severmore-analytics.app
                        </div>
                    </div>

                    {/* Dashboard Content Mock */}
                    <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Sidebar */}
                        <div className="hidden md:block col-span-1 space-y-4">
                            <div className="h-10 w-full bg-muted/50 rounded-lg border border-border/50 flex items-center px-3 gap-3">
                                <div className="w-4 h-4 bg-blue-500/50 rounded-sm" />
                                <div className="h-2 w-20 bg-muted-foreground/20 rounded-full" />
                            </div>
                            <div className="h-8 w-3/4 bg-transparent rounded-lg flex items-center px-3 gap-3 opacity-50">
                                <div className="w-4 h-4 bg-muted-foreground/20 rounded-sm" />
                                <div className="h-2 w-16 bg-muted-foreground/20 rounded-full" />
                            </div>
                            <div className="h-8 w-3/4 bg-transparent rounded-lg flex items-center px-3 gap-3 opacity-50">
                                <div className="w-4 h-4 bg-muted-foreground/20 rounded-sm" />
                                <div className="h-2 w-12 bg-muted-foreground/20 rounded-full" />
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="col-span-2 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    { label: "Total Scans", value: "1,248", trend: "+24% vs. Vormonat", color: "blue" },
                                    { label: "Neue Leads", value: "386", trend: "+12% vs. Vormonat", color: "purple" },
                                    { label: "Conversion", value: "31%", trend: "— Stabil", color: "orange" },
                                ].map((kpi) => (
                                    <div key={kpi.label} className={`h-28 flex-1 bg-muted/20 rounded-xl border border-border/50 p-4 relative overflow-hidden group transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)]`}>
                                        <div className={`absolute inset-0 bg-${kpi.color}-500/5 group-hover:bg-${kpi.color}-500/10 transition-colors`} />
                                        <p className="text-muted-foreground text-xs uppercase font-bold mb-2 tracking-wide">{kpi.label}</p>
                                        <p className="text-3xl font-bold text-foreground tracking-tight">{kpi.value}</p>
                                        <span className={`text-xs flex items-center gap-1 mt-1 ${kpi.trend.startsWith('+') ? 'text-green-400' : 'text-muted-foreground'}`}>
                                            {kpi.trend.startsWith('+') && <BarChart3 size={12} />} {kpi.trend}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Chart Area */}
                            <div className="h-64 bg-muted/20 rounded-xl border border-border/50 relative overflow-hidden p-4 flex items-end justify-between gap-2">
                                {[40, 60, 45, 70, 50, 80, 65, 90, 75, 55, 85, 95].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        whileInView={{ height: `${h}%` }}
                                        transition={{ delay: i * 0.05, duration: 0.5 }}
                                        className="w-full bg-blue-500/20 hover:bg-blue-500/50 transition-colors rounded-t-sm relative group"
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            {h * 12} Scans
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                    </div>
                </motion.div>

                <div className="mt-12 flex flex-col items-center gap-4">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-mono">
                            +60% mehr Leads
                        </span>
                        <span className="text-border">|</span>
                        <span>🏆 Gründungspreis U21 Gewinner</span>
                        <span className="text-border hidden md:inline">|</span>
                        <span className="hidden md:inline">Rated 5/5 ⭐</span>
                    </div>
                    <Link to="/analytics">
                        <Button variant="link" className="text-muted-foreground hover:text-foreground transition-colors duration-300">
                            Alle Analytics Features ansehen <ArrowRight size={16} className="ml-1" />
                        </Button>
                    </Link>
                </div>

            </div>
        </section>
    );
}
