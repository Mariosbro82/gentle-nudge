"use client";

import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Smartphone,
    Users,
    Settings,
    LogOut,
    BarChart,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

export function AdminSidebar({ onClose }: { onClose?: () => void }) {
    const location = useLocation();
    const { signOut } = useAuth();

    const links = [
        { href: "/dashboard", label: "Übersicht", icon: LayoutDashboard },
        { href: "/dashboard/devices", label: "Geräte", icon: Smartphone },
        { href: "/dashboard/chips", label: "Chips", icon: Smartphone },
        { href: "/dashboard/leads", label: "Kontakte", icon: Users },
        { href: "/dashboard/analytics", label: "Analyse", icon: BarChart },
        { href: "/dashboard/settings", label: "Einstellungen", icon: Settings },
    ];

    return (
        <aside className="w-64 h-full bg-zinc-950 border-r border-white/5 flex flex-col">
            <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
                <span className="font-bold text-white text-lg tracking-tight">NFCwear Admin</span>
                <button onClick={onClose} className="md:hidden text-zinc-400 hover:text-white">
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {links.map((link) => {
                    const isActive = location.pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            to={link.href}
                            onClick={onClose}
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
                <button
                    onClick={() => signOut()}
                    className="flex items-center gap-3 px-3 py-2 text-zinc-500 hover:text-red-400 cursor-pointer transition-colors w-full"
                >
                    <LogOut size={18} />
                    <span className="text-sm font-medium">Abmelden</span>
                </button>
            </div>
        </aside>
    );
}
