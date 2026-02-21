/**
 * Plan-based feature gating configuration
 * Based on: Starter (€29), Pro/Business (€99), Enterprise (Custom)
 */

export type PlanType = "starter" | "pro" | "enterprise";

export interface PlanConfig {
    name: string;
    price: string;
    features: Record<string, boolean>;
    limits: {
        maxChips: number;
        maxTeamMembers: number;
    };
}

export const PLAN_FEATURES: Record<PlanType, PlanConfig> = {
    starter: {
        name: "Starter",
        price: "€29",
        features: {
            basic_analytics: true,
            smart_actions: true,
            digital_business_card: true,
            standard_support: true,
            api_access: false,
            advanced_analytics: false,
            team_management: false,
            priority_support: false,
            custom_branding: false,
            sso_audit_logs: false,
            white_labeling: false,
            custom_integrations: false,
            dedicated_success_manager: false,
            welcome_animation: true,
            video_greeting: false,
            file_vault: true,
            presets: true,
            webhooks: false,
            csv_export: false,
            ghost_mode: true,
            campaigns: false,
        },
        limits: {
            maxChips: 5,
            maxTeamMembers: 1,
        },
    },
    pro: {
        name: "Business",
        price: "€99",
        features: {
            basic_analytics: true,
            smart_actions: true,
            digital_business_card: true,
            standard_support: true,
            api_access: true,
            advanced_analytics: true,
            team_management: true,
            priority_support: true,
            custom_branding: true,
            sso_audit_logs: false,
            white_labeling: false,
            custom_integrations: false,
            dedicated_success_manager: false,
            welcome_animation: true,
            video_greeting: true,
            file_vault: true,
            presets: true,
            webhooks: true,
            csv_export: true,
            ghost_mode: true,
            campaigns: true,
        },
        limits: {
            maxChips: 50,
            maxTeamMembers: 20,
        },
    },
    enterprise: {
        name: "Enterprise",
        price: "Custom",
        features: {
            basic_analytics: true,
            smart_actions: true,
            digital_business_card: true,
            standard_support: true,
            api_access: true,
            advanced_analytics: true,
            team_management: true,
            priority_support: true,
            custom_branding: true,
            sso_audit_logs: true,
            white_labeling: true,
            custom_integrations: true,
            dedicated_success_manager: true,
            welcome_animation: true,
            video_greeting: true,
            file_vault: true,
            presets: true,
            webhooks: true,
            csv_export: true,
            ghost_mode: true,
            campaigns: true,
        },
        limits: {
            maxChips: Infinity,
            maxTeamMembers: Infinity,
        },
    },
};

export const FEATURE_LABELS: Record<string, string> = {
    basic_analytics: "Basic Analytics",
    smart_actions: "Smart Actions",
    digital_business_card: "Digital Business Card",
    standard_support: "Standard Support",
    api_access: "API Zugriff",
    advanced_analytics: "Advanced Analytics",
    team_management: "Team Management",
    priority_support: "Priority Support",
    custom_branding: "Custom Branding",
    sso_audit_logs: "SSO & Audit Logs",
    white_labeling: "White Labeling",
    custom_integrations: "Custom Integrationen",
    dedicated_success_manager: "Dedicated Success Manager",
    welcome_animation: "Welcome Animation",
    video_greeting: "Video-Begrüßung",
    file_vault: "Datei-Vault",
    presets: "Profil-Presets",
    webhooks: "Webhook-Integration",
    csv_export: "CSV Export",
    ghost_mode: "Ghost Mode",
    campaigns: "KI-Kampagnen",
};

export function hasFeature(plan: PlanType | null | undefined, feature: string): boolean {
    const p = plan || "starter";
    return PLAN_FEATURES[p]?.features[feature] ?? false;
}

export function getPlanLimit(plan: PlanType | null | undefined, limit: keyof PlanConfig["limits"]): number {
    const p = plan || "starter";
    return PLAN_FEATURES[p]?.limits[limit] ?? 0;
}
