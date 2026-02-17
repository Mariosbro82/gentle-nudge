import { ExternalLink } from "lucide-react";
import type { CustomLink } from "@/types/profile";

interface Props {
    links: CustomLink[];
    accentColor: string;
    variant?: "pill" | "button";
}

export function CustomLinksDisplay({ links, variant = "button" }: Props) {
    if (!links || links.length === 0) return null;

    if (variant === "pill") {
        return (
            <>
                {links.map((link, i) => (
                    <a
                        key={i}
                        href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/10 text-sm hover:bg-white/5 transition-colors"
                    >
                        <ExternalLink className="h-4 w-4 text-zinc-400" />
                        {link.title}
                    </a>
                ))}
            </>
        );
    }

    return (
        <>
            {links.map((link, i) => (
                <a
                    key={i}
                    href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-white/10 text-sm hover:bg-white/5 transition-colors"
                >
                    <ExternalLink className="h-4 w-4" />
                    {link.title}
                </a>
            ))}
        </>
    );
}
