import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { motion } from "framer-motion";
import { Users, Rocket, Heart, Star } from "lucide-react";
import { BentoGrid, BentoCard } from "@/components/marketing/ui/bento-grid";

export default function AboutPage() {
    const founders = [
        {
            name: "Tjark Schmitt",
            role: "Co-Founder & Creative Director",
            bio: "Als kreativer Kopf hinter Severmore ist Tjark für das Design und die visuelle Identität der Marke verantwortlich. Sein Ziel ist es, technische Innovation mit ästhetischem Anspruch zu vereinen.",
            future: "Zukünftiger Ingenieurswissenschaftler",
            gradient: "from-blue-500/20 to-cyan-500/20",
            image: "/images/founders/tjark.png"
        },
        {
            name: "Noah Solaker",
            role: "Co-Founder & Managing Director",
            bio: "Noah leitet die operativen Geschäfte, den Vertrieb und die Kundenbeziehungen. Er setzt auf persönlichen Kontakt statt anonymer E-Commerce-Abwicklung.",
            future: "Zukünftiger BWL-Student",
            gradient: "from-purple-500/20 to-pink-500/20",
            image: "/images/founders/noah.png"
        }
    ];

    const milestones = [
        {
            year: "2023",
            title: "Der Funke",
            description: "Zwei 16-jährige Schüler am Gymnasium Winsen haben genug von Fast Fashion. Die Idee zu Severmore wird geboren."
        },
        {
            year: "2024",
            title: "Widerstand & Wille",
            description: "6 Monate warten auf das Familiengericht. Keine Bank will ein Konto eröffnen. Wir geben nicht auf."
        },
        {
            year: "2025",
            title: "Durchbruch",
            description: "Gründung der Severmore UG. Gewinn des Sonderpreises U21 beim Gründungspreis Landkreis Harburg."
        },
        {
            year: "2026",
            title: "Scaling Up",
            description: "Expansion in ganz Deutschland. Neue Kollektionen, neue Technologien, gleiche Werte."
        }
    ];

    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-purple-500/30 overflow-x-hidden">
            <Navbar />

            {/* Custom Intro */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-[120px]" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-block px-4 py-2 rounded-full border border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium mb-6">
                            Unsere Geschichte
                        </span>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-foreground">
                            Vom Klassenzimmer <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">zum Startup</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
                            Severmore ist die Vision zweier Schüler, die beweisen wollten, dass Alter keine Barriere für echte Innovation ist.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Founders Section */}
            <section className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Die Köpfe dahinter</h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Freunde, Gründer, Visionäre.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
                        {founders.map((founder, index) => (
                            <motion.div
                                key={founder.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                className="group relative p-8 rounded-[2.5rem] bg-card border border-border overflow-hidden hover:shadow-2xl transition-all duration-500"
                            >
                                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${founder.gradient} rounded-full blur-[80px] opacity-50 group-hover:opacity-100 transition-opacity`} />

                                <div className="relative z-10">
                                    <div className="w-32 h-32 rounded-2xl overflow-hidden mb-8 shadow-md">
                                        <img src={founder.image} alt={founder.name} className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="text-3xl font-bold mb-2">{founder.name}</h3>
                                    <p className="text-blue-500 font-medium mb-6 uppercase tracking-wide text-sm">{founder.role}</p>
                                    <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                                        {founder.bio}
                                    </p>
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 text-sm font-medium">
                                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${founder.gradient.replace('/20', '')}`} />
                                        {founder.future}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="py-24 px-6 bg-muted/30">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-16 items-start">
                        <div className="flex-1 sticky top-32">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                                Eine Reise gegen <br />
                                alle Widerstände
                            </h2>
                            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                                "Ihr seid zu jung." "Das geht rechtlich nicht." "Macht erst mal Abitur." <br />
                                Wir haben all das gehört – und es trotzdem gemacht.
                            </p>
                            <div className="flex gap-4">
                                <div className="p-4 rounded-xl bg-background border border-border text-center flex-1">
                                    <div className="text-3xl font-bold text-blue-600 mb-1">16</div>
                                    <div className="text-sm text-muted-foreground">Jahre beim Start</div>
                                </div>
                                <div className="p-4 rounded-xl bg-background border border-border text-center flex-1">
                                    <div className="text-3xl font-bold text-purple-600 mb-1">U21</div>
                                    <div className="text-sm text-muted-foreground">Sonderpreis</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 space-y-12 pl-8 border-l-2 border-border relative">
                            {milestones.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ margin: "-100px" }}
                                    className="relative"
                                >
                                    <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-background border-4 border-blue-500" />
                                    <span className="text-sm font-bold text-blue-500 tracking-wider uppercase mb-2 block">{m.year}</span>
                                    <h3 className="text-2xl font-bold mb-3">{m.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{m.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Bento Grid */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Wofür wir stehen</h2>
                    </div>

                    <BentoGrid>
                        <BentoCard
                            name="Innovation"
                            className="col-span-3 lg:col-span-2"
                            background={<div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />}
                            Icon={Rocket}
                            description="Wir hinterfragen den Status Quo. Mode muss digitaler und interaktiver werden."
                            href="#"
                            cta="Unsere Vision"
                        />
                        <BentoCard
                            name="Community"
                            className="col-span-3 lg:col-span-1"
                            background={<div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />}
                            Icon={Users}
                            description="Severmore ist mehr als eine Marke. Es ist ein Wir-Gefühl."
                            href="#"
                            cta="Werde Teil davon"
                        />
                        <BentoCard
                            name="Leidenschaft"
                            className="col-span-3 lg:col-span-1"
                            background={<div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent" />}
                            Icon={Heart}
                            description="Von Gründern für Gründer. Wir lieben, was wir tun."
                            href="#"
                            cta="Kontakt"
                        />
                        <BentoCard
                            name="Exzellenz"
                            className="col-span-3 lg:col-span-2"
                            background={<div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent" />}
                            Icon={Star}
                            description="Wir geben uns nicht mit dem Durchschnitt zufrieden. Award-winning Qualität."
                            href="#"
                            cta="Awards ansehen"
                        />
                    </BentoGrid>
                </div>
            </section>

            <Footer />
        </main>
    );
}
