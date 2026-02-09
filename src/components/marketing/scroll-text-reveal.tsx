import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

/**
 * Industrieller NFC Chip SVG
 * Basierend auf dem Referenzbild: Quadratische Spulen, zentraler IC, metallische Pins.
 */
const IndustrialNfcChip = ({ progress }: { progress: any }) => {
    // Rotation gekoppelt an Scroll-Fortschritt
    const rotation = useTransform(progress, [0.2, 0.8], [-15, 15]);
    const tilt = useTransform(progress, [0.2, 0.8], [5, -5]);

    return (
        <motion.div
            className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center pointer-events-none"
            style={{ rotateZ: rotation, rotateX: tilt }}
        >
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                {/* Chip Body / Substrat */}
                <rect x="30" y="30" width="140" height="140" rx="4" fill="#09090b" stroke="#27272a" strokeWidth="1" />

                {/* Quadratische Antennen-Spulen (Gold/Kupfer Look für Premium) */}
                {[0, 1, 2, 3, 4, 5].map((i) => (
                    <rect
                        key={i}
                        x={40 + i * 6}
                        y={40 + i * 6}
                        width={120 - i * 12}
                        height={120 - i * 12}
                        rx="2"
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="1"
                        opacity={0.6 - i * 0.08}
                    />
                ))}

                {/* Die Verbindung zur Mitte */}
                <path d="M100 40 L100 75" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />

                {/* Zentraler IC (Integrated Circuit) */}
                <rect x="75" y="75" width="50" height="50" rx="2" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />

                {/* Pins am Rand des ICs */}
                {[0, 1, 2, 3].map(i => (
                    <React.Fragment key={i}>
                        <rect x="70" y={80 + i * 10} width="6" height="3" fill="#a1a1aa" /> {/* Links */}
                        <rect x="124" y={80 + i * 10} width="6" height="3" fill="#a1a1aa" /> {/* Rechts */}
                    </React.Fragment>
                ))}

                {/* NFC Text-Gravur */}
                <text
                    x="100" y="105"
                    textAnchor="middle"
                    fill="#e4e4e7"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                    className="select-none tracking-widest"
                >
                    NFCWEAR
                </text>

                {/* Licht-Reflektion (Glanzeffekt) */}
                <defs>
                    <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="white" stopOpacity="0.05" />
                        <stop offset="50%" stopColor="white" stopOpacity="0" />
                        <stop offset="100%" stopColor="white" stopOpacity="0.02" />
                    </linearGradient>
                </defs>
                <rect x="30" y="30" width="140" height="140" rx="4" fill="url(#shine)" pointerEvents="none" />
            </svg>

            {/* Zentraler hochenergetischer Glow */}
            <div className="absolute w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />
        </motion.div>
    );
};

export function ScrollTextReveal() {
    const containerRef = useRef(null);

    // Always dark mode for this section as requested
    const theme = {
        bg: "bg-background",
        text: "text-foreground",
        revealBg: "bg-card",
        revealText: "text-foreground",
    };

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Unified Y transformation for the main container:
    // 0 -> 0.5: Slide in from bottom (100vh -> 0vh)
    // 0.5 -> 0.8: Stay centered (0vh)
    // 0.8 -> 1.0: Slide up and out to make room (0vh -> -100vh)
    const containerY = useTransform(smoothProgress, [0, 0.5, 0.8, 1], ["100vh", "0vh", "0vh", "-100vh"]);

    const circleScale = useTransform(smoothProgress, [0.4, 0.9], [0.8, 1.5]);
    const circleRadius = useTransform(smoothProgress, [0.85, 1], ["50%", "0%"]);

    const chipScale = useTransform(smoothProgress, [0.3, 0.7], [0.5, 1.2]);
    const chipOpacity = useTransform(smoothProgress, [0.3, 0.5], [0, 1]);

    // Fade out the background text earlier so it doesn't clash with the chip
    const textOpacity = useTransform(smoothProgress, [0, 0.3], [1, 0]);

    // Scale up the background text as it fades
    const textScale = useTransform(smoothProgress, [0, 0.3], [1, 1.5]);

    // Cleanup phase: Fade out the container content at the end
    const contentFadeOut = useTransform(smoothProgress, [0.8, 0.95], [1, 0]);

    return (
        <section
            ref={containerRef}
            className={`relative ${theme.bg} ${theme.text} h-[450vh] mb-0 overflow-visible z-10`}
        >
            {/* Sticky Animation Container */}
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

                {/* Hintergrund-Beschriftung (Erscheint nur im initialen Modus) */}
                <motion.div
                    style={{ opacity: textOpacity, scale: textScale }}
                    className="absolute inset-0 flex items-center justify-center z-0"
                >
                    <h2 className="text-[10rem] md:text-[16rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-foreground via-foreground/80 to-foreground/60 select-none text-center leading-[0.85] tracking-tighter opacity-50">
                        NFC<br />WEAR
                    </h2>
                </motion.div>

                {/* Der Reveal-Kreis */}
                <motion.div
                    style={{
                        y: containerY,
                        scale: circleScale,
                        borderRadius: circleRadius,
                        opacity: contentFadeOut, // Fade out
                    }}
                    className={`absolute inset-0 z-20 ${theme.revealBg} flex items-center justify-center shadow-[0_-20px_100px_rgba(0,0,0,0.5)] border-t border-border`}
                >
                    {/* Inhalt innerhalb des Reveal-Kreises */}
                    <motion.div
                        style={{
                            scale: chipScale,
                            opacity: chipOpacity
                        }}
                        className="flex flex-col items-center p-6"
                    >
                        <IndustrialNfcChip progress={smoothProgress} />

                        <div className={`mt-16 text-center ${theme.revealText} max-w-2xl`}>
                            <motion.span
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-blue-500 font-bold tracking-[0.3em] text-xs uppercase mb-4 block"
                            >
                                NTAG424 DNA Technologie
                            </motion.span>

                            <h2 className="text-4xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground">
                                Unfälschbare<br />Identität.
                            </h2>


                        </div>
                    </motion.div>
                </motion.div>

            </div>

            {/* Scroll-Indikator am Fuß der ersten Sektion */}
            <motion.div
                style={{ opacity: textOpacity }}
                className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-2"
            >
                <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Scroll to Reveal</div>
                <div className="w-px h-12 bg-border" />
            </motion.div>
        </section>
    );
}
