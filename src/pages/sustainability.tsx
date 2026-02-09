import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { motion } from "framer-motion";
import { Leaf, Recycle, Heart, Droplets } from "lucide-react";

export default function SustainabilityPage() {
    const values = [
        {
            title: "Fair-Trade zertifiziert",
            description: "Unsere Produktion ist Fair-Trade zertifiziert, um gerechte Löhne und sichere Arbeitsbedingungen zu garantieren.",
            icon: Heart
        },
        {
            title: "Recyceltes Garn",
            description: "Wir verwenden recyceltes Garn, um den Ressourcenverbrauch zu minimieren und Abfall zu reduzieren.",
            icon: Recycle
        },
        {
            title: "Vegane Farben",
            description: "Alle unsere Drucke werden mit veganen und umweltfreundlichen Farben durchgeführt.",
            icon: Droplets
        },
        {
            title: "Langlebigkeit",
            description: "Severmore steht für Qualität, die hält. Weniger Konsum durch Produkte, die über Generationen halten.",
            icon: Leaf
        }
    ];

    return (
        <main className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <Navbar />

            <section className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-green-400 via-white to-white bg-clip-text text-transparent">
                            Nachhaltigkeit
                        </h1>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                            Mode neu denken – individuell, nachhaltig und gemeinschaftlich.
                            Wir setzen Standards für eine bewusstere Textilindustrie.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm"
                            >
                                <value.icon className="w-8 h-8 text-green-400 mb-4" />
                                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                                <p className="text-sm text-zinc-400">
                                    {value.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="p-12 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-green-500/10 to-blue-500/10 backdrop-blur-md">
                        <h2 className="text-3xl font-bold mb-6">Unser ESG-Versprechen</h2>
                        <p className="text-lg text-zinc-300 mb-8 max-w-3xl">
                            Bei Severmore integrieren wir ökologische und soziale Verantwortung in jeden Schritt
                            unseres Handelns. Von der Auswahl der Rohstoffe bis hin zum sozialen Engagement
                            (1€ pro Artikel für die Kinderkrebshilfe) – wir streben nach positivem Impact.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <span className="px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-sm">CO2-optimiert</span>
                            <span className="px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm">Plastikfrei verpackt</span>
                            <span className="px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-sm">Soziales Engagement</span>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
