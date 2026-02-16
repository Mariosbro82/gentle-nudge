"use client";

import { useScroll, useTransform } from "framer-motion";
import React from "react";
import { GoogleGeminiEffect } from "@/components/ui/google-gemini-effect";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
    const ref = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
    const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
    const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
    const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
    const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);

    return (
        <div
            className="h-[400vh] bg-background w-full dark:border dark:border-white/[0.1] relative pt-0 overflow-clip"
            ref={ref}
        >
            <GoogleGeminiEffect
                pathLengths={[
                    pathLengthFirst,
                    pathLengthSecond,
                    pathLengthThird,
                    pathLengthFourth,
                    pathLengthFifth,
                ]}
            >
                <div className="container mx-auto px-6 text-center relative z-20 pt-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="px-4 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 backdrop-blur-md text-sm text-yellow-600 dark:text-yellow-200 inline-flex items-center gap-2 mb-8">
                            <Sparkles size={14} className="text-yellow-500 dark:text-yellow-400" />
                            Sonderpreis U21 Gewinner 2025 🏆
                        </span>

                        <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground mb-8">
                            Kleidung, die <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-zinc-900 dark:from-blue-400 dark:via-purple-400 dark:to-white animate-gradient">
                                verbindet.
                            </span>
                        </h1>

                        <p className="text-xl md:text-3xl font-light text-muted-foreground max-w-2xl mx-auto mb-24 leading-relaxed tracking-wide">
                            Die SaaS-Plattform für Wearable Intelligence.
                        </p>



                        {/* Scroll Indicator */}



                        <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full md:w-auto mt-40 relative z-50">
                            <Button size="lg" className="h-16 px-10 rounded-full bg-foreground text-background hover:bg-zinc-800 dark:hover:bg-zinc-200 text-lg font-semibold shadow-[0_0_40px_-10px_rgba(0,0,0,0.3)] dark:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all hover:scale-105" onClick={() => window.location.href = 'mailto:contact@nfcwear.com'}>
                                Demo buchen
                            </Button>
                            <Button size="lg" variant="outline" className="h-16 px-10 rounded-full border-zinc-200 bg-white/50 dark:border-white/10 dark:bg-white/5 backdrop-blur-md hover:bg-zinc-100 dark:hover:bg-white/10 text-foreground text-lg transition-all hover:scale-105" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                                Mehr erfahren <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </GoogleGeminiEffect>
        </div>
    );
}
