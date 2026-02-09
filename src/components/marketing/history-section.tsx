"use client";

import { motion } from "framer-motion";

export function HistorySection() {
    const steps = [
        {
            year: "2023",
            title: "Der Ursprung",
            subtitle: "Zwei Schüler, eine Idee.",
            desc: "Im Klassenzimmer des Gymnasium Winsen entstand der Plan: Warum ist Schulkleidung so ... analog? Tjark & Noah (damals 16) entwerfen das erste Konzept für 'Connected Fashion'."
        },
        {
            year: "2024",
            title: "Gegen alle Widerstände",
            subtitle: "Keine Geschäftsfähigkeit? Kein Problem.",
            desc: "Banken winkten ab, das Familiengericht ließ uns 6 Monate warten. Doch wir gaben nicht auf. Gründung der Severmore UG – als jüngste Unternehmer der Region."
        },
        {
            year: "2025",
            title: "Die Anerkennung",
            subtitle: "Sonderpreis U21 & Durchbruch.",
            desc: "Der Beweis, dass Alter nur eine Zahl ist. Gewinn des Gründungspreises Landkreis Harburg. Launch der Jubiläums-Kollektion für unsere eigene Schule."
        },
        {
            year: "Zukunft",
            title: "Die Vision: Severmore",
            subtitle: "Ingenieurskunst trifft Business.",
            desc: "Abitur in der Tasche, Studium im Blick. Wir skalieren NFCwear zur führenden Plattform für intelligente Textilien in Europa. Das ist erst der Anfang."
        }
    ];

    return (
        <section id="history" className="py-32 bg-background relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-24">
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border text-xs font-mono mb-6 inline-block tracking-widest uppercase">
                        Unsere Reise
                    </span>
                    <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">Von Schülern zu <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Pionieren.</span></h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
                        Severmore ist mehr als eine Firma. Es ist der Beweis, dass man mit 16 Jahren Industrien verändern kann.
                    </p>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    {/* Central Line */}
                    <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-1 bg-border rounded-full overflow-hidden">
                        <motion.div
                            initial={{ height: 0 }}
                            whileInView={{ height: "100%" }}
                            transition={{ duration: 2, ease: "linear" }}
                            className="w-full bg-gradient-to-b from-blue-500 via-purple-500 to-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)]"
                        />
                    </div>

                    <div className="space-y-24">
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ margin: "-100px" }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                className={`relative flex flex-col md:flex-row gap-12 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                            >

                                {/* Center Node */}
                                <div className="absolute left-0 md:left-1/2 w-10 h-10 -ml-5 bg-background border-4 border-border rounded-full z-20 flex items-center justify-center shadow-xl group">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full group-hover:scale-150 transition-transform duration-500 shadow-[0_0_10px_rgba(59,130,246,1)]" />
                                </div>

                                {/* Spacer for layout balance */}
                                <div className="flex-1 hidden md:block" />

                                {/* Content Card */}
                                <div className="flex-1 pl-12 md:pl-0">
                                    <div className={`relative p-8 rounded-3xl bg-card border border-border backdrop-blur-sm hover:border-blue-500/20 transition-all duration-500 group ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>

                                        {/* Year Badge */}
                                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold font-mono text-sm mb-6 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                            {step.year}
                                        </div>

                                        <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-blue-200 transition-colors">{step.title}</h3>
                                        <div className="text-lg font-medium text-muted-foreground mb-4">{step.subtitle}</div>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
