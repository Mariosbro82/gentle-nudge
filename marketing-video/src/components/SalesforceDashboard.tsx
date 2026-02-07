import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const SalesforceDashboard = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // New lead appears highlight
    const highlightOpacity = interpolate(frame, [10, 20, 40], [0, 0.5, 0], {
        extrapolateRight: 'clamp',
    });

    // Row slide in
    const rowTranslateX = spring({
        frame: frame - 5,
        fps,
        from: -50,
        to: 0,
        config: { damping: 20 },
    });
    const rowOpacity = interpolate(frame, [5, 15], [0, 1], {
        extrapolateRight: 'clamp',
    });


    return (
        <AbsoluteFill className="bg-white flex items-center justify-center overflow-hidden p-12">

            {/* Mock Dashboard UI */}
            <div className="w-full max-w-4xl bg-zinc-50 border border-zinc-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full max-h-[600px]">
                {/* Header */}
                <div className="h-16 bg-white border-b border-zinc-200 flex items-center px-6 gap-4">
                    <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">SF</div>
                    <div className="text-zinc-700 font-bold">Salesforce Dashboard</div>
                </div>

                {/* Sidebar & Content */}
                <div className="flex flex-1">
                    <div className="w-48 bg-zinc-50 border-r border-zinc-200 p-4 space-y-2">
                        <div className="w-full h-8 bg-blue-100 rounded text-blue-700 text-sm flex items-center px-2">Leads</div>
                        <div className="w-full h-8 hover:bg-zinc-100 rounded text-zinc-600 text-sm flex items-center px-2">Contacts</div>
                        <div className="w-full h-8 hover:bg-zinc-100 rounded text-zinc-600 text-sm flex items-center px-2">Opportunities</div>
                    </div>

                    <div className="flex-1 p-8 bg-white">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-zinc-800">Recent Leads</h2>
                            <div className="w-32 h-8 bg-blue-600 rounded text-white text-sm flex items-center justify-center">New Lead</div>
                        </div>

                        {/* Table Header */}
                        <div className="grid grid-cols-4 gap-4 pb-2 border-b border-zinc-200 mb-4 text-sm font-semibold text-zinc-500">
                            <div>Name</div>
                            <div>Company</div>
                            <div>Source</div>
                            <div>Status</div>
                        </div>

                        {/* Recent Leads Rows */}
                        <div className="space-y-3">
                            {/* New Lead (Animated) */}
                            <div
                                className="grid grid-cols-4 gap-4 py-3 border-b border-zinc-100 items-center relative"
                                style={{
                                    transform: `translateX(${rowTranslateX}px)`,
                                    opacity: rowOpacity
                                }}
                            >
                                <div className="absolute inset-0 bg-blue-50 pointer-events-none" style={{ opacity: highlightOpacity }} />
                                <div className="font-medium text-zinc-900 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    John Doe
                                </div>
                                <div className="text-zinc-600">Tech Corp</div>
                                <div className="text-zinc-600">NFC Touchpoint</div>
                                <div className="text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs w-fit">New</div>
                            </div>

                            {/* Old Lead 1 */}
                            <div className="grid grid-cols-4 gap-4 py-3 border-b border-zinc-100 items-center opacity-50">
                                <div className="font-medium text-zinc-900">Sarah Smith</div>
                                <div className="text-zinc-600">Design Co</div>
                                <div className="text-zinc-600">Web Form</div>
                                <div className="text-zinc-500 bg-zinc-100 px-2 py-1 rounded text-xs w-fit">Contacted</div>
                            </div>
                            {/* Old Lead 2 */}
                            <div className="grid grid-cols-4 gap-4 py-3 border-b border-zinc-100 items-center opacity-50">
                                <div className="font-medium text-zinc-900">Mike Johnson</div>
                                <div className="text-zinc-600">Finance Inc</div>
                                <div className="text-zinc-600">Referral</div>
                                <div className="text-zinc-500 bg-zinc-100 px-2 py-1 rounded text-xs w-fit">Qualified</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};
