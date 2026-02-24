import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

/**
 * Spektakulärer NFC Chip mit animierten Wellen, Glow und Partikel-Effekten
 */
const IndustrialNfcChip = ({ progress }: { progress: any }) => {
    const rotation = useTransform(progress, [0.2, 0.8], [-12, 12]);
    const tilt = useTransform(progress, [0.2, 0.8], [5, -5]);

    return (
        <motion.div
            className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center pointer-events-none"
            style={{ rotateZ: rotation, rotateX: tilt }}
        >
            {/* Äußere pulsierende NFC-Wellen */}
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={`wave-${i}`}
                    className="absolute inset-0 rounded-2xl border border-blue-500/30"
                    animate={{
                        scale: [1, 1.3 + i * 0.15, 1.6 + i * 0.2],
                        opacity: [0.4, 0.15, 0],
                    }}
                    transition={{
                        duration: 2.5,
                        delay: i * 0.6,
                        repeat: Infinity,
                        ease: "easeOut",
                    }}
                />
            ))}

            {/* Großer äußerer Glow */}
            <div className="absolute w-64 h-64 md:w-80 md:h-80 bg-blue-500/8 blur-[80px] rounded-full" />

            {/* Floating Partikel / Sparks */}
            {[...Array(8)].map((_, i) => {
                const angle = (i / 8) * 360;
                const rad = (angle * Math.PI) / 180;
                const radius = 140;
                return (
                    <motion.div
                        key={`spark-${i}`}
                        className="absolute w-1 h-1 rounded-full bg-blue-400"
                        style={{
                            left: '50%',
                            top: '50%',
                        }}
                        animate={{
                            x: [Math.cos(rad) * 80, Math.cos(rad) * radius, Math.cos(rad) * 80],
                            y: [Math.sin(rad) * 80, Math.sin(rad) * radius, Math.sin(rad) * 80],
                            opacity: [0, 0.8, 0],
                            scale: [0.5, 1.5, 0.5],
                        }}
                        transition={{
                            duration: 3,
                            delay: i * 0.35,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                );
            })}

            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_20px_60px_rgba(59,130,246,0.15)]">
                <defs>
                    {/* Animierter Gradient für Spulen */}
                    <linearGradient id="coil-active" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9">
                            <animate attributeName="stopColor" values="#3b82f6;#60a5fa;#fbbf24;#3b82f6" dur="4s" repeatCount="indefinite" />
                        </stop>
                        <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.7">
                            <animate attributeName="stopColor" values="#fbbf24;#3b82f6;#60a5fa;#fbbf24" dur="4s" repeatCount="indefinite" />
                        </stop>
                        <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.9">
                            <animate attributeName="stopColor" values="#60a5fa;#fbbf24;#3b82f6;#60a5fa" dur="4s" repeatCount="indefinite" />
                        </stop>
                    </linearGradient>

                    {/* Glow-Filter */}
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>

                    {/* Starker Glow für den IC */}
                    <filter id="ic-glow">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Shine-Gradient */}
                    <linearGradient id="shine-sweep" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="white" stopOpacity="0">
                            <animate attributeName="offset" values="-0.5;1.5" dur="3s" repeatCount="indefinite" />
                        </stop>
                        <stop offset="15%" stopColor="white" stopOpacity="0.12">
                            <animate attributeName="offset" values="-0.35;1.65" dur="3s" repeatCount="indefinite" />
                        </stop>
                        <stop offset="30%" stopColor="white" stopOpacity="0">
                            <animate attributeName="offset" values="-0.2;1.8" dur="3s" repeatCount="indefinite" />
                        </stop>
                    </linearGradient>
                </defs>

                {/* Chip-Substrat */}
                <rect x="30" y="30" width="140" height="140" rx="6" fill="#09090b" stroke="#27272a" strokeWidth="1" />

                {/* Animierte Antennen-Spulen mit Strich-Animation */}
                {[0, 1, 2, 3, 4, 5].map((i) => (
                    <rect
                        key={i}
                        x={40 + i * 6}
                        y={40 + i * 6}
                        width={120 - i * 12}
                        height={120 - i * 12}
                        rx="2"
                        fill="none"
                        stroke="url(#coil-active)"
                        strokeWidth="1.5"
                        opacity={0.7 - i * 0.06}
                        filter="url(#glow)"
                        strokeDasharray="480"
                        strokeDashoffset="0"
                    >
                        <animate
                            attributeName="stroke-dashoffset"
                            values="480;0"
                            dur={`${2 + i * 0.3}s`}
                            repeatCount="indefinite"
                        />
                    </rect>
                ))}

                {/* Verbindungstrace zur Mitte */}
                <path d="M100 40 L100 75" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" filter="url(#glow)">
                    <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
                </path>

                {/* Zentraler IC mit Glow */}
                <rect x="75" y="75" width="50" height="50" rx="3" fill="#18181b" stroke="#3b82f6" strokeWidth="0.5" filter="url(#ic-glow)" opacity="0.9">
                    <animate attributeName="stroke-opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
                </rect>

                {/* IC Pins */}
                {[0, 1, 2, 3].map(i => (
                    <React.Fragment key={i}>
                        <rect x="70" y={80 + i * 10} width="6" height="3" rx="0.5" fill="#a1a1aa">
                            <animate attributeName="fill" values="#a1a1aa;#60a5fa;#a1a1aa" dur="2s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
                        </rect>
                        <rect x="124" y={80 + i * 10} width="6" height="3" rx="0.5" fill="#a1a1aa">
                            <animate attributeName="fill" values="#a1a1aa;#60a5fa;#a1a1aa" dur="2s" begin={`${i * 0.2 + 0.1}s`} repeatCount="indefinite" />
                        </rect>
                    </React.Fragment>
                ))}

                {/* NFCWEAR Text */}
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

                {/* Laufender Shine-Effekt */}
                <rect x="30" y="30" width="140" height="140" rx="6" fill="url(#shine-sweep)" pointerEvents="none" />
            </svg>

            {/* Inner Glow */}
            <motion.div
                className="absolute w-24 h-24 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)' }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
        </motion.div>
    );
};

