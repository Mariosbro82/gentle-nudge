import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { motion } from "framer-motion";
import { GraduationCap, Building2, Palette, Repeat, Vote } from "lucide-react";
import { BentoGrid, BentoCard } from "@/components/marketing/ui/bento-grid";

export default function SolutionsPage() {
    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-blue-500/30 overflow-x-hidden">
            <Navbar />

            {/* Custom Header */}
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
                            Lösungen für jeden
                        </span>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-foreground">
                            Gemeinsam <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Stärker</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
                            Ob Schule, Unternehmen oder Verein – Severmore stärkt durch Mode und Technologie Ihr Wir-Gefühl.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Schools Section */}
            <section className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 flex items-center justify-center">
                                <GraduationCap className="w-48 h-48 text-blue-600/20 dark:text-blue-400/20" />
                                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-30" />
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                    <GraduationCap className="w-8 h-8" />
                                </div>
                                <h2 className="text-3xl md:text-5xl font-bold">Für Schulen</h2>
                            </div>
                            <p className="text-lg text-muted-foreground mb-8">
                                Von Abitur-Hoodies bis zur kompletten Schulkollektion. Wir stärken die Identität Ihrer Schule mit hochwertiger Kleidung und modernen Designs.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {[
                                    "Individuelle Designs mit Ihrem Schullogo",
                                    "Abitur- & Abschluss-Kollektionen",
                                    "Einfache Sammelbestellung für Eltern & Schüler",
                                    "Faire Preise & nachhaltige Qualität"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 text-xs">✓</div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className="px-8 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
                                Schulkollektion anfragen
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Corporate Section */}
            <section className="py-24 px-6 bg-gradient-to-b from-muted/50 to-background">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                                    <Building2 className="w-8 h-8" />
                                </div>
                                <h2 className="text-3xl md:text-5xl font-bold">Für Unternehmen</h2>
                            </div>
                            <p className="text-lg text-muted-foreground mb-8">
                                Corporate Fashion, die Ihre Mitarbeiter gerne tragen. Stärken Sie Ihre Marke und das Teamgefühl mit hochwertigen Textilien und NFC-Integrationen.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {[
                                    "Hochwertige Arbeitskleidung & Merchandise",
                                    "Digitale Visitenkarten via NFC im Ärmel",
                                    "Steuerlich absetzbare Team-Events",
                                    "Mengenrabatte bei Großbestellungen"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 text-xs">✓</div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className="px-8 py-3 rounded-full bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors">
                                Firmenangebot einholen
                            </button>
                        </div>
                        <div className="relative aspect-square rounded-3xl overflow-hidden border border-border bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center p-0">
                            <img src="/assets/digital-handshake.png" alt="Digital Handshake" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Interactive Co-Creation Section */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-sm font-bold text-pink-500 tracking-wider uppercase mb-2 block">Innovation</span>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Interactive Co-Creation</h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Wir gestalten nicht nur für Sie, sondern mit Ihnen. Werde Teil des Designprozesses.
                        </p>
                    </div>

                    <BentoGrid>
                        <BentoCard
                            name="Design Voting"
                            className="col-span-3 lg:col-span-1"
                            background={<div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent" />}
                            Icon={Vote}
                            description="Lassen Sie Ihre Community über neue Designs abstimmen."
                            href="#"
                            cta="Zum Voting"
                        />
                        <BentoCard
                            name="Live-Feedback"
                            className="col-span-3 lg:col-span-1"
                            background={<div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent" />}
                            Icon={Palette}
                            description="Direktes Feedback zu Farben, Materialien und Schnitten."
                            href="#"
                            cta="Feedback geben"
                        />
                        <BentoCard
                            name="Community Iteration"
                            className="col-span-3 lg:col-span-1"
                            background={<div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent" />}
                            Icon={Repeat}
                            description="Schnelle Iterationszyklen basierend auf echten Wünschen."
                            href="#"
                            cta="Mitmachen"
                        />
                    </BentoGrid>
                </div>
            </section>

            <Footer />
        </main>
    );
}

