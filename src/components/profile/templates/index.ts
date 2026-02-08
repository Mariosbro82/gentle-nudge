import type { ComponentType } from "react";
import type { TemplateProps, TemplateId } from "@/types/profile";
import { PremiumGradientTemplate } from "./premium-gradient";
import { MinimalistCardTemplate } from "./minimalist-card";
import { EventBadgeTemplate } from "./event-badge";

export const TEMPLATE_REGISTRY: Record<TemplateId, ComponentType<TemplateProps>> = {
    "premium-gradient": PremiumGradientTemplate,
    "minimalist-card": MinimalistCardTemplate,
    "event-badge": EventBadgeTemplate,
};

export function getTemplate(id: string): ComponentType<TemplateProps> {
    return TEMPLATE_REGISTRY[id as TemplateId] || PremiumGradientTemplate;
}
