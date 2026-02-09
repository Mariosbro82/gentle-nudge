import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Target, Eye, Repeat } from "lucide-react";
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
import { getProfileViewAnalytics } from "@/lib/api/analytics";

const COLORS = ["#0ea5e9", "#14b8a6", "#6366f1", "#f59e0b", "#ec4899"];

export default function AnalyticsPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [viewData, setViewData] = useState<{ date: string; views: number }[]>([]);
    const [deviceData, setDeviceData] = useState<{ name: string; value: number }[]>([]);
    const [countryData, setCountryData] = useState<{ name: string; value: number }[]>([]);
    const [metrics, setMetrics] = useState({
        totalViews: 0,
        uniqueVisitors: 0,
        recurringVisitors: 0,
        avgDaily: 0,
        conversionRate: 0,
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

            // Calculate conversion rate (leads / unique visitors)
            const { count: leadsCount } = await supabase
                .from("leads")
                .select("*", { count: "exact", head: true })
                .eq("captured_by_user_id", userProfile.id);

            const conversionRate = analytics.uniqueVisitors > 0
                ? Math.round(((leadsCount || 0) / analytics.uniqueVisitors) * 100) / 10
                : 0;

            setMetrics({
                totalViews: analytics.totalViews,
                uniqueVisitors: analytics.uniqueVisitors,
                recurringVisitors: analytics.recurringVisitors,
                avgDaily: analytics.avgDaily,
                conversionRate,
            });

            setViewData(analytics.viewsByDate);
            setDeviceData(analytics.deviceBreakdown);
            setCountryData(analytics.countryBreakdown);
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

    const statCards = [
        { title: "Profil Aufrufe", value: metrics.totalViews, icon: Eye, color: "text-sky-500" },
        { title: "Besucher (Unique)", value: metrics.uniqueVisitors, icon: Users, color: "text-teal-500" },
        { title: "Wiederkehrend", value: metrics.recurringVisitors, icon: Repeat, color: "text-purple-500" },
        { title: "Ø Täglich", value: metrics.avgDaily, icon: TrendingUp, color: "text-indigo-500" },
        { title: "Konversionsrate", value: `${metrics.conversionRate}%`, icon: Target, color: "text-amber-500" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-zinc-500">Performance deines Profils (Letzte 30 Tage).</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {statCards.map((stat) => (
                    <Card key={stat.title} className="bg-zinc-900/50 border-white/5">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-400">{stat.title}</CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">
                                {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="bg-zinc-900/50 border-white/5 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-white">Aufrufe im Zeitverlauf</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {viewData.length > 0 ? (
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={viewData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                        <XAxis dataKey="date" stroke="#666" fontSize={12} tickLine={false} />
                                        <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#18181b",
                                                border: "1px solid #333",
                                                borderRadius: "8px",
                                                color: "#fff",
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="views"
                                            stroke="#0ea5e9"
                                            strokeWidth={2}
                                            dot={false}
                                            activeDot={{ r: 4 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-zinc-500">Noch keine Daten verfügbar</div>
                        )}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="bg-zinc-900/50 border-white/5">
                        <CardHeader>
                            <CardTitle className="text-white">Geräte</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {deviceData.length > 0 ? (
                                <div className="h-[200px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={deviceData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                outerRadius={70}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {deviceData.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "#18181b",
                                                    border: "1px solid #333",
                                                    borderRadius: "8px",
                                                    color: "#fff",
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="flex justify-center gap-2 mt-2 flex-wrap">
                                        {deviceData.map((entry, index) => (
                                            <div key={entry.name} className="flex items-center gap-1.5">
                                                <div
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                />
                                                <span className="text-[10px] text-zinc-400">
                                                    {entry.name} ({entry.value})
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-[200px] flex items-center justify-center text-zinc-500">K.A.</div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900/50 border-white/5">
                        <CardHeader>
                            <CardTitle className="text-white">Länder (Top 5)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {countryData.length > 0 ? (
                                <div className="space-y-2">
                                    {countryData.map((country, i) => (
                                        <div key={country.name} className="flex items-center justify-between text-sm">
                                            <span className="text-zinc-300 flex items-center gap-2">
                                                <span className="text-zinc-500 w-4">{i + 1}.</span> {country.name}
                                            </span>
                                            <span className="font-mono text-zinc-400">{country.value}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center py-4 text-zinc-500">K.A.</div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
