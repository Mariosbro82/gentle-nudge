import { useState, useEffect, useCallback } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { ChevronRight, Search, Menu, QrCode, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import { Input } from "@/components/ui/input";

const ROUTE_LABELS: Record<string, string> = {
    "/dashboard": "Übersicht",
    "/dashboard/devices": "Geräte",
    "/dashboard/leads": "Kontakte",
    "/dashboard/campaigns": "Kampagnen",
    "/dashboard/analytics": "Analyse",
    "/dashboard/team": "Team",
    "/dashboard/top-performers": "Top Performer",
    "/dashboard/settings": "Einstellungen",
    "/dashboard/support": "Support",
    "/dashboard/corporate-design": "Corporate Design",
};

const SEARCH_ITEMS = Object.entries(ROUTE_LABELS).map(([path, label]) => ({ path, label }));

interface TopBarProps {
    onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const [qrOpen, setQrOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const currentLabel = ROUTE_LABELS[location.pathname] || "Dashboard";
    const isRoot = location.pathname === "/dashboard";

    const filteredItems = searchQuery.trim()
        ? SEARCH_ITEMS.filter((item) =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : SEARCH_ITEMS;

    // ⌘K / Ctrl+K shortcut
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setSearchOpen((prev) => !prev);
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    // Reset on open
    useEffect(() => {
        if (searchOpen) {
            setSearchQuery("");
            setSelectedIndex(0);
        }
    }, [searchOpen]);

    // Reset selected index when query changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [searchQuery]);

    const handleSelect = useCallback((path: string) => {
        navigate(path);
        setSearchOpen(false);
    }, [navigate]);

    const handleSearchKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => Math.min(prev + 1, filteredItems.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
            handleSelect(filteredItems[selectedIndex].path);
        }
    };

    const handleDownloadQr = () => {
        const container = document.getElementById("qr-code-container");
        const svg = container?.querySelector("svg");
        if (!svg) return;
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
            ctx?.drawImage(img, 0, 0, 400, 400);
            const a = document.createElement("a");
            a.download = "qr-code.png";
            a.href = canvas.toDataURL("image/png");
            a.click();
        };
        img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    };

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

            {/* Right: QR + Search */}
            <div className="flex items-center gap-2">
                <Dialog open={qrOpen} onOpenChange={setQrOpen}>
                    <DialogTrigger asChild>
                        <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors" aria-label="QR-Code anzeigen">
                            <QrCode size={18} />
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle className="text-center text-lg">Dein QR-Code</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col items-center gap-5 py-6">
                            <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200" id="qr-code-container">
                                <QRCodeSVG
                                    value={typeof window !== "undefined" ? window.location.href : ""}
                                    size={240}
                                    fgColor="#000000"
                                    bgColor="#ffffff"
                                    level="H"
                                />
                            </div>
                            <p className="text-sm text-muted-foreground text-center max-w-[260px]">
                                Scanne den Code mit der Kamera, falls NFC nicht verfügbar ist.
                            </p>
                            <Button variant="outline" size="default" className="gap-2" onClick={handleDownloadQr}>
                                <Download size={16} />
                                Als PNG herunterladen
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Search trigger */}
                <button
                    onClick={() => setSearchOpen(true)}
                    className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-lg border border-border/50 bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all text-sm cursor-pointer max-w-[240px] w-full"
                >
                    <Search size={14} className="shrink-0" />
                    <span className="flex-1 text-left truncate">Suchen…</span>
                    <kbd className="hidden md:inline-flex h-5 items-center gap-0.5 rounded border border-border/50 bg-muted/50 px-1.5 text-[10px] font-mono text-muted-foreground shrink-0">
                        ⌘K
                    </kbd>
                </button>

                {/* Search dialog */}
                <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
                    <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
                        <div className="flex items-center gap-2 px-4 border-b border-border/50">
                            <Search size={16} className="text-muted-foreground shrink-0" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                placeholder="Seite suchen…"
                                className="border-0 shadow-none focus-visible:ring-0 h-12 text-base"
                                autoFocus
                            />
                            <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-border/50 bg-muted/50 px-1.5 text-[10px] font-mono text-muted-foreground shrink-0">
                                ESC
                            </kbd>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto py-2">
                            {filteredItems.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-6">Keine Ergebnisse</p>
                            ) : (
                                filteredItems.map((item, i) => (
                                    <button
                                        key={item.path}
                                        onClick={() => handleSelect(item.path)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors",
                                            i === selectedIndex
                                                ? "bg-accent text-accent-foreground"
                                                : "text-foreground hover:bg-accent/50"
                                        )}
                                    >
                                        <Search size={14} className="text-muted-foreground shrink-0" />
                                        <span>{item.label}</span>
                                        {item.path === location.pathname && (
                                            <span className="ml-auto text-xs text-muted-foreground">Aktuelle Seite</span>
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
