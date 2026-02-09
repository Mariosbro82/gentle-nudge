
import { Link, Outlet, useLocation } from "react-router-dom";
import { Users, LayoutDashboard, Database, BarChart3, HelpCircle, LogOut, ShieldAlert } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { label: "Overview", icon: LayoutDashboard, href: "/admin/dashboard" },
    { label: "Users", icon: Users, href: "/admin/users" },
    { label: "Chips", icon: Database, href: "/admin/chips" },
    { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
    { label: "Support", icon: HelpCircle, href: "/admin/support" },
];

export function AdminLayout() {
    const { pathname } = useLocation();
    const { signOut } = useAuth();

    return (
        <div className="flex h-screen bg-zinc-950 text-foreground font-sans selection:bg-red-500/30">
            {/* Sidebar */}
            <aside className="w-64 border-r border-zinc-800 flex flex-col">
                <div className="p-6 border-b border-zinc-800 flex items-center gap-2 text-red-500">
                    <ShieldAlert className="w-6 h-6" />
                    <span className="font-bold tracking-wider">ADMIN.SYS</span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-red-500/10 text-red-500 border border-red-500/20"
                                        : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
                                )}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-zinc-800">
                    <button
                        onClick={signOut}
                        className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/5 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Secure Logout
                    </button>
                    <div className="mt-4 px-3 text-xs text-zinc-600 font-mono">
                        v2.4.0-ADMIN-BUILD
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-zinc-950/50">
                <Outlet />
            </main>
        </div>
    );
}
