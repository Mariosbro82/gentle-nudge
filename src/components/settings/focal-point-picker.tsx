import { useRef, useState } from "react";
import { Crosshair, Pencil, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FocalPointPickerProps {
    imageUrl: string;
    position: string;
    onChange: (position: string) => void;
    onSave?: () => void;
    aspectRatio?: string;
    label?: string;
}

export function FocalPointPicker({ imageUrl, position, onChange, onSave, aspectRatio = "3/1", label }: FocalPointPickerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dragging, setDragging] = useState(false);
    const [editing, setEditing] = useState(false);
    const [localPosition, setLocalPosition] = useState(position);

    const displayPos = editing ? localPosition : position;
    const [x, y] = (displayPos || "50% 50%").split(" ").map((v) => parseFloat(v));

    function handlePointerEvent(e: React.PointerEvent) {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const px = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        const py = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
        const newPos = `${Math.round(px)}% ${Math.round(py)}%`;
        setLocalPosition(newPos);
    }

    function handleStartEdit() {
        setLocalPosition(position);
        setEditing(true);
    }

    function handleSave() {
        onChange(localPosition);
        onSave?.();
        setEditing(false);
    }

    if (!editing) {
        return (
            <Button type="button" variant="outline" size="sm" onClick={handleStartEdit} className="mt-1">
                <Pencil className="h-3 w-3 mr-2" /> {label || "Ausschnitt anpassen"}
            </Button>
        );
    }

    return (
        <div className="space-y-2 mt-2">
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
                    style={{ objectPosition: displayPos }}
                    draggable={false}
                />
                <div
                    className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ left: `${x}%`, top: `${y}%` }}
                >
                    <div className="absolute inset-0 rounded-full border-2 border-white shadow-lg shadow-black/50" />
                    <Crosshair className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-lg" />
                </div>
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white" />
                    <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white" />
                    <div className="absolute top-1/3 left-0 right-0 h-px bg-white" />
                    <div className="absolute top-2/3 left-0 right-0 h-px bg-white" />
                </div>
            </div>
            <div className="flex gap-2">
                <Button type="button" size="sm" onClick={handleSave}>
                    <Check className="h-3 w-3 mr-1" /> Speichern
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(false)}>
                    Abbrechen
                </Button>
            </div>
        </div>
    );
}
