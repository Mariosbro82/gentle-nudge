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

const CONTENT_W = 390;
const CONTENT_H = 844;
const INNER_SCALE = 280 / CONTENT_W;
const PHONE_W = Math.round(CONTENT_W * INNER_SCALE);
const PHONE_H = Math.round(CONTENT_H * INNER_SCALE);
const BORDER_RADIUS = "2.2rem";

export function PhonePreview3D({ user, className = "", scale = 1, rotateY = 0, rotateX = 0 }: PhonePreview3DProps) {
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
                    className="relative bg-black shadow-2xl shadow-black/40"
                    style={{
                        width: PHONE_W + 12,
                        height: PHONE_H + 12,
                        borderRadius: BORDER_RADIUS,
                        padding: 6,
                    }}
                >
                    {/* Inner screen bezel */}
                    <div
                        className="relative w-full h-full overflow-hidden"
                        style={{ borderRadius: "1.8rem" }}
                    >
                        {/* Dynamic Island */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[90px] h-[26px] bg-black rounded-full z-20" />

                        {/* Status bar */}
                        <div className="absolute top-1.5 left-7 right-7 flex justify-between items-center z-10 text-white/50 text-[8px] font-medium">
                            <span>9:41</span>
                            <div className="flex items-center gap-1">
                                <div className="w-3.5 h-[7px] border border-white/50 rounded-[2px]">
                                    <div className="w-[9px] h-full bg-white/50 rounded-[1px]" />
                                </div>
                            </div>
                        </div>

                        {/* Profile Content – scaled to fit inside phone screen */}
                        <div
                            className="absolute inset-0 overflow-hidden"
                            style={{ borderRadius: "inherit" }}
                        >
                            <div
                                className="origin-top-left pointer-events-none"
                                style={{
                                    width: CONTENT_W,
                                    height: CONTENT_H,
                                    transform: `scale(${INNER_SCALE})`,
                                }}
                            >
                                <Template user={user} />
                            </div>
                        </div>
                    </div>

                    {/* Screen reflection */}
                    <div
                        className="absolute inset-[6px] pointer-events-none z-10"
                        style={{
                            background: "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, transparent 35%, transparent 65%, rgba(255,255,255,0.02) 100%)",
                            borderRadius: "1.8rem",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
/** Mini version for preset cards */
export function PhonePreviewMini({ user, className = "" }: { user: ProfileUser; className?: string }) {
    const Template = useMemo(() => getTemplate(user.activeTemplate), [user.activeTemplate]);
    const MINI_W = 120;
    const MINI_H = 220;
    const miniScale = MINI_W / CONTENT_W;

    return (
        <div className={`relative ${className}`} style={{ perspective: "800px" }}>
            <div
                className="rounded-xl border-[3px] border-zinc-700 bg-black shadow-lg shadow-black/40 transition-transform duration-300 hover:scale-105"
                style={{
                    width: MINI_W,
                    height: MINI_H,
                    transform: "rotateY(-5deg) rotateX(3deg)",
                    overflow: "hidden",
                }}
            >
                <div
                    className="origin-top-left pointer-events-none"
                    style={{
                        width: CONTENT_W,
                        height: CONTENT_H,
                        transform: `scale(${miniScale})`,
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