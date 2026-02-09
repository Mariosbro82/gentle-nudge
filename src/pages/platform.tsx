import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { motion } from "framer-motion";

export default function PlatformPage() {
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
                            Severmore OS
                        </h1>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                            Die intelligente Plattform für vernetzte Wearables. Verwalten Sie Ihre Geräte,
                            analysieren Sie Interaktionen und skalieren Sie Ihre Vision.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm"
                        >
                            <h3 className="text-2xl font-semibold mb-4">Zentrales Dashboard</h3>
                            <p className="text-zinc-400 mb-6">
                                Behalten Sie den Überblick über all Ihre NFC-fähigen Produkte. Echtzeit-Statistiken,
                                Nutzerverwaltung und detaillierte Einblicke in einem intuitiven Interface.
                            </p>
                            <div className="aspect-video rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/5 flex items-center justify-center">
                                <span className="text-blue-400 font-medium">Dashboard Preview</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm"
                        >
                            <h3 className="text-2xl font-semibold mb-4">Software-Integrationen</h3>
                            <p className="text-zinc-400 mb-6">
                                Verbinden Sie Ihre Wearables mit Ihren Lieblingstools. Von CRM-Systemen bis hin zu
                                Event-Management-Software – wir bieten nahtlose Integrationen für Ihren Workflow.
                            </p>
                            <div className="aspect-video rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-white/5 flex items-center justify-center">
                                <span className="text-purple-400 font-medium">Integrationen Preview</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
