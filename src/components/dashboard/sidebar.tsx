"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Smartphone,
    Users,
    Settings,
    LogOut,
    BarChart
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
    const pathname = usePathname();

    const links = [
        { href: "/dashboard", label: "Übersicht", icon: LayoutDashboard },
        { href: "/dashboard/devices", label: "Geräte", icon: Smartphone },
        { href: "/dashboard/leads", label: "Kontakte", icon: Users },
        { href: "/dashboard/analytics", label: "Analyse", icon: BarChart },
        { href: "/dashboard/settings", label: "Einstellungen", icon: Settings },
    ];

    return (
        <aside className="w-64 h-screen bg-zinc-950 border-r border-white/5 flex flex-col fixed left-0 top-0">
            <div className="h-16 flex items-center px-6 border-b border-white/5">
                <span className="font-bold text-white text-lg tracking-tight">NFCwear Admin</span>
            </div>

            <div className="flex-1 py-6 px-3 space-y-1">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-white/10 text-white"
                                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <link.icon size={18} />
                            {link.label}
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-white/5">
                <div className="flex items-center gap-3 px-3 py-2 text-zinc-500 hover:text-red-400 cursor-pointer transition-colors">
                    <LogOut size={18} />
                    <span className="text-sm font-medium">Abmelden</span>
                </div>
            </div>
        </aside>
    );
}
