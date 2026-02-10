
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
    Database, Search, Smartphone, Building2, Utensils, QrCode, Plus, FileSpreadsheet, UserPlus, Loader2, Copy, ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Chip {
    id: string;
    uid: string;
    mode: string | null;
    active_mode: string | null;
    assigned_user_id: string | null;
    company_id: string | null;
    last_scan: string | null;
    users?: { email: string; name: string } | null;
    companies?: { name: string } | null;
}

export default function AdminChipsPage() {
    const [chips, setChips] = useState<Chip[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterMode, setFilterMode] = useState<string | null>(null);

    // Modals state
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isAssignOpen, setIsAssignOpen] = useState(false);

    // Form state
    const [newChipUid, setNewChipUid] = useState("");
    const [importData, setImportData] = useState("");
    const [selectedChip, setSelectedChip] = useState<Chip | null>(null);
    const [assignTarget, setAssignTarget] = useState("");
    const [assignType, setAssignType] = useState<'user' | 'company'>('user');
    const [actionLoading, setActionLoading] = useState(false);

    const fetchChips = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('chips')
                .select(`
                    *,
                    users ( email, name ),
                    companies ( name )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const formattedChips = (data as any[]).map(item => ({
                ...item,
                users: item.users,
                companies: item.companies
            }));

            setChips(formattedChips);
        } catch (error) {
            console.error("Error fetching chips:", error);
            alert("Failed to load chips");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChips();
    }, []);

    const handleAddChip = async () => {
        if (!newChipUid) return;
        setActionLoading(true);
        try {
            const { error } = await supabase.from('chips').insert({ uid: newChipUid });
            if (error) throw error;
            setIsAddOpen(false);
            setNewChipUid("");
            fetchChips();
        } catch (error: any) {
            alert("Error adding chip: " + error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleMassImport = async () => {
        if (!importData) return;
        setActionLoading(true);
        try {
            // Expecting CSV format: uid, mode?
            // Simple implementation: split by newline, take first column as UID
            const rows = importData.split('\n').filter(r => r.trim());
            const chipsToInsert = rows.map(row => {
                const cols = row.split(',').map(c => c.trim());
                return { uid: cols[0], active_mode: (cols[1] || null) as any }; // Optional mode, cast for enum
            });

            const { error } = await supabase.from('chips').insert(chipsToInsert);
            if (error) throw error;

            setIsImportOpen(false);
            setImportData("");
            fetchChips();
            alert(`Successfully imported ${chipsToInsert.length} chips.`);
        } catch (error: any) {
            alert("Import failed: " + error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleAssign = async () => {
        if (!selectedChip || !assignTarget) return;
        setActionLoading(true);
        try {
            let updateData: any = {};

            if (assignType === 'user') {
                // Find user by email or slug
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('id')
                    .or(`email.eq.${assignTarget},slug.eq.${assignTarget}`)
                    .single();

                if (userError || !userData) throw new Error("User not found");
                updateData = { assigned_user_id: userData.id, company_id: null };
            } else {
                // Find company by name (exact match for now)
                const { data: companyData, error: companyError } = await supabase
                    .from('companies')
                    .select('id')
                    .eq('name', assignTarget)
                    .single();

                if (companyError || !companyData) throw new Error("Company not found");
                updateData = { company_id: companyData.id, assigned_user_id: null };
            }

            const { error } = await supabase
                .from('chips')
                .update(updateData)
                .eq('id', selectedChip.id);

            if (error) throw error;

            setIsAssignOpen(false);
            setSelectedChip(null);
            setAssignTarget("");
            fetchChips();
        } catch (error: any) {
            alert("Assignment failed: " + error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const filteredChips = chips.filter(chip => {
        const matchesSearch =
            chip.uid.toLowerCase().includes(searchQuery.toLowerCase()) ||
            chip.users?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            chip.companies?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesMode = filterMode ? chip.active_mode === filterMode : true;
        return matchesSearch && matchesMode;
    });

    const getModeIcon = (mode: string | null) => {
        switch (mode) {
            case 'corporate': return <Building2 className="w-4 h-4" />;
            case 'hospitality': return <Utensils className="w-4 h-4" />;
            case 'campaign': return <QrCode className="w-4 h-4" />;
            default: return <Smartphone className="w-4 h-4" />;
        }
    };

    return (
        <div className="p-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                        <Database className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Chip Inventory</h1>
                        <p className="text-zinc-500 text-sm">Track and manage physical NFC assets.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                        <Input
                            placeholder="Search UID, user, company..."
                            className="pl-9 bg-zinc-900 border-zinc-800 w-[200px] lg:w-[300px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button onClick={fetchChips} variant="outline" className="border-zinc-800 bg-zinc-900">
                        Refresh
                    </Button>

                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                                <Plus className="w-4 h-4 mr-2" /> Add Chip
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-zinc-950 border-zinc-800 text-white">
                            <DialogHeader>
                                <DialogTitle>Add New Chip</DialogTitle>
                                <DialogDescription className="text-zinc-400">
                                    Register a new NFC chip UID manually.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="uid" className="text-right">UID</Label>
                                    <Input
                                        id="uid"
                                        value={newChipUid}
                                        onChange={(e) => setNewChipUid(e.target.value)}
                                        className="col-span-3 bg-zinc-900 border-zinc-700 text-white"
                                        placeholder="04:A3:..."
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                                <Button onClick={handleAddChip} disabled={actionLoading}>
                                    {actionLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />} Save
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
                        <DialogTrigger asChild>
                            <Button variant="secondary" className="bg-zinc-800 text-zinc-300 hover:text-white">
                                <FileSpreadsheet className="w-4 h-4 mr-2" /> Import
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-zinc-950 border-zinc-800 text-white">
                            <DialogHeader>
                                <DialogTitle>Mass Import Chips</DialogTitle>
                                <DialogDescription className="text-zinc-400">
                                    Paste CSV data here. Format: <code>UID, Mode (optional)</code>
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <Textarea
                                    value={importData}
                                    onChange={(e) => setImportData(e.target.value)}
                                    placeholder={`04:A1:B2:C3, corporate\n04:D4:E5:F6, hospitality`}
                                    className="bg-zinc-900 border-zinc-700 text-white font-mono h-[200px]"
                                />
                            </div>
                            <DialogFooter>
                                <Button variant="ghost" onClick={() => setIsImportOpen(false)}>Cancel</Button>
                                <Button onClick={handleMassImport} disabled={actionLoading}>
                                    {actionLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />} Import
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-zinc-800 pb-4 overflow-x-auto">
                {['all', 'corporate', 'hospitality', 'campaign'].map((mode) => (
                    <button
                        key={mode}
                        onClick={() => setFilterMode(mode === 'all' ? null : mode)}
                        className={`px-4 py-2 rounded-full text-xs font-medium border transition-colors ${(mode === 'all' && !filterMode) || filterMode === mode
                            ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                            : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                            }`}
                    >
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                ))}
            </div>

            <div className="border border-zinc-800 rounded-lg bg-zinc-950/50 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                            <TableHead className="text-zinc-400">UID</TableHead>
                            <TableHead className="text-zinc-400">Mode</TableHead>
                            <TableHead className="text-zinc-400">Assigned To</TableHead>
                            <TableHead className="text-zinc-400">Company</TableHead>
                            <TableHead className="text-zinc-400">Last Scan</TableHead>
                            <TableHead className="text-right text-zinc-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                                    Loading chips...
                                </TableCell>
                            </TableRow>
                        ) : filteredChips.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                                    No chips found matching criteria.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredChips.map((chip) => (
                                <TableRow key={chip.id} className="border-zinc-800 hover:bg-zinc-900/50">
                                    <TableCell className="font-mono text-zinc-300">
                                        {chip.uid}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getModeIcon(chip.active_mode)}
                                            <span className="capitalize text-zinc-400">{chip.active_mode || 'Unassigned'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {chip.users ? (
                                            <div className="flex flex-col">
                                                <span className="text-sm text-white">{chip.users.name || 'User'}</span>
                                                <span className="text-xs text-zinc-500">{chip.users.email}</span>
                                            </div>
                                        ) : (
                                            <Badge variant="outline" className="border-zinc-800 text-zinc-500">Unassigned</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {chip.companies ? (
                                            <span className="text-zinc-300">{chip.companies.name}</span>
                                        ) : (
                                            <span className="text-zinc-600">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-zinc-500 text-xs">
                                        {chip.last_scan ? new Date(chip.last_scan).toLocaleString() : 'Never'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-zinc-400 hover:text-white"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(`${window.location.origin}/t/${chip.uid}`);
                                                    alert("Link copied to clipboard");
                                                }}
                                                title="Copy Link"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-zinc-400 hover:text-white"
                                                onClick={() => window.open(`${window.location.origin}/t/${chip.uid}`, '_blank')}
                                                title="Open Link"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-zinc-400 hover:text-white"
                                                onClick={() => {
                                                    setSelectedChip(chip);
                                                    setIsAssignOpen(true);
                                                }}
                                                title="Assign User"
                                            >
                                                <UserPlus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Assignment Dialog */}
            <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
                <DialogContent className="bg-zinc-950 border-zinc-800 text-white">
                    <DialogHeader>
                        <DialogTitle>Assign Chip {selectedChip?.uid}</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Link this physical chip to a user or company account.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="flex gap-4 justify-center mb-4">
                            <Button
                                variant={assignType === 'user' ? 'default' : 'outline'}
                                onClick={() => setAssignType('user')}
                                className={assignType === 'user' ? 'bg-purple-600' : 'bg-transparent border-zinc-700 text-zinc-400'}
                            >
                                Assign to User
                            </Button>
                            <Button
                                variant={assignType === 'company' ? 'default' : 'outline'}
                                onClick={() => setAssignType('company')}
                                className={assignType === 'company' ? 'bg-purple-600' : 'bg-transparent border-zinc-700 text-zinc-400'}
                            >
                                Assign to Company
                            </Button>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="target" className="text-right">
                                {assignType === 'user' ? 'Email/Slug' : 'Company Name'}
                            </Label>
                            <Input
                                id="target"
                                value={assignTarget}
                                onChange={(e) => setAssignTarget(e.target.value)}
                                className="col-span-3 bg-zinc-900 border-zinc-700 text-white"
                                placeholder={assignType === 'user' ? 'user@example.com' : 'Acme Corp'}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsAssignOpen(false)}>Cancel</Button>
                        <Button onClick={handleAssign} disabled={actionLoading}>
                            {actionLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />} Assign
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}
