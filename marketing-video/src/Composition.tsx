import { AbsoluteFill, useCurrentFrame, interpolate, Sequence, spring, useVideoConfig } from 'remotion';
import { SleeveCloseUp } from './components/SleeveCloseUp';
import { PhoneInteraction } from './components/PhoneInteraction';
import { TechOverlay } from './components/TechOverlay';
import { SalesforceDashboard } from './components/SalesforceDashboard';

// Text Overlay Component — vertical layout
const FinalTextOverlay = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Staggered word animations
  const tapProgress = spring({ frame, fps, from: 0, to: 1, config: { damping: 15 } });
  const connectProgress = spring({ frame: frame - 15, fps, from: 0, to: 1, config: { damping: 15 } });

  // Branding fade-in
  const brandOpacity = interpolate(frame, [30, 60], [0, 1]);

  const textStyle = (progress: number) => ({
    opacity: interpolate(progress, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(progress, [0, 1], [40, 0])}px)`,
    display: 'block'
  });

  return (
    <AbsoluteFill className="flex flex-col items-center justify-center z-10 bg-zinc-900">
      <h1 className="text-7xl font-bold text-white mb-8 tracking-tight text-center leading-tight">
        <span style={textStyle(tapProgress)} className="text-blue-400">Engineering.</span>
        <span style={textStyle(connectProgress)} className="text-purple-400">Fashion.</span>
      </h1>

      {/* Branding Outro */}
      <div style={{ opacity: brandOpacity }} className="absolute bottom-20 flex flex-col items-center gap-2">
        <p className="text-zinc-500 text-sm tracking-widest uppercase font-medium">Powered by</p>
        <p className="text-white text-xl font-semibold tracking-wide">NFCwear by Severmore</p>
      </div>
    </AbsoluteFill>
  );
};

export const MyComposition = () => {
  return (
    <AbsoluteFill className="bg-zinc-900">
      {/* Scene 1 & 2: Sleeve Close Up + Tech Reveal (0-200f) -> Persist until transition to dashboard */}
      <Sequence from={0} durationInFrames={340}>
        <SleeveCloseUp />
      </Sequence>

      {/* Overlay: Tech Schematics (60-200f) -> End before dashboard */}
      <Sequence from={60} durationInFrames={250}>
        <TechOverlay />
      </Sequence>

      {/* Scene 3: Phone Interaction (200-330f) */}
      <Sequence from={200} durationInFrames={130}>
        <PhoneInteraction />
      </Sequence>

      {/* TRANSITION 1: Dashboard Slides Up (320-470) */}
      {/* Overlaps slightly with phone for "emergence" effect, then holds */}
      <Sequence from={320} durationInFrames={150}>
        <div style={{ transform: 'translateY(0)', width: '100%', height: '100%' }}>
          <SalesforceDashboard />
        </div>
      </Sequence>

      {/* TRANSITION 2: Clean Cut to Text (470-570) */}
      {/* Dashboard sequence ends at 320+150=470. Text starts at 470. No overlap. */}
      <Sequence from={470} durationInFrames={100}>
        <FinalTextOverlay />
      </Sequence>
    </AbsoluteFill>
  );
};
