import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./sidebar";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 font-sans antialiased">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-zinc-950 sticky top-0 z-40">
                <span className="font-bold text-lg">NFCwear Admin</span>
                <button onClick={() => setIsSidebarOpen(true)} className="text-zinc-400 hover:text-white">
                    <Menu size={24} />
                </button>
            </div>

            {/* Sidebar - Desktop (Fixed) & Mobile (Overlay) */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 border-r border-white/5 transition-transform duration-300 ease-in-out md:translate-x-0 h-full",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <AdminSidebar onClose={() => setIsSidebarOpen(false)} />
            </div>

            {/* Overlay backdrop for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/80 md:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="md:ml-64 p-4 md:p-8">
                <Outlet />
            </main>
        </div>
    );
}
