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
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { ModeToggle } from "@/components/mode-toggle";
import { supabase } from "@/lib/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AdminSidebarProps {
    onClose?: () => void;
    collapsed: boolean;
    onToggleCollapse: () => void;
}

export function AdminSidebar({ onClose, collapsed, onToggleCollapse }: AdminSidebarProps) {
    const location = useLocation();
    const { user, signOut } = useAuth();
    const [isOrgAdmin, setIsOrgAdmin] = useState(false);
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        if (!user) return;
        (async () => {
            const { data: myUser } = await supabase
                .from("users")
                .select("id, name, email")
                .eq("auth_user_id", user.id)
                .maybeSingle();
            if (!myUser) return;

            setUserName(myUser.name || "");
            setUserEmail(myUser.email || "");

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

    const NavItem = ({ link }: { link: typeof links[0] }) => {
        const isActive = location.pathname === link.href;
        const content = (
            <Link
                key={link.href}
                to={link.href}
                onClick={onClose}
                className={cn(
                    "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    collapsed && "justify-center px-2",
                    isActive
                        ? "bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
            >
                {/* Active indicator bar */}
                {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary" />
                )}
                <link.icon className={cn("shrink-0 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} size={18} />
                {!collapsed && <span>{link.label}</span>}
            </Link>
        );

        if (collapsed) {
            return (
                <Tooltip key={link.href}>
                    <TooltipTrigger asChild>{content}</TooltipTrigger>
                    <TooltipContent side="right" className="text-xs">{link.label}</TooltipContent>
                </Tooltip>
            );
        }

        return content;
    };

    return (
        <TooltipProvider delayDuration={0}>
            <aside className={cn(
                "h-full flex flex-col bg-sidebar border-r border-border/50 transition-all duration-300 ease-in-out",
                collapsed ? "w-[68px]" : "w-64"
            )}>
                {/* Logo */}
                <div className={cn(
                    "h-16 flex items-center border-b border-border/50 shrink-0",
                    collapsed ? "justify-center px-2" : "justify-between px-5"
                )}>
                    {!collapsed && (
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                <span className="text-xs font-bold text-primary-foreground">N</span>
                            </div>
                            <span className="font-semibold text-sidebar-foreground tracking-tight">NFCwear</span>
                        </div>
                    )}
                    {collapsed && (
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <span className="text-xs font-bold text-primary-foreground">N</span>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="flex-1 py-4 px-2.5 space-y-0.5 overflow-y-auto">
                    {links.map((link) => (
                        <NavItem key={link.href} link={link} />
                    ))}
                </div>

                {/* Bottom section */}
                <div className="border-t border-border/50 p-2.5 space-y-1">
                    {/* Collapse toggle */}
                    <button
                        onClick={onToggleCollapse}
                        className={cn(
                            "hidden md:flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all cursor-pointer",
                            collapsed && "justify-center px-2"
                        )}
                    >
                        {collapsed ? <ChevronsRight size={18} /> : <><ChevronsLeft size={18} /><span>Einklappen</span></>}
                    </button>

                    {/* User info + logout */}
                    <div className={cn(
                        "flex items-center gap-2 pt-1",
                        collapsed ? "flex-col" : "justify-between"
                    )}>
                        {!collapsed && (
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                    <span className="text-xs font-medium text-muted-foreground">
                                        {userName ? userName.split(" ").map(n => n[0]).join("").toUpperCase() : "?"}
                                    </span>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-sidebar-foreground truncate">{userName || "Benutzer"}</p>
                                    <p className="text-[10px] text-muted-foreground truncate">{userEmail}</p>
                                </div>
                            </div>
                        )}
                        <div className={cn("flex items-center gap-1", collapsed && "flex-col")}>
                            <ModeToggle />
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => signOut()}
                                        className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                                    >
                                        <LogOut size={16} />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side={collapsed ? "right" : "top"} className="text-xs">Abmelden</TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </aside>
        </TooltipProvider>
    );
}
