"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function AnalyticsPreview() {
    return (
        <section className="py-24 bg-background border-t border-border">
            <div className="container mx-auto px-4 flex flex-col items-center">

                <div className="text-center mb-12 max-w-3xl">
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                        Leads werden endlich <span className="text-green-400">messbar.</span>
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Auf Messen sind Leads oft unsichtbar. Mit NFCwear sehen Sie live auf dem Dashboard, welcher Mitarbeiter performt und wer konvertiert.
                    </p>
                </div>

                {/* Mock Dashboard Window */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="w-full max-w-5xl rounded-xl border border-border shadow-2xl bg-card overflow-hidden backdrop-blur-md"
                >
                    {/* Window Header */}
                    <div className="h-10 bg-muted border-b border-border flex items-center px-4 gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                        <div className="ml-4 h-6 w-64 bg-background/20 rounded-sm" />
                    </div>

                    {/* Dashboard Content Mock */}
                    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Sidebar */}
                        <div className="hidden md:block col-span-1 space-y-4">
                            <div className="h-8 w-32 bg-muted/20 rounded-md" />
                            <div className="h-4 w-24 bg-muted/20 rounded-md" />
                            <div className="h-4 w-20 bg-muted/20 rounded-md" />
                            <div className="h-4 w-28 bg-muted/20 rounded-md" />
                        </div>

                        {/* Main Content */}
                        <div className="col-span-2 space-y-6">
                            <div className="flex gap-4">
                                <div className="h-24 flex-1 bg-muted/20 rounded-xl border border-border p-4">
                                    <div className="h-4 w-12 bg-muted/30 rounded-sm mb-2" />
                                    <div className="h-8 w-16 bg-muted/40 rounded-md" />
                                </div>
                                <div className="h-24 flex-1 bg-muted/20 rounded-xl border border-border p-4">
                                    <div className="h-4 w-12 bg-muted/30 rounded-sm mb-2" />
                                    <div className="h-8 w-16 bg-muted/40 rounded-md" />
                                </div>
                                <div className="h-24 flex-1 bg-muted/20 rounded-xl border border-border p-4">
                                    <div className="h-4 w-12 bg-muted/30 rounded-sm mb-2" />
                                    <div className="h-8 w-16 bg-muted/40 rounded-md" />
                                </div>
                            </div>
                            <div className="h-64 bg-muted/20 rounded-xl border border-border relative overflow-hidden">
                                {/* Mock Chart Line */}
                                <svg className="w-full h-full absolute bottom-0 z-0" preserveAspectRatio="none">
                                    <path d="M0,200 C150,200 150,100 300,100 C450,100 450,50 600,50 L600,300 L0,300 Z" fill="rgba(59, 130, 246, 0.1)" />
                                    <path d="M0,200 C150,200 150,100 300,100 C450,100 450,50 600,50" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="2" fill="none" />
                                </svg>
                            </div>
                        </div>

                    </div>
                </motion.div>

                <div className="mt-12">
                    <Button variant="link" className="text-muted-foreground hover:text-foreground">
                        Mehr Analytics Features ansehen <ArrowRight size={16} className="ml-1" />
                    </Button>
                </div>

            </div>
        </section>
    );
}
