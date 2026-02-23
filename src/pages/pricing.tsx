import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { PricingCard } from "@/components/ui/dark-gradient-pricing";
import { RoiCalculator } from "@/components/marketing/roi-calculator";

export default function PricingPage() {
    const tiers = [
        {
            tier: "Starter",
            price: "€29",
            bestFor: "Für kleine Unternehmen",
            CTA: "Kostenlos testen",
            href: "/signup",
            benefits: [
                { text: "Bis zu 5 NFC-Tags", checked: true },
                { text: "Basic Analytics", checked: true },
                { text: "Smart Actions", checked: true },
                { text: "Digital Business Card", checked: true },
                { text: "Standard Support", checked: true },
                { text: "API Zugriff", checked: false },
            ],
        },
        {
            tier: "Business",
            price: "€99",
            bestFor: "Für wachsende Teams",
            CTA: "Jetzt starten",
            href: "/signup",
            benefits: [
                { text: "Bis zu 50 NFC-Tags", checked: true },
                { text: "Advanced Analytics", checked: true },
                { text: "KI-Kampagnen & Follow-ups", checked: true },
                { text: "KI-Assistent", checked: true },
                { text: "Team Management", checked: true },
                { text: "Priority Support", checked: true },
                { text: "API Zugriff", checked: true },
                { text: "Custom Branding", checked: true },
            ],
        },
        {
            tier: "Enterprise",
            price: "Custom",
            bestFor: "Für Großunternehmen",
            CTA: "Kontaktieren Sie uns",
            href: "mailto:contact@severmore.com",
            benefits: [
                { text: "Unbegrenzte NFC-Tags", checked: true },
                { text: "KI-Kampagnen & Follow-ups", checked: true },
                { text: "KI-Assistent", checked: true },
                { text: "Dedicated Success Manager", checked: true },
                { text: "SLA 99.9%", checked: true },
                { text: "SSO & Audit Logs", checked: true },
                { text: "White Labeling", checked: true },
                { text: "Custom Integrationen", checked: true },
            ],
        },
    ];

    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-purple-500/30">
            <Navbar />

            <section className="relative pt-32 pb-20 px-6">
                <div className="container mx-auto">
                    <div className="mb-16 text-center max-w-3xl mx-auto">
                        <span className="inline-block px-4 py-2 rounded-full border border-border bg-muted/50 text-sm font-medium mb-6">
                            Transparente Preise
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground tracking-tight">
                            Wählen Sie Ihren Plan
                        </h1>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Starten Sie klein und skalieren Sie, wenn Sie bereit sind.
                            Keine versteckten Gebühren. Jederzeit kündbar.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {tiers.map((tier, index) => (
                            <PricingCard key={index} {...tier} />
                        ))}
                    </div>
                </div>
            </section>

            <RoiCalculator />

            <Footer />
        </main>
    );
}

