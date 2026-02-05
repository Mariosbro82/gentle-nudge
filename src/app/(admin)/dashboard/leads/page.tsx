import { Button } from "@/components/ui/button";
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
import { LeadsTableActions } from "./actions"; // Client component for actions

export default async function LeadsPage() {
    const supabase = await createClient();

    // Fetch Leads
    const { data: leads } = await supabase
        .from("leads")
        .select("*, users(name)");

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Kontakte</h1>
                    <p className="text-zinc-500">Erfasste Kontakte aus dem Visitenkarten-Modus.</p>
                </div>
                {/* Client actions for Export/Sync */}
                <LeadsTableActions leads={leads || []} />
            </div>

            <div className="rounded-md border border-white/5 bg-zinc-900/50">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/5 hover:bg-white/5">
                            <TableHead>Name</TableHead>
                            <TableHead>E-Mail</TableHead>
                            <TableHead>Stimmung</TableHead>
                            <TableHead>Erfasst von</TableHead>
                            <TableHead>Datum</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leads?.map((lead: any) => (
                            <TableRow key={lead.id} className="border-white/5 hover:bg-white/5">
                                <TableCell className="font-medium text-white">{lead.lead_name}</TableCell>
                                <TableCell className="text-zinc-400">{lead.lead_email}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`
                        ${lead.sentiment === 'hot' ? 'border-green-500 text-green-400 bg-green-500/10' :
                                            lead.sentiment === 'warm' ? 'border-yellow-500 text-yellow-400 bg-yellow-500/10' : 'border-red-500 text-red-400 bg-red-500/10'}
                    `}>
                                        {lead.sentiment}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-zinc-400">{(lead.users as any)?.name || "-"}</TableCell>
                                <TableCell className="text-zinc-500">{new Date(lead.created_at).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                        {!leads || leads.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-zinc-500">
                                    Noch keine Kontakte erfasst.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
