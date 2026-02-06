import { supabase } from "@/lib/supabase/client";

/**
 * Log a scan event (client-side version)
 */
export async function logScan(chipId: string) {
    // Get device info from navigator
    const userAgent = navigator.userAgent;
    const deviceType = getDeviceType(userAgent);

    const { error } = await supabase.from("scans").insert({
        chip_id: chipId,
        user_agent: userAgent,
        device_type: deviceType,
        scanned_at: new Date().toISOString(),
        // Note: IP address is usually captured server-side or via Supabase Edge Functions
    });

    if (error) {
        console.error("Failed to log scan:", error);
        return false;
    }
    return true;
}

/**
 * Get device type from user agent
 */
function getDeviceType(userAgent: string): string {
    const ua = userAgent.toLowerCase();

    if (/ipad|tablet|playbook|silk/i.test(ua)) {
        return "Tablet";
    }
    if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) {
        return "Mobile";
    }
    return "Desktop";
}

/**
 * Get analytics data for user's chips
 */
export async function getAnalyticsData(chipIds: string[], daysBack: number = 30) {
    if (chipIds.length === 0) {
        return {
            scans: [],
            totalScans: 0,
            uniqueVisitors: 0,
            avgDaily: 0,
            scansByDate: [],
            deviceBreakdown: [],
        };
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const { data: scans, error } = await supabase
        .from("scans")
        .select("*")
        .in("chip_id", chipIds)
        .gte("scanned_at", startDate.toISOString())
        .order("scanned_at", { ascending: true });

    if (error || !scans) {
        return {
            scans: [],
            totalScans: 0,
            uniqueVisitors: 0,
            avgDaily: 0,
            scansByDate: [],
            deviceBreakdown: [],
        };
    }

    // Process data
    const totalScans = scans.length;
    const uniqueVisitors = new Set(scans.map(s => s.ip_address)).size;
    const avgDaily = Math.round((totalScans / daysBack) * 10) / 10;

    // Group by date
    const scansByDate: Record<string, number> = {};
    scans.forEach(scan => {
        const date = new Date(scan.scanned_at || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        scansByDate[date] = (scansByDate[date] || 0) + 1;
    });

    // Device breakdown
    const devices: Record<string, number> = { Mobile: 0, Desktop: 0, Tablet: 0, Other: 0 };
    scans.forEach(scan => {
        const type = scan.device_type || "Other";
        if (type.includes("Mobile")) devices.Mobile++;
        else if (type.includes("Desktop")) devices.Desktop++;
        else if (type.includes("Tablet")) devices.Tablet++;
        else devices.Other++;
    });

    return {
        scans,
        totalScans,
        uniqueVisitors,
        avgDaily,
        scansByDate: Object.entries(scansByDate).map(([date, count]) => ({ date, scans: count })),
        deviceBreakdown: Object.entries(devices)
            .filter(([_, val]) => val > 0)
            .map(([name, value]) => ({ name, value })),
    };
}
