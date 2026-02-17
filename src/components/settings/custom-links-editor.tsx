import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CustomLink } from "@/types/profile";

interface Props {
    links: CustomLink[];
    onChange: (links: CustomLink[]) => void;
}

export function CustomLinksEditor({ links, onChange }: Props) {
    const addLink = () => {
        onChange([...links, { title: "", url: "" }]);
    };

    const updateLink = (index: number, field: keyof CustomLink, value: string) => {
        const updated = [...links];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    };

    const removeLink = (index: number) => {
        onChange(links.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-3">
            {links.map((link, i) => (
                <div key={i} className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <Input
                        placeholder="Titel (z.B. Calendly)"
                        value={link.title}
                        onChange={(e) => updateLink(i, "title", e.target.value)}
                        className="bg-input border-border flex-1"
                    />
                    <Input
                        placeholder="https://..."
                        value={link.url}
                        onChange={(e) => updateLink(i, "url", e.target.value)}
                        className="bg-input border-border flex-[2]"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLink(i)}
                        className="text-red-400 hover:text-red-300 flex-shrink-0"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addLink} className="w-full border-dashed">
                <Plus className="h-4 w-4 mr-2" /> Link hinzufügen
            </Button>
        </div>
    );
}
