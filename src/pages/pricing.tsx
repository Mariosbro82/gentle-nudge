import { Navbar } from "@/components/marketing/navbar";
import { PricingCard } from "@/components/ui/dark-gradient-pricing";

export default function PricingPage() {
    const tiers = [
        {
            tier: "Starter",
            price: "€29",
            bestFor: "Für kleine Unternehmen",
            CTA: "Kostenlos testen",
            benefits: [
                { text: "Bis zu 500 NFC-Tags", checked: true },
                { text: "Basic Analytics", checked: true },
                { text: "Standard Support", checked: true },
                { text: "API Zugriff", checked: false },
                { text: "Custom Branding", checked: false },
            ],
        },
        {
            tier: "Business",
            price: "€99",
            bestFor: "Für wachsende Teams",
            CTA: "Jetzt starten",
            benefits: [
                { text: "Unbegrenzte NFC-Tags", checked: true },
                { text: "Advanced Analytics", checked: true },
                { text: "Priority Support", checked: true },
                { text: "API Zugriff", checked: true },
                { text: "Custom Branding", checked: false },
            ],
        },
        {
            tier: "Enterprise",
            price: "Custom",
            bestFor: "Für Großunternehmen",
            CTA: "Kontaktieren Sie uns",
            benefits: [
                { text: "Alles in Business", checked: true },
                { text: "Dedicated Success Manager", checked: true },
                { text: "SLA 99.9%", checked: true },
                { text: "Custom Integrationen", checked: true },
                { text: "White Labeling", checked: true },
            ],
        },
    ];

    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="container mx-auto px-6 pt-32 pb-20">
                <div className="mb-16 text-center">
                    <h1 className="text-4xl font-bold mb-4">Preise & Pläne</h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                        Übersicht über unsere Preismodelle für Unternehmen jeder Größe.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {tiers.map((tier, index) => (
                        <PricingCard key={index} {...tier} />
                    ))}
                </div>
            </div>
        </main>
    );
}
