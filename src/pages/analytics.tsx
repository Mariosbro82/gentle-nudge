import { Navbar } from "@/components/marketing/navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Target, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Footer } from "@/components/marketing/footer";

export default function AnalyticsPage() {
    const features = [
        {
            icon: BarChart3,
            title: "Echtzeit-Tracking",
            description: "Sehen Sie live, wann und wo Ihre NFC-Produkte gescannt werden. Keine Verzögerung, volle Transparenz."
        },
        {
            icon: Users,
            title: "Besucher-Insights",
            description: "Unterscheiden Sie zwischen neuen Besuchern und Wiederkehrern um die Qualität Ihrer Kontakte zu bewerten."
        },
        {
            icon: Target,
            title: "Conversion-Messung",
            description: "Verfolgen Sie nicht nur Scans, sondern echte Ergebnisse. Wie viele Besucher werden zu Leads? Wie viele kaufen?"
        },
        {
            icon: TrendingUp,
            title: "Trend-Analysen",
            description: "Erkennen Sie Muster in Ihren Kampagnen. Welcher Tag performt am besten? Welches Event bringt den meisten Traffic?"
        }
    ];

    return (
        <main className="min-h-screen bg-black selection:bg-blue-500/30">
            <Navbar />

            <div className="pt-32 pb-20 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium mb-6"
                        >
                            Analytics & Insights
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-bold text-white mb-6"
                        >
                            Verstehen Sie Ihre <br />
                            <span className="text-blue-500">wahre Performance.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-zinc-400 max-w-2xl mx-auto"
                        >
                            NFCwear verwandelt physische Interaktionen in digitale Datenpunkte.
                            Optimieren Sie Ihren ROI mit präzisen Metriken.
                        </motion.p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-24">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="p-8 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-blue-500/20 transition-colors group"
                            >
                                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <feature.icon className="w-6 h-6 text-blue-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="rounded-3xl bg-gradient-to-br from-blue-900/20 to-black border border-blue-500/20 p-12 text-center relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-blue-500/5 blur-3xl" />
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold text-white mb-6">Bereit für bessere Daten?</h2>
                            <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
                                Starten Sie jetzt und erhalten Sie vollen Zugriff auf alle Analytics-Features im Dashboard.
                            </p>
                            <Link to="/login">
                                <Button className="bg-white text-black hover:bg-zinc-200 rounded-full px-8 py-6 text-lg">
                                    Jetzt starten <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
