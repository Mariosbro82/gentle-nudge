
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Users, MoreHorizontal, Search, Eye, Ghost, Shield, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AdminUser } from "@/types/admin";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data as unknown as AdminUser[]); // Cast for now, types updated but strictly typed might need partial
        } catch (error) {
            console.error("Error fetching users:", error);
            alert("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Filter users based on search
    const filteredUsers = users.filter(user =>
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.includes(searchQuery)
    );

    const deleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

        try {
            const { error } = await supabase.from('users').delete().eq('id', userId);
            if (error) throw error;

            setUsers(users.filter(u => u.id !== userId));
        } catch (error) {
            console.error(error);
            alert("Failed to delete user. Ensure you have admin privileges.");
        }
    };

    const toggleGhostMode = async (userId: string, currentStatus: boolean) => {
        // This functionality requires ghost_mode column which exists
        try {
            const { error } = await supabase
                .from('users')
                .update({ ghost_mode: !currentStatus } as any)
                .eq('id', userId);

            if (error) throw error;

            // Optimistic update
            setUsers(users.map(u =>
                u.id === userId ? { ...u, ghost_mode: !currentStatus } as any : u
            ));
        } catch (error) {
            console.error(error);
            alert("Failed to update ghost mode");
        }
    };

    return (
        <div className="p-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                        <Users className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">User Management</h1>
                        <p className="text-zinc-500 text-sm">Manage access, roles, and profiles.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                        <Input
                            placeholder="Search users..."
                            className="pl-9 bg-zinc-900 border-zinc-800 w-[300px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button onClick={fetchUsers} variant="outline" className="border-zinc-800 bg-zinc-900">
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="border border-zinc-800 rounded-lg bg-zinc-950/50 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                            <TableHead className="text-zinc-400">User</TableHead>
                            <TableHead className="text-zinc-400">Role</TableHead>
                            <TableHead className="text-zinc-400">Status</TableHead>
                            <TableHead className="text-zinc-400">Joined</TableHead>
                            <TableHead className="text-right text-zinc-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-zinc-500">
                                    Loading users...
                                </TableCell>
                            </TableRow>
                        ) : filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-zinc-500">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id} className="border-zinc-800 hover:bg-zinc-900/50">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-white">{user.full_name || 'Unnamed User'}</span>
                                            <span className="text-xs text-zinc-500">{user.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={
                                            user.role === 'admin'
                                                ? "border-red-500/30 text-red-500 bg-red-500/10"
                                                : "border-blue-500/30 text-blue-500 bg-blue-500/10"
                                        }>
                                            {user.role === 'admin' && <ShieldAlert className="w-3 h-3 mr-1" />}
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {(user as any).ghost_mode ? (
                                            <Badge variant="secondary" className="bg-zinc-800 text-zinc-400">
                                                <Ghost className="w-3 h-3 mr-1" /> Ghost
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
                                                Active
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-zinc-500">
                                        {new Date(user.created_at || '').toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-zinc-300">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
                                                    Copy ID
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-zinc-800" />
                                                <DropdownMenuItem>
                                                    <Eye className="w-4 h-4 mr-2" /> View Public Profile
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => toggleGhostMode(user.id, (user as any).ghost_mode)}>
                                                    <Ghost className="w-4 h-4 mr-2" />
                                                    {(user as any).ghost_mode ? "Disable Ghost Mode" : "Enable Ghost Mode"}
                                                </DropdownMenuItem>
                                                {user.role !== 'admin' && (
                                                    <DropdownMenuItem className="text-red-500 focus:text-red-400">
                                                        <Shield className="w-4 h-4 mr-2" /> Promote to Admin
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuSeparator className="bg-zinc-800" />
                                                <DropdownMenuItem
                                                    onClick={() => deleteUser(user.id)}
                                                    className="text-red-600 focus:text-red-500 focus:bg-red-500/10"
                                                >
                                                    Delete User
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
