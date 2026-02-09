
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { AdminUser } from "@/types/admin";
import { Users, CreditCard, Activity, ArrowUpRight, TrendingUp, TrendingDown, UserPlus, Eye, Megaphone } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

interface DashboardStat {
    label: string;
    value: string;
    change: string;
    trend: 'up' | 'down' | 'neutral';
    icon: any;
    color: string;
}

interface ActivityItem {
    id: string;
    type: 'user' | 'lead' | 'view';
    description: string;
    time: string; // ISO string
    icon: any;
    color: string;
}

interface GrowthData {
    date: string;
    users: number;
}

export default function AdminDashboardPage() {
    const [adminProfile, setAdminProfile] = useState<AdminUser | null>(null);
    const [stats, setStats] = useState<DashboardStat[]>([
        { label: "Total Users", value: "-", change: "0%", trend: 'neutral', icon: Users, color: "text-blue-500" },
        { label: "Active Chips", value: "-", change: "0%", trend: 'neutral', icon: CreditCard, color: "text-purple-500" },
        { label: "Profile Views", value: "-", change: "0%", trend: 'neutral', icon: Activity, color: "text-green-500" },
        { label: "Leads Generated", value: "-", change: "0%", trend: 'neutral', icon: ArrowUpRight, color: "text-orange-500" },
    ]);
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [growthData, setGrowthData] = useState<GrowthData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                // 1. Fetch Admin Profile
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data } = await supabase
                        .from('users')
                        .select('*')
                        .eq('auth_user_id', user.id)
                        .single();
                    setAdminProfile(data as unknown as AdminUser);
                }

                // 2. Fetch Stats & Trends
                const now = new Date();
                const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

                const thirtyDaysAgoIso = thirtyDaysAgo.toISOString();
                const sixtyDaysAgoIso = sixtyDaysAgo.toISOString();

                // Helper to get counts
                const getCounts = async (table: string, timeCol: string = 'created_at') => {
                    const totalPromise = supabase.from(table as any).select('*', { count: 'exact', head: true });
                    const currentPromise = supabase.from(table as any).select('*', { count: 'exact', head: true }).gte(timeCol, thirtyDaysAgoIso);
                    const previousPromise = supabase.from(table as any).select('*', { count: 'exact', head: true }).gte(timeCol, sixtyDaysAgoIso).lt(timeCol, thirtyDaysAgoIso);

                    const [total, current, previous] = await Promise.all([totalPromise, currentPromise, previousPromise]);

                    return {
                        total: total.count || 0,
                        current: current.count || 0,
                        previous: previous.count || 0
                    };
                };

                const [users, chips, views, leads] = await Promise.all([
                    getCounts('users'),
                    getCounts('chips'),
                    getCounts('profile_views', 'viewed_at'),
                    getCounts('leads')
                ]);

                const calculateTrend = (current: number, previous: number) => {
                    if (previous === 0) return current > 0 ? "+100%" : "0%";
                    const diff = ((current - previous) / previous) * 100;
                    return (diff > 0 ? "+" : "") + diff.toFixed(1) + "%";
                };

                const getTrendDirection = (current: number, previous: number): 'up' | 'down' | 'neutral' => {
                    if (current === previous) return 'neutral';
                    return current > previous ? 'up' : 'down';
                };

                setStats([
                    {
                        label: "Total Users",
                        value: users.total.toLocaleString(),
                        change: calculateTrend(users.current, users.previous),
                        trend: getTrendDirection(users.current, users.previous),
                        icon: Users,
                        color: "text-blue-500"
                    },
                    {
                        label: "Active Chips",
                        value: chips.total.toLocaleString(),
                        change: calculateTrend(chips.current, chips.previous),
                        trend: getTrendDirection(chips.current, chips.previous),
                        icon: CreditCard,
                        color: "text-purple-500"
                    },
                    {
                        label: "Profile Views",
                        value: views.total.toLocaleString(),
                        change: calculateTrend(views.current, views.previous),
                        trend: getTrendDirection(views.current, views.previous),
                        icon: Activity,
                        color: "text-green-500"
                    },
                    {
                        label: "Leads Generated",
                        value: leads.total.toLocaleString(),
                        change: calculateTrend(leads.current, leads.previous),
                        trend: getTrendDirection(leads.current, leads.previous),
                        icon: ArrowUpRight,
                        color: "text-orange-500"
                    },
                ]);

                // 3. Fetch Recent Activity
                const { data: recentUsers } = await supabase.from('users').select('id, email, created_at').order('created_at', { ascending: false }).limit(5);
                const { data: recentLeads } = await supabase.from('leads').select('id, email, created_at').order('created_at', { ascending: false }).limit(5);
                // Depending on size, fetching views might be heavy, but limit 5 is fine
                const { data: recentViews } = await supabase.from('profile_views').select('id, viewer_id, viewed_at').order('viewed_at', { ascending: false }).limit(5);

                const newActivities: ActivityItem[] = [
                    ...(recentUsers?.map(u => ({
                        id: u.id,
                        type: 'user' as const,
                        description: `New user signed up: ${u.email}`,
                        time: u.created_at,
                        icon: UserPlus,
                        color: 'text-blue-400'
                    })) || []),
                    ...(recentLeads?.map(l => ({
                        id: l.id.toString(),
                        type: 'lead' as const,
                        description: `New lead captured: ${l.email}`,
                        time: l.created_at,
                        icon: Megaphone,
                        color: 'text-orange-400'
                    })) || []),
                    ...(recentViews?.map((v, i) => ({
                        id: v.id ? v.id.toString() : `view-${i}`,
                        type: 'view' as const,
                        description: `Profile view recorded`,
                        time: v.viewed_at,
                        icon: Eye,
                        color: 'text-green-400'
                    })) || [])
                ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10);

                setActivities(newActivities);

                // 4. Fetch Growth Data (Last 30 Days Users)
                const { data: monthUsers } = await supabase
                    .from('users')
                    .select('created_at')
                    .gte('created_at', thirtyDaysAgoIso)
                    .order('created_at', { ascending: true });

                // Group by day
                const days: Record<string, number> = {};
                // Initialize last 30 days with 0
                for (let i = 0; i < 30; i++) {
                    const d = new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000);
                    const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
                    days[dateStr] = 0;
                }

                monthUsers?.forEach(u => {
                    const dateStr = u.created_at.split('T')[0];
                    if (days[dateStr] !== undefined) {
                        days[dateStr]++;
                    }
                });

                const chartData = Object.entries(days).map(([date, count]) => ({
                    date: date.substring(5), // MM-DD
                    users: count
                }));

                setGrowthData(chartData);

            } catch (error) {
                console.error("Dashboard data error:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    return (
        <div className="p-8 space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
                <p className="text-zinc-400">Welcome back, {adminProfile?.name || adminProfile?.email || 'Admin'}.</p>
            </header>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl hover:bg-zinc-900 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 bg-zinc-950 rounded-lg border border-zinc-800 ${stat.color}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border ${stat.trend === 'up' ? "text-green-400 bg-green-400/10 border-green-400/20" :
                                stat.trend === 'down' ? "text-red-400 bg-red-400/10 border-red-400/20" :
                                    "text-zinc-400 bg-zinc-400/10 border-zinc-400/20"
                                }`}>
                                {stat.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                                {stat.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                                {stat.change}
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">
                            {loading ? "..." : stat.value}
                        </h3>
                        <p className="text-sm text-zinc-500">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Growth Chart */}
                <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-medium text-white">User Growth</h3>
                            <p className="text-zinc-500 text-sm">New user signups over the last 30 days.</p>
                        </div>
                        <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={growthData}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
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
                                    dataKey="users"
                                    stroke="#3b82f6"
                                    fillOpacity={1}
                                    fill="url(#colorUsers)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity Feed */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 flex flex-col h-[400px]">
                    <h3 className="text-lg font-medium text-white mb-4">Recent Activity</h3>
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                        {loading ? (
                            <p className="text-zinc-500 text-sm text-center py-4">Loading stats...</p>
                        ) : activities.length === 0 ? (
                            <p className="text-zinc-500 text-sm text-center py-4">No recent activity.</p>
                        ) : (
                            activities.map((item, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                    <div className={`mt-0.5 min-w-[32px] w-8 h-8 rounded-full flex items-center justify-center bg-zinc-950 border border-zinc-800 ${item.color}`}>
                                        <item.icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-300 font-medium leading-none mb-1">{item.description}</p>
                                        <p className="text-xs text-zinc-500">
                                            {new Date(item.time).toLocaleDateString()} {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
