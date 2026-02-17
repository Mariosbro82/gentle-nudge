import { useRef, useState } from "react";
import { Crosshair } from "lucide-react";

interface FocalPointPickerProps {
    imageUrl: string;
    position: string; // "50% 50%"
    onChange: (position: string) => void;
    aspectRatio?: string; // e.g. "3/1" for banner, "1/1" for profile
    label?: string;
}

export function FocalPointPicker({ imageUrl, position, onChange, aspectRatio = "3/1", label }: FocalPointPickerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dragging, setDragging] = useState(false);

    const [x, y] = (position || "50% 50%").split(" ").map((v) => parseFloat(v));

    function handlePointerEvent(e: React.PointerEvent) {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const px = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        const py = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
        onChange(`${Math.round(px)}% ${Math.round(py)}%`);
    }

    return (
        <div className="space-y-2">
            {label && <p className="text-xs text-muted-foreground">{label}</p>}
            <div
                ref={containerRef}
                className="relative rounded-lg overflow-hidden border border-border cursor-crosshair select-none"
                style={{ aspectRatio }}
                onPointerDown={(e) => {
                    setDragging(true);
                    (e.target as HTMLElement).setPointerCapture(e.pointerId);
                    handlePointerEvent(e);
                }}
                onPointerMove={(e) => dragging && handlePointerEvent(e)}
                onPointerUp={() => setDragging(false)}
            >
                <img
                    src={imageUrl}
                    alt="Focal point"
                    className="w-full h-full object-cover pointer-events-none"
                    style={{ objectPosition: position }}
                    draggable={false}
                />
                {/* Focal point indicator */}
                <div
                    className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ left: `${x}%`, top: `${y}%` }}
                >
                    <div className="absolute inset-0 rounded-full border-2 border-white shadow-lg shadow-black/50" />
                    <Crosshair className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-lg" />
                </div>
                {/* Grid overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white" />
                    <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white" />
                    <div className="absolute top-1/3 left-0 right-0 h-px bg-white" />
                    <div className="absolute top-2/3 left-0 right-0 h-px bg-white" />
                </div>
            </div>
            <p className="text-[10px] text-muted-foreground">Klicken oder ziehen Sie, um den Fokuspunkt zu setzen.</p>
        </div>
    );
}
