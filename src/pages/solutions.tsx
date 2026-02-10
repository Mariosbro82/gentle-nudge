import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { motion } from "framer-motion";
import {
    Building2,
    Palette,
    Repeat,
    Vote,
    Monitor,
    Calendar,
    Utensils,
    Zap,
    CheckCircle2,
    ArrowRight
} from "lucide-react";

const solutions = [
    {
        id: "messen",
        title: "Messen & Ausstellungen",
        subtitle: "Hauptfokus",
        highlight: true,
        icon: Monitor,
        description: "Maximieren Sie Ihren ROI auf Messen. Mit NFC-integrierten Hoodies teilen Ihre Mitarbeiter Standinfos, Produktkataloge oder Terminkalender in Sekunden – kontaktlos und unvergesslich.",
        features: [
            "Digitale Visitenkarte im Ärmel",
            "Instant Lead-Erfassung per Tap",
            "Kontaktloses Teilen von Katalogen & PDFs",
            "Messbare Interaktions-Analysen"
        ],
        cta: "Messe-Lösung anfragen",
        image: "/assets/solution-messen.jpg",
        color: "blue"
    },
    {
        id: "veranstaltungen",
        title: "Events & Festivals",
        icon: Calendar,
        description: "Verwandeln Sie Ihr Event in ein digitales Erlebnis. Ob VIP-Check-in, Cashless Payment oder sofortiges Networking – wir machen Infrastruktur tragbar.",
        features: [
            "Smart Ticketing Integration",
            "VIP-Bereich Zutrittskontrolle",
            "Interaktive Besucher-Erlebnisse",
            "Branded Merchandise mit Mehrwert"
        ],
        cta: "Event-Konzept erstellen",
        color: "purple"
    },
    {
        id: "unternehmen",
        title: "Corporate Identity",
        icon: Building2,
        description: "Stärken Sie das Wir-Gefühl und Ihren professionellen Auftritt. Unsere Corporate Fashion kombiniert hochwertiges Design mit smarten Funktionen für den modernen Arbeitsalltag.",
        features: [
            "Nachhaltige Premium-Textilien",
            "Zentrall verwaltete Mitarbeiter-Profile",
            "Automatisierte Onboarding-Prozesse",
            "Steuerlich optimierte Teambekleidung"
        ],
        cta: "Team-Kollektion planen",
        color: "indigo"
    },
    {
        id: "gastronomie",
        title: "Gastronomie & Hospitality",
        icon: Utensils,
        description: "Optimieren Sie den Servicefluss. Digitale Speisekarten, direkte Trinkgeld-Optionen oder Social-Media-Follows direkt über die Team-Kleidung.",
        features: [
            "Digitale Speisekarten via NFC",
            "Einfaches Social Media Networking",
            "Optimierte Service-Workflows",
            "Moderne Team-Uniformen"
        ],
        cta: "Gastro-Vorteile entdecken",
        color: "pink"
    }
];

export default function SolutionsPage() {
    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-blue-500/30 overflow-x-hidden">
            <Navbar />

            {/* Header */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-block px-4 py-2 rounded-full border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
                            Branchenspezifische Lösungen
                        </span>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-foreground">
                            Digitaler <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Vorsprung</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
                            Verschaffen Sie Ihrem Business den entscheidenden Vorteil durch die perfekte Synergie aus Fashion und Technologie.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Focus: Messen (Visual Highlight) */}
            <section className="py-24 px-6 relative overflow-hidden" id="messen">
                <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-400/5 z-0" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative aspect-square rounded-3xl overflow-hidden border border-border bg-card">
                                    <img src="/assets/solution-messen.jpg" alt="Messe Erfolg" className="w-full h-full object-cover object-top transition duration-500 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                                    <div className="absolute bottom-8 left-8 right-8">
                                        <div className="flex items-center gap-3 text-blue-500 mb-2">
                                            <Zap className="w-5 h-5 fill-current" />
                                            <span className="text-sm font-bold uppercase tracking-wider">Top Industrie-Focus</span>
                                        </div>
                                        <h3 className="text-2xl font-bold">Maximaler Messe-Impact</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shadow-lg shadow-blue-500/20">
                                    <Monitor className="w-8 h-8" />
                                </div>
                                <div>
                                    <span className="text-blue-600 dark:text-blue-400 font-bold text-sm tracking-widest uppercase mb-1 block">Highlight</span>
                                    <h2 className="text-4xl md:text-5xl font-bold">Messen & Ausstellungen</h2>
                                </div>
                            </div>
                            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                                Maximieren Sie Ihren ROI auf Messen. Mit NFC-integrierten Hoodies teilen Ihre Mitarbeiter Standinfos, Produktkataloge oder Terminkalender in Sekunden – kontaktlos und unvergesslich.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                                {[
                                    "Digitale Visitenkarte im Ärmel",
                                    "Instant Lead-Erfassung per Tap",
                                    "Katalog-Sharing in Sekunden",
                                    "Messbare Interaktions-Daten"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                        <span className="text-foreground/80 font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => window.location.href = 'mailto:contact@nfcwear.com'}
                                className="group px-8 py-4 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center gap-2"
                            >
                                Messe-Lösung anfragen
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Other Solutions Grid */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Weitere Einsatzbereiche</h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Entdecken Sie, wie Severmore in verschiedenen Branchen Mehrwert schafft.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {solutions.slice(1).map((solution, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex flex-col h-full p-8 rounded-3xl bg-muted/30 border border-border/50 hover:border-foreground/20 transition-all hover:bg-muted/50 group"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-background flex items-center justify-center mb-6 shadow-sm border border-border group-hover:scale-110 transition-transform`}>
                                    <solution.icon className={`w-7 h-7 text-${solution.color}-500`} />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{solution.title}</h3>
                                <p className="text-muted-foreground leading-relaxed mb-6 flex-grow ">
                                    {solution.description}
                                </p>
                                <ul className="space-y-3">
                                    {solution.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-sm text-foreground/70">
                                            <div className="w-1.5 h-1.5 rounded-full bg-border" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Interactive Co-Creation Section */}
            <section className="py-24 px-6 bg-gradient-to-b from-transparent to-muted/20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-sm font-bold text-pink-500 tracking-wider uppercase mb-2 block">Innovation</span>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Interactive Co-Creation</h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Wir gestalten nicht nur für Sie, sondern mit Ihnen. Werde Teil des Designprozesses.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Design Voting",
                                description: "Lassen Sie Ihre Community über neue Designs abstimmen. Demokratisierung der Mode.",
                                icon: Vote,
                                color: "yellow"
                            },
                            {
                                title: "Live-Feedback",
                                description: "Direktes Feedback zu Farben, Materialien und Schnitten. Wissen, was gewünscht ist.",
                                icon: Palette,
                                color: "pink"
                            },
                            {
                                title: "Community Iteration",
                                description: "Schnelle Iterationszyklen basierend auf echten Wünschen. Agil und kundenorientiert.",
                                icon: Repeat,
                                color: "cyan"
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-6 rounded-2xl bg-card border border-border shadow-sm flex items-start gap-4"
                            >
                                <div className={`p-3 rounded-xl bg-background border border-border text-${feature.color}-500 shadow-sm`}>
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
