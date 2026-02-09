import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { motion } from "framer-motion";
import { MockDashboard } from "@/components/marketing/ui/mock-dashboard";
import { InfiniteLogoScroll } from "@/components/marketing/ui/infinite-scroll";
import { BentoGrid, BentoCard } from "@/components/marketing/ui/bento-grid";
import { BarChart3, Users, Zap, Shield, Smartphone, Globe, Code2, Database } from "lucide-react";

const integrations = [
    { name: "Salesforce", logo: ({ className }: { className?: string }) => <Database className={className} /> },
    { name: "HubSpot", logo: ({ className }: { className?: string }) => <Users className={className} /> },
    { name: "Slack", logo: ({ className }: { className?: string }) => <Zap className={className} /> },
    { name: "Shopify", logo: ({ className }: { className?: string }) => <Globe className={className} /> },
    { name: "Zapier", logo: ({ className }: { className?: string }) => <Code2 className={className} /> },
    { name: "Mailchimp", logo: ({ className }: { className?: string }) => <Users className={className} /> },
];

export default function PlatformPage() {
    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-blue-500/30 overflow-x-hidden">
            <Navbar />

            {/* Custom Intro Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
                <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-background" />

                <div className="relative z-10 max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-foreground">
                            Severmore <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">OS</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
                            Das Betriebssystem für Ihre Community. Verwalten Sie NFC-Produkte, analysieren Sie Interaktionen und skalieren Sie Ihre Vision.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative mx-auto max-w-5xl"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30" />
                        <div className="relative bg-background rounded-2xl border border-border overflow-hidden">
                            <MockDashboard />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 px-6 bg-muted/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Mächtige Werkzeuge</h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Alles, was Sie brauchen, um Ihre physischen Produkte mit der digitalen Welt zu verbinden.
                        </p>
                    </div>

                    <BentoGrid>
                        <BentoCard
                            name="Echtzeit Analytics"
                            className="col-span-3 lg:col-span-2"
                            background={<div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />}
                            Icon={BarChart3}
                            description="Verfolgen Sie Scans, Interaktionen und Nutzerverhalten in Echtzeit. Treffen Sie datenbasierte Entscheidungen."
                            href="#"
                            cta="Mehr erfahren"
                        />
                        <BentoCard
                            name="NFC Management"
                            className="col-span-3 lg:col-span-1"
                            background={<div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />}
                            Icon={Smartphone}
                            description="Verwalten Sie tausende von Chips mit einem Klick."
                            href="#"
                            cta="Details"
                        />
                        <BentoCard
                            name="Nutzerverwaltung"
                            className="col-span-3 lg:col-span-1"
                            background={<div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent" />}
                            Icon={Users}
                            description="Rollenbasierte Zugriffsrechte für Ihr ganzes Team."
                            href="#"
                            cta="Team einladen"
                        />
                        <BentoCard
                            name="Sicherheit & Datenschutz"
                            className="col-span-3 lg:col-span-2"
                            background={<div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent" />}
                            Icon={Shield}
                            description="DSGVO-konform und verschlüsselt. Ihre Daten gehören Ihnen."
                            href="#"
                            cta="Sicherheitsbericht"
                        />
                    </BentoGrid>
                </div>
            </section>

            {/* Integrations Section */}
            <section className="py-24 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Nahtlose Integrationen</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Verbindet sich mit den Tools, die Sie bereits nutzen.
                    </p>
                </div>

                <div className="relative w-full">
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
                    <InfiniteLogoScroll logos={integrations} speed="normal" />
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-900 to-purple-900 p-12 text-center">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Bereit für die Zukunft?</h2>
                        <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
                            Starten Sie noch heute mit Severmore OS und bringen Sie Ihre Community auf das nächste Level.
                        </p>
                        <button className="bg-white text-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg">
                            Jetzt starten
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

