import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase/client";

export function AdminRoute() {
    const { user, loading: authLoading } = useAuth();
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [checkingRole, setCheckingRole] = useState(true);

    useEffect(() => {
        const checkAdminRole = async () => {
            if (!user) {
                setCheckingRole(false);
                return;
            }

            try {
                // Use server-side is_admin() RPC which checks user_roles table
                const { data, error } = await supabase.rpc('is_admin');

                if (error) {
                    console.error("Error checking admin role:", error);
                    setIsAdmin(false);
                } else {
                    setIsAdmin(data === true);
                }
            } catch (err) {
                console.error("Unexpected error checking role:", err);
                setIsAdmin(false);
            } finally {
                setCheckingRole(false);
            }
        };

        if (!authLoading) {
            checkAdminRole();
        }
    }, [user, authLoading]);

    if (authLoading || checkingRole) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-zinc-500 font-mono">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs tracking-widest uppercase">Authenticating...</p>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
