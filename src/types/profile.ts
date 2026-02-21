export interface CustomLink {
    title: string;
    url: string;
    icon?: string;
}

export interface ProfileUser {
    id: string;
    name: string;
    title: string;
    company: string;
    bio: string;
    email: string;
    phone: string;
    website: string;
    linkedin: string;
    avatar: string;
    banner: string;
    activeTemplate: string;
    ghostMode: boolean;
    ghostModeUntil: string | null;
    backgroundImage: string;
    backgroundColor: string;
    bannerColor: string;
    accentColor: string;
    customLinks: CustomLink[];
    couponCode: string;
    couponDescription: string;
    countdownTarget: string | null;
    countdownLabel: string;
    profilePicPosition: string;
    bannerPicPosition: string;
    backgroundPosition: string;
    videoUrl: string;
    customGreeting: string;
    avatarStyle: "image" | "emoji";
    avatarEmoji: string;
}

export interface TemplateProps {
    user: ProfileUser;
}

export type TemplateId = "premium-gradient" | "minimalist-card" | "event-badge";
