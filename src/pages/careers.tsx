import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

export default function CareersPage() {
    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-purple-500/30 overflow-x-hidden">
            <Navbar />

            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-foreground">
                        Karriere
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
                        Wir suchen immer nach Talenten, die mit uns die Zukunft gestalten wollen.
                        Aktuell haben wir keine offenen Stellen ausgeschrieben, aber Initiativbewerbungen sind willkommen.
                    </p>
                    <a href="mailto:info@severmore.de" className="inline-block px-8 py-4 rounded-full bg-foreground text-background font-bold text-lg hover:bg-foreground/90 transition-all">
                        Initiativ bewerben
                    </a>
                </div>
            </section>

            <Footer />
        </main>
    );
}
