import { useEffect, useState } from "react";
import { Users, TrendingUp, Target, Eye, Repeat, Scan } from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";
import { getProfileViewAnalytics, getScanAnalytics } from "@/lib/api/analytics";
import { cn } from "@/lib/utils";
import { KPICard } from "@/components/dashboard/kpi-card";
import { DashboardSkeleton } from "@/components/dashboard/skeleton-cards";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg border border-border/50 bg-popover/95 backdrop-blur-xl px-3 py-2 shadow-xl">
            <p className="text-xs font-medium text-foreground mb-1">{label}</p>
            {payload.map((p: any, i: number) => (
                <p key={i} className="text-sm font-semibold" style={{ color: p.color }}>
                    {p.value} {p.name}
                </p>
            ))}
        </div>
    );
}

export default function AnalyticsPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'views' | 'scans'>('views');

    const [viewData, setViewData] = useState<{ date: string; views: number }[]>([]);
    const [viewDeviceData, setViewDeviceData] = useState<{ name: string; value: number }[]>([]);
    const [countryData, setCountryData] = useState<{ name: string; value: number }[]>([]);
    const [viewMetrics, setViewMetrics] = useState({ totalViews: 0, uniqueVisitors: 0, recurringVisitors: 0, avgDaily: 0, conversionRate: 0 });

    const [scanData, setScanData] = useState<{ date: string; scans: number }[]>([]);
    const [scanDeviceData, setScanDeviceData] = useState<{ name: string; value: number }[]>([]);
    const [scanMetrics, setScanMetrics] = useState({ totalScans: 0, uniqueScans: 0 });

    useEffect(() => {
        async function fetchAnalytics() {
            if (!user) return;
            const { data: userProfile } = await supabase.from("users").select("id, company_id").eq("auth_user_id", user.id).single();
            if (!userProfile) { setLoading(false); return; }

            const analytics = await getProfileViewAnalytics(userProfile.id);
            const scanAnalytics = await getScanAnalytics(userProfile.id);

            const { count: leadsCount } = await supabase.from("leads").select("*", { count: "exact", head: true }).eq("captured_by_user_id", userProfile.id);
            const conversionRate = analytics.uniqueVisitors > 0 ? Math.round(((leadsCount || 0) / analytics.uniqueVisitors) * 100) / 10 : 0;

            setViewMetrics({ totalViews: analytics.totalViews, uniqueVisitors: analytics.uniqueVisitors, recurringVisitors: analytics.recurringVisitors, avgDaily: analytics.avgDaily, conversionRate });
            setScanMetrics({ totalScans: scanAnalytics.totalScans, uniqueScans: scanAnalytics.uniqueScans });
            setViewData(analytics.viewsByDate);
            setViewDeviceData(analytics.deviceBreakdown);
            setCountryData(analytics.countryBreakdown);
            setScanData(scanAnalytics.scansByDate);
            setScanDeviceData(scanAnalytics.deviceBreakdown);
            setLoading(false);
        }
        fetchAnalytics();
    }, [user]);

    if (loading) return <DashboardSkeleton />;

    const viewStatCards = [
        { title: "Profil Aufrufe", value: viewMetrics.totalViews, icon: Eye, trend: "+15%", trendDirection: "up" as const },
        { title: "Besucher (Unique)", value: viewMetrics.uniqueVisitors, icon: Users, trend: "+9%", trendDirection: "up" as const },
        { title: "Wiederkehrend", value: viewMetrics.recurringVisitors, icon: Repeat },
        { title: "Ø Täglich", value: viewMetrics.avgDaily, icon: TrendingUp },
        { title: "Konversionsrate", value: `${viewMetrics.conversionRate}%`, icon: Target },
    ];

    const scanStatCards = [
        { title: "NFC Scans (Total)", value: scanMetrics.totalScans, icon: Scan, trend: "+12%", trendDirection: "up" as const },
        { title: "Geräte (Unique)", value: scanMetrics.uniqueScans, icon: Users },
    ];

    const currentStats = activeTab === 'views' ? viewStatCards : scanStatCards;
    const currentChartData = activeTab === 'views' ? viewData : scanData;
    const currentDeviceData = activeTab === 'views' ? viewDeviceData : scanDeviceData;
    const currentDataKey = activeTab === 'views' ? "views" : "scans";
    const gradientId = activeTab === 'views' ? "viewGrad" : "scanGrad";
    const strokeColor = activeTab === 'views' ? "hsl(var(--chart-1))" : "hsl(var(--chart-4))";

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Analyse</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">Performance & Statistiken der letzten 30 Tage.</p>
                </div>
                <div className="flex bg-muted/50 border border-border/50 p-1 rounded-lg">
                    {[{ key: 'views' as const, label: 'Profil Views', icon: Eye }, { key: 'scans' as const, label: 'NFC Scans', icon: Scan }].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all cursor-pointer",
                                activeTab === tab.key ? "bg-background text-foreground shadow-sm border border-border/50" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Grid */}
            <div className={cn("grid gap-4", activeTab === 'views' ? "md:grid-cols-2 lg:grid-cols-5" : "md:grid-cols-2")}>
                {currentStats.map((stat) => (
                    <KPICard key={stat.title} {...stat} />
                ))}
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-xl border border-border/50 bg-card p-6">
                    <h3 className="text-sm font-semibold tracking-tight text-foreground mb-1">
                        {activeTab === 'views' ? 'Profilaufrufe' : 'NFC Scans'} im Zeitverlauf
                    </h3>
                    <p className="text-xs text-muted-foreground mb-6">Letzte 30 Tage</p>
                    {currentChartData.length > 0 ? (
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={currentChartData}>
                                    <defs>
                                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.25} />
                                            <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey={currentDataKey} name={activeTab === 'views' ? 'Views' : 'Scans'} stroke={strokeColor} strokeWidth={2} fill={`url(#${gradientId})`} dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: "hsl(var(--background))" }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">Noch keine Daten verfügbar</div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="rounded-xl border border-border/50 bg-card p-6">
                        <h3 className="text-sm font-semibold tracking-tight text-foreground mb-4">Geräte</h3>
                        {currentDeviceData.length > 0 ? (
                            <>
                                <div className="h-[180px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={currentDeviceData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value" strokeWidth={0}>
                                                {currentDeviceData.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex justify-center gap-3 mt-2 flex-wrap">
                                    {currentDeviceData.map((entry, index) => (
                                        <div key={entry.name} className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                            <span className="text-[11px] text-muted-foreground">{entry.name} ({entry.value})</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="h-[180px] flex items-center justify-center text-sm text-muted-foreground">K.A.</div>
                        )}
                    </div>

                    {activeTab === 'views' && (
                        <div className="rounded-xl border border-border/50 bg-card p-6">
                            <h3 className="text-sm font-semibold tracking-tight text-foreground mb-4">Länder (Top 5)</h3>
                            {countryData.length > 0 ? (
                                <div className="space-y-3">
                                    {countryData.map((country, i) => {
                                        const max = countryData[0]?.value || 1;
                                        return (
                                            <div key={country.name} className="space-y-1">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-foreground flex items-center gap-2">
                                                        <span className="text-muted-foreground text-xs w-4">{i + 1}.</span> {country.name}
                                                    </span>
                                                    <span className="font-mono text-xs text-muted-foreground">{country.value}</span>
                                                </div>
                                                <div className="h-1 rounded-full bg-muted overflow-hidden">
                                                    <div className="h-full rounded-full bg-chart-1/50 transition-all" style={{ width: `${(country.value / max) * 100}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">K.A.</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
