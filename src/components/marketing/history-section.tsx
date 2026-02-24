"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const milestones = [
    {
        year: "2023",
        title: "Zwei Schüler. Ein Klassenzimmer.",
        desc: "Im Klassenzimmer des Gymnasium Winsen entwerfen Tjark & Noah mit 16 Jahren das erste Konzept für Connected Fashion. Die Idee: Schulkleidung war ihnen zu analog.",
        image: "/images/journey/founders-team.jpg",
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
        image: "/images/journey/founders-team-new.jpg",
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
            className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-0 items-center"
        >
            {/* Image */}
            <div className={`md:col-span-5 ${isEven ? "md:col-start-1 md:order-1" : "md:col-start-8 md:order-3"}`}>
                <div className="relative overflow-hidden rounded-xl aspect-[4/3] group">
                    <img
                        src={milestone.image}
                        alt={milestone.title}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                        loading="lazy"
                    />
                    {/* Year badge overlay */}
                    <div className="absolute top-4 left-4">
                        <span className="inline-block px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-mono tracking-widest text-foreground border border-border/30">
                            {milestone.accent}
                        </span>
                    </div>
                    <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-4 left-5">
                        <span className="text-white text-5xl md:text-6xl font-black tracking-tighter leading-none drop-shadow-lg" style={{ fontFeatureSettings: "'tnum'" }}>
                            {milestone.year}
                        </span>
                    </div>
                </div>
            </div>

            {/* Center connector */}
            <div className="hidden md:flex md:col-span-2 md:col-start-6 md:order-2 items-center justify-center relative">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-border bg-background ring-4 ring-background z-10" />
            </div>

            {/* Text */}
            <div className={`md:col-span-5 ${isEven ? "md:col-start-8 md:order-3" : "md:col-start-1 md:order-1"}`}>
                <div className="space-y-4 md:py-8">
                    <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
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
    const lineHeight = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);

    return (
        <section id="history" ref={containerRef} className="py-24 md:py-40 bg-background relative overflow-hidden">
            <div className="container mx-auto px-6">
                {/* Header — asymmetric editorial */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-20 md:mb-32">
                    <div className="md:col-span-7">
                        <span className="text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground mb-5 block">
                            Unsere Reise
                        </span>
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[0.95]">
                            Von der Schulbank
                            <br />
                            zum Startup.
                        </h2>
                    </div>
                    <div className="md:col-span-4 md:col-start-9 flex items-end">
                        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                            Severmore ist der Beweis, dass man mit 16 Jahren Industrien verändern kann.
                            Kein VC, kein MBA — nur Überzeugung und zwei Jungs mit einer Idee.
                        </p>
                    </div>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical line (desktop) */}
                    <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-border/40">
                        <motion.div
                            className="w-full bg-foreground/15 origin-top"
                            style={{ height: lineHeight }}
                        />
                    </div>

                    <div className="space-y-12 md:space-y-24">
                        {milestones.map((milestone, i) => (
                            <MilestoneCard key={i} milestone={milestone} index={i} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
