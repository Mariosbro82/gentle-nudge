import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase/client";

export default function NfcTapPage() {
    const { uid } = useParams<{ uid: string }>();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [_loading, setLoading] = useState(true);

    useEffect(() => {
        async function handleTap() {
            if (!uid) {
                setError("Keine UID gefunden");
                setLoading(false);
                return;
            }

            // Fetch chip data
            const { data: chip, error: fetchError } = await supabase
                .from("chips")
                .select(`*, company:companies(*), assigned_user:users(*)`)
                .eq("uid", uid)
                .single();

            if (fetchError || !chip) {
                setError("Chip nicht erkannt");
                setLoading(false);
                return;
            }

            // Log scan (non-blocking)
            try {
                await supabase.from("scans").insert({
                    chip_id: chip.id,
                    scanned_at: new Date().toISOString(),
                });
            } catch (e) {
                console.error("Failed to log scan", e);
            }

            // Ghost mode check - always route to profile page so ghost page renders
            const assignedUser = chip.assigned_user as any;
            if (assignedUser?.ghost_mode) {
                const ghostUntil = assignedUser.ghost_mode_until;
                const isStillGhosted = !ghostUntil || new Date(ghostUntil) > new Date();

                if (isStillGhosted) {
                    const profilePath = assignedUser.slug
                        ? `/p/${assignedUser.slug}`
                        : `/p/${assignedUser.id}`;
                    navigate(profilePath, { replace: true });
                    return;
                }
            }

            // Route based on mode
            switch (chip.active_mode) {
                case "corporate":
                    if ((chip.assigned_user as any)?.slug) {
                        navigate(`/p/${(chip.assigned_user as any).slug}`, { replace: true });
                    } else if (chip.assigned_user_id) {
                        navigate(`/p/${chip.assigned_user_id}`, { replace: true });
                    } else {
                        setError("Chip ist im Corporate-Modus, aber keinem User zugewiesen.");
                    }
                    break;

                case "hospitality":
                    if ((chip.menu_data as any)?.url) {
                        window.location.href = (chip.menu_data as any).url;
                    } else if (chip.company_id) {
                        navigate(`/review/${chip.company_id}`, { replace: true });
                    } else if (chip.assigned_user_id || (chip.assigned_user as any)?.id) {
                        // Fallback to profile if no company/menu but user is assigned
                        const targetUser = chip.assigned_user as any;
                        if (targetUser?.slug) {
                            navigate(`/p/${targetUser.slug}`, { replace: true });
                        } else if (chip.assigned_user_id) {
                            navigate(`/p/${chip.assigned_user_id}`, { replace: true });
                        } else {
                            // Should be covered by above, but safe fallback
                            setError("Hospitality Mode: Kein Menü, keine Firma und kein User gefunden.");
                        }
                    } else {
                        setError("Chip ist im Hospitality-Modus, aber nicht konfiguriert (Kein Menü, Firma oder User).");
                    }
                    break;

                case "campaign":
                    if (chip.company_id) {
                        navigate(`/campaign/${chip.company_id}`, { replace: true });
                    } else if (assignedUser) {
                        const profilePath = assignedUser.slug ? `/p/${assignedUser.slug}` : `/p/${assignedUser.id}`;
                        navigate(profilePath, { replace: true });
                    } else {
                        setError("Campaign Mode: Keine Kampagne und kein User gefunden.");
                    }
                    break;

                case "lost":
                    if (assignedUser) {
                        const profilePath = assignedUser.slug ? `/p/${assignedUser.slug}` : `/p/${assignedUser.id}`;
                        navigate(profilePath, { replace: true });
                    } else {
                        setError("Lost Mode: Kein Besitzer zugewiesen.");
                    }
                    break;

                default:
                    // Universal Fallback for unknown modes or missing config
                    if (assignedUser) {
                        const profilePath = assignedUser.slug ? `/p/${assignedUser.slug}` : `/p/${assignedUser.id}`;
                        navigate(profilePath, { replace: true });
                    } else {
                        setError("Unbekannter Modus und kein User zugewiesen.");
                    }
            }
        }

        handleTap();
    }, [uid, navigate]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white p-4 text-center">
                <div>
                    <h1 className="text-2xl font-bold mb-2 text-red-500">{error}</h1>
                    <p className="text-zinc-400">Dieser NFC-Tag ist nicht registriert oder inaktiv.</p>
                    <p className="mt-4 text-xs text-zinc-600">UID: {uid}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
            <div className="flex items-center gap-3">
                <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-zinc-400">Lädt...</span>
            </div>
        </div>
    );
}
