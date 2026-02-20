import { useState } from "react";
import { Ticket, Copy, Check } from "lucide-react";

interface Props {
    code: string;
    description: string;
    accentColor: string;
}

export function CouponDisplay({ code, description, accentColor }: Props) {
    const [copied, setCopied] = useState(false);

    if (!code) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            className="rounded-xl border border-dashed border-white/[0.18] p-4 text-center space-y-2 my-4 overflow-hidden relative"
            style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
            }}
        >
            <div className="flex items-center justify-center gap-2 text-sm text-white/70">
                <Ticket className="h-4 w-4" />
                <span>{description || "Gutschein"}</span>
            </div>
            <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 mx-auto px-6 py-2 rounded-lg font-mono text-lg font-bold tracking-wider transition-colors"
                style={{ backgroundColor: `${accentColor}22`, color: accentColor, border: `1px solid ${accentColor}44` }}
            >
                {code}
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4 opacity-60" />}
            </button>
        </div>
    );
}
