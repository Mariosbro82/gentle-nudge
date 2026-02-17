import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface Props {
    target: string;
    label: string;
    accentColor: string;
}

export function CountdownDisplay({ target, label, accentColor }: Props) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [expired, setExpired] = useState(false);

    useEffect(() => {
        const update = () => {
            const diff = new Date(target).getTime() - Date.now();
            if (diff <= 0) {
                setExpired(true);
                return;
            }
            setTimeLeft({
                days: Math.floor(diff / 86400000),
                hours: Math.floor((diff % 86400000) / 3600000),
                minutes: Math.floor((diff % 3600000) / 60000),
                seconds: Math.floor((diff % 60000) / 1000),
            });
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [target]);

    if (!target || expired) return null;

    const blocks = [
        { value: timeLeft.days, label: "Tage" },
        { value: timeLeft.hours, label: "Std" },
        { value: timeLeft.minutes, label: "Min" },
        { value: timeLeft.seconds, label: "Sek" },
    ];

    return (
        <div className="rounded-xl border border-white/10 p-4 my-4 text-center space-y-3">
            {label && (
                <div className="flex items-center justify-center gap-2 text-sm text-zinc-400">
                    <Clock className="h-4 w-4" />
                    <span>{label}</span>
                </div>
            )}
            <div className="flex justify-center gap-3">
                {blocks.map((b) => (
                    <div key={b.label} className="text-center">
                        <div
                            className="text-2xl font-bold font-mono w-14 h-14 flex items-center justify-center rounded-lg"
                            style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                        >
                            {String(b.value).padStart(2, "0")}
                        </div>
                        <span className="text-[10px] text-zinc-500 mt-1 block">{b.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
