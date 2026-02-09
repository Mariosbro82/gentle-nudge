import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router-dom";

const BentoGrid = ({ children, className }: { children: ReactNode; className?: string }) => {
    return (
        <div
            className={cn(
                "grid w-full auto-rows-[22rem] grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto",
                className
            )}
        >
            {children}
        </div>
    );
};

const BentoCard = ({
    name,
    className,
    background,
    Icon,
    description,
    href,
    cta,
}: {
    name: string;
    className?: string;
    background: ReactNode;
    Icon: any;
    description: string;
    href: string;
    cta: string;
}) => {
    return (
        <div
            key={name}
            className={cn(
                "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-2xl",
                "bg-white/50 dark:bg-black/20 backdrop-blur-md border border-gray-200 dark:border-white/10",
                "hover:shadow-xl transition-all duration-300",
                className
            )}
        >
            <div className="absolute inset-0 z-0">{background}</div>
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/40 to-transparent dark:from-black/90 dark:via-black/40 dark:to-transparent pointer-events-none z-10" />

            <div className="pointer-events-none z-20 flex transform-gpu flex-col gap-2 p-6 transition-all duration-300 group-hover:-translate-y-6 mt-auto">
                <Icon className="h-10 w-10 origin-left transform-gpu text-blue-600 dark:text-blue-400 transition-all duration-300 ease-in-out group-hover:scale-75" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {name}
                </h3>
                <p className="max-w-lg text-gray-600 dark:text-gray-300">{description}</p>
            </div>

            <div
                className={cn(
                    "pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 z-20"
                )}
            >
                <Link to={href} className="pointer-events-auto bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 shadow-lg">
                    {cta}
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
            </div>
        </div>
    );
};

export { BentoGrid, BentoCard };
