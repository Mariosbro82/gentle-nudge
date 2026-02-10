import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-purple-500/30 overflow-x-hidden">
            <Navbar />

            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-foreground">
                        Kontakt
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
                        Hast du Fragen, Anregungen oder möchtest mit uns zusammenarbeiten?
                        Schreib uns gerne eine Nachricht.
                    </p>
                    <a href="mailto:info@severmore.de" className="inline-block px-8 py-4 rounded-full bg-foreground text-background font-bold text-lg hover:bg-foreground/90 transition-all">
                        Email senden
                    </a>
                </div>
            </section>

            <Footer />
        </main>
    );
}
