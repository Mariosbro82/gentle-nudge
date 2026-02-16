import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Users, LayoutDashboard, Database, BarChart3, HelpCircle, LogOut, Terminal, Menu, Building2, X } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
    { label: "Overview", icon: LayoutDashboard, href: "/admin/dashboard" },
    { label: "Users", icon: Users, href: "/admin/users" },
    { label: "Chips", icon: Database, href: "/admin/chips" },
    { label: "Organizations", icon: Building2, href: "/admin/organizations" },
    { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
    { label: "Support", icon: HelpCircle, href: "/admin/support" },
];

export function AdminLayout() {
    const { pathname } = useLocation();
    const { signOut } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-zinc-100 font-mono selection:bg-emerald-500/30">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-emerald-900/30 bg-[#0a0a0f] sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold tracking-widest text-emerald-400 text-xs uppercase">NFCwear // Ctrl</span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10"
                >
                    {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
            </div>

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-60 transform transition-transform duration-200 lg:translate-x-0 bg-[#08080d] border-r border-emerald-900/20",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-5 border-b border-emerald-900/20">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                                <Terminal className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-xs font-bold tracking-widest text-emerald-400 uppercase">Control</p>
                                <p className="text-[10px] text-zinc-600 tracking-wider">ADMIN SYSTEM v3.0</p>
                            </div>
                        </div>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
                        <p className="text-[10px] text-zinc-600 uppercase tracking-widest px-3 py-2">Navigation</p>
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded text-xs font-medium transition-all",
                                        isActive
                                            ? "bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-400 pl-[10px]"
                                            : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
                                    )}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-3 border-t border-emerald-900/20">
                        <button
                            onClick={signOut}
                            className="flex items-center gap-3 px-3 py-2 w-full rounded text-xs font-medium text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Disconnect
                        </button>
                        <div className="mt-3 px-3 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[10px] text-zinc-600">System Online</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="lg:ml-60 min-h-screen">
                {/* Top bar */}
                <div className="hidden lg:flex items-center justify-between px-8 py-3 border-b border-emerald-900/10 bg-[#0a0a0f]/80 backdrop-blur-sm sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-[10px] text-zinc-600 tracking-wider uppercase">
                            {NAV_ITEMS.find(n => pathname.startsWith(n.href))?.label || "Dashboard"}
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] text-zinc-700 font-mono">
                            {new Date().toLocaleDateString("de-DE")} · {new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                    </div>
                </div>

                <div className="p-4 lg:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
