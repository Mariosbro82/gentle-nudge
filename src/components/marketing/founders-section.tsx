import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function FoundersSection() {
    return (
        <section className="py-24 bg-muted/30 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">Die Köpfe hinter Severmore</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Aus einer Schulhof-Idee zum Tech-Startup. Wir verbinden Technologie mit Mode – direkt aus Winsen.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                    {/* Tjark Profile */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-blue-500/10 rounded-3xl blur-xl group-hover:bg-blue-500/20 transition-all duration-500" />
                        <div className="relative p-8 rounded-3xl bg-card border border-border backdrop-blur-sm h-full flex flex-col items-center text-center hover:border-blue-500/30 transition-colors">
                            <div className="w-32 h-32 rounded-full border-4 border-background shadow-2xl mb-6 overflow-hidden bg-muted">
                                <Avatar className="w-full h-full">
                                    <AvatarImage src="/images/founders/tjark.png" alt="Tjark Schmitt" className="object-cover" />
                                    <AvatarFallback>TS</AvatarFallback>
                                </Avatar>
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-1">Tjark Schmitt</h3>
                            <span className="text-blue-400 text-sm font-mono mb-4 block">Co-Founder & Product</span>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                                "Mode muss Geschichten erzählen – deine Geschichte."<br />
                                Verantwortlich für Design und technische Entwicklung. Verbindet Ingenieursdenken mit kreativem Anspruch.
                            </p>
                            <div className="mt-auto px-4 py-2 rounded-full bg-muted border border-border text-xs text-muted-foreground">
                                Fokus: Design & Tech
                            </div>
                        </div>
                    </div>

                    {/* Noah Profile */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-purple-500/10 rounded-3xl blur-xl group-hover:bg-purple-500/20 transition-all duration-500" />
                        <div className="relative p-8 rounded-3xl bg-card border border-border backdrop-blur-sm h-full flex flex-col items-center text-center hover:border-purple-500/30 transition-colors">
                            <div className="w-32 h-32 rounded-full border-4 border-background shadow-2xl mb-6 overflow-hidden bg-muted">
                                <Avatar className="w-full h-full">
                                    <AvatarImage src="/images/founders/noah.png" alt="Noah Solaker" className="object-cover" />
                                    <AvatarFallback>NS</AvatarFallback>
                                </Avatar>
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-1">Noah Solaker</h3>
                            <span className="text-purple-400 text-sm font-mono mb-4 block">Co-Founder & Operations</span>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                                "Wir verkaufen keine Kleidung. Wir stärken Gemeinschaften."<br />
                                Kümmert sich um Strategie und Vertrieb. Sorgt dafür, dass aus guten Ideen echte Lösungen werden.
                            </p>
                            <div className="mt-auto px-4 py-2 rounded-full bg-muted border border-border text-xs text-muted-foreground">
                                Fokus: Sales & Strategy
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <p className="text-sm text-muted-foreground italic">
                        "Digitalisierung muss nicht unpersönlich sein. Wir schaffen echte Verbindungen."
                    </p>
                </div>
            </div>
        </section>
    );
}
