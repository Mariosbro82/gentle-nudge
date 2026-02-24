import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface InfiniteLogoScrollProps {
    logos: {
        name: string;
        logo: React.FC<{ className?: string }>;
    }[];
    speed?: "slow" | "normal" | "fast";
    direction?: "left" | "right";
    pauseOnHover?: boolean;
    className?: string;
}

export function InfiniteLogoScroll({
    logos,
    speed = "normal",
    direction = "left",
    pauseOnHover = true,
    className,
}: InfiniteLogoScrollProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        addAnimation();
    }, []);

    function addAnimation() {
        if (containerRef.current && scrollerRef.current) {
            const scrollerContent = Array.from(scrollerRef.current.children);

            scrollerContent.forEach((item) => {
                const duplicatedItem = item.cloneNode(true);
                if (scrollerRef.current) {
                    scrollerRef.current.appendChild(duplicatedItem);
                }
            });

            getDirection();
            getSpeed();
            containerRef.current.setAttribute("data-animated", "true");
        }
    }

    const getDirection = () => {
        if (containerRef.current) {
            if (direction === "left") {
                containerRef.current.style.setProperty(
                    "--animation-direction",
                    "forwards"
                );
            } else {
                containerRef.current.style.setProperty(
                    "--animation-direction",
                    "reverse"
                );
            }
        }
    };

    const getSpeed = () => {
        if (containerRef.current) {
            if (speed === "fast") {
                containerRef.current.style.setProperty("--animation-duration", "20s");
            } else if (speed === "normal") {
                containerRef.current.style.setProperty("--animation-duration", "40s");
            } else {
                containerRef.current.style.setProperty("--animation-duration", "80s");
            }
        }
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
                className
            )}
        >
            <div
                ref={scrollerRef}
                className={cn(
                    "flex min-w-full shrink-0 gap-12 py-4 w-max flex-nowrap",
                    "animate-scroll",
                    pauseOnHover && "hover:[animation-play-state:paused]"
                )}
            >
                {logos.map((item, idx) => {
                    const LogoIcon = item.logo;
                    return (
                        <div
                            className="flex items-center gap-3 text-muted-foreground opacity-60 hover:opacity-100 transition-opacity"
                            key={item.name + idx}
                        >
                            <LogoIcon className="h-8 w-8 shrink-0" />
                            <span className="text-lg font-semibold whitespace-nowrap">{item.name}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
