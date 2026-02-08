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
}

export interface TemplateProps {
    user: ProfileUser;
}

export type TemplateId = "premium-gradient" | "minimalist-card" | "event-badge";
