import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { motion } from "framer-motion";
import { Briefcase, Calendar, Shield, Cpu } from "lucide-react";

export default function SolutionsPage() {
    const solutions = [
        {
            title: "Für Sales Teams",
            description: "Maximieren Sie Ihre Lead-Generierung durch interaktive Visitenkarten und nahtlose CRM-Anbindung.",
            icon: Briefcase,
            color: "blue"
        },
        {
            title: "Für Events & Exhibitions",
            description: "Optimieren Sie den Check-in-Prozess und bieten Sie interaktive Erlebnisse für Ihre Besucher.",
            icon: Calendar,
            color: "purple"
        },
        {
            title: "Für Operations (HR/Access)",
            description: "Sicherer Zugang und Identitätsmanagement integriert in Ihre Arbeitskleidung.",
            icon: Shield,
            color: "pink"
        },
        {
            title: "Firmware & Enterprise",
            description: "Maßgeschneiderte NFC-Lösungen für komplexe Infrastrukturen und spezialisierte Anforderungen.",
            icon: Cpu,
            color: "indigo"
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
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">
                            Unsere Lösungen
                        </h1>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                            Maßgeschneiderte NFC-Integrationen für jede Branche. Entdecken Sie, wie
                            Severmore Ihre Geschäftsprozesse revolutionieren kann.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                        {solutions.map((solution, index) => (
                            <motion.div
                                key={solution.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group p-8 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                            >
                                <div className={`w-12 h-12 rounded-2xl bg-${solution.color}-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <solution.icon className={`w-6 h-6 text-${solution.color}-500`} />
                                </div>
                                <h3 className="text-2xl font-semibold mb-3">{solution.title}</h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    {solution.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
