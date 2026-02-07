import { AbsoluteFill, useCurrentFrame, interpolate, Img } from 'remotion';
import { NFCChip } from './NFCChip';
import hoodieImg from '../assets/hoodie.png';

export const SleeveCloseUp = () => {
    const frame = useCurrentFrame();

    // Animation: Start with full hoodie, zoom to RIGHT sleeve cuff
    // Frame 0-90: Zoom animation

    const zoomProgress = interpolate(frame, [0, 90], [0, 1], {
        extrapolateRight: 'clamp',
    });

    // Scale: Start at 1 (full hoodie), zoom to 12x for extreme close-up on cuff
    const scale = interpolate(zoomProgress, [0, 1], [1, 12]);

    // EVEN MORE: to the RIGHT and DOWNWARDS for cuff edge
    // translateX negative = moves image LEFT, shows RIGHT side
    // translateY negative = moves image UP, shows BOTTOM
    const translateX = interpolate(zoomProgress, [0, 1], [0, -850]); // Max right
    const translateY = interpolate(zoomProgress, [0, 1], [0, -600]); // Max down

    // Chip fades in
    const chipOpacity = interpolate(frame, [70, 100], [0, 1], {
        extrapolateRight: 'clamp',
    });
    const chipScale = interpolate(frame, [70, 100], [0.3, 0.7], {
        extrapolateRight: 'clamp',
    });

    // Chip position - BOTTOM RIGHT CORNER (cuff area)
    const chipOffsetX = 180;  // Far right
    const chipOffsetY = 200;  // Far down

    return (
        <AbsoluteFill className="bg-zinc-100 overflow-hidden">
            {/* Hoodie Image - zooming to right sleeve cuff */}
            <AbsoluteFill style={{
                transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`,
                transformOrigin: 'center center',
            }}>
                <Img src={hoodieImg} className="w-full h-full object-contain" />
            </AbsoluteFill>

            {/* NFC Chip - positioned at cuff edge (bottom-right) */}
            <AbsoluteFill className="flex items-center justify-center">
                <div style={{
                    opacity: chipOpacity,
                    transform: `scale(${chipScale}) translate(${chipOffsetX}px, ${chipOffsetY}px)`,
                }}>
                    <NFCChip />
                    <div className="absolute inset-0 -z-10 animate-ping opacity-20 bg-blue-500 rounded-full blur-xl" />
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
