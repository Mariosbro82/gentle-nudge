import { Check } from "lucide-react";

interface TemplateSelectorProps {
    activeTemplateId: string;
    onSelect: (id: string) => void;
}

interface TemplateOption {
    id: string;
    name: string;
    description: string;
    gradient: string;
    icon: string;
}

const TEMPLATES: TemplateOption[] = [
    {
        id: "premium-gradient",
        name: "Premium Gradient",
        description: "Eleganter Farbverlauf mit modernem Look",
        gradient: "from-blue-600 to-purple-600",
        icon: "Aa",
    },
    {
        id: "minimalist-card",
        name: "Minimalist Card",
        description: "Schlicht und professionell",
        gradient: "from-zinc-700 to-zinc-900",
        icon: "Aa",
    },
    {
        id: "event-badge",
        name: "Event Badge",
        description: "Auffällig für Messen und Events",
        gradient: "from-violet-600 to-indigo-600",
        icon: "Aa",
    },
];

export function TemplateSelector({ activeTemplateId, onSelect }: TemplateSelectorProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TEMPLATES.map((template) => {
                const isActive = template.id === activeTemplateId;

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
                        <div className={`h-16 rounded-lg bg-gradient-to-r ${template.gradient} mb-3 flex items-end justify-center`}>
                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm -mb-4 border-2 border-zinc-900 flex items-center justify-center text-[10px] font-bold text-white/80">
                                {template.icon}
                            </div>
                        </div>

                        <div className="mt-2">
                            <p className="text-sm font-medium">{template.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{template.description}</p>
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
