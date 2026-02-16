import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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

            try {
                const response = await fetch(
                    `https://owxuoejwnxspzuleeyqi.supabase.co/functions/v1/scan?uid=${encodeURIComponent(uid)}`,
                    {
                        method: "GET",
                        headers: {
                            "Accept": "application/json",
                            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93eHVvZWp3bnhzcHp1bGVleXFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NzM4NDgsImV4cCI6MjA4NjI0OTg0OH0.snwR-UPW1Qrm_pqT6qSWVmAYHR5nsL1-xaxwz9LZotA",
                            "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93eHVvZWp3bnhzcHp1bGVleXFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NzM4NDgsImV4cCI6MjA4NjI0OTg0OH0.snwR-UPW1Qrm_pqT6qSWVmAYHR5nsL1-xaxwz9LZotA",
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    setError(data.error === "chip_not_found" ? "Chip nicht erkannt" : (data.error || "Fehler beim Laden"));
                    setLoading(false);
                    return;
                }

                if (data.redirect) {
                    if (data.external) {
                        window.location.href = data.redirect;
                    } else {
                        navigate(data.redirect, { replace: true });
                    }
                    return;
                }

                setError("Chip nicht erkannt");
            } catch (e) {
                console.error("NFC tap error:", e);
                setError("Verbindungsfehler");
            }
            setLoading(false);
        }

        handleTap();
    }, [uid, navigate]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4 text-center">
                <div>
                    <h1 className="text-2xl font-bold mb-2 text-destructive">{error}</h1>
                    <p className="text-muted-foreground">Dieser NFC-Tag ist nicht registriert oder inaktiv.</p>
                    <p className="mt-4 text-xs text-muted-foreground/50">UID: {uid}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
            <div className="flex items-center gap-3">
                <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-muted-foreground">Lädt...</span>
            </div>
        </div>
    );
}
