"use client";

import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";

export function LeadsTableActions({ leads }: { leads: any[] }) {

    const handleExportCSV = () => {
        const headers = "Name,Email,Sentiment,Date\n";
        const rows = leads.map((l: any) => `${l.lead_name},${l.lead_email},${l.sentiment},${l.created_at}`).join("\n");
        const blob = new Blob([headers + rows], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "leads_export.csv";
        link.click();
    };

    const handleCRMSync = () => {
        alert("Synchronisiere mit konfiguriertem CRM (Salesforce/HubSpot)...");
    };

    return (
        <div className="flex gap-2">
            <Button variant="outline" className="border-white/10" onClick={handleExportCSV}>
                <Download size={18} className="mr-2" /> CSV Exportieren
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-500 text-white" onClick={handleCRMSync}>
                <RefreshCw size={18} className="mr-2" /> CRM Synchronisieren
            </Button>
        </div>
    );
}
