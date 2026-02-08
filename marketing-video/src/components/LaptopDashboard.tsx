import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const LaptopDashboard = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Window entrance — subtle scale-up
    const windowProgress = spring({
        frame,
        fps,
        from: 0,
        to: 1,
        config: { damping: 25, stiffness: 100 }
    });
    const windowScale = interpolate(windowProgress, [0, 1], [0.95, 1]);
    const windowOpacity = interpolate(windowProgress, [0, 1], [0, 1]);

    // New lead row animation — delayed spring entrance
    const rowProgress = spring({
        frame: frame - 40,
        fps,
        from: 0,
        to: 1,
        config: { damping: 18, stiffness: 80 }
    });

    const rowOpacity = interpolate(rowProgress, [0, 1], [0, 1]);
    const rowTranslateX = interpolate(rowProgress, [0, 1], [-20, 0]);
    const rowTranslateY = interpolate(rowProgress, [0, 1], [-8, 0]);

    // Highlight pulse — sweeps across the row
    const highlightOpacity = interpolate(frame, [40, 55, 90], [0, 0.5, 0], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
    });

    // Green dot pulse (replaces CSS animate-pulse)
    const dotCycle = frame % 45;
    const dotOpacity = interpolate(dotCycle, [0, 22, 45], [0.6, 1, 0.6]);
    const dotScale = interpolate(dotCycle, [0, 22, 45], [0.8, 1.2, 0.8]);

    // Notification badge pop-in
    const badgeProgress = spring({
        frame: frame - 35,
        fps,
        from: 0,
        to: 1,
        config: { damping: 12, stiffness: 200 }
    });
    const badgeScale = interpolate(badgeProgress, [0, 1], [0, 1]);

    return (
        <AbsoluteFill className="bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 flex items-center justify-center p-8">
            {/* macOS Window - Full Browser Look */}
            <div
                className="relative w-full max-w-5xl"
                style={{
                    transform: `scale(${windowScale})`,
                    opacity: windowOpacity,
                }}
            >
                {/* Window Shadow */}
                <div className="absolute inset-0 bg-black/40 rounded-xl blur-2xl translate-y-6 scale-[0.98]" />

                {/* Main Window */}
                <div className="relative bg-zinc-100 rounded-xl overflow-hidden shadow-2xl border border-zinc-300">
                    {/* macOS Title Bar */}
                    <div className="flex items-center h-10 bg-gradient-to-b from-zinc-200 to-zinc-300 border-b border-zinc-400 px-4">
                        {/* Traffic Lights */}
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500 border border-red-600" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500 border border-yellow-600" />
                            <div className="w-3 h-3 rounded-full bg-green-500 border border-green-600" />
                        </div>

                        {/* URL Bar */}
                        <div className="flex-1 flex justify-center">
                            <div className="flex items-center gap-2 bg-white/80 rounded-md px-4 py-1 min-w-[300px] border border-zinc-300">
                                <svg className="w-3 h-3 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span className="text-xs text-zinc-500">salesforce.com/leads</span>
                            </div>
                        </div>

                        {/* Spacer for symmetry */}
                        <div className="w-14" />
                    </div>

                    {/* Dashboard Content */}
                    <div className="flex h-[420px]">
                        {/* Sidebar */}
                        <div className="w-44 bg-zinc-800 p-3 flex flex-col gap-1">
                            <div className="flex items-center gap-2 mb-4 px-2">
                                <div className="w-7 h-7 bg-gradient-to-br from-blue-400 to-blue-600 rounded flex items-center justify-center text-white text-[10px] font-bold">SF</div>
                                <span className="text-white font-semibold text-sm">Salesforce</span>
                            </div>
                            <div className="px-3 py-1.5 bg-blue-600/30 text-blue-400 rounded text-xs font-medium relative">
                                Leads
                                {/* Notification badge */}
                                <div
                                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                                    style={{
                                        transform: `scale(${badgeScale})`,
                                    }}
                                >
                                    <span className="text-white text-[8px] font-bold">1</span>
                                </div>
                            </div>
                            <div className="px-3 py-1.5 text-zinc-400 text-xs">Contacts</div>
                            <div className="px-3 py-1.5 text-zinc-400 text-xs">Opportunities</div>
                            <div className="px-3 py-1.5 text-zinc-400 text-xs">Reports</div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 p-5 bg-zinc-50">
                            <div className="flex justify-between items-center mb-3">
                                <h1 className="text-lg font-bold text-zinc-800">Recent Leads</h1>
                                <div className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium">+ New Lead</div>
                            </div>

                            {/* Table */}
                            <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
                                {/* Header */}
                                <div className="grid grid-cols-5 gap-2 px-3 py-2 bg-zinc-50 border-b border-zinc-200 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide">
                                    <div>Name</div>
                                    <div>Company</div>
                                    <div>Source</div>
                                    <div>Status</div>
                                    <div>Added</div>
                                </div>

                                {/* New Lead Row (Animated) */}
                                <div
                                    className="grid grid-cols-5 gap-2 px-3 py-2 border-b border-zinc-100 items-center relative"
                                    style={{
                                        opacity: rowOpacity,
                                        transform: `translateX(${rowTranslateX}px) translateY(${rowTranslateY}px)`
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-transparent" style={{ opacity: highlightOpacity }} />

                                    <div className="flex items-center gap-1.5 relative z-10">
                                        <div
                                            className="w-1.5 h-1.5 rounded-full bg-green-500"
                                            style={{
                                                opacity: dotOpacity,
                                                transform: `scale(${dotScale})`,
                                            }}
                                        />
                                        <span className="font-semibold text-zinc-900 text-xs">Max Mustermann</span>
                                    </div>
                                    <div className="text-zinc-600 text-xs relative z-10">Corporate Fashion</div>
                                    <div className="relative z-10">
                                        <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px] font-medium">NFC Tap</span>
                                    </div>
                                    <div className="relative z-10">
                                        <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-medium">New</span>
                                    </div>
                                    <div className="text-zinc-500 text-[10px] relative z-10">Just now</div>
                                </div>

                                {/* Existing Rows */}
                                <div className="grid grid-cols-5 gap-2 px-3 py-2 border-b border-zinc-100 items-center opacity-40">
                                    <div className="font-medium text-zinc-900 text-xs">Sarah Schmidt</div>
                                    <div className="text-zinc-600 text-xs">Design Studio</div>
                                    <div><span className="px-1.5 py-0.5 bg-zinc-100 text-zinc-600 rounded text-[10px]">Web</span></div>
                                    <div><span className="px-1.5 py-0.5 bg-zinc-100 text-zinc-600 rounded text-[10px]">Contacted</span></div>
                                    <div className="text-zinc-500 text-[10px]">2h ago</div>
                                </div>

                                <div className="grid grid-cols-5 gap-2 px-3 py-2 items-center opacity-40">
                                    <div className="font-medium text-zinc-900 text-xs">Thomas Weber</div>
                                    <div className="text-zinc-600 text-xs">Tech Industries</div>
                                    <div><span className="px-1.5 py-0.5 bg-zinc-100 text-zinc-600 rounded text-[10px]">Referral</span></div>
                                    <div><span className="px-1.5 py-0.5 bg-zinc-100 text-zinc-600 rounded text-[10px]">Qualified</span></div>
                                    <div className="text-zinc-500 text-[10px]">Yesterday</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};
