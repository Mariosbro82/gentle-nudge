import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Users, ScanLine, ArrowUpRight, Activity, TrendingUp } from "lucide-react";

const OFFSET_FACTOR = 4;
const SCALE_FACTOR = 0.03;
const OPACITY_FACTOR = 0.1;

export function SidebarDashboard() {
    const [dismissedIndex, setDismissedIndex] = React.useState<number[]>([]);

    const cardsData = [
        {
            id: 1,
            type: "stats",
            title: "Gesamt-Performance",
            content: (
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-muted/50 p-2 rounded-lg border border-border/50">
                        <p className="text-[10px] text-muted-foreground uppercase font-semibold">Scans</p>
                        <p className="text-lg font-bold">1,284</p>
                    </div>
                    <div className="bg-muted/50 p-2 rounded-lg border border-border/50">
                        <p className="text-[10px] text-muted-foreground uppercase font-semibold">Leads</p>
                        <p className="text-lg font-bold">42</p>
                    </div>
                    <div className="bg-muted/50 p-2 rounded-lg border border-border/50 col-span-2">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-[10px] text-muted-foreground uppercase font-semibold">Aktive Chips</p>
                                <p className="text-lg font-bold">12</p>
                            </div>
                            <TrendingUp className="text-green-500" size={16} />
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 2,
            type: "activity",
            title: "Live Scan Feed",
            content: (
                <div className="space-y-2 mt-2">
                    {[
                        { device: "iPhone 15 Pro", time: "Gerade eben", color: "bg-blue-500" },
                        { device: "Samsung S24 Ultra", time: "Vor 2 Min.", color: "bg-purple-500" },
                        { device: "Google Pixel 8", time: "Vor 15 Min.", color: "bg-orange-500" },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-1.5 rounded-md hover:bg-muted/30 transition-colors">
                            <div className={cn("h-1.5 w-1.5 rounded-full shrink-0", item.color)} />
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{item.device}</p>
                                <p className="text-[10px] text-muted-foreground">{item.time}</p>
                            </div>
                            <ScanLine size={12} className="text-muted-foreground" />
                        </div>
                    ))}
                </div>
            )
        },
        {
            id: 3,
            type: "chart",
            title: "Scan Performance (7 Tage)",
            content: (
                <div className="mt-4 flex items-end gap-1.5 h-20 px-1">
                    {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                        <div
                            key={i}
                            className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t-sm transition-all relative group/bar"
                            style={{ height: `${h}%` }}
                        >
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[8px] py-0.5 px-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap border border-border">
                                {Math.round(h * 1.5)} Scans
                            </div>
                        </div>
                    ))}
                </div>
            )
        },
        {
            id: 4,
            type: "preview",
            title: "Profil Vorschau",
            content: (
                <div className="mt-2 relative group overflow-hidden rounded-lg border border-border/50 aspect-video bg-muted/30">
                    <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-r from-blue-600 to-purple-600 opacity-20" />
                    <div className="absolute top-4 left-4 h-8 w-8 rounded-full border-2 border-background bg-muted overflow-hidden">
                        <div className="size-full bg-gradient-to-br from-neutral-200 to-neutral-400" />
                    </div>
                    <div className="absolute top-4 left-16 right-4 space-y-1">
                        <div className="h-2 w-24 bg-foreground/20 rounded-full" />
                        <div className="h-1.5 w-16 bg-foreground/10 rounded-full" />
                    </div>
                    <div className="absolute inset-x-4 bottom-4 grid grid-cols-3 gap-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-6 rounded bg-background/50 border border-white/10" />
                        ))}
                    </div>
                </div>
            )
        }
    ];

    const visibleCards = cardsData.filter(c => !dismissedIndex.includes(c.id));
    const cardCount = visibleCards.length;

    return (
        <div className="group relative overflow-hidden px-3 pb-3 pt-12 min-h-[420px]">
            <div className="relative size-full">
                {visibleCards.reverse().map((card, idx) => {
                    const depth = cardCount - 1 - idx;
                    return (
                        <div
                            key={card.id}
                            className={cn(
                                "absolute left-0 top-0 size-full transition-all duration-300 ease-out",
                                depth > 3 ? "opacity-0 invisible" : "opacity-100 visible"
                            )}
                            style={{
                                transform: `translateY(-${depth * OFFSET_FACTOR}%) scale(${1 - depth * SCALE_FACTOR})`,
                                zIndex: idx,
                                opacity: 1 - depth * OPACITY_FACTOR,
                            }}
                        >
                            <DashboardCard
                                title={card.title}
                                isActive={depth === 0}
                                onDismiss={() => setDismissedIndex(prev => [...prev, card.id])}
                            >
                                {card.content}
                            </DashboardCard>
                        </div>
                    );
                })}

                {cardCount === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-start pt-28 text-center p-6 animate-in fade-in duration-500">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                            <Activity className="text-primary" size={24} />
                        </div>
                        <h3 className="font-semibold text-foreground text-lg">Bereit für den Start?</h3>
                        <p className="text-xs text-muted-foreground mt-3 max-w-[220px] leading-relaxed">
                            Nach dem Login stehen Ihnen alle Funktionen vollumfänglich zur Verfügung.
                        </p>
                        <button
                            onClick={() => setDismissedIndex([])}
                            className="text-xs text-primary font-medium mt-6 hover:underline bg-primary/5 px-4 py-2 rounded-full transition-colors hover:bg-primary/10"
                        >
                            Vorschau neu laden
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function DashboardCard({
    title,
    children,
    isActive,
    onDismiss
}: {
    title: string;
    children: React.ReactNode;
    isActive: boolean;
    onDismiss: () => void;
}) {
    const [dx, setDx] = React.useState(0);
    const [isDragging, setIsDragging] = React.useState(false);
    const startX = React.useRef(0);

    const handlePointerDown = (e: React.PointerEvent) => {
        if (!isActive) return;
        setIsDragging(true);
        startX.current = e.clientX;
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;
        const currentDx = e.clientX - startX.current;
        setDx(currentDx);
    };

    const handlePointerUp = () => {
        if (!isDragging) return;
        setIsDragging(false);
        if (Math.abs(dx) > 100) {
            onDismiss();
        } else {
            setDx(0);
        }
    };

    return (
        <Card
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className={cn(
                "relative select-none p-5 text-[0.8125rem] bg-card/80 backdrop-blur-sm border-border shadow-2xl h-[340px] flex flex-col cursor-grab active:cursor-grabbing",
                isActive ? "z-10" : "pointer-events-none"
            )}
            style={{
                transform: `translateX(${dx}px) rotate(${dx * 0.05}deg)`,
                opacity: 1 - Math.abs(dx) / 500,
                transition: isDragging ? "none" : "transform 0.2s ease-out, opacity 0.2s ease-out"
            }}
        >
            <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-foreground uppercase tracking-wider text-[10px] opacity-70">
                    {title}
                </span>
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            </div>

            <div className="flex-1 overflow-hidden">
                {children}
            </div>

            <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-5 w-5 rounded-full border-2 border-card bg-muted-foreground/20" />
                    ))}
                    <div className="h-5 w-5 rounded-full border-2 border-card bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary">
                        +
                    </div>
                </div>
                <span className="text-[10px] text-muted-foreground italic">Swipe zum Wechseln</span>
            </div>
        </Card>
    );
}
