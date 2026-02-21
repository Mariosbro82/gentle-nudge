import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";

export interface OrgTemplateConfig {
    global_colors?: {
        background?: string;
        banner?: string;
        accent?: string;
    };
    company_logo_url?: string;
    mandatory_links?: Array<{ title: string; url: string }>;
    locked_fields?: string[];
}

export interface OrgContext {
    orgId: string | null;
    orgName: string | null;
    orgRole: "owner" | "admin" | "member" | "viewer" | null;
    templateConfig: OrgTemplateConfig | null;
    isOrgAdmin: boolean;
    loading: boolean;
}

export function useOrgTemplate(): OrgContext {
    const { user: authUser } = useAuth();
    const [state, setState] = useState<OrgContext>({
        orgId: null,
        orgName: null,
        orgRole: null,
        templateConfig: null,
        isOrgAdmin: false,
        loading: true,
    });

    useEffect(() => {
        if (!authUser) {
            setState(prev => ({ ...prev, loading: false }));
            return;
        }

        (async () => {
            // Get internal user id
            const { data: myUser } = await supabase
                .from("users")
                .select("id")
                .eq("auth_user_id", authUser.id)
                .maybeSingle();

            if (!myUser) {
                setState(prev => ({ ...prev, loading: false }));
                return;
            }

            // Get membership
            const { data: membership } = await supabase
                .from("organization_members")
                .select("organization_id, role")
                .eq("user_id", myUser.id)
                .maybeSingle();

            if (!membership) {
                setState(prev => ({ ...prev, loading: false }));
                return;
            }

            const isAdmin = membership.role === "owner" || membership.role === "admin";

            // Get org with template_config
            const { data: org } = await supabase
                .from("organizations")
                .select("id, name, template_config")
                .eq("id", membership.organization_id)
                .single();

            setState({
                orgId: org?.id || null,
                orgName: org?.name || null,
                orgRole: membership.role as any,
                templateConfig: (org?.template_config as OrgTemplateConfig) || null,
                isOrgAdmin: isAdmin,
                loading: false,
            });
        })();
    }, [authUser]);

    return state;
}

/** Check if a field is locked by the org template */
export function isFieldLocked(config: OrgTemplateConfig | null, fieldName: string): boolean {
    if (!config?.locked_fields) return false;
    return config.locked_fields.includes(fieldName);
}
