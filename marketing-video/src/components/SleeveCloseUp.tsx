import { AbsoluteFill, useCurrentFrame, interpolate, Img, Easing, useVideoConfig } from 'remotion';
import { NFCChip } from './NFCChip';
import hoodieImg from '../assets/hoodie.png';

export const SleeveCloseUp = () => {
    const frame = useCurrentFrame();

    // Animation: Start with full hoodie, zoom to RIGHT sleeve cuff
    // Frame 0-90: Zoom animation with cinematic ease-out
    const zoomProgress = interpolate(frame, [0, 90], [0, 1], {
        extrapolateRight: 'clamp',
        easing: Easing.out(Easing.cubic),
    });

    // Scale: Start at 1.8 (to fill vertical height), zoom to 15x for extreme close-up on cuff
    const scale = interpolate(zoomProgress, [0, 1], [1.8, 15]);

    // Pan to center on the chip position 
    // Pan to center on the chip position 
    // Adjusted: Move significantly more RIGHT (more negative X) and DOWN (more negative Y)
    const translateX = interpolate(zoomProgress, [0, 1], [0, -2200]);
    const translateY = interpolate(zoomProgress, [0, 1], [200, -2100]);

    // X-Ray / Tech Reveal Effect (Frame 60-120)
    // Turns image dark/blue/grayscale to simulate scanning
    const xrayProgress = interpolate(frame, [60, 90], [0, 1], { extrapolateRight: 'clamp' });
    const grayscale = xrayProgress * 100;
    const brightness = interpolate(xrayProgress, [0, 1], [1, 0.4]);
    const xrayColor = interpolate(xrayProgress, [0, 1], [0, 0.3]); // Blue tint opacity

    // Chip fades in
    const chipOpacity = interpolate(frame, [70, 100], [0, 1], {
        extrapolateRight: 'clamp',
        easing: Easing.out(Easing.cubic),
    });
    const chipScale = interpolate(frame, [70, 100], [0.5, 1], {
        extrapolateRight: 'clamp',
        easing: Easing.out(Easing.back(1.5)),
    });

    return (
        <AbsoluteFill className="bg-zinc-900 overflow-hidden">
            {/* Hoodie Image - zooming to right sleeve cuff */}
            <AbsoluteFill style={{
                transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`,
                transformOrigin: 'center center',
            }}>
                <Img
                    src={hoodieImg}
                    className="w-full h-full object-contain"
                    style={{
                        filter: `grayscale(${grayscale}%) brightness(${brightness}) contrast(1.2)`,
                    }}
                />
            </AbsoluteFill>

            {/* X-Ray Blue Tint Overlay */}
            <AbsoluteFill
                style={{ backgroundColor: '#3b82f6', opacity: xrayColor, mixBlendMode: 'overlay' }}
            />

            {/* NFC Chip */}
            <AbsoluteFill className="flex items-center justify-center">
                <div style={{
                    opacity: chipOpacity,
                    transform: `scale(${chipScale})`,
                }}>
                    <NFCChip />
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
