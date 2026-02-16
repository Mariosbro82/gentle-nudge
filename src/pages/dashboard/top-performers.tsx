import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";
import { Trophy, Medal, Award, User, TrendingUp, Eye, Users2, Zap, Building2, Shield } from "lucide-react";

interface Performer {
    user_id: string;
    user_name: string | null;
    user_email: string;
    user_job_title: string | null;
    user_profile_pic: string | null;
    profile_views: number;
    leads_count: number;
    score: number;
}

const PODIUM = [
    { rank: 1, icon: Trophy, color: "text-yellow-500", bg: "from-yellow-500/20 to-yellow-500/5 border-yellow-500/30", size: "h-28" },
    { rank: 2, icon: Medal, color: "text-zinc-300", bg: "from-zinc-400/15 to-zinc-400/5 border-zinc-400/20", size: "h-20" },
    { rank: 3, icon: Award, color: "text-amber-700", bg: "from-amber-700/15 to-amber-700/5 border-amber-700/20", size: "h-14" },
];

export default function TopPerformersPage() {
    const { user } = useAuth();
    const [performers, setPerformers] = useState<Performer[]>([]);
    const [loading, setLoading] = useState(true);
    const [noOrg, setNoOrg] = useState(false);
    const [myRole, setMyRole] = useState<string | null>(null);

    useEffect(() => {
        if (user) loadPerformers();
    }, [user]);

    async function loadPerformers() {
        setLoading(true);
        try {
            const { data: myUser } = await supabase
                .from("users")
                .select("id")
                .eq("auth_user_id", user!.id)
                .maybeSingle();

            if (!myUser) { setNoOrg(true); setLoading(false); return; }

            const { data: myMembership } = await supabase
                .from("organization_members")
                .select("organization_id, role")
                .eq("user_id", myUser.id)
                .maybeSingle();

            if (!myMembership) { setNoOrg(true); setLoading(false); return; }

            setMyRole(myMembership.role);

            // Get all org members
            const { data: orgMembers } = await supabase
                .from("organization_members")
                .select("user_id")
                .eq("organization_id", myMembership.organization_id);

            if (!orgMembers || orgMembers.length === 0) { setLoading(false); return; }

            const userIds = orgMembers.map(m => m.user_id);

            // Fetch user info, view counts, and lead counts in parallel
            const [usersRes, viewsRes, leadsRes] = await Promise.all([
                supabase.from("users").select("id, email, name, job_title, profile_pic, view_count").in("id", userIds),
                // Count views per user (last 30 days)
                supabase.from("profile_views")
                    .select("user_id")
                    .in("user_id", userIds)
                    .gte("viewed_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
                // Count leads per user (last 30 days)
                supabase.from("leads")
                    .select("captured_by_user_id")
                    .in("captured_by_user_id", userIds)
                    .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
            ]);

            const users = usersRes.data || [];
            const views = viewsRes.data || [];
            const leads = leadsRes.data || [];

            // Count per user
            const viewCounts: Record<string, number> = {};
            views.forEach(v => { viewCounts[v.user_id!] = (viewCounts[v.user_id!] || 0) + 1; });

            const leadCounts: Record<string, number> = {};
            leads.forEach(l => { leadCounts[l.captured_by_user_id!] = (leadCounts[l.captured_by_user_id!] || 0) + 1; });

            const ranked: Performer[] = users.map(u => {
                const pv = viewCounts[u.id] || 0;
                const lc = leadCounts[u.id] || 0;
                // Score: views + leads * 5 (leads are worth more)
                const score = pv + lc * 5;
                return {
                    user_id: u.id,
                    user_name: u.name,
                    user_email: u.email,
                    user_job_title: u.job_title,
                    user_profile_pic: u.profile_pic,
                    profile_views: pv,
                    leads_count: lc,
                    score,
                };
            }).sort((a, b) => b.score - a.score);

            setPerformers(ranked);
        } catch (err) {
            console.error("Error loading performers:", err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const isOrgAdmin = myRole === "owner" || myRole === "admin";

    if (!isOrgAdmin) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <Shield className="w-12 h-12 text-muted-foreground mb-4" />
                <h2 className="text-lg font-medium text-foreground">Kein Zugriff</h2>
                <p className="text-sm text-muted-foreground mt-1">Nur Org-Admins und Owner können das Ranking einsehen.</p>
            </div>
        );
    }

    if (noOrg) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <Building2 className="w-12 h-12 text-muted-foreground mb-4" />
                <h2 className="text-lg font-medium text-foreground">Kein Team zugewiesen</h2>
                <p className="text-sm text-muted-foreground mt-1">Du bist noch keiner Organisation zugeordnet.</p>
            </div>
        );
    }

    const top3 = performers.slice(0, 3);
    const rest = performers.slice(3);

    return (
        <div className="space-y-8">
            <header>
                <div className="flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Top Performer</h1>
                        <p className="text-sm text-muted-foreground">Ranking basierend auf Profil-Views & Leads der letzten 30 Tage</p>
                    </div>
                </div>
            </header>

            {performers.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <Users2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Noch keine Daten vorhanden.</p>
                </div>
            ) : (
                <>
                    {/* Podium */}
                    <div className="flex items-end justify-center gap-4 pt-8">
                        {[1, 0, 2].map((idx) => {
                            const p = top3[idx];
                            if (!p) return null;
                            const podium = PODIUM[idx];
                            const PodiumIcon = podium.icon;
                            return (
                                <div key={p.user_id} className="flex flex-col items-center gap-3 w-36">
                                    <div className="relative">
                                        {p.user_profile_pic ? (
                                            <img
                                                src={p.user_profile_pic}
                                                alt=""
                                                className={`w-16 h-16 rounded-full object-cover border-2 ${idx === 0 ? "border-yellow-500 w-20 h-20" : idx === 1 ? "border-zinc-300" : "border-amber-700"}`}
                                            />
                                        ) : (
                                            <div className={`w-16 h-16 rounded-full bg-muted flex items-center justify-center border-2 ${idx === 0 ? "border-yellow-500 w-20 h-20" : idx === 1 ? "border-zinc-300" : "border-amber-700"}`}>
                                                <User className="w-6 h-6 text-muted-foreground" />
                                            </div>
                                        )}
                                        <div className={`absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center bg-background border ${podium.color}`}>
                                            <PodiumIcon className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-semibold text-foreground truncate max-w-full">{p.user_name || p.user_email.split("@")[0]}</p>
                                        <p className="text-xs text-muted-foreground">{p.user_job_title || ""}</p>
                                    </div>
                                    <div className={`w-full ${podium.size} rounded-t-xl bg-gradient-to-t ${podium.bg} border border-b-0 flex items-center justify-center`}>
                                        <span className={`text-2xl font-bold ${podium.color}`}>#{podium.rank}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Stats cards for top 3 */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {top3.map((p, i) => {
                            const podium = PODIUM[i];
                            const PodiumIcon = podium.icon;
                            return (
                                <div key={p.user_id} className={`bg-card border rounded-xl p-4 ${i === 0 ? "border-yellow-500/30" : "border-border"}`}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <PodiumIcon className={`w-4 h-4 ${podium.color}`} />
                                        <span className="text-sm font-medium text-foreground">{p.user_name || p.user_email.split("@")[0]}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        <div>
                                            <Eye className="w-3.5 h-3.5 mx-auto text-muted-foreground mb-1" />
                                            <p className="text-lg font-bold text-foreground">{p.profile_views}</p>
                                            <p className="text-[10px] text-muted-foreground">Views</p>
                                        </div>
                                        <div>
                                            <Zap className="w-3.5 h-3.5 mx-auto text-muted-foreground mb-1" />
                                            <p className="text-lg font-bold text-foreground">{p.leads_count}</p>
                                            <p className="text-[10px] text-muted-foreground">Leads</p>
                                        </div>
                                        <div>
                                            <TrendingUp className="w-3.5 h-3.5 mx-auto text-muted-foreground mb-1" />
                                            <p className="text-lg font-bold text-foreground">{p.score}</p>
                                            <p className="text-[10px] text-muted-foreground">Score</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Full ranking table */}
                    {rest.length > 0 && (
                        <div className="bg-card border border-border rounded-xl overflow-hidden">
                            <div className="px-4 py-3 border-b border-border">
                                <h3 className="text-sm font-medium text-foreground">Vollständiges Ranking</h3>
                            </div>
                            <div className="divide-y divide-border">
                                {rest.map((p, i) => (
                                    <div key={p.user_id} className="flex items-center justify-between px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-mono text-muted-foreground w-6 text-right">#{i + 4}</span>
                                            {p.user_profile_pic ? (
                                                <img src={p.user_profile_pic} alt="" className="w-8 h-8 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                                    <User className="w-4 h-4 text-muted-foreground" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm font-medium text-foreground">{p.user_name || p.user_email.split("@")[0]}</p>
                                                <p className="text-xs text-muted-foreground">{p.user_job_title || ""}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{p.profile_views}</span>
                                            <span className="flex items-center gap-1"><Zap className="w-3 h-3" />{p.leads_count}</span>
                                            <span className="font-semibold text-foreground">{p.score} pts</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
