import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

// Initialize Supabase Client (Admin/Service Role needed for secure reads if RLS is strict, or just Anon if policy allows)
// For redirect, we usually need read access to chips table.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface PageProps {
    params: {
        uid: string;
    };
    searchParams: {
        sun?: string; // Secure Unique NFC message
    };
}

import { logScan } from "@/lib/actions/analytics";

// ... imports

export default async function NfcRedirectPage({ params, searchParams }: PageProps) {
    const { uid } = params;
    const { sun } = searchParams;

    // ... SUN check ...

    // 2. Fetch Chip Data
    const { data: chip, error } = await supabase
        .from("chips")
        .select(`
        *,
        company:companies(*),
        assigned_user:users(*)
    `)
        .eq("uid", uid)
        .single();

    if (error || !chip) {
        // ... existing error UI ...
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white p-4 text-center">
                <div>
                    <h1 className="text-2xl font-bold mb-2 text-red-500">Chip nicht erkannt</h1>
                    <p className="text-zinc-400">Dieser NFC-Tag ist nicht registriert oder inaktiv.</p>
                    <p className="mt-4 text-xs text-zinc-600">UID: {uid}</p>
                </div>
            </div>
        );
    }

    // 3. Log Scan (Non-blocking)
    // We await it here to ensure it logs before redirect, though it adds a few ms.
    try {
        await logScan(chip.id);
    } catch (e) {
        console.error("Failed to log scan", e);
    }

    // 5. Routing Logic based on Mode
    switch (chip.active_mode) {
        case "corporate":
        case "vcard": // Handle both legacy and new 'vcard' mode name
            if (chip.assigned_user?.slug) {
                redirect(`/p/${chip.assigned_user.slug}`);
            } else if (chip.assigned_user_id) {
                redirect(`/p/${chip.assigned_user_id}`);
            }
            break;

        case "hospitality":
        case "menu":
            // Check for menu_data JSON
            if (chip.menu_data?.url) {
                redirect(chip.menu_data.url);
            }
            redirect(`/review/${chip.company_id}`);
            break;

        case "campaign":
            // Redirect to Company Campaign Page
            redirect(`/campaign/${chip.company_id}`);
            break;

        case "redirect":
            if (chip.target_url) {
                redirect(chip.target_url);
            }
            break;
    }

    // Fallback
    // ...

    // Fallback
    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
            <div className="animate-pulse">Lädt...</div>
        </div>
    );
}