export function ScrollTextReveal() {
    const containerRef = useRef(null);

    const theme = {
        bg: "bg-background",
        text: "text-foreground",
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

    const containerY = useTransform(smoothProgress, [0, 0.5, 0.8, 1], ["100vh", "0vh", "0vh", "-100vh"]);
    const circleScale = useTransform(smoothProgress, [0.4, 0.9], [0.8, 1.5]);
    const circleRadius = useTransform(smoothProgress, [0.85, 1], ["50%", "0%"]);
    const chipScale = useTransform(smoothProgress, [0.3, 0.7], [0.5, 1.2]);
    const chipOpacity = useTransform(smoothProgress, [0.3, 0.5], [0, 1]);
    const textOpacity = useTransform(smoothProgress, [0, 0.3], [1, 0]);
    const textScale = useTransform(smoothProgress, [0, 0.3], [1, 1.5]);
    const contentFadeOut = useTransform(smoothProgress, [0.8, 0.95], [1, 0]);

    return (
        <section
            ref={containerRef}
            className={`relative ${theme.bg} ${theme.text} h-[450vh] mb-0 overflow-visible z-10`}
        >
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
                <motion.div
                    style={{ opacity: textOpacity, scale: textScale }}
                    className="absolute inset-0 flex items-center justify-center z-0"
                >
                    <h2 className="text-[10rem] md:text-[16rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-foreground via-foreground/80 to-foreground/60 select-none text-center leading-[0.85] tracking-tighter opacity-50">
                        NFC<br />WEAR
                    </h2>
                </motion.div>

                <motion.div
                    style={{
                        y: containerY,
                        scale: circleScale,
                        borderRadius: circleRadius,
                        opacity: contentFadeOut,
                    }}
                    className="absolute inset-0 z-20 flex items-center justify-center"
                >
                    <motion.div
                        style={{ scale: chipScale, opacity: chipOpacity }}
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
                            <h2 className="text-4xl md:text-7xl font-extrabold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground">
                                Unfälschbare<br />Identität.
                            </h2>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

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
