import { createClient } from "@/lib/supabase/server";
import { AnalyticsCharts } from "./charts";
import { redirect } from "next/navigation";

export default async function AnalyticsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Get user's profile to check company
    const { data: userProfile } = await supabase
        .from("users")
        .select("id, company_id")
        .eq("id", user.id)
        .single();

    // 1. Get Chips for User (same logic as Dashboard/Devices)
    let chipsQuery = supabase.from("chips").select("id");
    if (userProfile?.company_id) {
        chipsQuery = chipsQuery.eq("company_id", userProfile.company_id);
    } else {
        chipsQuery = chipsQuery.eq("assigned_user_id", user.id);
    }
    const { data: chips } = await chipsQuery;

    const chipIds = chips?.map(c => c.id) || [];

    if (chipIds.length === 0) {
        return (
            <div className="p-10 text-center text-zinc-500">
                <h2 className="text-xl font-bold text-white mb-2">Keine NFC-Chips gefunden</h2>
                <p>Verknüpfen Sie zuerst einen Chip, um Analysen zu sehen.</p>
            </div>
        );
    }

    // 2. Fetch Scans (Last 30 Days default)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: scans } = await supabase
        .from("scans")
        .select("*")
        .in("chip_id", chipIds)
        .gte("scanned_at", thirtyDaysAgo.toISOString())
        .order("scanned_at", { ascending: true });

    const recentScans = scans || [];

    // 3. Process Data
    const totalScans = recentScans.length;
    const uniqueVisitors = new Set(recentScans.map(s => s.ip_address)).size;
    const avgDaily = Math.round((totalScans / 30) * 10) / 10;

    // Conversion (Scans vs Leads)
    const { count: leadsCount } = await supabase
        .from("leads")
        .select("*", { count: 'exact', head: true })
        .in("captured_by_user_id", [user.id]); // Simplify to user for now

    const conversionRate = totalScans > 0 ? Math.round(((leadsCount || 0) / totalScans) * 100) / 10 : 0;

    // Chart Data: Scans by Date
    // Simplified aggregation
    const scansByDate: Record<string, number> = {};
    recentScans.forEach(scan => {
        const date = new Date(scan.scanned_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        scansByDate[date] = (scansByDate[date] || 0) + 1;
    });

    const scanData = Object.entries(scansByDate).map(([date, count]) => ({ date, scans: count }));

    // Device Data
    const devices: Record<string, number> = { Mobile: 0, Desktop: 0, Tablet: 0, Other: 0 };
    recentScans.forEach(scan => {
        const type = scan.device_type || "Other";
        if (type.includes("Mobile")) devices.Mobile++;
        else if (type.includes("Desktop")) devices.Desktop++;
        else if (type.includes("Tablet")) devices.Tablet++;
        else devices.Other++;
    });

    const deviceData = Object.entries(devices)
        .filter(([_, val]) => val > 0)
        .map(([name, value]) => ({ name, value }));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-zinc-500">Performance Ihrer NFC Chips (Letzte 30 Tage).</p>
            </div>

            <AnalyticsCharts
                scanData={scanData}
                deviceData={deviceData}
                metrics={{ totalScans, uniqueVisitors, avgDaily, conversionRate }}
            />
        </div>
    );
}
