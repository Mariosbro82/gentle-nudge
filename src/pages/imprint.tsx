import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

export default function ImprintPage() {
    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-purple-500/30 overflow-x-hidden">
            <Navbar />

            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-12 text-foreground">
                        Impressum
                    </h1>
                    <div className="prose prose-invert max-w-none space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Angaben gemäß § 5 TMG</h2>
                            <p className="text-muted-foreground whitespace-pre-line">
                                Severmore UG (haftungsbeschränkt)<br />
                                Ludwig-van-Beethoven-Weg 9<br />
                                21423 Winsen (Luhe)<br />
                                Deutschland
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4">Kontakt</h2>
                            <p className="text-muted-foreground whitespace-pre-line">
                                Tel.: 015565824919<br />
                                E-Mail: info@severmore.de
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4">Vertreten durch</h2>
                            <p className="text-muted-foreground">
                                Tjark Schmitt, Noah Solaker (Geschäftsführer)
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4">Registereintrag</h2>
                            <p className="text-muted-foreground whitespace-pre-line">
                                Eintragung im Handelsregister.<br />
                                Registergericht: Amtsgericht Lüneburg<br />
                                Registernummer: HRB 212787
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4">Umsatzsteuer-ID</h2>
                            <p className="text-muted-foreground">
                                Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:<br />
                                DE453199946
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4">Streitschlichtung</h2>
                            <p className="text-muted-foreground">
                                Wir sind zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle weder verpflichtet noch bereit.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
