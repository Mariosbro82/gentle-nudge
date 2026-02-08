import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, Easing } from 'remotion';
import iphoneDefaultImg from '../assets/iphone-default.png';
import iphoneTappedImg from '../assets/iphone-ui.png';

export const PhoneInteraction = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Timeline:
    // 0-90: Phone (default home screen) enters with spring physics
    // 60-80: Tap animation (press down + release)
    // 75-90: Screen switches with flash effect
    // 90+: Settled with profile visible

    // 1. Phone Entry - smooth spring from bottom
    const entryProgress = spring({
        frame,
        fps,
        from: 0,
        to: 1,
        config: { mass: 2, damping: 28, stiffness: 80 },
        durationInFrames: 70
    });

    const phoneY = interpolate(entryProgress, [0, 1], [1500, 0]); // Enter from bottom
    const phoneRotate = interpolate(entryProgress, [0, 1], [5, 0]);

    // Phone shadow grows as it "lands"
    const shadowBlur = interpolate(entryProgress, [0, 0.8, 1], [5, 60, 50]);
    const shadowOpacity = interpolate(entryProgress, [0, 1], [0.1, 0.5]);

    // 2. Tap Animation (frame 60-80) — slightly longer and punchier
    const tapDown = interpolate(frame, [60, 68], [0, 1], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
        easing: Easing.out(Easing.cubic),
    });
    const tapUp = interpolate(frame, [68, 80], [0, 1], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
        easing: Easing.out(Easing.bounce),
    });
    const tapProgress = tapDown * (1 - tapUp);
    const tapScale = interpolate(tapProgress, [0, 1], [1, 0.96]);
    const tapRotate = interpolate(tapProgress, [0, 1], [0, -1]);

    // 3. Screen flash on tap (brief white flash at moment of tap)
    const flashOpacity = interpolate(frame, [67, 70, 78], [0, 0.6, 0], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
    });

    // 4. Image Switch (frame 75-90) — slightly slower crossfade
    const switchProgress = interpolate(frame, [72, 88], [0, 1], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
        easing: Easing.inOut(Easing.cubic),
    });
    const defaultOpacity = interpolate(switchProgress, [0, 1], [1, 0]);
    const tappedOpacity = interpolate(switchProgress, [0, 1], [0, 1]);

    // Combined transform (Scale 1.8x for larger presence in 1080p)
    const baseScale = 1.8;
    const phoneTransform = `translateY(${phoneY}px) rotate(${phoneRotate + tapRotate}deg) scale(${baseScale * tapScale})`;

    return (
        <AbsoluteFill className="flex items-center justify-center overflow-hidden">
            {/* Phone container with dynamic shadow */}
            <div
                className="relative"
                style={{
                    transform: phoneTransform,
                    width: 350,
                    height: 700,
                    filter: `drop-shadow(0 ${shadowBlur}px ${shadowBlur * 1.5}px rgba(0,0,0,${shadowOpacity}))`,
                }}
            >
                {/* Default iPhone (Home Screen) */}
                <Img
                    src={iphoneDefaultImg}
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{ opacity: defaultOpacity }}
                />

                {/* Tapped iPhone (Profile Page) */}
                <Img
                    src={iphoneTappedImg}
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{ opacity: tappedOpacity }}
                />

                {/* Tap flash effect */}
                <div
                    className="absolute inset-0 rounded-[40px] pointer-events-none"
                    style={{
                        backgroundColor: 'rgba(255,255,255,1)',
                        opacity: flashOpacity,
                    }}
                />
            </div>
        </AbsoluteFill>
    );
};
