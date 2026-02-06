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

            // Route based on mode
            switch (chip.active_mode) {
                case "corporate":
                    if ((chip.assigned_user as any)?.slug) {
                        navigate(`/p/${(chip.assigned_user as any).slug}`, { replace: true });
                    } else if (chip.assigned_user_id) {
                        navigate(`/p/${chip.assigned_user_id}`, { replace: true });
                    }
                    break;

                case "hospitality":
                    if ((chip.menu_data as any)?.url) {
                        window.location.href = (chip.menu_data as any).url;
                    } else {
                        navigate(`/review/${chip.company_id}`, { replace: true });
                    }
                    break;

                case "campaign":
                    navigate(`/campaign/${chip.company_id}`, { replace: true });
                    break;

                default:
                    if (chip.target_url) {
                        window.location.href = chip.target_url;
                    } else {
                        setError("Unbekannter Modus");
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
