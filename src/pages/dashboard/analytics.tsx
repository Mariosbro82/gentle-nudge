import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, TrendingUp, Target } from "lucide-react";
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

const COLORS = ["#0ea5e9", "#14b8a6", "#6366f1", "#f59e0b"];

export default function AnalyticsPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [scanData, setScanData] = useState<{ date: string; scans: number }[]>([]);
    const [deviceData, setDeviceData] = useState<{ name: string; value: number }[]>([]);
    const [metrics, setMetrics] = useState({
        totalScans: 0,
        uniqueVisitors: 0,
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

            // Get chips
            let chipsQuery = supabase.from("chips").select("id");
            if (userProfile?.company_id) {
                chipsQuery = chipsQuery.eq("company_id", userProfile.company_id);
            } else {
                chipsQuery = chipsQuery.eq("assigned_user_id", userProfile?.id || "");
            }
            const { data: chips } = await chipsQuery;
            const chipIds = chips?.map((c) => c.id) || [];

            if (chipIds.length === 0) {
                setLoading(false);
                return;
            }

            // Fetch scans (last 30 days)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const { data: scans } = await supabase
                .from("scans")
                .select("*")
                .in("chip_id", chipIds)
                .gte("scanned_at", thirtyDaysAgo.toISOString())
                .order("scanned_at", { ascending: true });

            const recentScans = scans || [];
            const totalScans = recentScans.length;
            const uniqueVisitors = new Set(recentScans.map((s) => s.ip_address)).size;
            const avgDaily = Math.round((totalScans / 30) * 10) / 10;

            // Conversion rate
            const { count: leadsCount } = await supabase
                .from("leads")
                .select("*", { count: "exact", head: true })
                .eq("captured_by_user_id", userProfile?.id || "");

            const conversionRate = totalScans > 0 ? Math.round(((leadsCount || 0) / totalScans) * 100) / 10 : 0;

            // Process scan data by date
            const scansByDate: Record<string, number> = {};
            recentScans.forEach((scan) => {
                const date = new Date(scan.scanned_at || '').toLocaleDateString("en-US", { month: "short", day: "numeric" });
                scansByDate[date] = (scansByDate[date] || 0) + 1;
            });
            const processedScanData = Object.entries(scansByDate).map(([date, count]) => ({ date, scans: count }));

            // Device data
            const devices: Record<string, number> = { Mobile: 0, Desktop: 0, Tablet: 0, Other: 0 };
            recentScans.forEach((scan) => {
                const type = scan.device_type || "Other";
                if (type.includes("Mobile")) devices.Mobile++;
                else if (type.includes("Desktop")) devices.Desktop++;
                else if (type.includes("Tablet")) devices.Tablet++;
                else devices.Other++;
            });
            const processedDeviceData = Object.entries(devices)
                .filter(([_, val]) => val > 0)
                .map(([name, value]) => ({ name, value }));

            setMetrics({ totalScans, uniqueVisitors, avgDaily, conversionRate });
            setScanData(processedScanData);
            setDeviceData(processedDeviceData);
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
        { title: "Total Scans", value: metrics.totalScans, icon: BarChart3, color: "text-sky-500" },
        { title: "Unique Visitors", value: metrics.uniqueVisitors, icon: Users, color: "text-teal-500" },
        { title: "Avg. Daily Scans", value: metrics.avgDaily, icon: TrendingUp, color: "text-indigo-500" },
        { title: "Conversion Rate", value: `${metrics.conversionRate}%`, icon: Target, color: "text-amber-500" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-zinc-500">Performance Ihrer NFC Chips (Letzte 30 Tage).</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                        <CardTitle className="text-white">Scans Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {scanData.length > 0 ? (
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={scanData}>
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
                                            dataKey="scans"
                                            stroke="#0ea5e9"
                                            strokeWidth={2}
                                            dot={false}
                                            activeDot={{ r: 4 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-zinc-500">No data available yet</div>
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/50 border-white/5">
                    <CardHeader>
                        <CardTitle className="text-white">Device Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {deviceData.length > 0 ? (
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={deviceData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
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
                                <div className="flex justify-center gap-4 mt-4 flex-wrap">
                                    {deviceData.map((entry, index) => (
                                        <div key={entry.name} className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                            />
                                            <span className="text-xs text-zinc-400">
                                                {entry.name} ({entry.value})
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-zinc-500">No data available yet</div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
