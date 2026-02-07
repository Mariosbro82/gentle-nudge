import { Navbar } from "@/components/marketing/navbar";
import { HeroScroll } from "@/components/marketing/hero-scroll";
import { IdeaSection } from "@/components/marketing/idea-section";
import { FoundersSection } from "@/components/marketing/founders-section";
import { AnalyticsSection } from "@/components/marketing/analytics-section";
import { RoiSection } from "@/components/marketing/roi-section";
import { FeaturesSection } from "@/components/marketing/features-section";
import { TechHighlights } from "@/components/marketing/tech-highlights";
import { HistorySection } from "@/components/marketing/history-section";
import { ContactSection } from "@/components/marketing/contact-section";

export default function MarketingPage() {
    return (
        <main className="min-h-screen bg-black selection:bg-blue-500/30">
            <Navbar />
            <HeroScroll />
            <IdeaSection />

            {/* Visual Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-0" />

            <AnalyticsSection />
            <FoundersSection />

            <RoiSection />

            <FeaturesSection />
            <HistorySection />
            <TechHighlights />
            <ContactSection />

            <footer className="py-10 text-center text-zinc-600 text-sm border-t border-white/5 bg-black">
                <p>© 2026 NFCwear by Severmore. All rights reserved.</p>
            </footer>
        </main>
    );
}
