import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
    title: string;
    value: number | string;
    trend?: string;
    trendDirection?: "up" | "down" | "neutral";
    icon: LucideIcon;
    subtitle?: string;
}

export function KPICard({ title, value, trend, trendDirection = "neutral", icon: Icon, subtitle }: KPICardProps) {
    return (
        <div className="group relative rounded-xl border border-border/50 bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20">
            <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <div className="w-9 h-9 rounded-lg bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                    <Icon size={18} />
                </div>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {typeof value === "number" ? value.toLocaleString("de-DE") : value}
            </h2>
            <div className="flex items-center gap-2 mt-2">
                {trend && (
                    <span className={cn(
                        "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
                        trendDirection === "up" && "bg-emerald-500/10 text-emerald-500",
                        trendDirection === "down" && "bg-destructive/10 text-destructive",
                        trendDirection === "neutral" && "bg-muted text-muted-foreground",
                    )}>
                        {trendDirection === "up" && <TrendingUp size={12} />}
                        {trendDirection === "down" && <TrendingDown size={12} />}
                        {trend}
                    </span>
                )}
                {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
            </div>
        </div>
    );
}
