import { type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, actionHref, onAction }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 border border-border/50 flex items-center justify-center mb-5">
                <Icon className="w-7 h-7 text-muted-foreground/60" />
            </div>
            <h3 className="text-base font-semibold text-foreground tracking-tight">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-sm">{description}</p>
            {actionLabel && (
                actionHref ? (
                    <Button asChild className="mt-5" size="sm">
                        <Link to={actionHref}>{actionLabel}</Link>
                    </Button>
                ) : (
                    <Button onClick={onAction} className="mt-5" size="sm">{actionLabel}</Button>
                )
            )}
        </div>
    );
}
