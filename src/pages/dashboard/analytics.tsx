import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Target, Eye, Repeat, Scan } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";
import { getProfileViewAnalytics, getScanAnalytics } from "@/lib/api/analytics";
import { cn } from "@/lib/utils";

const COLORS = ["#0ea5e9", "#14b8a6", "#6366f1", "#f59e0b", "#ec4899"];

export default function AnalyticsPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'views' | 'scans'>('views');

    // Profile View Data
    const [viewData, setViewData] = useState<{ date: string; views: number }[]>([]);
    const [viewDeviceData, setViewDeviceData] = useState<{ name: string; value: number }[]>([]);
    const [countryData, setCountryData] = useState<{ name: string; value: number }[]>([]);
    const [viewMetrics, setViewMetrics] = useState({
        totalViews: 0,
        uniqueVisitors: 0,
        recurringVisitors: 0,
        avgDaily: 0,
        conversionRate: 0,
    });

    // NFC Scan Data
    const [scanData, setScanData] = useState<{ date: string; scans: number }[]>([]);
    const [scanDeviceData, setScanDeviceData] = useState<{ name: string; value: number }[]>([]);
    const [scanMetrics, setScanMetrics] = useState({
        totalScans: 0,
        uniqueScans: 0,
    });

    useEffect(() => {
        async function fetchAnalytics() {
            if (!user) return;

            // Get user's profile to check company
            const { data: userProfile } = await supabase
                .from("users")
                .select("id, company_id")
                .eq("auth_user_id", user.id)
                .single();

            if (!userProfile) {
                setLoading(false);
                return;
            }

            // Fetch profile analytics
            const analytics = await getProfileViewAnalytics(userProfile.id);
            const scanAnalytics = await getScanAnalytics(userProfile.id);

            // Calculate conversion rate (leads / unique visitors)
            const { count: leadsCount } = await supabase
                .from("leads")
                .select("*", { count: "exact", head: true })
                .eq("captured_by_user_id", userProfile.id);

            const conversionRate = analytics.uniqueVisitors > 0
                ? Math.round(((leadsCount || 0) / analytics.uniqueVisitors) * 100) / 10
                : 0;

            setViewMetrics({
                totalViews: analytics.totalViews,
                uniqueVisitors: analytics.uniqueVisitors,
                recurringVisitors: analytics.recurringVisitors,
                avgDaily: analytics.avgDaily,
                conversionRate,
            });

            setScanMetrics({
                totalScans: scanAnalytics.totalScans,
                uniqueScans: scanAnalytics.uniqueScans,
            });

            setViewData(analytics.viewsByDate);
            setViewDeviceData(analytics.deviceBreakdown);
            setCountryData(analytics.countryBreakdown);

            setScanData(scanAnalytics.scansByDate);
            setScanDeviceData(scanAnalytics.deviceBreakdown);

            setLoading(false);
        }

        fetchAnalytics();
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const viewStatCards = [
        { title: "Profil Aufrufe", value: viewMetrics.totalViews, icon: Eye, color: "text-sky-500" },
        { title: "Besucher (Unique)", value: viewMetrics.uniqueVisitors, icon: Users, color: "text-teal-500" },
        { title: "Wiederkehrend", value: viewMetrics.recurringVisitors, icon: Repeat, color: "text-purple-500" },
        { title: "Ø Täglich", value: viewMetrics.avgDaily, icon: TrendingUp, color: "text-indigo-500" },
        { title: "Konversionsrate", value: `${viewMetrics.conversionRate}%`, icon: Target, color: "text-amber-500" },
    ];

    const scanStatCards = [
        { title: "NFC Scans (Total)", value: scanMetrics.totalScans, icon: Scan, color: "text-sky-500" },
        { title: "Geräte (Unique)", value: scanMetrics.uniqueScans, icon: Users, color: "text-teal-500" },
        // { title: "Aktive Chips", value: scanMetrics.activeChips, icon: Cpu, color: "text-purple-500" }, 
    ];

    const currentStats = activeTab === 'views' ? viewStatCards : scanStatCards;
    const currentChartData = activeTab === 'views' ? viewData : scanData;
    const currentDeviceData = activeTab === 'views' ? viewDeviceData : scanDeviceData;
    const currentDataKey = activeTab === 'views' ? "views" : "scans";

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                    <p className="text-muted-foreground">Performance & Statistiken (Letzte 30 Tage).</p>
                </div>

                <div className="flex bg-muted p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('views')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all",
                            activeTab === 'views'
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Eye className="w-4 h-4" />
                        Profil Views
                    </button>
                    <button
                        onClick={() => setActiveTab('scans')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all",
                            activeTab === 'scans'
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Scan className="w-4 h-4" />
                        NFC Scans
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {currentStats.map((stat) => (
                    <Card key={stat.title} className="bg-card border-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">
                                {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="bg-card border-border lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-foreground">
                            {activeTab === 'views' ? 'Profilaufrufe' : 'NFC Scans'} im Zeitverlauf
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {currentChartData.length > 0 ? (
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={currentChartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "hsl(var(--card))",
                                                border: "1px solid hsl(var(--border))",
                                                borderRadius: "8px",
                                                color: "hsl(var(--foreground))",
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey={currentDataKey}
                                            stroke={activeTab === 'views' ? "#0ea5e9" : "#8b5cf6"}
                                            strokeWidth={2}
                                            dot={false}
                                            activeDot={{ r: 4 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-muted-foreground">Noch keine Daten verfügbar</div>
                        )}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="bg-card border-border">
                        <CardHeader>
                            <CardTitle className="text-foreground">Geräte</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {currentDeviceData.length > 0 ? (
                                <div className="h-[200px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={currentDeviceData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                outerRadius={70}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {currentDeviceData.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "hsl(var(--card))",
                                                    border: "1px solid hsl(var(--border))",
                                                    borderRadius: "8px",
                                                    color: "hsl(var(--foreground))",
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="flex justify-center gap-2 mt-2 flex-wrap">
                                        {currentDeviceData.map((entry, index) => (
                                            <div key={entry.name} className="flex items-center gap-1.5">
                                                <div
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                />
                                                <span className="text-[10px] text-muted-foreground">
                                                    {entry.name} ({entry.value})
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-[200px] flex items-center justify-center text-muted-foreground">K.A.</div>
                            )}
                        </CardContent>
                    </Card>

                    {activeTab === 'views' && (
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="text-foreground">Länder (Top 5)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {countryData.length > 0 ? (
                                    <div className="space-y-2">
                                        {countryData.map((country, i) => (
                                            <div key={country.name} className="flex items-center justify-between text-sm">
                                                <span className="text-zinc-300 flex items-center gap-2">
                                                    <span className="text-muted-foreground w-4">{i + 1}.</span> {country.name}
                                                </span>
                                                <span className="font-mono text-muted-foreground">{country.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center py-4 text-muted-foreground">K.A.</div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
