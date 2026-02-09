import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { motion } from "framer-motion";
import { Leaf, Recycle, Heart, Droplets, Factory, Truck, Shirt, HeartHandshake } from "lucide-react";
import { BentoGrid, BentoCard } from "@/components/marketing/ui/bento-grid";

export default function SustainabilityPage() {
    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-green-500/30 overflow-x-hidden">
            <Navbar />

            {/* Custom Intro */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px]" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-block px-4 py-2 rounded-full border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-medium mb-6">
                            Unser Versprechen
                        </span>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-foreground">
                            Mode mit <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Verantwortung</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
                            Wir setzen neue Standards für eine bewusstere Textilindustrie. Fair, Recycelt und mit echtem Social Impact.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Production Journey Timeline */}
            <section className="py-24 px-6 bg-muted/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Die Reise eines Produkts</h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Transparenz ist unser oberstes Gebot. Verfolgen Sie den Weg unserer Produkte.
                        </p>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[100px] left-0 right-0 h-1 bg-gradient-to-r from-green-500/20 via-green-500 to-green-500/20" />

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                            {[
                                { title: "Rohstoffe", desc: "100% Recyceltes Garn & Bio-Baumwolle", icon: Recycle, delay: 0 },
                                { title: "Produktion", desc: "Faire Löhne & Zertifizierte Fabriken", icon: Factory, delay: 0.2 },
                                { title: "Veredelung", desc: "Vegane Farben & Ökostrom", icon: Droplets, delay: 0.4 },
                                { title: "Ankunft", desc: "Plastikfreier Versand zu Dir", icon: Truck, delay: 0.6 },
                            ].map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: step.delay }}
                                    className="relative flex flex-col items-center text-center bg-background p-6 rounded-2xl border border-border shadow-sm z-10"
                                >
                                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mb-6 text-2xl">
                                        <step.icon />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                    <p className="text-muted-foreground">{step.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ESG Bento Grid */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <BentoGrid>
                        <BentoCard
                            name="CO2 Optimiert"
                            className="col-span-3 lg:col-span-2"
                            background={<div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent" />}
                            Icon={Leaf}
                            description="Durch lokale Veredelung und optimierte Lieferketten minimieren wir unseren CO2-Fußabdruck drastisch."
                            href="#"
                            cta="Unser Klimabericht"
                        />
                        <BentoCard
                            name="Langlebigkeit"
                            className="col-span-3 lg:col-span-1"
                            background={<div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent" />}
                            Icon={Shirt}
                            description="'Evermore' steht für Qualität. Kauf weniger, aber besser."
                            href="#"
                            cta="Pflegehinweise"
                        />
                        <BentoCard
                            name="Fair Fashion"
                            className="col-span-3 lg:col-span-1"
                            background={<div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent" />}
                            Icon={HeartHandshake}
                            description="Keine Kompromisse bei Arbeitsbedingungen. Jeder verdient Respekt."
                            href="#"
                            cta="Zertifikate"
                        />
                        <BentoCard
                            name="Ressourcenschutz"
                            className="col-span-3 lg:col-span-2"
                            background={<div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />}
                            Icon={Droplets}
                            description="Wir sparen bis zu 90% Wasser im Vergleich zu konventioneller Herstellung durch innovative Färbeprozesse."
                            href="#"
                            cta="Mehr dazu"
                        />
                    </BentoGrid>
                </div>
            </section>

            {/* Social Impact Section */}
            <section className="py-24 px-6 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center justify-center p-4 bg-red-100 dark:bg-red-900/30 rounded-full mb-8"
                    >
                        <Heart className="w-12 h-12 text-red-500 fill-current animate-pulse" />
                    </motion.div>

                    <h2 className="text-4xl md:text-6xl font-bold mb-8">
                        1€ pro Artikel
                    </h2>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12">
                        Geht direkt an die <span className="text-red-500 font-semibold">Kinderkrebshilfe Hamburg</span>.
                        Weil wir glauben, dass Erfolg nur dann wertvoll ist, wenn man ihn teilt.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="p-8 bg-white dark:bg-card rounded-2xl shadow-sm border border-border">
                            <div className="text-4xl font-bold text-foreground mb-2">100%</div>
                            <div className="text-muted-foreground">Transparent</div>
                        </div>
                        <div className="p-8 bg-white dark:bg-card rounded-2xl shadow-sm border border-border">
                            <div className="text-4xl font-bold text-foreground mb-2">Direkt</div>
                            <div className="text-muted-foreground">Ohne Umwege</div>
                        </div>
                        <div className="p-8 bg-white dark:bg-card rounded-2xl shadow-sm border border-border">
                            <div className="text-4xl font-bold text-foreground mb-2">Lokal</div>
                            <div className="text-muted-foreground">Hier in Hamburg</div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

