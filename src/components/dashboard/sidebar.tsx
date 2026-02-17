"use client";

import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    LayoutDashboard,
    Smartphone,
    Users,
    Settings,
    LogOut,
    BarChart,
    UsersRound,
    Trophy,
    Megaphone,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { ModeToggle } from "@/components/mode-toggle";
import { supabase } from "@/lib/supabase/client";

export function AdminSidebar({ onClose }: { onClose?: () => void }) {
    const location = useLocation();
    const { user, signOut } = useAuth();
    const [isOrgAdmin, setIsOrgAdmin] = useState(false);

    useEffect(() => {
        if (!user) return;
        (async () => {
            const { data: myUser } = await supabase
                .from("users")
                .select("id")
                .eq("auth_user_id", user.id)
                .maybeSingle();
            if (!myUser) return;

            const { data: membership } = await supabase
                .from("organization_members")
                .select("role")
                .eq("user_id", myUser.id)
                .maybeSingle();

            if (membership && (membership.role === "owner" || membership.role === "admin")) {
                setIsOrgAdmin(true);
            }
        })();
    }, [user]);

    const links = [
        { href: "/dashboard", label: "Übersicht", icon: LayoutDashboard },
        { href: "/dashboard/devices", label: "Geräte", icon: Smartphone },
        { href: "/dashboard/leads", label: "Kontakte", icon: Users },
        { href: "/dashboard/campaigns", label: "Kampagnen", icon: Megaphone },
        { href: "/dashboard/analytics", label: "Analyse", icon: BarChart },
        ...(isOrgAdmin ? [
            { href: "/dashboard/team", label: "Team", icon: UsersRound },
            { href: "/dashboard/top-performers", label: "Top Performer", icon: Trophy },
        ] : []),
        { href: "/dashboard/settings", label: "Einstellungen", icon: Settings },
    ];

    return (
        <aside className="w-64 h-full bg-sidebar border-r border-border flex flex-col">
            <div className="h-16 flex items-center justify-between px-6 border-b border-border">
                <span className="font-bold text-sidebar-foreground text-lg tracking-tight">NFCwear Admin</span>
                <button onClick={onClose} className="md:hidden text-muted-foreground hover:text-sidebar-foreground">
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
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                    : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
                            )}
                        >
                            <link.icon size={18} />
                            {link.label}
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-border flex items-center justify-between gap-2">
                <button
                    onClick={() => signOut()}
                    className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-red-500 dark:hover:text-red-400 cursor-pointer transition-colors"
                >
                    <LogOut size={18} />
                    <span className="text-sm font-medium">Abmelden</span>
                </button>
                <div className="bg-muted rounded-md">
                    <ModeToggle />
                </div>
            </div>
        </aside>
    );
}
