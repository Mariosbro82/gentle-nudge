import { useMemo } from "react";
import type { ProfileUser } from "@/types/profile";
import { getTemplate } from "@/components/profile/templates";

interface PhonePreview3DProps {
    user: ProfileUser;
    className?: string;
    scale?: number;
    rotateY?: number;
    rotateX?: number;
}

export function PhonePreview3D({ user, className = "", scale = 1, rotateY = -8, rotateX = 5 }: PhonePreview3DProps) {
    const Template = useMemo(() => getTemplate(user.activeTemplate), [user.activeTemplate]);

    return (
        <div className={`flex items-center justify-center ${className}`} style={{ perspective: "1200px" }}>
            <div
                className="relative transition-transform duration-500 ease-out"
                style={{
                    transform: `rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(${scale})`,
                    transformStyle: "preserve-3d",
                }}
            >
                {/* Phone Frame */}
                <div
                    className="relative rounded-[2.5rem] border-[6px] border-zinc-800 bg-black overflow-hidden shadow-2xl shadow-black/60"
                    style={{
                        width: 280,
                        height: 580,
                    }}
                >
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl z-20" />

                    {/* Status bar */}
                    <div className="absolute top-1 left-8 right-8 flex justify-between items-center z-10 text-white/60 text-[8px] px-1">
                        <span>9:41</span>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-1.5 border border-white/60 rounded-sm">
                                <div className="w-2 h-full bg-white/60 rounded-sm" />
                            </div>
                        </div>
                    </div>

                    {/* Profile Content - scrollable iframe-like container */}
                    <div className="w-full h-full overflow-hidden">
                        <div
                            className="origin-top-left"
                            style={{
                                width: 390,
                                height: 844,
                                transform: `scale(${280 / 390})`,
                            }}
                        >
                            <Template user={user} />
                        </div>
                    </div>

                    {/* Screen reflection */}
                    <div
                        className="absolute inset-0 pointer-events-none z-10"
                        style={{
                            background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.03) 100%)",
                        }}
                    />
                </div>

                {/* 3D Shadow */}
                <div
                    className="absolute -bottom-4 left-4 right-4 h-8 rounded-full blur-2xl opacity-40 bg-black"
                    style={{ transform: "translateZ(-20px)" }}
                />
            </div>
        </div>
    );
}

/** Mini version for preset cards */
export function PhonePreviewMini({ user, className = "" }: { user: ProfileUser; className?: string }) {
    const Template = useMemo(() => getTemplate(user.activeTemplate), [user.activeTemplate]);

    return (
        <div className={`relative ${className}`} style={{ perspective: "800px" }}>
            <div
                className="rounded-xl border-[3px] border-zinc-700 bg-black overflow-hidden shadow-lg shadow-black/40 transition-transform duration-300 hover:scale-105"
                style={{
                    width: 120,
                    height: 220,
                    transform: "rotateY(-5deg) rotateX(3deg)",
                }}
            >
                <div
                    className="origin-top-left pointer-events-none"
                    style={{
                        width: 390,
                        height: 844,
                        transform: `scale(${120 / 390})`,
                    }}
                >
                    <Template user={user} />
                </div>
                {/* Reflection */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)",
                    }}
                />
            </div>
        </div>
    );
}
