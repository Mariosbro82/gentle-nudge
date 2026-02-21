import { Globe } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { type SupportedLang, LANG_LABELS } from "@/lib/i18n";

interface LanguageSwitcherProps {
  currentLang: SupportedLang;
  onLangChange: (lang: SupportedLang) => void;
}

export function LanguageSwitcher({ currentLang, onLangChange }: LanguageSwitcherProps) {
  const langs = Object.entries(LANG_LABELS) as [SupportedLang, string][];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-white/70 hover:text-white hover:bg-white/10 transition-colors backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <Globe className="h-3.5 w-3.5" />
          <span className="uppercase font-medium">{currentLang}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px] bg-zinc-900/95 backdrop-blur-xl border-white/10">
        {langs.map(([code, label]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => onLangChange(code)}
            className={`text-sm ${code === currentLang ? "text-white font-semibold" : "text-white/70"}`}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
