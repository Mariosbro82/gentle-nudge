import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ScanLine, Users, ArrowUpRight, Eye, Activity } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";
import { KPICard } from "@/components/dashboard/kpi-card";
import { DashboardSkeleton } from "@/components/dashboard/skeleton-cards";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
    ResponsiveContainer,
} from "recharts";

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg border border-border/50 bg-popover/95 backdrop-blur-xl px-3 py-2 shadow-xl">
            <p className="text-xs font-medium text-foreground">{label}</p>
            {payload.map((p: any, i: number) => (
                <p key={i} className="text-sm font-semibold" style={{ color: p.color }}>
                    {p.value} {p.name}
                </p>
            ))}
        </div>
    );
}

export default function DashboardPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [scansCount, setScansCount] = useState(0);
    const [leadsCount, setLeadsCount] = useState(0);
    const [chipsCount, setChipsCount] = useState(0);
    const [viewsCount, setViewsCount] = useState(0);
    const [recentScans, setRecentScans] = useState<any[]>([]);
    const [scanChartData, setScanChartData] = useState<{ date: string; scans: number }[]>([]);

    useEffect(() => {
        async function fetchData() {
            if (!user) return;

            const { data: userProfile } = await supabase
                .from("users")
                .select("id, company_id, view_count")
                .eq("auth_user_id", user.id)
                .single();

            if (userProfile) {
                const { count } = await supabase
                    .from("profile_views")
                    .select("*", { count: "exact", head: true })
                    .eq("user_id", userProfile.id);
                setViewsCount(count || 0);
            }

            let chipsQuery = supabase.from("chips").select("id");
            if (userProfile?.company_id) {
                chipsQuery = chipsQuery.eq("company_id", userProfile.company_id);
            } else {
                chipsQuery = chipsQuery.eq("assigned_user_id", userProfile?.id || "");
            }
            const { data: userChips } = await chipsQuery;
            const chipIds = userChips?.map((c) => c.id) || [];
            setChipsCount(chipIds.length);

            if (chipIds.length > 0) {
                const [scansResult, recentScansResult, allScans] = await Promise.all([
                    supabase.from("scans").select("*", { count: "exact", head: true }).in("chip_id", chipIds),
                    supabase.from("scans").select("*").in("chip_id", chipIds).order("scanned_at", { ascending: false }).limit(5),
                    supabase.from("scans").select("scanned_at").in("chip_id", chipIds).gte("scanned_at", new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()).order("scanned_at", { ascending: true }),
                ]);
                setScansCount(scansResult.count || 0);
                setRecentScans(recentScansResult.data || []);

                // Build chart data from last 14 days
                const dayMap: Record<string, number> = {};
                for (let i = 13; i >= 0; i--) {
                    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
                    dayMap[d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })] = 0;
                }
                (allScans.data || []).forEach((s: any) => {
                    const d = new Date(s.scanned_at).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });
                    if (d in dayMap) dayMap[d]++;
                });
                setScanChartData(Object.entries(dayMap).map(([date, scans]) => ({ date, scans })));
            }

            const { count: leads } = await supabase
                .from("leads")
                .select("*", { count: "exact", head: true })
                .eq("captured_by_user_id", userProfile?.id || "");
            setLeadsCount(leads || 0);

            setLoading(false);
        }
        fetchData();
    }, [user]);

    if (loading) return <DashboardSkeleton />;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Übersicht</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">Willkommen zurück. Hier ist Ihre aktuelle Performance.</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-medium text-emerald-500">Live</span>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard title="Gesamt Scans" value={scansCount} trend="+12%" trendDirection="up" icon={ScanLine} subtitle="diese Woche" />
                <KPICard title="Aktive Kontakte" value={leadsCount} trend="+8%" trendDirection="up" icon={Users} subtitle="erfasst" />
                <KPICard title="Aktive Chips" value={chipsCount} icon={ArrowUpRight} subtitle="zugewiesen" />
                <KPICard title="Profil Aufrufe" value={viewsCount} trend="+23%" trendDirection="up" icon={Eye} subtitle="gesamt" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Area Chart */}
                <div className="lg:col-span-3 rounded-xl border border-border/50 bg-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-sm font-semibold tracking-tight text-foreground">Scans (14 Tage)</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">Tägliche NFC-Scan-Aktivität</p>
                        </div>
                        <Link to="/dashboard/analytics" className="text-xs font-medium text-primary hover:underline underline-offset-4">
                            Alle Details →
                        </Link>
                    </div>
                    {scanChartData.length > 0 ? (
                        <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={scanChartData}>
                                    <defs>
                                        <linearGradient id="scanGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                                            <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                                    <ReTooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="scans" name="Scans" stroke="hsl(var(--chart-1))" strokeWidth={2} fill="url(#scanGradient)" dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: "hsl(var(--background))" }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[280px] flex items-center justify-center">
                            <p className="text-sm text-muted-foreground">Noch keine Scan-Daten vorhanden</p>
                        </div>
                    )}
                </div>

                {/* Live Feed */}
                <div className="lg:col-span-2 rounded-xl border border-border/50 bg-card p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <Activity size={16} className="text-primary" />
                            <h3 className="text-sm font-semibold tracking-tight text-foreground">Live Feed</h3>
                        </div>
                        <Link to="/dashboard/leads" className="text-xs font-medium text-primary hover:underline underline-offset-4">
                            Alle →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentScans.slice(0, 5).map((scan: any) => (
                            <div key={scan.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors">
                                <div className="h-9 w-9 rounded-lg bg-chart-1/10 flex items-center justify-center text-chart-1 shrink-0">
                                    <ScanLine size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">{scan.device_type || "Gerät"}</p>
                                    <p className="text-xs text-muted-foreground">{new Date(scan.scanned_at).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</p>
                                </div>
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                            </div>
                        ))}
                        {!recentScans.length && (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <ScanLine className="w-8 h-8 text-muted-foreground/40 mb-2" />
                                <p className="text-sm text-muted-foreground">Noch keine Scans</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
