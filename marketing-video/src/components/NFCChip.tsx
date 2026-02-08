import React from 'react';
import { useCurrentFrame, interpolate, useVideoConfig } from 'remotion';

export const NFCChip = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // 1. Blue Wave Animation (Restored & Enhanced)
    // Multiple expanding rings fading out
    const waves = [0, 1, 2].map((i) => {
        const delay = i * 40;
        const rawProgress = (frame - delay) % 120;
        const progress = interpolate(rawProgress, [0, 120], [0, 1]);
        const scale = interpolate(progress, [0, 1], [0.8, 2.5]);
        const opacity = interpolate(progress, [0, 0.5, 1], [0.6, 0.3, 0]);
        return { scale, opacity, id: i };
    });

    // 2. Chip Rotation (3D Feel)
    const rotateY = interpolate(frame, [0, 300], [-15, 15]);
    const rotateX = interpolate(frame, [0, 300], [10, -10]);

    // 3. Shine Effect
    const shinePos = interpolate(frame % 150, [0, 150], [-150, 250]);

    return (
        <div className="relative w-96 h-96 flex items-center justify-center p-8">
            {/* Restored Blue Wave Animation */}
            {waves.map((wave) => (
                <div
                    key={wave.id}
                    className="absolute inset-0 border-2 border-blue-500 rounded-3xl"
                    style={{
                        transform: `scale(${wave.scale})`,
                        opacity: wave.opacity,
                    }}
                />
            ))}
            <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full animate-pulse" />

            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
                style={{ transform: `rotateY(${rotateY}deg) rotateX(${rotateX}deg)` }}>

                {/* 1. Main Housing (Black, Chamfered Square) */}
                <path d="M40 20 L160 20 L180 40 L180 160 L160 180 L40 180 L20 160 L20 40 Z"
                    fill="#09090b" stroke="#27272a" strokeWidth="1" />

                {/* 2. Side Pins (Silver/Chrome) */}
                <g fill="url(#silver-gradient)">
                    {[0, 1, 2, 3, 4, 5, 6].map(i => (
                        <React.Fragment key={i}>
                            <rect x="10" y={50 + i * 15} width="15" height="6" rx="1" /> {/* Left */}
                            <rect x="175" y={50 + i * 15} width="15" height="6" rx="1" /> {/* Right */}
                        </React.Fragment>
                    ))}
                </g>

                {/* 3. Antenna Coils (Silver Concentric Squares) */}
                {/* Using a single path for the spiral effect */}
                <g fill="none" stroke="url(#coil-gradient)" strokeWidth="2.5" strokeLinecap="square">
                    <path d="M50 50 H150 V150 H50 V50" />
                    <path d="M58 58 H142 V142 H58 V58" />
                    <path d="M66 66 H134 V134 H66 V66" />
                    <path d="M74 74 H126 V126 H74 V74" />
                    <path d="M82 82 H118 V118 H82 V82" />
                </g>

                {/* 4. Diagonal Trace / Bridge */}
                <path d="M125 45 L110 90 L100 100" fill="none" stroke="#d4d4d8" strokeWidth="3" />
                <circle cx="125" cy="45" r="3" fill="#d4d4d8" />

                {/* 5. Center Pad / Die */}
                <rect x="90" y="90" width="20" height="20" rx="2" fill="#d4d4d8" />
                <rect x="95" y="95" width="10" height="10" rx="1" fill="#18181b" />

                {/* 6. "NFC" Branding */}
                <text x="100" y="145" textAnchor="middle" fill="#e4e4e7" fontSize="24" fontFamily="Arial, sans-serif" fontWeight="bold" letterSpacing="2">
                    NFC
                </text>

                {/* Gradients & Filters */}
                <defs>
                    <linearGradient id="silver-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#e4e4e7" />
                        <stop offset="50%" stopColor="#a1a1aa" />
                        <stop offset="100%" stopColor="#e4e4e7" />
                    </linearGradient>

                    <linearGradient id="coil-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="50%" stopColor="#9ca3af" />
                        <stop offset="100%" stopColor="#ffffff" />
                    </linearGradient>

                    <linearGradient id="shine-glass" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform={`translate(${shinePos / 100}, 0)`}>
                        <stop offset="0%" stopColor="white" stopOpacity="0" />
                        <stop offset="45%" stopColor="white" stopOpacity="0.1" />
                        <stop offset="50%" stopColor="white" stopOpacity="0.3" />
                        <stop offset="55%" stopColor="white" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Glassy Shine Overlay */}
                <path d="M40 20 L160 20 L180 40 L180 160 L160 180 L40 180 L20 160 L20 40 Z"
                    fill="url(#shine-glass)" pointerEvents="none" />

            </svg>
        </div>
    );
};
