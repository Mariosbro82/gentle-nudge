import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export const NFCChip = () => {
    const frame = useCurrentFrame();

    // Shine effect animation
    const shineOffset = interpolate(frame % 90, [0, 90], [-100, 200]);

    return (
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                {/* Chip Body / Substrat */}
                <rect x="30" y="30" width="140" height="140" rx="4" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />

                {/* Quadratische Antennen-Spulen (Silber/Aluminium Look) */}
                {[0, 1, 2, 3, 4, 5].map((i) => (
                    <rect
                        key={i}
                        x={40 + i * 6}
                        y={40 + i * 6}
                        width={120 - i * 12}
                        height={120 - i * 12}
                        rx="2"
                        fill="none"
                        stroke="#a1a1aa"
                        strokeWidth="1.5"
                        opacity={0.8 - i * 0.1}
                    />
                ))}

                {/* Die Verbindung zur Mitte */}
                <path d="M100 40 L100 75" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" />

                {/* Zentraler IC (Integrated Circuit) */}
                <rect x="75" y="75" width="50" height="50" rx="2" fill="#09090b" stroke="#52525b" strokeWidth="1" />

                {/* Pins am Rand des ICs */}
                {[0, 1, 2, 3].map(i => (
                    <React.Fragment key={i}>
                        <rect x="70" y={80 + i * 10} width="6" height="3" fill="#d4d4d8" /> {/* Links */}
                        <rect x="124" y={80 + i * 10} width="6" height="3" fill="#d4d4d8" /> {/* Rechts */}
                    </React.Fragment>
                ))}

                {/* NFC Text-Gravur */}
                <text
                    x="100" y="105"
                    textAnchor="middle"
                    fill="#e4e4e7"
                    fontSize="12"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                    className="select-none"
                >
                    NFC
                </text>

                {/* Licht-Reflektion (Glanzeffekt) */}
                <defs>
                    <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform={`translate(${shineOffset / 100}, 0)`}>
                        <stop offset="0%" stopColor="white" stopOpacity="0.1" />
                        <stop offset="50%" stopColor="white" stopOpacity="0" />
                        <stop offset="100%" stopColor="white" stopOpacity="0.05" />
                    </linearGradient>
                </defs>
                <rect x="30" y="30" width="140" height="140" rx="4" fill="url(#shine)" pointerEvents="none" />
            </svg>

            {/* Zentraler hochenergetischer Glow */}
            <div className="absolute w-32 h-32 bg-blue-500/20 blur-[60px] rounded-full pointer-events-none" />
        </div>
    );
};
