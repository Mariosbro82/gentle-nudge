import { cn } from "@/lib/utils";

interface NfcChipVisualProps {
  className?: string;
}

export function NfcChipVisual({ className }: NfcChipVisualProps) {
  return (
    <div className={cn("relative w-64 h-64", className)}>
      {/* Outer Glow */}
      <div className="absolute inset-0 bg-electric-blue/20 rounded-full blur-xl animate-pulse" />

      {/* Chip Body */}
      <div className="absolute inset-2 bg-black/90 rounded-full border border-electric-blue/30 shadow-[0_0_15px_rgba(14,165,233,0.3)] flex items-center justify-center overflow-hidden backdrop-blur-sm">

        {/* Circuit Pattern (SVG) */}
        <svg className="absolute w-full h-full opacity-40" viewBox="0 0 100 100" fill="none">
           <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.2" className="text-white/20" />

           {/* Outer Ring */}
           <path d="M50 50 m-40 0 a 40 40 0 1 0 80 0 a 40 40 0 1 0 -80 0"
                 stroke="currentColor"
                 strokeWidth="0.5"
                 strokeDasharray="4 4"
                 className="text-electric-blue animate-[spin_20s_linear_infinite]" />

           {/* Middle Ring */}
           <path d="M50 50 m-30 0 a 30 30 0 1 1 60 0 a 30 30 0 1 1 -60 0"
                 stroke="currentColor"
                 strokeWidth="1"
                 strokeDasharray="10 10"
                 className="text-electric-blue animate-[spin_15s_linear_infinite_reverse]" />

           {/* Inner Ring */}
           <path d="M50 50 m-20 0 a 20 20 0 1 0 40 0 a 20 20 0 1 0 -40 0"
                 stroke="currentColor"
                 strokeWidth="1.5"
                 className="text-electric-blue" />

            {/* Connecting Lines */}
            <path d="M50 10 L50 30" stroke="currentColor" strokeWidth="1" className="text-electric-blue/50" />
            <path d="M50 90 L50 70" stroke="currentColor" strokeWidth="1" className="text-electric-blue/50" />
            <path d="M10 50 L30 50" stroke="currentColor" strokeWidth="1" className="text-electric-blue/50" />
            <path d="M90 50 L70 50" stroke="currentColor" strokeWidth="1" className="text-electric-blue/50" />
        </svg>

        {/* Core */}
        <div className="relative z-10 w-12 h-12 bg-electric-blue/10 rounded-full border border-electric-blue flex items-center justify-center">
            <div className="w-6 h-6 bg-electric-blue rounded-full shadow-[0_0_20px_rgba(14,165,233,1)] animate-pulse" />
        </div>

        {/* Highlight Reflection */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-white/10 to-transparent rounded-tr-full pointer-events-none" />
      </div>
    </div>
  );
}
