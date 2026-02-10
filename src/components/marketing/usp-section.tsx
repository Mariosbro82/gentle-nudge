import { motion } from "framer-motion";
import { Monitor, Calendar, Building2, Utensils } from "lucide-react";

export function USPSection() {
    const useCases = [
        {
            icon: <Monitor className="w-12 h-12 text-blue-400" />,
            title: "Messen & Expos",
            description: "Verwandle jeden Händedruck in einen Lead. Teile Kataloge und Kontakte direkt per Tap auf das Smartphone deines Gegenübers.",
            gradient: "from-blue-500/20 to-cyan-500/20"
        },
        {
            icon: <Calendar className="w-12 h-12 text-purple-400" />,
            title: "Events & Festivals",
            description: "Digitaler Check-in und Networking für Teilnehmer. Teambekleidung wird zur smarten Event-Schnittstelle.",
            gradient: "from-purple-500/20 to-pink-500/20"
        },
        {
            icon: <Building2 className="w-12 h-12 text-indigo-400" />,
            title: "Unternehmen",
            description: "Corporate Identity neu gedacht. Hochwertige Fashion mit smarten Funktionen für den modernen Arbeitsalltag.",
            gradient: "from-indigo-500/20 to-violet-500/20"
        },
        {
            icon: <Utensils className="w-12 h-12 text-pink-400" />,
            title: "Gastronomie",
            description: "Digitale Speisekarten und Social Follows direkt über die Team-Kleidung. Service-Optimierung par excellence.",
            gradient: "from-pink-500/20 to-rose-500/20"
        }
    ];

    return (
        <section className="py-32 bg-background">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                        Mehrwert für jede Branche
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        Maßgeschneiderte Lösungen für Ihren Erfolg.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {useCases.map((useCase, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className={`relative p-8 rounded-3xl bg-card border border-border overflow-hidden hover:border-foreground/20 transition-colors group`}
                        >
                            <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${useCase.gradient} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full -mr-32 -mt-32`} />

                            <div className="relative z-10">
                                <div className="mb-6 p-4 rounded-2xl bg-background border border-border w-fit">
                                    {useCase.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mb-3">{useCase.title}</h3>
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    {useCase.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
