import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Building2, Plus, Trash2, UserPlus, Crown, Shield, User, Eye, AlertCircle } from "lucide-react";
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
    owner: { icon: Crown, color: "text-yellow-400", label: "Owner" },
    admin: { icon: Shield, color: "text-emerald-400", label: "Admin" },
    member: { icon: User, color: "text-blue-400", label: "Mitglied" },
    viewer: { icon: Eye, color: "text-zinc-500", label: "Viewer" },
};

export default function AdminOrganizationsPage() {
    const [orgs, setOrgs] = useState<Organization[]>([]);
    const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
    const [members, setMembers] = useState<OrgMember[]>([]);
    const [availableUsers, setAvailableUsers] = useState<AvailableUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newOrgName, setNewOrgName] = useState("");
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [selectedRole, setSelectedRole] = useState<string>("member");

    useEffect(() => { loadOrgs(); }, []);

    async function loadOrgs() {
        setLoading(true);
        setError(null);
        const { data, error: fetchError } = await supabase.from("organizations").select("*").order("created_at", { ascending: false });
        if (fetchError) {
            setError("Fehler beim Laden: " + fetchError.message);
            setLoading(false);
            return;
        }
        if (data) {
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
        setError(null);
        const slug = newOrgName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const { error: insertError } = await supabase.from("organizations").insert({ name: newOrgName, slug });
        if (insertError) {
            setError("Erstellen fehlgeschlagen: " + insertError.message);
            console.error("Error creating org:", insertError);
        } else {
            setNewOrgName("");
            setCreateDialogOpen(false);
            loadOrgs();
        }
    }

    async function deleteOrg(orgId: string) {
        if (!confirm("Organisation wirklich löschen? Alle Mitglieder werden entfernt.")) return;
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

        if (data && data.length > 0) {
            const userIds = data.map(m => m.user_id);
            const { data: users } = await supabase.from("users").select("id, email, name").in("id", userIds);
            const userMap = new Map(users?.map(u => [u.id, u]) || []);
            setMembers(data.map(m => ({
                ...m,
                user_email: userMap.get(m.user_id)?.email || "Unknown",
                user_name: userMap.get(m.user_id)?.name || null,
            })));
        } else {
            setMembers([]);
        }
    }

    async function openAddMember() {
        const { data: allUsers } = await supabase.from("users").select("id, email, name");
        const memberIds = new Set(members.map(m => m.user_id));
        setAvailableUsers((allUsers || []).filter(u => !memberIds.has(u.id)));
        setAddMemberDialogOpen(true);
    }

    async function addMember() {
        if (!selectedOrg || !selectedUserId) return;
        setError(null);
        const { error: insertError } = await supabase.from("organization_members").insert({
            organization_id: selectedOrg.id,
            user_id: selectedUserId,
            role: selectedRole as any,
            joined_at: new Date().toISOString(),
        });
        if (insertError) {
            setError("Hinzufügen fehlgeschlagen: " + insertError.message);
        } else {
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
        <div className="space-y-6">
            {/* Error Banner */}
            {error && (
                <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="ml-auto text-red-400/60 hover:text-red-400">✕</button>
                </div>
            )}

            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Organisationen</h1>
                    <p className="text-zinc-500 text-sm">Firmen erstellen und Mitarbeiter zuweisen</p>
                </div>
                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-mono text-xs">
                            <Plus className="w-4 h-4" /> Neue Org
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#0e0e14] border-emerald-900/30">
                        <DialogHeader>
                            <DialogTitle className="text-zinc-100 font-mono">Organisation erstellen</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <Input
                                placeholder="Firmenname eingeben..."
                                value={newOrgName}
                                onChange={(e) => setNewOrgName(e.target.value)}
                                className="bg-[#08080d] border-zinc-800 text-zinc-100 font-mono"
                                onKeyDown={(e) => e.key === "Enter" && createOrg()}
                            />
                            <Button onClick={createOrg} className="w-full bg-emerald-600 hover:bg-emerald-700 font-mono text-xs">
                                Erstellen
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Org List */}
                <div className="space-y-2">
                    <p className="text-[10px] text-zinc-600 uppercase tracking-widest px-1">Alle Organisationen ({orgs.length})</p>
                    {loading ? (
                        <div className="flex items-center gap-2 p-4 text-zinc-500 text-xs">
                            <div className="w-3 h-3 border border-emerald-500 border-t-transparent rounded-full animate-spin" />
                            Laden...
                        </div>
                    ) : orgs.length === 0 ? (
                        <div className="p-6 text-center border border-dashed border-zinc-800 rounded-lg">
                            <Building2 className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                            <p className="text-zinc-600 text-xs">Noch keine Organisationen</p>
                        </div>
                    ) : (
                        orgs.map((org) => (
                            <div
                                key={org.id}
                                onClick={() => selectOrg(org)}
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                    selectedOrg?.id === org.id
                                        ? "bg-emerald-500/5 border-emerald-500/30"
                                        : "bg-[#0e0e14] border-zinc-800/50 hover:border-zinc-700"
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded flex items-center justify-center ${
                                            selectedOrg?.id === org.id ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-800/50 text-zinc-500"
                                        }`}>
                                            <Building2 className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-zinc-200">{org.name}</p>
                                            <p className="text-[10px] text-zinc-600">{org.member_count} Mitglieder · {org.plan || "starter"}</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => { e.stopPropagation(); deleteOrg(org.id); }}
                                        className="text-zinc-600 hover:text-red-400 h-7 w-7"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Member Management */}
                <div className="lg:col-span-2">
                    {selectedOrg ? (
                        <div className="bg-[#0e0e14] border border-zinc-800/50 rounded-lg p-5 space-y-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-zinc-200 font-mono">{selectedOrg.name}</h3>
                                    <p className="text-[10px] text-zinc-600">Mitglieder verwalten · ID: {selectedOrg.id.slice(0, 8)}...</p>
                                </div>
                                <Button onClick={openAddMember} size="sm" className="gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs">
                                    <UserPlus className="w-3.5 h-3.5" /> Hinzufügen
                                </Button>
                            </div>

                            <div className="space-y-2">
                                {members.length === 0 ? (
                                    <div className="text-center py-10 border border-dashed border-zinc-800 rounded-lg">
                                        <UserPlus className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                                        <p className="text-zinc-600 text-xs">Keine Mitglieder. Füge Benutzer hinzu.</p>
                                    </div>
                                ) : (
                                    members.map((member) => {
                                        const rc = ROLE_CONFIG[member.role] || ROLE_CONFIG.member;
                                        return (
                                            <div key={member.id} className="flex items-center justify-between p-3 rounded bg-[#08080d] border border-zinc-800/30">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-7 h-7 rounded flex items-center justify-center bg-zinc-800/50 ${rc.color}`}>
                                                        <rc.icon className="w-3.5 h-3.5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-medium text-zinc-200">{member.user_name || member.user_email}</p>
                                                        <p className="text-[10px] text-zinc-600">{member.user_email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Select value={member.role} onValueChange={(v) => updateMemberRole(member.id, v)}>
                                                        <SelectTrigger className="w-28 h-7 bg-zinc-800/50 border-zinc-700 text-xs font-mono">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-[#0e0e14] border-zinc-700">
                                                            <SelectItem value="owner">Owner</SelectItem>
                                                            <SelectItem value="admin">Admin</SelectItem>
                                                            <SelectItem value="member">Mitglied</SelectItem>
                                                            <SelectItem value="viewer">Viewer</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <Button variant="ghost" size="icon" onClick={() => removeMember(member.id)} className="h-7 w-7 text-zinc-600 hover:text-red-400">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 bg-[#0e0e14] border border-dashed border-zinc-800 rounded-lg">
                            <Building2 className="w-10 h-10 text-zinc-800 mb-3" />
                            <p className="text-zinc-600 text-xs">Wähle eine Organisation aus der Liste</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Member Dialog */}
            <Dialog open={addMemberDialogOpen} onOpenChange={setAddMemberDialogOpen}>
                <DialogContent className="bg-[#0e0e14] border-emerald-900/30">
                    <DialogHeader>
                        <DialogTitle className="text-zinc-100 font-mono">Mitglied hinzufügen</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        <div>
                            <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-2">Benutzer</p>
                            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                                <SelectTrigger className="bg-[#08080d] border-zinc-800 text-zinc-200 font-mono text-xs">
                                    <SelectValue placeholder="Benutzer wählen..." />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0e0e14] border-zinc-700 max-h-60">
                                    {availableUsers.length === 0 ? (
                                        <div className="p-3 text-xs text-zinc-500 text-center">Keine verfügbaren Benutzer</div>
                                    ) : (
                                        availableUsers.map((u) => (
                                            <SelectItem key={u.id} value={u.id} className="font-mono text-xs">
                                                {u.name || u.email} ({u.email})
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-2">Rolle</p>
                            <Select value={selectedRole} onValueChange={setSelectedRole}>
                                <SelectTrigger className="bg-[#08080d] border-zinc-800 text-zinc-200 font-mono text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0e0e14] border-zinc-700">
                                    <SelectItem value="owner">Owner</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="member">Mitglied</SelectItem>
                                    <SelectItem value="viewer">Viewer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={addMember} className="w-full bg-emerald-600 hover:bg-emerald-700 font-mono text-xs" disabled={!selectedUserId}>
                            Mitglied hinzufügen
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
