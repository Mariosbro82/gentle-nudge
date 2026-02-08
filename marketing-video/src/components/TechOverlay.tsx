import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const TechOverlay = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Grid animation
    const gridOpacity = interpolate(frame, [0, 30], [0, 0.3], {
        extrapolateRight: 'clamp',
    });

    // Text typewriter effect
    const typeProgress = interpolate(frame, [20, 50], [0, 1], {
        extrapolateRight: 'clamp',
    });

    const text = "ENGINEERING GRADE";
    const charsShown = Math.floor(typeProgress * text.length);

    // Corner brackets animation
    const bracketScale = spring({
        frame,
        fps,
        from: 0.8,
        to: 1,
        config: { damping: 12 },
    });

    return (
        <AbsoluteFill className="pointer-events-none">
            {/* Grid Background */}
            <div
                className="absolute inset-0"
                style={{
                    opacity: gridOpacity,
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }}
            />

            {/* Corner Brackets */}
            <div className="absolute inset-8 border-2 border-white/20" style={{ transform: `scale(${bracketScale})` }}>
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-500" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-500" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500" />
            </div>

            {/* Tech Readout */}
            <div className="absolute top-12 left-12 text-blue-400 font-mono text-xl tracking-widest">
                {text.slice(0, charsShown)}
                <span className="animate-pulse">_</span>
            </div>

            {/* Data Lines */}
            <svg className="absolute inset-0 w-full h-full opacity-40">
                <line
                    x1="50%" y1="100" x2="50%" y2="200"
                    stroke="white"
                    strokeDasharray="5,5"
                    style={{
                        strokeDashoffset: -frame * 2
                    }}
                />
                <circle cx="50%" cy="200" r="4" fill="white" />
            </svg>
        </AbsoluteFill>
    );
};
