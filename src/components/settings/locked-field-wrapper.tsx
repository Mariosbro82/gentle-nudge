import { Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface LockedFieldWrapperProps {
    locked: boolean;
    children: React.ReactNode;
}

/**
 * Wraps a form field. When locked, disables pointer events and overlays a lock icon with tooltip.
 */
export function LockedFieldWrapper({ locked, children }: LockedFieldWrapperProps) {
    if (!locked) return <>{children}</>;

    return (
        <div className="relative">
            <div className="pointer-events-none opacity-50">
                {children}
            </div>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="absolute top-1 right-1 z-10 w-6 h-6 rounded-md bg-muted/80 border border-border flex items-center justify-center cursor-help">
                        <Lock className="h-3 w-3 text-muted-foreground" />
                    </div>
                </TooltipTrigger>
                <TooltipContent side="left" className="text-xs max-w-[200px]">
                    Dieses Feld wird von Ihrem Firmen-Administrator verwaltet.
                </TooltipContent>
            </Tooltip>
        </div>
    );
}
