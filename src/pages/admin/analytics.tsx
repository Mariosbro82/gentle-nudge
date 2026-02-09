
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Users, CreditCard, Activity, ArrowUpRight, Megaphone, TrendingUp, Filter } from "lucide-react";
import {
    Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";

interface AnalyticsStats {
    totalUsers: number;
    activeChips: number;
    totalLeads: number;
    totalViews: number;
}

interface TrafficData {
    date: string;
    views: number;
}

interface ConversionData {
    stage: string;
    count: number;
    fill: string;
}

export default function AdminAnalyticsPage() {
    const [stats, setStats] = useState<AnalyticsStats>({
        totalUsers: 0,
        activeChips: 0,
        totalLeads: 0,
        totalViews: 0
    });
    const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
    const [conversionData, setConversionData] = useState<ConversionData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            setLoading(true);
            try {
                // 1. Basic Counts
                const [
                    { count: userCount },
                    { count: chipCount },
                    { count: leadCount },
                    { count: viewsCount }
                ] = await Promise.all([
                    supabase.from('users').select('*', { count: 'exact', head: true }),
                    supabase.from('chips').select('*', { count: 'exact', head: true }),
                    supabase.from('leads').select('*', { count: 'exact', head: true }),
                    supabase.from('profile_views').select('*', { count: 'exact', head: true })
                ]);

                setStats({
                    totalUsers: userCount || 0,
                    activeChips: chipCount || 0,
                    totalLeads: leadCount || 0,
                    totalViews: viewsCount || 0
                });

                // 2. Traffic Analysis (Last 30 Days)
                const now = new Date();
                const days: Record<string, number> = {};
                for (let i = 0; i < 30; i++) {
                    const d = new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000);
                    const dateStr = d.toISOString().split('T')[0];
                    days[dateStr] = 0;
                }

                const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
                const { data: viewsData } = await supabase
                    .from('profile_views')
                    .select('viewed_at')
                    .gte('viewed_at', thirtyDaysAgo);

                viewsData?.forEach(v => {
                    const dateStr = v.viewed_at?.split('T')[0];
                    if (dateStr && days[dateStr] !== undefined) {
                        days[dateStr]++;
                    }
                });

                const trafficChartData = Object.entries(days).map(([date, count]) => ({
                    date: date.substring(5), // MM-DD
                    views: count
                }));
                setTrafficData(trafficChartData);

                // 3. Conversion Tracking (Simple Funnel)
                // Funnel: Visitors (profile views) -> Engaged (recurring?) -> Leads (leads table)
                // For simplified view: Views -> Leads

                // We'll treat "Visitors" as Total Unique Views (approx from viewsCount for demo, ideally count distinct IPs)
                // "Leads" is total leads

                const conversionChartData: ConversionData[] = [
                    { stage: "Page Views", count: viewsCount || 0, fill: "#3b82f6" }, // Blue
                    { stage: "Leads", count: leadCount || 0, fill: "#f97316" } // Orange
                ];
                setConversionData(conversionChartData);

            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    const kpiCards = [
        { label: "Total Users", value: stats.totalUsers.toLocaleString(), icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
        { label: "Active Chips", value: stats.activeChips.toLocaleString(), icon: CreditCard, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
        { label: "Leads Generated", value: stats.totalLeads.toLocaleString(), icon: Megaphone, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
        { label: "Total Profile Views", value: stats.totalViews.toLocaleString(), icon: Activity, color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" },
    ];

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                        <ArrowUpRight className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Analytics Hub</h1>
                        <p className="text-zinc-500 text-sm">Performance metrics and conversion tracking.</p>
                    </div>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiCards.map((stat, i) => (
                    <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl relative overflow-hidden group hover:bg-zinc-900 transition-colors">
                        <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${stat.color}`}>
                            <stat.icon className="w-16 h-16" />
                        </div>
                        <div className="relative z-10">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${stat.bg} ${stat.border} border`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-1">
                                {loading ? "..." : stat.value}
                            </h3>
                            <p className="text-sm text-zinc-500">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Traffic Analysis Chart */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 flex flex-col h-[400px]">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-medium text-white">Traffic Analysis</h3>
                            <p className="text-zinc-500 text-sm">Profile views over the last 30 days.</p>
                        </div>
                        <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                        </div>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trafficData}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#52525b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#52525b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="views"
                                    stroke="#10b981"
                                    fillOpacity={1}
                                    fill="url(#colorViews)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Conversion Tracking Chart */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 flex flex-col h-[400px]">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-medium text-white">Conversion Funnel</h3>
                            <p className="text-zinc-500 text-sm">Comparison of unique views vs leads.</p>
                        </div>
                        <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800">
                            <Filter className="w-4 h-4 text-orange-500" />
                        </div>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={conversionData} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                                <XAxis type="number" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis dataKey="stage" type="category" stroke="#fff" fontSize={12} tickLine={false} axisLine={false} width={80} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Optional Conversion Rate Display */}
                    <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between items-center px-4">
                        <span className="text-zinc-400 text-sm">Conversion Rate</span>
                        <span className="text-xl font-bold text-white">
                            {stats.totalViews > 0
                                ? ((stats.totalLeads / stats.totalViews) * 100).toFixed(2)
                                : "0.00"}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
