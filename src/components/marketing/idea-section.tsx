


export function IdeaSection() {
    return (
        <section id="idea" className="py-24 relative overflow-hidden">
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

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all group">
                        <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">Das Problem</h3>
                        <p className="text-zinc-500">
                            Herkömmliche Visitenkarten landen im Müll. Links auf Flyern werden nie abgetippt. Corporate Merch verstaubt im Schrank, weil er keinen echten Nutzen hat.
                        </p>
                    </div>
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all group">
                        <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">Die Lösung</h3>
                        <p className="text-zinc-500">
                            Integration von NTAG424 DNA Chips direkt in hochwertige Kleidung. Ein Tap mit dem Smartphone genügt, und die digitale Welt öffnet sich – sicher, schnell und ohne App.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
