import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface TemplateSelectorProps {
    activeTemplateId: string;
    onSelect: (id: string) => void;
}

interface TemplateOption {
    id: string;
    name: string;
    description: string | null;
}

const TEMPLATE_PREVIEWS: Record<string, { gradient: string; icon: string }> = {
    "premium-gradient": {
        gradient: "from-blue-600 to-purple-600",
        icon: "Aa",
    },
    "minimalist-card": {
        gradient: "from-zinc-700 to-zinc-900",
        icon: "Aa",
    },
    "event-badge": {
        gradient: "from-violet-600 to-indigo-600",
        icon: "Aa",
    },
};

export function TemplateSelector({ activeTemplateId, onSelect }: TemplateSelectorProps) {
    const [templates, setTemplates] = useState<TemplateOption[]>([]);

    useEffect(() => {
        async function fetchTemplates() {
            const { data } = await supabase
                .from("profile_templates")
                .select("id, name, description")
                .eq("is_active", true)
                .order("sort_order");

            if (data) setTemplates(data);
        }
        fetchTemplates();
    }, []);

    if (templates.length === 0) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {templates.map((template) => {
                const isActive = template.id === activeTemplateId;
                const preview = TEMPLATE_PREVIEWS[template.id] || TEMPLATE_PREVIEWS["premium-gradient"];

                return (
                    <button
                        key={template.id}
                        type="button"
                        onClick={() => onSelect(template.id)}
                        className={`relative rounded-xl border-2 p-3 text-left transition-all ${isActive
                                ? "border-blue-500 bg-blue-500/5"
                                : "border-border bg-card hover:border-muted-foreground/20"
                            }`}
                    >
                        {/* Preview mockup */}
                        <div className={`h-16 rounded-lg bg-gradient-to-r ${preview.gradient} mb-3 flex items-end justify-center`}>
                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm -mb-4 border-2 border-zinc-900 flex items-center justify-center text-[10px] font-bold text-white/80">
                                {preview.icon}
                            </div>
                        </div>

                        <div className="mt-2">
                            <p className="text-sm font-medium">{template.name}</p>
                            {template.description && (
                                <p className="text-xs text-muted-foreground mt-0.5">{template.description}</p>
                            )}
                        </div>

                        {isActive && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                                <Check className="h-3 w-3 text-white" />
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
