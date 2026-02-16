import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";
import { Crown, Shield, User, Eye, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TeamMember {
    id: string;
    user_id: string;
    role: string;
    user_name: string | null;
    user_email: string;
    user_job_title: string | null;
    user_profile_pic: string | null;
}

interface OrgInfo {
    id: string;
    name: string;
    plan: string | null;
}

const ROLE_ICONS: Record<string, { icon: any; label: string }> = {
    owner: { icon: Crown, label: "Owner" },
    admin: { icon: Shield, label: "Admin" },
    member: { icon: User, label: "Mitglied" },
    viewer: { icon: Eye, label: "Viewer" },
};

export default function TeamPage() {
    const { user } = useAuth();
    const [org, setOrg] = useState<OrgInfo | null>(null);
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [myRole, setMyRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) loadTeam();
    }, [user]);

    async function loadTeam() {
        setLoading(true);
        try {
            // Get my user record
            const { data: myUser } = await supabase
                .from("users")
                .select("id")
                .eq("auth_user_id", user!.id)
                .single();

            if (!myUser) { setLoading(false); return; }

            // Get my membership
            const { data: myMembership } = await supabase
                .from("organization_members")
                .select("organization_id, role")
                .eq("user_id", myUser.id)
                .limit(1)
                .single();

            if (!myMembership) { setLoading(false); return; }

            setMyRole(myMembership.role);

            // Get org info
            const { data: orgData } = await supabase
                .from("organizations")
                .select("id, name, plan")
                .eq("id", myMembership.organization_id)
                .single();

            if (orgData) setOrg(orgData);

            // Get all members of this org
            const { data: orgMembers } = await supabase
                .from("organization_members")
                .select("id, user_id, role")
                .eq("organization_id", myMembership.organization_id)
                .order("role");

            if (orgMembers) {
                const userIds = orgMembers.map(m => m.user_id);
                const { data: users } = await supabase
                    .from("users")
                    .select("id, email, name, job_title, profile_pic")
                    .in("id", userIds);

                const userMap = new Map(users?.map(u => [u.id, u]) || []);
                setMembers(orgMembers.map(m => ({
                    ...m,
                    user_name: userMap.get(m.user_id)?.name || null,
                    user_email: userMap.get(m.user_id)?.email || "Unknown",
                    user_job_title: userMap.get(m.user_id)?.job_title || null,
                    user_profile_pic: userMap.get(m.user_id)?.profile_pic || null,
                })));
            }
        } catch (err) {
            console.error("Error loading team:", err);
        } finally {
            setLoading(false);
        }
    }

    const isOrgAdmin = myRole === "owner" || myRole === "admin";

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isOrgAdmin && !loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <Shield className="w-12 h-12 text-muted-foreground mb-4" />
                <h2 className="text-lg font-medium text-foreground">Kein Zugriff</h2>
                <p className="text-sm text-muted-foreground mt-1">Nur Org-Admins und Owner können die Team-Übersicht einsehen.</p>
            </div>
        );
    }

    if (!org) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <Building2 className="w-12 h-12 text-muted-foreground mb-4" />
                <h2 className="text-lg font-medium text-foreground">Kein Team zugewiesen</h2>
                <p className="text-sm text-muted-foreground mt-1">Du bist noch keiner Organisation zugeordnet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <header>
                <div className="flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-primary" />
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">{org.name}</h1>
                        <p className="text-sm text-muted-foreground">
                            {members.length} Mitglieder · Plan: {org.plan || "Starter"}
                            {isOrgAdmin && <Badge variant="outline" className="ml-2 text-xs">Admin</Badge>}
                        </p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map((member) => {
                    const rc = ROLE_ICONS[member.role] || ROLE_ICONS.member;
                    const RoleIcon = rc.icon;
                    return (
                        <div key={member.id} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
                            <div className="flex items-center gap-3">
                                {member.user_profile_pic ? (
                                    <img src={member.user_profile_pic} alt="" className="w-10 h-10 rounded-full object-cover" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                        <User className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">{member.user_name || member.user_email}</p>
                                    <p className="text-xs text-muted-foreground truncate">{member.user_job_title || member.user_email}</p>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <RoleIcon className="w-3.5 h-3.5" />
                                    <span>{rc.label}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
