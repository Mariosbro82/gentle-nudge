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
 * Log a profile view event via Edge Function
 */
export async function logProfileView(userId: string) {
    // Get device info
    const userAgent = navigator.userAgent;
    const deviceType = getDeviceType(userAgent);
    const referrer = document.referrer;

    try {
        const { data, error } = await supabase.functions.invoke('log-profile-view', {
            body: {
                user_id: userId,
                device_type: deviceType,
                user_agent: userAgent,
                referrer: referrer
            }
        });

        if (error) throw error;
        return data;
    } catch (e) {
        console.error("Failed to log profile view:", e);
        return null;
    }
}

/**
 * Submit a lead via Edge Function
 */
export async function submitLead(leadData: {
    captured_by_user_id: string;
    lead_name: string;
    lead_email: string;
    lead_phone?: string;
    notes?: string;
}) {
    try {
        const { data, error } = await supabase.functions.invoke('submit-lead', {
            body: leadData
        });

        if (error) throw error;
        return { success: true, data };
    } catch (e) {
        console.error("Failed to submit lead:", e);
        return { success: false, error: e };
    }
}

/**
 * Get profile view analytics
 */
export async function getProfileViewAnalytics(userId: string, daysBack: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const { data: views, error } = await supabase
        .from("profile_views")
        .select("*")
        .eq("user_id", userId)
        .gte("viewed_at", startDate.toISOString())
        .order("viewed_at", { ascending: true });

    if (error || !views) {
        return {
            views: [],
            totalViews: 0,
            uniqueVisitors: 0,
            recurringVisitors: 0,
            avgDaily: 0,
            viewsByDate: [],
            deviceBreakdown: [],
            countryBreakdown: [],
        };
    }

    const totalViews = views.length;
    // Unique visitors based on distinct IP addresses
    const uniqueVisitors = new Set(views.map(v => v.ip_address)).size;
    // Recurring visitors (views marked as recurring)
    const recurringVisitors = views.filter(v => v.is_recurring).length;
    const avgDaily = Math.round((totalViews / daysBack) * 10) / 10;

    // Group by date
    const viewsByDate: Record<string, number> = {};
    views.forEach(view => {
        const date = new Date(view.viewed_at || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        viewsByDate[date] = (viewsByDate[date] || 0) + 1;
    });

    // Device breakdown
    const devices: Record<string, number> = { Mobile: 0, Desktop: 0, Tablet: 0, Other: 0 };
    views.forEach(view => {
        const type = view.device_type || "Other";
        if (type.includes("Mobile")) devices.Mobile++;
        else if (type.includes("Desktop")) devices.Desktop++;
        else if (type.includes("Tablet")) devices.Tablet++;
        else devices.Other++;
    });

    // Country breakdown
    const countries: Record<string, number> = {};
    views.forEach(view => {
        const country = view.country || "Unknown";
        countries[country] = (countries[country] || 0) + 1;
    });

    return {
        views,
        totalViews,
        uniqueVisitors,
        recurringVisitors,
        avgDaily,
        viewsByDate: Object.entries(viewsByDate).map(([date, count]) => ({ date, views: count })),
        deviceBreakdown: Object.entries(devices)
            .filter(([_, val]) => val > 0)
            .map(([name, value]) => ({ name, value })),
        countryBreakdown: Object.entries(countries)
            .sort((a, b) => b[1] - a[1]) // Sort by count desc
            .slice(0, 5) // Top 5
            .map(([name, value]) => ({ name, value })),
    };
}

/**
 * Get interested leads (recurring visitors)
 */
export async function getInterestedLeads(userId: string) {
    const { data, error } = await supabase.rpc('get_interested_leads', { p_user_id: userId });

    if (error) {
        console.error("Failed to fetch interested leads:", error);
        return [];
    }

    return data;
}
