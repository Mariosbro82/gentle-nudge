import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./sidebar";
import { TopBar } from "./top-bar";
import { cn } from "@/lib/utils";

export function DashboardLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans antialiased">
            {/* Sidebar - Desktop (Fixed) & Mobile (Overlay) */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out md:translate-x-0 h-full",
                collapsed ? "md:w-[68px]" : "md:w-64",
                isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full"
            )}>
                <AdminSidebar
                    onClose={() => setIsSidebarOpen(false)}
                    collapsed={collapsed}
                    onToggleCollapse={() => setCollapsed(!collapsed)}
                />
            </div>

            {/* Overlay backdrop for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-overlay/60 md:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className={cn(
                "transition-all duration-300 ease-in-out min-h-screen",
                collapsed ? "md:ml-[68px]" : "md:ml-64"
            )}>
                <TopBar onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="p-4 md:p-8 max-w-[1400px]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
