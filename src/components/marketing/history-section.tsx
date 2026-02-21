"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const milestones = [
    {
        year: "2023",
        title: "Zwei Schüler. Ein Klassenzimmer.",
        desc: "Im Klassenzimmer des Gymnasium Winsen entwerfen Tjark & Noah mit 16 Jahren das erste Konzept für Connected Fashion. Die Idee: Schulkleidung war ihnen zu analog.",
        image: "/images/journey/founders-1.jpg",
        accent: "Kapitel I",
    },
    {
        year: "2024",
        title: "Gegen alle Widerstände.",
        desc: "Banken winkten ab. Das Familiengericht ließ 6 Monate warten. Trotzdem: Gründung der Severmore UG — als jüngste Unternehmer der Region.",
        image: "/images/journey/founding-signing.jpg",
        accent: "Kapitel II",
    },
    {
        year: "2025",
        title: "Sonderpreis U21.",
        desc: "Gewinn des Gründungspreises Landkreis Harburg. Launch der Jubiläums-Kollektion. Der Beweis: Alter ist nur eine Zahl.",
        image: "/images/journey/award-ceremony-new.jpg",
        accent: "Kapitel III",
    },
    {
        year: "—",
        title: "Das ist erst der Anfang.",
        desc: "Abitur in der Tasche, Studium im Blick. NFCwear wird zur führenden Plattform für intelligente Textilien in Europa.",
        image: "/images/journey/founders-team.jpg",
        accent: "Zukunft",
    },
];

function MilestoneCard({ milestone, index }: { milestone: typeof milestones[0]; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "center center"],
    });
    const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
    const y = useTransform(scrollYProgress, [0, 0.6], [60, 0]);

    const isEven = index % 2 === 0;

    return (
        <motion.div
            ref={ref}
            style={{ opacity, y }}
            className={`grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-0 items-center ${isEven ? "" : "md:direction-rtl"}`}
        >
            {/* Image */}
            <div className={`md:col-span-5 ${isEven ? "md:col-start-1" : "md:col-start-8"}`} style={{ direction: "ltr" }}>
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] group">
                    <img
                        src={milestone.image}
                        alt={milestone.title}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                    />
                    {/* Subtle overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    {/* Year overlay */}
                    <div className="absolute bottom-4 left-4">
                        <span className="text-white/90 text-6xl font-black tracking-tighter leading-none" style={{ fontFeatureSettings: "'tnum'" }}>
                            {milestone.year}
                        </span>
                    </div>
                </div>
            </div>

            {/* Connector line (desktop) */}
            <div className="hidden md:flex md:col-span-2 items-center justify-center" style={{ direction: "ltr" }}>
                <div className="w-full h-px bg-border relative">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-foreground/20 bg-background" />
                </div>
            </div>

            {/* Text */}
            <div className={`md:col-span-5 ${isEven ? "md:col-start-8" : "md:col-start-1"}`} style={{ direction: "ltr" }}>
                <div className="space-y-3">
                    <span className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
                        {milestone.accent}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-tight">
                        {milestone.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-base max-w-md">
                        {milestone.desc}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

export function HistorySection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });
    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    return (
        <section id="history" ref={containerRef} className="py-24 md:py-40 bg-background relative">
            <div className="container mx-auto px-6">
                {/* Header — editorial, left-aligned */}
                <div className="max-w-3xl mb-20 md:mb-32">
                    <span className="text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground mb-4 block">
                        Unsere Reise
                    </span>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[0.95]">
                        Von der Schulbank
                        <br />
                        zum Startup.
                    </h2>
                    <p className="text-muted-foreground text-lg mt-6 max-w-xl leading-relaxed">
                        Severmore ist der Beweis, dass man mit 16 Jahren
                        Industrien verändern kann. Kein VC, kein MBA — nur Überzeugung.
                    </p>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical progress line (desktop only) */}
                    <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-border">
                        <motion.div
                            className="w-full bg-foreground/20 origin-top"
                            style={{ height: lineHeight }}
                        />
                    </div>

                    <div className="space-y-16 md:space-y-28">
                        {milestones.map((milestone, i) => (
                            <MilestoneCard key={i} milestone={milestone} index={i} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
