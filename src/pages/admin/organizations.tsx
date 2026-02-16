import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Building2, Plus, Trash2, UserPlus, Crown, Shield, User, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Organization {
    id: string;
    name: string;
    slug: string | null;
    plan: string | null;
    created_at: string;
    member_count?: number;
}

interface OrgMember {
    id: string;
    user_id: string;
    role: string;
    joined_at: string | null;
    user_email?: string;
    user_name?: string | null;
}

interface AvailableUser {
    id: string;
    email: string;
    name: string | null;
}

const ROLE_CONFIG: Record<string, { icon: any; color: string; label: string }> = {
    owner: { icon: Crown, color: "text-yellow-500", label: "Owner" },
    admin: { icon: Shield, color: "text-red-400", label: "Admin" },
    member: { icon: User, color: "text-blue-400", label: "Mitglied" },
    viewer: { icon: Eye, color: "text-zinc-400", label: "Viewer" },
};

export default function AdminOrganizationsPage() {
    const [orgs, setOrgs] = useState<Organization[]>([]);
    const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
    const [members, setMembers] = useState<OrgMember[]>([]);
    const [availableUsers, setAvailableUsers] = useState<AvailableUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [newOrgName, setNewOrgName] = useState("");
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [selectedRole, setSelectedRole] = useState<string>("member");

    useEffect(() => { loadOrgs(); }, []);

    async function loadOrgs() {
        setLoading(true);
        const { data } = await supabase.from("organizations").select("*").order("created_at", { ascending: false });
        if (data) {
            // Get member counts
            const orgsWithCounts = await Promise.all(data.map(async (org) => {
                const { count } = await supabase.from("organization_members").select("*", { count: "exact", head: true }).eq("organization_id", org.id);
                return { ...org, member_count: count || 0 };
            }));
            setOrgs(orgsWithCounts);
        }
        setLoading(false);
    }

    async function createOrg() {
        if (!newOrgName.trim()) return;
        const slug = newOrgName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const { error } = await supabase.from("organizations").insert({ name: newOrgName, slug });
        if (!error) {
            setNewOrgName("");
            setCreateDialogOpen(false);
            loadOrgs();
        } else {
            console.error("Error creating org:", error);
        }
    }

    async function deleteOrg(orgId: string) {
        if (!confirm("Organisation wirklich löschen? Alle Mitglieder werden entfernt.")) return;
        // Delete members first
        await supabase.from("organization_members").delete().eq("organization_id", orgId);
        await supabase.from("organizations").delete().eq("id", orgId);
        if (selectedOrg?.id === orgId) { setSelectedOrg(null); setMembers([]); }
        loadOrgs();
    }

    async function selectOrg(org: Organization) {
        setSelectedOrg(org);
        const { data } = await supabase
            .from("organization_members")
            .select("*")
            .eq("organization_id", org.id)
            .order("role");

        if (data) {
            // Enrich with user data
            const userIds = data.map(m => m.user_id);
            const { data: users } = await supabase.from("users").select("id, email, name").in("id", userIds);
            const userMap = new Map(users?.map(u => [u.id, u]) || []);
            setMembers(data.map(m => ({
                ...m,
                user_email: userMap.get(m.user_id)?.email || "Unknown",
                user_name: userMap.get(m.user_id)?.name || null,
            })));
        }
    }

    async function openAddMember() {
        // Load all users not in this org
        const { data: allUsers } = await supabase.from("users").select("id, email, name");
        const memberIds = new Set(members.map(m => m.user_id));
        setAvailableUsers((allUsers || []).filter(u => !memberIds.has(u.id)));
        setAddMemberDialogOpen(true);
    }

    async function addMember() {
        if (!selectedOrg || !selectedUserId) return;
        const { error } = await supabase.from("organization_members").insert({
            organization_id: selectedOrg.id,
            user_id: selectedUserId,
            role: selectedRole as any,
            joined_at: new Date().toISOString(),
        });
        if (!error) {
            setAddMemberDialogOpen(false);
            setSelectedUserId("");
            setSelectedRole("member");
            selectOrg(selectedOrg);
            loadOrgs();
        }
    }

    async function removeMember(memberId: string) {
        if (!confirm("Mitglied entfernen?")) return;
        await supabase.from("organization_members").delete().eq("id", memberId);
        if (selectedOrg) selectOrg(selectedOrg);
        loadOrgs();
    }

    async function updateMemberRole(memberId: string, newRole: string) {
        await supabase.from("organization_members").update({ role: newRole as any }).eq("id", memberId);
        if (selectedOrg) selectOrg(selectedOrg);
    }

    return (
        <div className="space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Organisationen</h1>
                    <p className="text-zinc-400">Firmen erstellen und Mitarbeiter zuweisen.</p>
                </div>
                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-red-600 hover:bg-red-700 text-white gap-2">
                            <Plus className="w-4 h-4" /> Neue Organisation
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-900 border-zinc-800">
                        <DialogHeader>
                            <DialogTitle className="text-white">Organisation erstellen</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <Input
                                placeholder="Firmenname"
                                value={newOrgName}
                                onChange={(e) => setNewOrgName(e.target.value)}
                                className="bg-zinc-950 border-zinc-800 text-white"
                                onKeyDown={(e) => e.key === "Enter" && createOrg()}
                            />
                            <Button onClick={createOrg} className="w-full bg-red-600 hover:bg-red-700">Erstellen</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Org List */}
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Alle Organisationen</h3>
                    {loading ? (
                        <p className="text-zinc-500 text-sm">Laden...</p>
                    ) : orgs.length === 0 ? (
                        <p className="text-zinc-500 text-sm">Noch keine Organisationen erstellt.</p>
                    ) : (
                        orgs.map((org) => (
                            <div
                                key={org.id}
                                onClick={() => selectOrg(org)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                    selectedOrg?.id === org.id
                                        ? "bg-red-500/10 border-red-500/30"
                                        : "bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900"
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Building2 className="w-5 h-5 text-zinc-400" />
                                        <div>
                                            <p className="text-white font-medium">{org.name}</p>
                                            <p className="text-xs text-zinc-500">{org.member_count} Mitglieder · {org.plan || "starter"}</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => { e.stopPropagation(); deleteOrg(org.id); }}
                                        className="text-zinc-500 hover:text-red-400 h-8 w-8"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Member Management */}
                <div className="lg:col-span-2">
                    {selectedOrg ? (
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-medium text-white">{selectedOrg.name}</h3>
                                    <p className="text-sm text-zinc-500">Mitglieder verwalten</p>
                                </div>
                                <Button onClick={openAddMember} className="gap-2 bg-zinc-800 hover:bg-zinc-700 text-white">
                                    <UserPlus className="w-4 h-4" /> Mitglied hinzufügen
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {members.length === 0 ? (
                                    <p className="text-zinc-500 text-sm text-center py-8">Noch keine Mitglieder. Füge Benutzer hinzu.</p>
                                ) : (
                                    members.map((member) => {
                                        const rc = ROLE_CONFIG[member.role] || ROLE_CONFIG.member;
                                        return (
                                            <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-950/50 border border-zinc-800">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-zinc-900 border border-zinc-700 ${rc.color}`}>
                                                        <rc.icon className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-white">{member.user_name || member.user_email}</p>
                                                        <p className="text-xs text-zinc-500">{member.user_email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Select value={member.role} onValueChange={(v) => updateMemberRole(member.id, v)}>
                                                        <SelectTrigger className="w-32 h-8 bg-zinc-900 border-zinc-700 text-sm">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-zinc-900 border-zinc-700">
                                                            <SelectItem value="owner">Owner</SelectItem>
                                                            <SelectItem value="admin">Admin</SelectItem>
                                                            <SelectItem value="member">Mitglied</SelectItem>
                                                            <SelectItem value="viewer">Viewer</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <Button variant="ghost" size="icon" onClick={() => removeMember(member.id)} className="h-8 w-8 text-zinc-500 hover:text-red-400">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-64 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                            <p className="text-zinc-500">Wähle eine Organisation aus der Liste.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Member Dialog */}
            <Dialog open={addMemberDialogOpen} onOpenChange={setAddMemberDialogOpen}>
                <DialogContent className="bg-zinc-900 border-zinc-800">
                    <DialogHeader>
                        <DialogTitle className="text-white">Mitglied hinzufügen</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                            <SelectTrigger className="bg-zinc-950 border-zinc-800 text-white">
                                <SelectValue placeholder="Benutzer wählen..." />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-700 max-h-60">
                                {availableUsers.map((u) => (
                                    <SelectItem key={u.id} value={u.id}>
                                        {u.name || u.email} ({u.email})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                            <SelectTrigger className="bg-zinc-950 border-zinc-800 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-700">
                                <SelectItem value="owner">Owner</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="member">Mitglied</SelectItem>
                                <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={addMember} className="w-full bg-red-600 hover:bg-red-700" disabled={!selectedUserId}>
                            Hinzufügen
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
