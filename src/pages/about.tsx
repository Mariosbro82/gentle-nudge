import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { motion } from "framer-motion";
import { Award, Users, Rocket, Clock } from "lucide-react";

export default function AboutPage() {
    const founders = [
        {
            name: "Tjark Schmitt",
            role: "Co-Founder & Creative Director",
            bio: "Als kreativer Kopf hinter Severmore ist Tjark für das Design und die visuelle Identität der Marke verantwortlich. Sein Ziel ist es, technische Innovation mit ästhetischem Anspruch zu vereinen.",
            future: "Zukünftiger Student der Ingenieurwissenschaften"
        },
        {
            name: "Noah Solaker",
            role: "Co-Founder & Managing Director",
            bio: "Noah leitet die operativen Geschäfte, den Vertrieb und die Kundenbeziehungen. Er setzt auf persönlichen Kontakt statt anonymer E-Commerce-Abwicklung.",
            future: "Zukünftiger Student der Betriebswirtschaftslehre"
        }
    ];

    const milestones = [
        {
            year: "2023",
            title: "Die Idee",
            description: "Zwei 16-jährige Schüler am Gymnasium Winsen beschließen, Mode neu zu denken."
        },
        {
            year: "2024",
            title: "Hürden & Start",
            description: "Nachmonatelangem Warten auf die unbeschränkte Geschäftsfähigkeit wird Severmore offiziell gegründet."
        },
        {
            year: "2025",
            title: "Auszeichnung",
            description: "Gewinn des Sonderpreises U21 beim Gründungspreis Landkreis Harburg."
        }
    ];

    return (
        <main className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <Navbar />

            <section className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-24"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">
                            Über Uns
                        </h1>
                        <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
                            Vom Klassenzimmer zum preisgekrönten Startup. Severmore ist die Vision zweier
                            Schüler, die beweisen wollten, dass Alter keine Barriere für echte Innovation ist.
                        </p>
                    </motion.div>

                    {/* Founders Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
                        {founders.map((founder, index) => (
                            <motion.div
                                key={founder.name}
                                initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="p-10 rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Users size={80} />
                                </div>
                                <h3 className="text-3xl font-bold mb-2">{founder.name}</h3>
                                <p className="text-blue-500 font-medium mb-6">{founder.role}</p>
                                <p className="text-zinc-400 leading-relaxed mb-6">
                                    {founder.bio}
                                </p>
                                <div className="pt-6 border-t border-white/10">
                                    <p className="text-sm text-zinc-500 font-medium">{founder.future}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Story Section */}
                    <div className="flex flex-col md:flex-row gap-16 items-center mb-32">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="flex-1"
                        >
                            <h2 className="text-4xl font-bold mb-8">Die Geschichte hinter Severmore</h2>
                            <div className="space-y-6 text-zinc-400 text-lg leading-relaxed">
                                <p>
                                    Alles begann mit der Vision, Mode persönlicher, nachhaltiger und
                                    gemeinschaftsorientierter zu machen. Als Tjark und Noah mit 16 Jahren
                                    ihren Businessplan schrieben, standen sie vor enormen bürokratischen Hürden.
                                </p>
                                <p>
                                    Das über sechsmonatige Warten auf die familiengerichtliche Genehmigung der
                                    unbeschränkten Geschäftsfähigkeit und die Suche nach einer Bank, die
                                    minderjährige Gründer unterstützt, waren echte Belastungsproben.
                                </p>
                                <p>
                                    Heute, mit 18 und 17 Jahren, stehen sie kurz vor dem Abitur und führen ein
                                    Unternehmen, das für Qualität und Innovation ausgezeichnet wurde.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="flex-1 grid grid-cols-2 gap-4"
                        >
                            <div className="p-6 rounded-2xl border border-white/5 bg-white/5 flex flex-col items-center text-center">
                                <Award className="w-10 h-10 text-yellow-500 mb-4" />
                                <span className="text-2xl font-bold">U21</span>
                                <span className="text-sm text-zinc-500">Sonderpreis 2025</span>
                            </div>
                            <div className="p-6 rounded-2xl border border-white/5 bg-white/5 flex flex-col items-center text-center">
                                <Rocket className="w-10 h-10 text-blue-500 mb-4" />
                                <span className="text-2xl font-bold">Winsen</span>
                                <span className="text-sm text-zinc-500">Regional verwurzelt</span>
                            </div>
                            <div className="p-6 rounded-2xl border border-white/5 bg-white/5 flex flex-col items-center text-center">
                                <Users className="w-10 h-10 text-purple-500 mb-4" />
                                <span className="text-2xl font-bold">10k+</span>
                                <span className="text-sm text-zinc-500">Produkte verfügbar</span>
                            </div>
                            <div className="p-6 rounded-2xl border border-white/5 bg-white/5 flex flex-col items-center text-center">
                                <Clock className="w-10 h-10 text-green-500 mb-4" />
                                <span className="text-2xl font-bold">Evermore</span>
                                <span className="text-sm text-zinc-500">Qualität fürs Leben</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Timeline Section */}
                    <div className="mb-32">
                        <h2 className="text-3xl font-bold text-center mb-16">Meilensteine</h2>
                        <div className="max-w-4xl mx-auto space-y-12">
                            {milestones.map((milestone, index) => (
                                <motion.div
                                    key={milestone.year}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex gap-8 items-start"
                                >
                                    <div className="text-3xl font-bold text-blue-500 font-mono pt-1">
                                        {milestone.year}
                                    </div>
                                    <div className="flex-1 pt-1.5 border-t border-white/10">
                                        <h4 className="text-xl font-semibold mb-2">{milestone.title}</h4>
                                        <p className="text-zinc-500 leading-relaxed">
                                            {milestone.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Career & Contact Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-12 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-blue-500/10 to-transparent">
                            <h3 className="text-2xl font-bold mb-4">Karriere</h3>
                            <p className="text-zinc-400 mb-6">
                                Du willst Teil unserer Fashion-Revolution werden? Wir sind immer auf der
                                Suche nach Talenten, die mit uns Mode neu denken.
                            </p>
                            <button className="text-blue-500 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                                Offene Stellen ansehen <span>→</span>
                            </button>
                        </div>
                        <div className="p-12 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-purple-500/10 to-transparent">
                            <h3 className="text-2xl font-bold mb-4">Kontakt</h3>
                            <p className="text-zinc-400 mb-6">
                                Haben Sie Fragen zu unseren Produkten oder interaktiven Lösungen?
                                Wir freuen uns auf Ihre Nachricht.
                            </p>
                            <button className="text-purple-500 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                                Jetzt anfragen <span>→</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
