import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const SalesforceDashboard = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Staggered entrance for dashboard elements
    const containerSpring = spring({ frame, fps, from: 0.9, to: 1, config: { damping: 20 } });
    const containerOpacity = interpolate(frame, [0, 10], [0, 1]);

    // "New Lead" Notification Badge Pop
    const badgeProgress = spring({
        frame: frame - 25,
        fps,
        config: { mass: 0.5, stiffness: 200 }
    });
    const badgeScale = interpolate(badgeProgress, [0, 1], [0, 1]);

    // Row slide in (New Lead)
    const rowProgress = spring({
        frame: frame - 15,
        fps,
        from: 0,
        to: 1,
        config: { damping: 18, stiffness: 120 },
    });

    const rowTranslateY = interpolate(rowProgress, [0, 1], [20, 0]);
    const rowOpacity = interpolate(rowProgress, [0, 1], [0, 1]);

    // Highlight flash on new row
    const highlightOpacity = interpolate(frame, [15, 25, 60], [0, 0.4, 0]);

    return (
        <AbsoluteFill className="bg-zinc-950 flex items-center justify-center p-8 overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[100px]" />

            {/* Main Dashboard UI Container */}
            <div
                className="w-full max-w-[900px] bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                style={{
                    transform: `scale(${containerSpring})`,
                    opacity: containerOpacity
                }}
            >
                {/* Header / Nav */}
                <div className="h-14 border-b border-white/5 flex items-center px-6 justify-between bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00A1E0] to-[#0077A9] flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
                                <path d="M17.8 8.6c.4-.6.7-1.3.7-2.1 0-2.2-1.8-4-4-4-1.8 0-3.3 1.2-3.8 2.8-.5-.2-1-.3-1.6-.3-2.8 0-5 2.2-5 5 0 .6.1 1.2.3 1.7-1.7.5-2.9 2.1-2.9 3.9 0 2.2 1.8 4 4 4 .4 0 .9-.1 1.3-.2.5 1.4 1.8 2.4 3.4 2.4 2.2 0 4-1.8 4-4 0-.4-.1-.9-.2-1.3 1.6-.4 2.7-1.9 2.7-3.6 0-1.7-1-3.1-2.5-3.8z" />
                            </svg>
                        </div>
                        <span className="text-white font-medium tracking-wide">Salesforce Cloud</span>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10" />
                        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 relative">
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-zinc-900 flex items-center justify-center" style={{ transform: `scale(${badgeScale})` }}>
                                <span className="text-[9px] font-bold text-white">1</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Body Content */}
                <div className="flex h-[500px]">
                    {/* Sidebar */}
                    <div className="w-56 border-r border-white/5 p-4 space-y-1 bg-zinc-900/50">
                        <div className="px-3 py-2 rounded-lg bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20">Leads</div>
                        <div className="px-3 py-2 rounded-lg text-zinc-500 hover:bg-white/5 text-sm transition-colors">Contacts</div>
                        <div className="px-3 py-2 rounded-lg text-zinc-500 hover:bg-white/5 text-sm transition-colors">Pipeline</div>
                        <div className="px-3 py-2 rounded-lg text-zinc-500 hover:bg-white/5 text-sm transition-colors">Reports</div>
                    </div>

                    {/* Main Area */}
                    <div className="flex-1 p-8 bg-zinc-950/30">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-2xl font-bold text-white mb-1">Recent Leads</h1>
                                <p className="text-zinc-500 text-sm">Real-time incoming data stream.</p>
                            </div>
                            <div className="px-4 py-2 bg-white text-zinc-950 text-sm font-semibold rounded-lg shadow-lg hover:bg-zinc-200 transition-colors">
                                Export Data
                            </div>
                        </div>

                        {/* Data Grid */}
                        <div className="w-full">
                            {/* Header Row */}
                            <div className="grid grid-cols-4 px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider border-b border-white/5">
                                <div>Lead Source</div>
                                <div>Company</div>
                                <div>Status</div>
                                <div>Timestamp</div>
                            </div>

                            {/* Alert Row (New Lead) */}
                            <div
                                className="grid grid-cols-4 px-4 py-4 items-center border-b border-white/5 relative group"
                                style={{
                                    transform: `translateY(${rowTranslateY}px)`,
                                    opacity: rowOpacity
                                }}
                            >
                                <div className="absolute inset-0 bg-blue-500/10" style={{ opacity: highlightOpacity }} />

                                <div className="flex items-center gap-3 relative z-10">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                    <span className="text-white font-medium">NFC Touchpoint</span>
                                </div>
                                <div className="text-zinc-400 relative z-10">Tech Corp GmbH</div>
                                <div className="relative z-10">
                                    <span className="px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium">
                                        Qualified
                                    </span>
                                </div>
                                <div className="text-zinc-500 text-sm font-mono relative z-10">Just now</div>
                            </div>

                            {/* Existing Rows */}
                            <div className="grid grid-cols-4 px-4 py-4 items-center border-b border-white/5 opacity-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-zinc-700" />
                                    <span className="text-zinc-300">Web Form</span>
                                </div>
                                <div className="text-zinc-500">Design Studio</div>
                                <div>
                                    <span className="px-2 py-1 rounded-full bg-zinc-800 border border-white/5 text-zinc-400 text-xs font-medium">
                                        Contacted
                                    </span>
                                </div>
                                <div className="text-zinc-600 text-sm font-mono">2m ago</div>
                            </div>
                            <div className="grid grid-cols-4 px-4 py-4 items-center border-b border-white/5 opacity-30">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-zinc-700" />
                                    <span className="text-zinc-300">Referral</span>
                                </div>
                                <div className="text-zinc-500">Agency One</div>
                                <div>
                                    <span className="px-2 py-1 rounded-full bg-zinc-800 border border-white/5 text-zinc-400 text-xs font-medium">
                                        New
                                    </span>
                                </div>
                                <div className="text-zinc-600 text-sm font-mono">15m ago</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};
