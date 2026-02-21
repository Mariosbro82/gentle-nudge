import { cn } from "@/lib/utils";
import { CSSProperties } from "react";

function Skeleton({ className, style }: { className?: string; style?: CSSProperties }) {
    return <div className={cn("animate-pulse rounded-lg bg-muted/60", className)} style={style} />;
}

export function KPICardSkeleton() {
    return (
        <div className="rounded-xl border border-border/50 bg-card p-5 space-y-3">
            <div className="flex items-center justify-between">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-4 w-16 rounded-full" />
        </div>
    );
}

export function ChartSkeleton() {
    return (
        <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex items-end gap-1 h-[280px] pt-8">
                {Array.from({ length: 14 }).map((_, i) => (
                    <Skeleton
                        key={i}
                        className="flex-1 rounded-t-sm"
                        style={{ height: `${30 + Math.random() * 60}%` }}
                    />
                ))}
            </div>
        </div>
    );
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
    return (
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
            <div className="p-4 border-b border-border/50 flex gap-4">
                {Array.from({ length: cols }).map((_, i) => (
                    <Skeleton key={i} className="h-3.5 flex-1" />
                ))}
            </div>
            {Array.from({ length: rows }).map((_, r) => (
                <div key={r} className="p-4 border-b border-border/30 last:border-0 flex gap-4 items-center">
                    {Array.from({ length: cols }).map((_, c) => (
                        <Skeleton key={c} className="h-4 flex-1" />
                    ))}
                </div>
            ))}
        </div>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-5 w-28" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <KPICardSkeleton key={i} />
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartSkeleton />
                <ChartSkeleton />
            </div>
        </div>
    );
}
