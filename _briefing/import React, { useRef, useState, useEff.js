import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

/**
 * Industrieller NFC Chip SVG
 * Basierend auf dem Referenzbild: Quadratische Spulen, zentraler IC, metallische Pins.
 */
const IndustrialNfcChip = ({ progress }) => {
    // Rotation gekoppelt an Scroll-Fortschritt
    const rotation = useTransform(progress, [0.2, 0.8], [-15, 15]);
    const tilt = useTransform(progress, [0.2, 0.8], [5, -5]);

    return (
        <motion.div
            className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center pointer-events-none"
            style={{ rotateZ: rotation, rotateX: tilt }}
        >
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
                    <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="white" stopOpacity="0.1" />
                        <stop offset="50%" stopColor="white" stopOpacity="0" />
                        <stop offset="100%" stopColor="white" stopOpacity="0.05" />
                    </linearGradient>
                </defs>
                <rect x="30" y="30" width="140" height="140" rx="4" fill="url(#shine)" pointerEvents="none" />
            </svg>

            {/* Zentraler hochenergetischer Glow (bleibt gleich in beiden Modi) */}
            <div className="absolute w-32 h-32 bg-blue-500/20 blur-[60px] rounded-full pointer-events-none" />
        </motion.div>
    );
};

export default function App() {
    const containerRef = useRef(null);
    const [isDarkMode, setIsDarkMode] = useState(true);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Theme-Variablen (Vermeidung von reinem #000 und #FFF)
    const theme = {
        bg: isDarkMode ? "bg-[#0a0a0a]" : "bg-[#f4f4f5]",
        text: isDarkMode ? "text-[#e5e7eb]" : "text-[#1a1a1a]",
        revealBg: isDarkMode ? "bg-[#f4f4f5]" : "bg-[#1a1a1a]",
        revealText: isDarkMode ? "text-[#1a1a1a]" : "text-[#e5e7eb]",
    };

    // Transformationen für den "Emerald" Reveal
    const circleY = useTransform(smoothProgress, [0, 0.5], ["100vh", "0vh"]);
    const circleScale = useTransform(smoothProgress, [0.4, 0.9], [0.8, 1.8]);
    const circleRadius = useTransform(smoothProgress, [0.85, 1], ["100%", "0%"]);

    const chipScale = useTransform(smoothProgress, [0.3, 0.7], [0.4, 1.1]);
    const chipOpacity = useTransform(smoothProgress, [0.3, 0.5], [0, 1]);

    return (
        <div
            ref={containerRef}
            className={`relative ${theme.bg} ${theme.text} h-[300vh] transition-colors duration-700 ease-in-out`}
        >
            {/* Theme Toggle Button */}
            <div className="fixed top-6 right-6 z-50">
                <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`p-3 rounded-full ${isDarkMode ? 'bg-zinc-800 text-yellow-400' : 'bg-zinc-200 text-indigo-600'} shadow-lg transition-all active:scale-95`}
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>

            {/* Sticky Animation Container */}
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

                {/* Hintergrund-Beschriftung (Erscheint nur im initialen Modus) */}
                <motion.div
                    style={{ opacity: useTransform(smoothProgress, [0, 0.2], [0.15, 0]) }}
                    className="absolute inset-0 flex items-center justify-center font-black text-7xl md:text-9xl uppercase tracking-tighter select-none"
                >
                    NTAG424 DNA
                </motion.div>

                {/* Der Reveal-Kreis (Emerald-Effekt) */}
                <motion.div
                    style={{
                        y: circleY,
                        scale: circleScale,
                        borderRadius: circleRadius
                    }}
                    className={`absolute inset-0 z-20 ${theme.revealBg} flex items-center justify-center shadow-[0_-20px_100px_rgba(0,0,0,0.1)]`}
                >
                    {/* Inhalt innerhalb des Reveal-Kreises */}
                    <motion.div
                        style={{
                            scale: chipScale,
                            opacity: chipOpacity
                        }}
                        className="flex flex-col items-center"
                    >
                        <IndustrialNfcChip progress={smoothProgress} />

                        <div className={`mt-12 text-center ${theme.revealText}`}>
                            <span className="text-blue-500 font-bold tracking-[0.2em] text-xs uppercase mb-2 block">
                                Hardware Excellence
                            </span>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tight">
                                Authentisch.<br />Sicher.
                            </h2>
                            <p className="mt-4 opacity-60 text-sm max-w-[280px] mx-auto leading-relaxed">
                                Der NTAG424 DNA Chip generiert bei jedem Tap eine neue, verschlüsselte URL.
                                Klonen unmöglich.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>

            </div>

            {/* Scroll-Indikator am Fuß der ersten Sektion */}
            <div className="absolute bottom-10 w-full flex flex-col items-center gap-2 opacity-30">
                <div className="text-[10px] font-bold tracking-widest uppercase">Scroll to Reveal</div>
                <div className={`w-px h-12 ${isDarkMode ? 'bg-zinc-700' : 'bg-zinc-300'}`} />
            </div>
        </div>
    );
}