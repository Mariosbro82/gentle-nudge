import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { Loader2, ShieldCheck, UserPlus } from "lucide-react";

export default function ClaimPage() {
    const { uid } = useParams<{ uid: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    async function handleClaim() {
        if (!uid) return;
        setLoading(true);
        setError(null);

        if (!user) {
            // Redirect to login, then back here
            navigate(`/login?redirectTo=/claim/${uid}`);
            return;
        }

        try {
            // 1. Get user profile
            const { data: profile, error: profileError } = await supabase
                .from("users")
                .select("id")
                .eq("auth_user_id", user.id)
                .single();

            if (profileError || !profile) {
                throw new Error("Benutzerprofil nicht gefunden.");
            }

            // 2. Assign chip to user
            const { error: updateError } = await supabase
                .from("chips")
                .update({
                    assigned_user_id: profile.id,
                    active_mode: "corporate", // Default mode
                    company_id: null // Or keep existing if any
                })
                .eq("uid", uid)
                .is("assigned_user_id", null); // Security: ensure it's still unassigned

            if (updateError) throw updateError;

            // Success
            setSuccess(true);
            setTimeout(() => {
                navigate("/dashboard/settings"); // Or profile page
            }, 2000);

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Fehler beim Aktivieren des Chips.");
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
                <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                        <ShieldCheck className="w-8 h-8 text-green-500" />
                    </div>
                    <h1 className="text-2xl font-bold">Chip erfolgreich aktiviert!</h1>
                    <p className="text-zinc-400">Sie werden weitergeleitet...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-6">
            <div className="max-w-md w-full space-y-8 bg-zinc-900/50 p-8 rounded-2xl border border-white/5 backdrop-blur-xl">
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center mb-4">
                        <UserPlus className="w-8 h-8 text-blue-500" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Chip aktivieren</h1>
                    <p className="text-zinc-400">
                        Dieser NFC-Chip ist noch niemandem zugewiesen. Aktivieren Sie ihn jetzt, um ihn mit Ihrem Profil zu verknüpfen.
                    </p>
                </div>

                <div className="bg-black/50 p-4 rounded-lg border border-white/5 font-mono text-center text-zinc-300">
                    UID: {uid}
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                <Button
                    className="w-full bg-blue-600 hover:bg-blue-500 h-12 text-lg font-semibold"
                    onClick={handleClaim}
                    disabled={loading}
                >
                    {loading ? <Loader2 className="animate-spin mr-2" /> : "Jetzt aktivieren"}
                </Button>

                {!user && (
                    <p className="text-xs text-center text-zinc-500">
                        Sie müssen sich anmelden oder registrieren.
                    </p>
                )}
            </div>
        </div>
    );
}
