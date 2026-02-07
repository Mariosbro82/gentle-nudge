import { AbsoluteFill, useCurrentFrame, interpolate, Sequence, spring, useVideoConfig } from 'remotion';
import { SleeveCloseUp } from './components/SleeveCloseUp';
import { PhoneInteraction } from './components/PhoneInteraction';
import { LaptopDashboard } from './components/LaptopDashboard';

// Text Overlay Component
const FinalTextOverlay = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textProgress = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: { damping: 20 }
  });

  const opacity = interpolate(textProgress, [0, 1], [0, 1]);
  const translateY = interpolate(textProgress, [0, 1], [30, 0]);
  const subtitleDelay = spring({
    frame: frame - 15,
    fps,
    from: 0,
    to: 1,
    config: { damping: 18 }
  });
  const subtitleOpacity = interpolate(subtitleDelay, [0, 1], [0, 1]);

  return (
    <AbsoluteFill className="bg-gradient-to-br from-zinc-900 via-black to-zinc-900 flex items-center justify-center">
      <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
      <div
        className="text-center px-8 relative z-10"
        style={{
          opacity,
          transform: `translateY(${translateY}px)`
        }}
      >
        <h1 className="text-6xl font-bold text-white mb-6 tracking-tight">
          <span className="text-blue-400">Tap.</span> Connect. <span className="text-purple-400">Sync.</span>
        </h1>
        <p
          className="text-2xl text-zinc-400 font-light"
          style={{ opacity: subtitleOpacity }}
        >
          Keine App nötig. Funktioniert auf jedem Smartphone.
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Transition Component - Cool zoom/blur effect
const DashboardTransition = () => {
  const frame = useCurrentFrame();

  // Start with bright flash/white, then fade to reveal dashboard
  const flashOpacity = interpolate(frame, [0, 10, 30], [1, 0.8, 0], { extrapolateRight: 'clamp' });
  const blurAmount = interpolate(frame, [0, 30], [20, 0], { extrapolateRight: 'clamp' });
  const scaleIn = interpolate(frame, [0, 30], [1.2, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      {/* Dashboard with transition effect */}
      <div style={{
        filter: `blur(${blurAmount}px)`,
        transform: `scale(${scaleIn})`,
        width: '100%',
        height: '100%'
      }}>
        <LaptopDashboard />
      </div>

      {/* White flash overlay */}
      <AbsoluteFill
        className="bg-white pointer-events-none"
        style={{ opacity: flashOpacity }}
      />
    </AbsoluteFill>
  );
};

export const MyComposition = () => {
  return (
    <AbsoluteFill className="bg-zinc-900">
      {/* Phase 1: Sleeve + Chip - EXTENDED to cover full phone sequence */}
      {/* SleeveCloseUp now runs from 0 to 280 to ensure no black gap */}
      <Sequence from={0} durationInFrames={280}>
        <SleeveCloseUp />
      </Sequence>

      {/* Phase 2: Phone Entry + Interaction (90-270f = 3-9s) */}
      {/* Phone appears ON TOP of the sleeve background */}
      <Sequence from={90} durationInFrames={180}>
        <PhoneInteraction />
      </Sequence>

      {/* Phase 3: Salesforce Dashboard with Cool Transition (270-420f = 9-14s) */}
      <Sequence from={270} durationInFrames={150}>
        <DashboardTransition />
      </Sequence>

      {/* Phase 4: Final Text Overlay (420-540f = 14-18s) */}
      <Sequence from={420} durationInFrames={120}>
        <FinalTextOverlay />
      </Sequence>
    </AbsoluteFill>
  );
};
