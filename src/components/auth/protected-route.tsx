import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase/client";

interface ProtectedRouteProps {
    children: React.ReactNode;
    skipOnboardingCheck?: boolean;
}

export function ProtectedRoute({ children, skipOnboardingCheck = false }: ProtectedRouteProps) {
    const { user, loading: authLoading } = useAuth();
    const location = useLocation();
    const [onboardingStatus, setOnboardingStatus] = useState<{
        checked: boolean;
        completed: boolean;
    }>({ checked: false, completed: true });

    useEffect(() => {
        async function checkOnboarding() {
            if (!user || skipOnboardingCheck) {
                setOnboardingStatus({ checked: true, completed: true });
                return;
            }

            const { data: profile } = await supabase
                .from("users")
                .select("has_completed_onboarding")
                .eq("auth_user_id", user.id)
                .single();

            // If no profile exists, they haven't completed onboarding
            const completed = (profile as any)?.has_completed_onboarding ?? false;
            setOnboardingStatus({ checked: true, completed });
        }

        if (user && !skipOnboardingCheck) {
            checkOnboarding();
        } else {
            setOnboardingStatus({ checked: true, completed: true });
        }
    }, [user, skipOnboardingCheck]);

    // Show loading while checking auth or onboarding status
    if (authLoading || (!onboardingStatus.checked && !skipOnboardingCheck)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950">
                <div className="flex items-center gap-3">
                    <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-zinc-400">Loading...</span>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Redirect to onboarding if not completed (and not already on onboarding page)
    if (!skipOnboardingCheck && !onboardingStatus.completed) {
        return <Navigate to="/onboarding" replace />;
    }

    return <>{children}</>;
}
