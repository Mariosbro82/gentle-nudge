import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Users, ScanLine, ArrowUpRight } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";

interface StatsCardProps {
    title: string;
    value: number | string;
    change: string;
    icon: React.ElementType;
}

function StatsCard({ title, value, change, icon: Icon }: StatsCardProps) {
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

    useEffect(() => {
        async function fetchData() {
            if (!user) return;

            // Get user's profile to check company
            const { data: userProfile } = await supabase
                .from("users")
                .select("id, company_id, view_count")
                .eq("auth_user_id", user.id)
                .single();

            if (userProfile) {
                setViewsCount(userProfile.view_count || 0);
            }

            // Get user's chip IDs
            let chipsQuery = supabase.from("chips").select("id");
            if (userProfile?.company_id) {
                chipsQuery = chipsQuery.eq("company_id", userProfile.company_id);
            } else {
                chipsQuery = chipsQuery.eq("assigned_user_id", userProfile?.id || "");
            }
            const { data: userChips } = await chipsQuery;
            const chipIds = userChips?.map((c) => c.id) || [];

            setChipsCount(chipIds.length);

            // Fetch counts filtered by user's chips
            if (chipIds.length > 0) {
                const [scansResult, recentScansResult] = await Promise.all([
                    supabase.from("scans").select("*", { count: "exact", head: true }).in("chip_id", chipIds),
                    supabase.from("scans").select("*").in("chip_id", chipIds).order("scanned_at", { ascending: false }).limit(5),
                ]);
                setScansCount(scansResult.count || 0);
                setRecentScans(recentScansResult.data || []);
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

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
                <StatsCard title="Gesamt Scans" value={scansCount} change="Gesamtzeit" icon={ScanLine} />
                <StatsCard title="Aktive Kontakte" value={leadsCount} change="Erfasste Kontakte" icon={Users} />
                <StatsCard title="Aktive Chips" value={chipsCount} change="Verteilte Geräte" icon={ArrowUpRight} />
                <StatsCard title="Aktive Chips" value={chipsCount} change="Verteilte Geräte" icon={ArrowUpRight} />
                <StatsCard title="Profil Aufrufe" value={viewsCount} change="Besucher Gesamt" icon={Users} />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-zinc-900 border-white/5 p-6 h-[400px]">
                    <h3 className="font-semibold mb-4">Live Scan Feed</h3>
                    <div className="text-zinc-500 text-sm">
                        <div className="space-y-4 mt-4">
                            {recentScans.slice(0, 5).map((scan: any) => (
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
                            {!recentScans.length && <p>Noch keine Scans.</p>}
                        </div>
                    </div>
                </Card>

                <Card className="bg-zinc-900 border-white/5 p-6 h-[400px] flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold">Performance (30 Tage)</h3>
                        <Link to="/dashboard/analytics" className="text-xs text-blue-400 hover:underline">
                            Details
                        </Link>
                    </div>
                    <div className="flex-1 flex items-center justify-center flex-col gap-4">
                        <div className="text-center">
                            <h4 className="text-4xl font-bold text-white mb-1">{scansCount}</h4>
                            <p className="text-zinc-500 text-sm">Scans Gesamt</p>
                        </div>
                        <div className="w-full bg-white/5 h-32 rounded-lg flex items-end px-4 gap-2 pb-2">
                            {/* Fake mini bars for visual flair */}
                            {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                                <div
                                    key={i}
                                    className="flex-1 bg-blue-500/20 rounded-t-sm hover:bg-blue-500/50 transition-all"
                                    style={{ height: `${h}%` }}
                                />
                            ))}
                        </div>
                        <p className="text-xs text-zinc-600">Mini-Preview. Für Details siehe Analytics.</p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
