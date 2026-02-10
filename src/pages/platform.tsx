import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { motion } from "framer-motion";
import { MockDashboard } from "@/components/marketing/ui/mock-dashboard";
import { InfiniteLogoScroll } from "@/components/marketing/ui/infinite-scroll";
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                        {[
                            {
                                title: "Echtzeit Analytics",
                                description: "Verfolgen Sie Scans, Interaktionen und Nutzerverhalten in Echtzeit. Treffen Sie datenbasierte Entscheidungen.",
                                icon: BarChart3,
                                color: "text-blue-500"
                            },
                            {
                                title: "NFC Management",
                                description: "Verwalten Sie tausende von Chips mit einem Klick. Volle Kontrolle über Ihre Assets.",
                                icon: Smartphone,
                                color: "text-purple-500"
                            },
                            {
                                title: "Nutzerverwaltung",
                                description: "Rollenbasierte Zugriffsrechte für Ihr ganzes Team. Skalierbar und sicher.",
                                icon: Users,
                                color: "text-green-500"
                            },
                            {
                                title: "Sicherheit & Datenschutz",
                                description: "DSGVO-konform und verschlüsselt. Ihre Daten gehören Ihnen und sind geschützt.",
                                icon: Shield,
                                color: "text-red-500"
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex flex-col gap-4"
                            >
                                <div className={`w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center ${feature.color}`}>
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
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

