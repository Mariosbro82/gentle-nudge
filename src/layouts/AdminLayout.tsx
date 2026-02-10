import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Users, LayoutDashboard, Database, BarChart3, HelpCircle, LogOut, ShieldAlert, Menu } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-zinc-950 text-foreground border-r border-zinc-800">
            <div className="p-6 border-b border-zinc-800 flex items-center gap-2 text-red-500">
                <ShieldAlert className="w-6 h-6" />
                <span className="font-bold tracking-wider">ADMIN.SYS</span>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-zinc-800 mt-auto">
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
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-950 text-foreground font-sans selection:bg-red-500/30">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950 sticky top-0 z-40">
                <div className="flex items-center gap-2 text-red-500">
                    <ShieldAlert className="w-5 h-5" />
                    <span className="font-bold tracking-wider text-sm">ADMIN.SYS</span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSidebarOpen(true)}
                    className="text-zinc-400 hover:text-white hover:bg-zinc-900"
                >
                    <Menu className="w-6 h-6" />
                </Button>
            </div>

            {/* Sidebar - Desktop (Fixed) & Mobile (Sliding) */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:translate-x-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <SidebarContent />
            </aside>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-zinc-950/80 backdrop-blur-sm md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="md:ml-64 min-h-screen">
                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
