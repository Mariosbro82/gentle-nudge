import { motion } from "framer-motion";
import { UserX, BarChart3, Keyboard, Cpu, Circle, Layers } from "lucide-react";

const fadeUp = {
    initial: { opacity: 0, y: 20 } as const,
    whileInView: { opacity: 1, y: 0 } as const,
    viewport: { once: true } as const,
    transition: { duration: 0.5, ease: "easeOut" as const },
};

export function IdeaSection() {
    return (
        <section id="idea" className="py-24 relative overflow-hidden bg-background z-20">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground mb-6 leading-tight">
                        Unsere Idee
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Corporate Fashion war bisher ein blinder Fleck. Wir denken Textilien als <span className="text-blue-400 font-semibold">digitale Schnittstelle</span>.
                        Was wäre, wenn dein Hoodie gleichzeitig Visitenkarte, Zahlungsterminal und Marketing-Kanal wäre?
                    </p>
                </motion.div>

                {/* The Problem Grid */}
                <div className="mb-24">
                    <motion.h3 {...fadeUp} className="text-2xl font-extrabold text-foreground mb-8 text-center tracking-tight">Das Problem</motion.h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: UserX, color: "red", title: "Leads gehen verloren", desc: "Ohne automatisiertes Capturing gehen bis zu 70% der Kontakte auf Events verloren – ein massiver Revenue Gap." },
                            { icon: BarChart3, color: "orange", title: "Keine Messbarkeit", desc: "Klassisches Merch liefert keine Daten. Ohne KPIs kein fundiertes Entscheiden – ein blinder Fleck im Marketing." },
                            { icon: Keyboard, color: "yellow", title: "Manueller Aufwand", desc: "Visitenkarten müssen mühsam abgetippt werden – ein fehleranfälliger Prozess mit unnötig langer Time-to-CRM." },
                        ].map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                                className="p-8 rounded-3xl glass-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] group flex flex-col items-center text-center"
                            >
                                <div className={`w-12 h-12 rounded-full bg-${item.color}-500/20 flex items-center justify-center mb-6 group-hover:bg-${item.color}-500/30 transition-colors`}>
                                    <item.icon className={`w-6 h-6 text-${item.color}-400`} />
                                </div>
                                <h4 className="text-xl font-bold text-foreground mb-3 tracking-tight">{item.title}</h4>
                                <p className="text-muted-foreground text-sm">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Engineering Section */}
                <div className="relative mb-32">
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-blue-500/5 rounded-[3rem] blur-3xl -z-10" />

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div {...fadeUp} className="text-left">
                            <h3 className="text-3xl md:text-4xl font-extrabold text-foreground mb-6 tracking-tight leading-tight">
                                Engineering trifft Fashion.
                            </h3>
                            <p className="text-lg text-muted-foreground mb-12">
                                Jedes Stück wird mit obsessiver Liebe zum Detail entwickelt. Von der optimalen Chip-Positionierung bis zur Textilkomposition – nichts wird dem Zufall überlassen.
                            </p>

                            <div className="space-y-8">
                                {[
                                    { icon: Cpu, color: "blue", title: "NTAG424 DNA", desc: "NFC-Chips mit militärischer Sicherheit und SUN-Authentifizierung. Die sicherste Consumer-NFC-Technologie." },
                                    { icon: Circle, color: "purple", title: "35mm Runde Tags", desc: "Premium NFC-Tags nahtlos in den Stoff integriert. Unsichtbar, aber immer erreichbar." },
                                    { icon: Layers, color: "pink", title: "Double-Woven Tech", desc: "Proprietäre Doppelwebtechnologie für Haltbarkeit über 500+ Waschzyklen." },
                                ].map((f, i) => (
                                    <motion.div
                                        key={f.title}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                                        className="flex gap-4"
                                    >
                                        <div className="w-12 h-12 rounded-2xl glass-subtle flex items-center justify-center flex-shrink-0">
                                            <f.icon className={`w-6 h-6 text-${f.color}-400`} />
                                        </div>
                                        <div>
                                            <h4 className="text-foreground font-bold mb-1 tracking-tight">{f.title}</h4>
                                            <p className="text-muted-foreground text-sm">{f.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Technical Drawing Placeholder */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="relative aspect-[4/5] glass-card rounded-3xl flex items-center justify-center overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
                        >
                            <video
                                src="/assets/best-render-vid.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    </div>
                </div>


            </div>
        </section>
    );
}
