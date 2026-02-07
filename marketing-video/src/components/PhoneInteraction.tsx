import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img } from 'remotion';
import iphoneDefaultImg from '../assets/iphone-default.png';
import iphoneTappedImg from '../assets/iphone-ui.png';

export const PhoneInteraction = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Timeline:
    // 0-90: Phone (default home screen) enters slowly
    // 60-80: Tap animation
    // 80+: Switch to tapped image (profile page)

    // 1. Phone Entry (Slow motion)
    const entryProgress = spring({
        frame,
        fps,
        from: 0,
        to: 1,
        config: { mass: 3, damping: 50, stiffness: 15 },
        durationInFrames: 90
    });

    const phoneX = interpolate(entryProgress, [0, 1], [600, 0]);
    const phoneY = interpolate(entryProgress, [0, 1], [400, 0]);
    const phoneRotate = interpolate(entryProgress, [0, 1], [15, 0]);

    // 2. Tap Animation (frame 60-80)
    const tapProgress = interpolate(frame, [60, 70, 80], [0, 1, 0], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp'
    });
    const tapScale = interpolate(tapProgress, [0, 1], [1, 0.95]);
    const tapRotate = interpolate(tapProgress, [0, 1], [0, -3]);

    // 3. Image Switch (frame 80+)
    // Default image fades out, tapped image fades in
    const switchProgress = interpolate(frame, [75, 85], [0, 1], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp'
    });
    const defaultOpacity = interpolate(switchProgress, [0, 1], [1, 0]);
    const tappedOpacity = interpolate(switchProgress, [0, 1], [0, 1]);

    // Combined transform for both images
    const phoneTransform = `translateX(${phoneX}px) translateY(${phoneY}px) rotate(${phoneRotate + tapRotate}deg) scale(${tapScale})`;

    return (
        <AbsoluteFill className="flex items-center justify-center overflow-hidden">
            {/* Container for both images - NO CODED FRAME, just raw images */}
            <div
                className="relative"
                style={{
                    transform: phoneTransform,
                    width: 350,
                    height: 700
                }}
            >
                {/* Default iPhone (Home Screen) - Visible initially */}
                <Img
                    src={iphoneDefaultImg}
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{ opacity: defaultOpacity }}
                />

                {/* Tapped iPhone (Profile Page) - Visible after tap */}
                <Img
                    src={iphoneTappedImg}
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{ opacity: tappedOpacity }}
                />
            </div>
        </AbsoluteFill>
    );
};
