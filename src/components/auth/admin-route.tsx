import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase/client";
import { UserRole } from "@/types/admin";

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
                // Fetch user role from public users table
                const { data, error } = await supabase
                    .from('users')
                    .select('role')
                    .eq('auth_user_id', user.id)
                    .single();

                if (error) {
                    console.error("Error checking admin role:", error);
                    setIsAdmin(false);
                } else {
                    const role = data?.role as UserRole;
                    setIsAdmin(role === 'admin');
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
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-400">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-mono">Verifying Access Level 4...</p>
                </div>
            </div>
        );
    }

    // If not authenticated or not admin, show 404 to hide the existence of this route
    // Or redirect to secret login if user is not logged in at all?
    // User asked for "hidden". If I redirect to login, it reveals the route exists.
    // But if they are at /admin/dashboard, they probably know it exists.
    // Use a classic 404 if not admin.
    if (!isAdmin) {
        // Render a fake 404 page or redirect to home
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
