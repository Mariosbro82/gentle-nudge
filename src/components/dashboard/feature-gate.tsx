import { Lock } from "lucide-react";
import { hasFeature, PLAN_FEATURES, type PlanType } from "@/lib/plan-features";

interface FeatureGateProps {
    feature: string;
    plan: PlanType | null | undefined;
    children: React.ReactNode;
    label?: string;
}

/**
 * Wraps a feature section. If the user's plan doesn't include the feature,
 * shows a locked overlay with upgrade prompt.
 */
export function FeatureGate({ feature, plan, children, label }: FeatureGateProps) {
    const allowed = hasFeature(plan, feature);

    if (allowed) return <>{children}</>;

    // Find which plan unlocks this feature
    const unlockPlan = (["pro", "enterprise"] as PlanType[]).find(
        (p) => PLAN_FEATURES[p].features[feature]
    );

    return (
        <div className="relative">
            <div className="pointer-events-none select-none opacity-40 blur-[1px]">
                {children}
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm rounded-xl z-10">
                <div className="flex flex-col items-center gap-2 text-center px-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <Lock className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                        {label || "Feature gesperrt"}
                    </p>
                    <p className="text-xs text-muted-foreground max-w-[200px]">
                        Verfügbar ab dem{" "}
                        <span className="font-semibold text-primary">
                            {unlockPlan ? PLAN_FEATURES[unlockPlan].name : "höheren"} Plan
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
