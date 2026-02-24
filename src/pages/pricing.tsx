import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { PricingCard } from "@/components/ui/dark-gradient-pricing";
import { RoiCalculator } from "@/components/marketing/roi-calculator";
import { ShieldCheck, Server, Lock } from "lucide-react";

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
                { text: "Digitale Visitenkarte", checked: true },
                { text: "Basic Analytics", checked: true },
                { text: "Smart Actions", checked: true },
                { text: "Welcome Animation", checked: true },
                { text: "Ghost Mode", checked: true },
                { text: "Profil-Presets", checked: true },
                { text: "File Vault (Ressourcen)", checked: true },
                { text: "Live-Status Badge", checked: true },
                { text: "Standard Support", checked: true },
                { text: "Video-Begrüßung", checked: false },
                { text: "KI-Assistent", checked: false },
                { text: "KI-Kampagnen", checked: false },
                { text: "Custom Branding", checked: false },
                { text: "API / Webhooks", checked: false },
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
                { text: "Alles aus Starter", checked: true },
                { text: "Advanced Analytics", checked: true },
                { text: "KI-Kampagnen & Follow-ups", checked: true },
                { text: "KI-Assistent", checked: true },
                { text: "Video-Begrüßung", checked: true },
                { text: "Team Management", checked: true },
                { text: "Top-Performer Ranking", checked: true },
                { text: "CSV Export (Leads)", checked: true },
                { text: "Custom Branding", checked: true },
                { text: "API / Webhooks", checked: true },
                { text: "Priority Support", checked: true },
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
                { text: "Alles aus Business", checked: true },
                { text: "Bulk Chip Import (CSV)", checked: true },
                { text: "Corporate Design System", checked: true },
                { text: "SSO & Audit Logs", checked: true },
                { text: "White Labeling", checked: true },
                { text: "Custom Integrationen", checked: true },
                { text: "Dedicated Success Manager", checked: true },
                { text: "SLA 99.9%", checked: true },
            ],
        },
    ];

    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-purple-500/30">
            <Navbar />

            <section className="relative pt-32 pb-20 px-6">
                <div className="container mx-auto">
                    <div className="mb-20 text-center max-w-3xl mx-auto">
                        <span className="inline-block px-4 py-2 rounded-full border border-border/50 bg-muted/50 text-sm font-medium mb-6">
                            Transparente Preise
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-foreground tracking-tight leading-tight">
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

                    {/* Trust Badges */}
                    <div className="flex flex-wrap items-center justify-center gap-6 mt-16">
                        {[
                            { icon: ShieldCheck, label: "100% DSGVO konform" },
                            { icon: Server, label: "Hosted in Germany" },
                            { icon: Lock, label: "Enterprise-Grade Security" },
                        ].map(({ icon: Icon, label }) => (
                            <div key={label} className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                <Icon size={14} className="text-muted-foreground/60" />
                                <span>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <RoiCalculator />

            <Footer />
        </main>
    );
}
