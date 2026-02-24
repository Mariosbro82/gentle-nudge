import { HeroSection } from "@/components/ui/hero-section-2";
import { ScrollTextReveal } from "@/components/marketing/scroll-text-reveal";
import { TrustSection } from "@/components/marketing/trust-section";
import { IdeaSection } from "@/components/marketing/idea-section";
import { FoundersSection } from "@/components/marketing/founders-section";
import { AnalyticsSection } from "@/components/marketing/analytics-section";
import { RoiSection } from "@/components/marketing/roi-section";
import { FeaturesSection } from "@/components/marketing/features-section";
import { TechHighlights } from "@/components/marketing/tech-highlights";
import { HistorySection } from "@/components/marketing/history-section";
import { ContactSection } from "@/components/marketing/contact-section";
import { Footer } from "@/components/marketing/footer";
import { FeatureBentoGrid } from "@/components/marketing/feature-bento-grid";
import { SocialProof } from "@/components/marketing/social-proof";

export default function MarketingPage() {
    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-blue-500/30">
            <HeroSection />
            <ScrollTextReveal />
            <TrustSection />
            <IdeaSection />

            {/* Visual Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-0" />

            <AnalyticsSection />
            <FeatureBentoGrid />
            <SocialProof />
            <FoundersSection />

            <RoiSection />

            <FeaturesSection />
            <HistorySection />
            <TechHighlights />
            <ContactSection />

            <Footer />
        </main>
    );
}
