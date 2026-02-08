


import { UserX, BarChart3, Keyboard, Cpu, Circle, Layers } from "lucide-react";

export function IdeaSection() {
    return (
        <section id="idea" className="py-24 relative overflow-hidden bg-black z-20">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500 mb-6">
                        Unsere Idee
                    </h2>
                    <p className="text-lg text-zinc-400 leading-relaxed">
                        Corporate Fashion war gestern. Wir dachten Mode neu: Nicht nur als Stoff, sondern als <span className="text-blue-400 font-semibold">digitale Schnittstelle</span>.
                        Was wäre, wenn dein Hoodie mehr könnte als nur gut aussehen? Wenn er deine Visitenkarte, dein Zahlungsmittel und dein Marketing-Tool wäre?
                    </p>
                </div>

                {/* The Problem Grid */}
                <div className="mb-24">
                    <h3 className="text-2xl font-bold text-white mb-8 text-center">Das Problem</h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Problem 1 */}
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all group flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-6 group-hover:bg-red-500/30 transition-colors">
                                <UserX className="w-6 h-6 text-red-400" />
                            </div>
                            <h4 className="text-xl font-bold text-white mb-3">Leads gehen verloren</h4>
                            <p className="text-zinc-500 text-sm">
                                Wertvolle Kontakte auf Messen und Events werden oft vergessen oder gehen im Chaos unter.
                            </p>
                        </div>

                        {/* Problem 2 */}
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all group flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-6 group-hover:bg-orange-500/30 transition-colors">
                                <BarChart3 className="w-6 h-6 text-orange-400" />
                            </div>
                            <h4 className="text-xl font-bold text-white mb-3">Keine Messbarkeit</h4>
                            <p className="text-zinc-500 text-sm">
                                Print-Werbung und herkömmliches Merch liefern keine Daten. Du weißt nicht, was funktioniert.
                            </p>
                        </div>

                        {/* Problem 3 */}
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all group flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mb-6 group-hover:bg-yellow-500/30 transition-colors">
                                <Keyboard className="w-6 h-6 text-yellow-400" />
                            </div>
                            <h4 className="text-xl font-bold text-white mb-3">Manueller Aufwand</h4>
                            <p className="text-zinc-500 text-sm">
                                Visitenkarten müssen mühsam abgetippt werden. Ein fehleranfälliger und zeitfressender Prozess.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Engineering Section */}
                <div className="relative mb-32">
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-blue-500/5 rounded-[3rem] blur-3xl -z-10" />

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="text-left">
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Engineering trifft Fashion.
                            </h3>
                            <p className="text-lg text-zinc-400 mb-12">
                                Jedes Stück wird mit obsessiver Liebe zum Detail entwickelt. Von der Platzierung des NFC-Chips bis zum Gewicht des Stoffes – nichts wird dem Zufall überlassen.
                            </p>

                            <div className="space-y-8">
                                {/* Feature 1 */}
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0">
                                        <Cpu className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold mb-1">NTAG424 DNA</h4>
                                        <p className="text-zinc-500 text-sm">
                                            NFC-Chips mit militärischer Sicherheit und SUN-Authentifizierung. Die sicherste Consumer-NFC-Technologie.
                                        </p>
                                    </div>
                                </div>

                                {/* Feature 2 */}
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0">
                                        <Circle className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold mb-1">35mm Runde Tags</h4>
                                        <p className="text-zinc-500 text-sm">
                                            Premium NFC-Tags nahtlos in den Stoff integriert. Unsichtbar, aber immer erreichbar.
                                        </p>
                                    </div>
                                </div>

                                {/* Feature 3 */}
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0">
                                        <Layers className="w-6 h-6 text-pink-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold mb-1">Double-Woven Tech</h4>
                                        <p className="text-zinc-500 text-sm">
                                            Proprietäre Doppelwebtechnologie für Haltbarkeit über 500+ Waschzyklen.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Technical Drawing Placeholder */}
                        <div className="relative aspect-[4/5] bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center overflow-hidden">
                            <video
                                src="/assets/best-render-vid.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>


            </div>
        </section>
    );
}
