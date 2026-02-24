import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function FoundersSection() {
    return (
        <section className="py-24 bg-muted/30 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-center mb-20"
                >
                    <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-6 tracking-tight leading-tight">Die Köpfe hinter Severmore</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Aus einer Schulhof-Idee zum Tech-Startup. Wir verbinden Technologie mit Mode – direkt aus Winsen.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                    {[
                        { name: "Tjark Schmitt", role: "Co-Founder & Product", img: "/images/founders/tjark.png", color: "blue", quote: "Mode muss Geschichten erzählen – deine Geschichte.", desc: "Verantwortlich für Design und technische Entwicklung. Verbindet Ingenieursdenken mit kreativem Anspruch.", focus: "Fokus: Design & Tech" },
                        { name: "Noah Solaker", role: "Co-Founder & Operations", img: "/images/founders/noah.png", color: "purple", quote: "Wir verkaufen keine Kleidung. Wir stärken Gemeinschaften.", desc: "Kümmert sich um Strategie und Vertrieb. Sorgt dafür, dass aus guten Ideen echte Lösungen werden.", focus: "Fokus: Sales & Strategy" },
                    ].map((founder, i) => (
                        <motion.div
                            key={founder.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15, duration: 0.5, ease: "easeOut" }}
                            className="relative group"
                        >
                            <div className={`absolute inset-0 bg-${founder.color}-500/10 rounded-3xl blur-xl group-hover:bg-${founder.color}-500/20 transition-all duration-500`} />
                            <div className={`relative p-8 rounded-3xl bg-card border border-border/50 backdrop-blur-sm h-full flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-${founder.color}-500/30`}>
                                <div className="w-32 h-32 rounded-full border-4 border-background shadow-[0_8px_30px_rgb(0,0,0,0.08)] mb-6 overflow-hidden bg-muted">
                                    <Avatar className="w-full h-full">
                                        <AvatarImage src={founder.img} alt={founder.name} className="object-cover" />
                                        <AvatarFallback>{founder.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                </div>
                                <h3 className="text-2xl font-extrabold text-foreground mb-1 tracking-tight">{founder.name}</h3>
                                <span className={`text-${founder.color}-400 text-sm font-mono mb-4 block`}>{founder.role}</span>
                                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                                    "{founder.quote}"<br />
                                    {founder.desc}
                                </p>
                                <div className="mt-auto px-4 py-2 rounded-full bg-muted border border-border/50 text-xs text-muted-foreground">
                                    {founder.focus}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                    className="mt-16 text-center"
                >
                    <p className="text-sm text-muted-foreground italic">
                        "Digitalisierung muss nicht unpersönlich sein. Wir schaffen echte Verbindungen."
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
