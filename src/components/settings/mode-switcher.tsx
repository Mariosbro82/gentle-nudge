import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Megaphone, Star } from "lucide-react";

export type DashboardMode = "corporate" | "campaign" | "hospitality";

interface ModeSwitcherProps {
  mode: DashboardMode;
  onChange: (mode: DashboardMode) => void;
}

const modes: { id: DashboardMode; label: string; icon: typeof Briefcase; color: string }[] = [
  { id: "corporate", label: "Vertrieb", icon: Briefcase, color: "hsl(220, 90%, 56%)" },
  { id: "campaign", label: "Kampagnen", icon: Megaphone, color: "hsl(270, 70%, 60%)" },
  { id: "hospitality", label: "Bewertung", icon: Star, color: "hsl(30, 90%, 55%)" },
];

export function ModeSwitcher({ mode, onChange }: ModeSwitcherProps) {
  

  return (
    <div
      className="relative inline-flex items-center rounded-2xl p-1 gap-0.5"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)",
        backdropFilter: "blur(40px) saturate(180%)",
        WebkitBackdropFilter: "blur(40px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 4px 24px -4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {modes.map((m) => {
        const isActive = mode === m.id;
        const Icon = m.icon;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onChange(m.id)}
            className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors duration-300 z-10"
            style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.4)" }}
          >
            {isActive && (
              <motion.div
                layoutId="mode-pill"
                className="absolute inset-0 rounded-xl"
                style={{
                  background: `linear-gradient(135deg, ${m.color}, ${m.color}cc)`,
                  boxShadow: `0 0 24px -2px ${m.color}50, inset 0 1px 0 rgba(255,255,255,0.2)`,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <Icon className="w-4 h-4 relative z-10" />
            <span className="relative z-10 hidden sm:inline">{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Wrap mode-dependent content sections for smooth cross-fade */
export function ModeContent({ mode, children }: { mode: DashboardMode; children: React.ReactNode }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={mode}
        initial={{ opacity: 0, filter: "blur(4px)", scale: 0.98 }}
        animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
        exit={{ opacity: 0, filter: "blur(4px)", scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ willChange: "opacity, filter, transform" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
