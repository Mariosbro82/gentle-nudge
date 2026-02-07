
import { motion } from "framer-motion";
import { BarChart3, Zap } from "lucide-react";

export function RoiSection() {
    return (
        <section id="roi" className="py-24 bg-zinc-950 border-y border-white/5">
            <div className="container mx-auto px-4">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            Warum <span className="text-purple-400">NFCwear?</span>
                        </h2>

                        <div className="space-y-8 text-lg text-zinc-400">
                            <blockquote className="border-l-4 border-purple-500/50 pl-6 italic text-white/80">
                                &quot;Ein Messestand kostet 50.000€. Wenn Ihr Team Papierkarten nutzt, landen 60% davon im Müll. Mit Severmore landet der Kontakt direkt im CRM.&quot;
                            </blockquote>

                            <p>
                                Wir machen Corporate Fashion messbar. Jede Interaktion wird getrackt, jeder Lead wird erfasst. Sehen Sie live, welcher Mitarbeiter performt und welcher Hoodie den meisten Umsatz generiert.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                                <div className="p-4 rounded-lg bg-white/5 border border-white/5 hover:border-purple-500/30 transition-colors">
                                    <h4 className="flex items-center gap-2 text-white font-semibold mb-1">
                                        <Zap className="text-yellow-400" size={18} /> 60% mehr Leads
                                    </h4>
                                    <p className="text-sm text-zinc-500">durch friktionslose Erfassung per Tap.</p>
                                </div>
                                <div className="p-4 rounded-lg bg-white/5 border border-white/5 hover:border-purple-500/30 transition-colors">
                                    <h4 className="flex items-center gap-2 text-white font-semibold mb-1">
                                        <BarChart3 className="text-green-400" size={18} /> 100% Messbar
                                    </h4>
                                    <p className="text-sm text-zinc-500">Volles ROI-Tracking für jedes Event.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Abstract Graph/Analytics Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative h-[500px] w-full bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-white/10 overflow-hidden flex flex-col items-center justify-center p-8 shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-grid-white/[0.02]" />

                        {/* Interactive Chart Visualization */}
                        <div className="flex items-end gap-4 sm:gap-8 h-64 w-full max-w-md px-2 sm:px-6 pb-6 border-b border-l border-white/10 relative z-10">

                            {/* Bar 1: Papier (4.4% -> ~26% height) */}
                            <div className="w-1/4 h-full flex flex-col justify-end group items-center relative">
                                <motion.div
                                    initial={{ height: 0 }}
                                    whileInView={{ height: "26%" }}
                                    whileHover={{ height: "28%", backgroundColor: "rgba(82, 82, 91, 0.8)" }}
                                    transition={{ duration: 0.8 }}
                                    className="w-full bg-zinc-800/50 rounded-t-md relative cursor-pointer"
                                >
                                    {/* Tooltip */}
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 border border-white/10 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                        4.4% Rate
                                    </div>
                                </motion.div>
                                <span className="absolute -bottom-8 text-xs text-zinc-500 font-medium tracking-wide">Papier</span>
                            </div>

                            {/* Bar 2: QR Code (6.4% -> ~38% height) */}
                            <div className="w-1/4 h-full flex flex-col justify-end group items-center relative">
                                <motion.div
                                    initial={{ height: 0 }}
                                    whileInView={{ height: "38%" }}
                                    whileHover={{ height: "40%", backgroundColor: "rgba(30, 58, 138, 0.6)" }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="w-full bg-blue-900/30 rounded-t-md relative cursor-pointer"
                                >
                                    {/* Tooltip */}
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 border border-white/10 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                        6.4% Rate
                                    </div>
                                </motion.div>
                                <span className="absolute -bottom-8 text-xs text-zinc-500 font-medium tracking-wide">QR Code</span>
                            </div>

                            {/* Bar 3: NFCwear (13.2% -> ~80% height to leave room for badge) */}
                            <div className="w-1/4 h-full flex flex-col justify-end group items-center relative">
                                <motion.div
                                    initial={{ height: 0 }}
                                    whileInView={{ height: "80%" }}
                                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(168,85,247,0.6)" }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                    className="w-full bg-gradient-to-t from-purple-600 to-blue-500 rounded-t-md relative shadow-[0_0_30px_rgba(168,85,247,0.3)] cursor-pointer z-10"
                                >
                                    {/* Persistent Badge that moves on hover */}
                                    <motion.div
                                        whileHover={{ y: -5, scale: 1.1 }}
                                        className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap border border-white/20"
                                    >
                                        +300% Conv.
                                    </motion.div>

                                    {/* Tooltip for NFC - new requirement */}
                                    <div className="absolute -top-24 left-1/2 -translate-x-1/2 bg-zinc-900 border border-white/10 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                        ~13.2% Rate
                                    </div>

                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 font-bold text-white text-sm tracking-wide bg-black/20 px-2 rounded backdrop-blur-sm">
                                        NFCwear
                                    </div>
                                </motion.div>
                                <span className="absolute -bottom-8 text-xs text-white font-bold tracking-wide">NFCwear</span>
                            </div>
                        </div>

                        <p className="mt-12 text-zinc-500 text-sm font-mono tracking-widest uppercase">Lead Conversion Comparison</p>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
