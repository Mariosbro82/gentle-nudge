import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { AddChipButton } from "./add-chip-button";
import { ChipActions } from "./chip-actions";

import { redirect } from "next/navigation";

export default async function DevicesPage() {
    const supabase = await createClient();

    // Get logged-in user
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
        redirect("/login");
    }

    // Get user's profile to check company
    const { data: userProfile } = await supabase
        .from("users")
        .select("id, company_id")
        .eq("id", authUser.id)
        .single();

    // Fetch ONLY chips assigned to this user OR belonging to their company
    let query = supabase
        .from("chips")
        .select("*, assigned_user:users(name)");

    if (userProfile?.company_id) {
        // User belongs to a company - show all company chips
        query = query.eq("company_id", userProfile.company_id);
    } else {
        // Individual user - show only their assigned chips
        query = query.eq("assigned_user_id", authUser.id);
    }

    const { data: devices } = await query;

    // Fetch Companies for the dropdown (only user's company if applicable)
    const { data: companies } = await supabase
        .from("companies")
        .select("id, name");

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Geräte</h1>
                    <p className="text-zinc-500">Verwalten Sie alle NFC-Chips und deren aktive Modi.</p>
                </div>
                <AddChipButton companies={companies || []} />
            </div>

            <div className="rounded-md border border-white/5 bg-zinc-900/50">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/5 hover:bg-white/5">
                            <TableHead>UID</TableHead>
                            <TableHead>Zugewiesen an</TableHead>
                            <TableHead>Aktiver Modus</TableHead>
                            <TableHead>Letzter Scan</TableHead>
                            <TableHead className="text-right">Aktionen</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {devices?.map((device: any) => (
                            <TableRow key={device.id} className="border-white/5 hover:bg-white/5">
                                <TableCell className="font-mono text-zinc-400">
                                    {device.uid ? `****${device.uid.slice(-4).toUpperCase()}` : "-"}
                                </TableCell>
                                <TableCell className="font-medium text-white">{device.assigned_user?.name || "-"}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`
                        ${device.active_mode === 'corporate' ? 'border-blue-500 text-blue-400' :
                                            device.active_mode === 'hospitality' ? 'border-orange-500 text-orange-400' : 'border-purple-500 text-purple-400'}
                    `}>
                                        {device.active_mode}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-zinc-500">{device.last_scan ? new Date(device.last_scan).toLocaleDateString() : "Nie"}</TableCell>
                                <TableCell className="text-right">
                                    <ChipActions chip={{ id: device.id, uid: device.uid, active_mode: device.active_mode }} />
                                </TableCell>
                            </TableRow>
                        ))}

                        {!devices || devices.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-zinc-500">
                                    Keine Geräte gefunden. Fügen Sie eines hinzu.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
