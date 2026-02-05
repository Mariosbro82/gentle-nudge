"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";

export async function logScan(chipId: string) {
    const supabase = await createClient();
    const headersList = await headers(); // Await headers
    const userAgent = headersList.get("user-agent") || "Unknown";
    const ip = headersList.get("x-forwarded-for") || "Unknown";

    // Parse User Agent
    // @ts-ignore
    const parser = new UAParser(userAgent);
    const device = parser.getDevice();
    const deviceType = device.type === "mobile" ? "Mobile" : device.type === "tablet" ? "Tablet" : "Desktop";
    const deviceVendor = device.vendor || "Generic";

    // Insert Scan
    await supabase.from("scans").insert({
        chip_id: chipId,
        ip_address: ip,
        user_agent: userAgent,
        device_type: `${deviceVendor} ${deviceType}`, // e.g. "Apple Mobile"
        scanned_at: new Date().toISOString()
    });
}