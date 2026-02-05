import { Card } from "@/components/ui/card";
import { Users, ScanLine, ArrowUpRight, DollarSign } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
    const supabase = await createClient();

    // Parallel data fetching
    const [
        { count: scansCount },
        { count: leadsCount },
        { count: chipsCount },
        { data: recentScans }
    ] = await Promise.all([
        supabase.from("scans").select("*", { count: "exact", head: true }),
        supabase.from("leads").select("*", { count: "exact", head: true }),
        supabase.from("chips").select("*", { count: "exact", head: true }),
        supabase.from("scans").select("*").order("scanned_at", { ascending: false }).limit(5)
    ]);

    return (
        <div className="space-y-8">

            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm text-zinc-400">System Online</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Gesamt Scans"
                    value={scansCount || 0}
                    change="Gesamtzeit"
                    icon={ScanLine}
                />
                <StatsCard
                    title="Aktive Kontakte"
                    value={leadsCount || 0}
                    change="Erfasste Kontakte"
                    icon={Users}
                />
                <StatsCard
                    title="Aktive Chips"
                    value={chipsCount || 0}
                    change="Verteilte Geräte"
                    icon={ArrowUpRight}
                />
                <StatsCard
                    title="Umsatz"
                    value="0€"
                    change="Platzhalter"
                    icon={DollarSign}
                />
            </div>

            {/* ... Charts Placeholder (kept as is) ... */}
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-zinc-900 border-white/5 p-6 h-[400px]">
                    <h3 className="font-semibold mb-4">Live Scan Feed</h3>
                    <div className="text-zinc-500 text-sm">
                        {/* Placeholder for now, later Realtime */}
                        <div className="space-y-4 mt-4">
                            {recentScans?.slice(0, 5).map((scan: any) => (
                                <div key={scan.id} className="flex items-center justify-between border-b border-white/5 pb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                            <ScanLine size={14} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">{scan.device_type || "Unknown Device"}</p>
                                            <p className="text-xs text-zinc-500">{new Date(scan.scanned_at).toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-zinc-600">{scan.ip_address}</span>
                                </div>
                            ))}
                            {!recentScans?.length && <p>Noch keine Scans.</p>}
                        </div>
                    </div>
                </Card>

                <Card className="bg-zinc-900 border-white/5 p-6 h-[400px] flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold">Performance (30 Tage)</h3>
                        <a href="/dashboard/analytics" className="text-xs text-blue-400 hover:underline">Details</a>
                    </div>
                    {/* Reusing the AnalyticsCharts component might be overkill layout-wise, so we will create a dedicated mini chart or just link to it for now if complex. 
                        Actually, let's render a simple CSS bar chart or just import the LineChart if we make a client wrapper.
                        For simplicity and speed: Import the `AnalyticsCharts` but we need to make sure it fits. 
                        Let's just put a "Go to Analytics" CTA with a summary for now, OR better:
                        Lets move the fetch logic up and pass data. 
                     */}
                    <div className="flex-1 flex items-center justify-center flex-col gap-4">
                        <div className="text-center">
                            <h4 className="text-4xl font-bold text-white mb-1">{scansCount || 0}</h4>
                            <p className="text-zinc-500 text-sm">Scans Gesamt</p>
                        </div>
                        <div className="w-full bg-white/5 h-32 rounded-lg flex items-end px-4 gap-2 pb-2">
                            {/* Fake mini bars for visual flair if no real chart lib here yet */}
                            {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                                <div key={i} className="flex-1 bg-blue-500/20 rounded-t-sm hover:bg-blue-500/50 transition-all" style={{ height: `${h}%` }} />
                            ))}
                        </div>
                        <p className="text-xs text-zinc-600">Mini-Preview. Für Details siehe Analytics.</p>
                    </div>
                </Card>
            </div>

        </div>
    );
}

function StatsCard({ title, value, change, icon: Icon }: any) {
    return (
        <Card className="bg-zinc-900 border-white/5 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-zinc-400">{title}</p>
                    <h2 className="text-2xl font-bold mt-2">{value}</h2>
                </div>
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400">
                    <Icon size={20} />
                </div>
            </div>
            <p className="text-xs text-zinc-500 mt-4">{change}</p>
        </Card>
    )
}
