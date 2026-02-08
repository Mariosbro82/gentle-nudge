export function GhostPage() {
    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white overflow-hidden">
            <div className="text-center max-w-sm px-6">
                {/* Animated Ghost SVG */}
                <div className="relative mb-8 flex justify-center">
                    <svg
                        width="160"
                        height="180"
                        viewBox="0 0 160 180"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="animate-ghost-float drop-shadow-[0_0_40px_rgba(139,92,246,0.3)]"
                    >
                        {/* Ghost body */}
                        <path
                            d="M80 10C46.86 10 20 36.86 20 70V140C20 142 21.5 143 23 142L40 130C42 128.5 44 128.5 46 130L60 140C62 141.5 64 141.5 66 140L80 130C82 128.5 84 128.5 86 130L100 140C102 141.5 104 141.5 106 140L120 130C122 128.5 124 128.5 126 130L140 142C141.5 143 143 142 143 140V70C143 36.86 116.14 10 80 10Z"
                            fill="url(#ghost-gradient)"
                            className="animate-ghost-shimmer"
                        />

                        {/* Left eye */}
                        <ellipse cx="60" cy="70" rx="10" ry="12" fill="#1e1b4b" />
                        <ellipse cx="63" cy="67" rx="4" ry="5" fill="white" opacity="0.9" />

                        {/* Right eye */}
                        <ellipse cx="100" cy="70" rx="10" ry="12" fill="#1e1b4b" />
                        <ellipse cx="103" cy="67" rx="4" ry="5" fill="white" opacity="0.9" />

                        {/* Smile */}
                        <path
                            d="M65 95 Q80 110 95 95"
                            stroke="#1e1b4b"
                            strokeWidth="3"
                            strokeLinecap="round"
                            fill="none"
                        />

                        {/* Blush */}
                        <ellipse cx="50" cy="90" rx="8" ry="5" fill="#c084fc" opacity="0.3" />
                        <ellipse cx="110" cy="90" rx="8" ry="5" fill="#c084fc" opacity="0.3" />

                        {/* Gradient definition */}
                        <defs>
                            <linearGradient id="ghost-gradient" x1="20" y1="10" x2="143" y2="142" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#e0e7ff" />
                                <stop offset="50%" stopColor="#c7d2fe" />
                                <stop offset="100%" stopColor="#a5b4fc" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Sparkle particles */}
                    <div className="absolute top-0 left-1/4 w-2 h-2 bg-violet-400 rounded-full animate-sparkle-1 opacity-60" />
                    <div className="absolute top-8 right-1/4 w-1.5 h-1.5 bg-indigo-300 rounded-full animate-sparkle-2 opacity-40" />
                    <div className="absolute bottom-12 left-1/3 w-1 h-1 bg-purple-300 rounded-full animate-sparkle-3 opacity-50" />
                </div>

                <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent">
                    Boo! Dieses Profil ist unsichtbar.
                </h1>
                <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
                    Der Besitzer hat den Ghost-Modus aktiviert.
                    <br />
                    Schau später nochmal vorbei!
                </p>
                <a
                    href="https://nfc.severmore.de"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full font-medium hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/25"
                >
                    Mehr erfahren
                </a>
            </div>

            <style>{`
                @keyframes ghost-float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-12px); }
                }
                @keyframes sparkle-1 {
                    0%, 100% { transform: scale(0) translateY(0); opacity: 0; }
                    50% { transform: scale(1) translateY(-20px); opacity: 0.6; }
                }
                @keyframes sparkle-2 {
                    0%, 100% { transform: scale(0) translateY(0); opacity: 0; }
                    50% { transform: scale(1) translateY(-15px); opacity: 0.4; }
                }
                @keyframes sparkle-3 {
                    0%, 100% { transform: scale(0) translateY(0); opacity: 0; }
                    50% { transform: scale(1) translateY(-10px); opacity: 0.5; }
                }
                .animate-ghost-float { animation: ghost-float 3s ease-in-out infinite; }
                .animate-sparkle-1 { animation: sparkle-1 2s ease-in-out infinite; }
                .animate-sparkle-2 { animation: sparkle-2 2.5s ease-in-out infinite 0.5s; }
                .animate-sparkle-3 { animation: sparkle-3 3s ease-in-out infinite 1s; }
            `}</style>
        </div>
    );
}
