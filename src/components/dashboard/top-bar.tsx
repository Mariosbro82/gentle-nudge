import { useLocation, Link } from "react-router-dom";
import { ChevronRight, Search, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const ROUTE_LABELS: Record<string, string> = {
    "/dashboard": "Übersicht",
    "/dashboard/devices": "Geräte",
    "/dashboard/leads": "Kontakte",
    "/dashboard/campaigns": "Kampagnen",
    "/dashboard/analytics": "Analyse",
    "/dashboard/team": "Team",
    "/dashboard/top-performers": "Top Performer",
    "/dashboard/settings": "Einstellungen",
};

interface TopBarProps {
    onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
    const location = useLocation();
    const currentLabel = ROUTE_LABELS[location.pathname] || "Dashboard";
    const isRoot = location.pathname === "/dashboard";

    return (
        <div className="h-14 border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 gap-4">
            {/* Left: Mobile menu + Breadcrumbs */}
            <div className="flex items-center gap-3 min-w-0">
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                >
                    <Menu size={20} />
                </button>

                <nav className="flex items-center gap-1.5 text-sm min-w-0">
                    <Link
                        to="/dashboard"
                        className={cn(
                            "text-muted-foreground hover:text-foreground transition-colors shrink-0",
                            isRoot && "text-foreground font-medium"
                        )}
                    >
                        Dashboard
                    </Link>
                    {!isRoot && (
                        <>
                            <ChevronRight size={14} className="text-muted-foreground/50 shrink-0" />
                            <span className="font-medium text-foreground truncate">{currentLabel}</span>
                        </>
                    )}
                </nav>
            </div>

            {/* Right: Search */}
            <button className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-lg border border-border/50 bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all text-sm cursor-pointer max-w-[240px] w-full">
                <Search size={14} className="shrink-0" />
                <span className="flex-1 text-left truncate">Suchen…</span>
                <kbd className="hidden md:inline-flex h-5 items-center gap-0.5 rounded border border-border/50 bg-muted/50 px-1.5 text-[10px] font-mono text-muted-foreground shrink-0">
                    ⌘K
                </kbd>
            </button>
        </div>
    );
}
