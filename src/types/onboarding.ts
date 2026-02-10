export interface OnboardingData {
    // New: Template & Automation
    selectedTemplate: "minimalist-card" | "premium-gradient" | "event-badge";
    automationInterest: boolean;
    automationDelayHours: number;

    // Personalization
    industry: string;
    useCase: string;
    referralSource: string;

    // Business
    companyName: string;
    teamSize: string;
    expectedContacts: string;

    // Profile
    displayName: string;
    slug: string; // New: Unique username handle
    tagline: string;
    profilePic: string | null;
    socialLinks: {
        linkedin?: string;
        twitter?: string;
        website?: string;
    };
}
