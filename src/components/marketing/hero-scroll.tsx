import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ParallaxStars } from "./parallax-stars";
import { NfcChipVisual } from "./nfc-chip-visual";
import { Button } from "@/components/ui/button";
import { ChevronRight, Play } from "lucide-react";

export function HeroScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Animation Ranges
  // 0.0 - 0.2: Fade out initial text
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const textScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  // 0.1 - 0.5: Circle expands from bottom to fill screen
  const circleSize = useTransform(scrollYProgress, [0.1, 0.5], ["100px", "250vw"]);
  const circleRadius = useTransform(scrollYProgress, [0.1, 0.5], ["50%", "0%"]);
  const circleY = useTransform(scrollYProgress, [0.1, 0.5], ["40vh", "0vh"]);

  // 0.3 - 0.6: Chip reveals inside the circle
  const chipScale = useTransform(scrollYProgress, [0.3, 0.6], [0.5, 1.5]);
  const chipOpacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
  const chipRotate = useTransform(scrollYProgress, [0.2, 0.8], [0, 180]);

  // 0.6 - 0.8: Final Content reveals
  const finalContentOpacity = useTransform(scrollYProgress, [0.6, 0.7], [0, 1]);
  const finalContentY = useTransform(scrollYProgress, [0.6, 0.7], [50, 0]);

  return (
    <div ref={containerRef} className="relative h-[300vh] bg-deep-blue text-white overflow-clip">
       <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
          <ParallaxStars />

          {/* Initial Hero Text */}
          <motion.div
            style={{ opacity: textOpacity, y: textY, scale: textScale }}
            className="absolute z-10 text-center px-4 w-full max-w-5xl"
          >
             <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-tight mb-6 leading-tight">
                Don't just wear <br/>
                your brand.
             </h1>
             <h2 className="text-5xl md:text-7xl lg:text-9xl font-bold text-electric-blue leading-tight">
                Connect it.
             </h2>
             <p className="mt-8 text-xl text-white/60 max-w-2xl mx-auto">
                The first wearable operating system for B2B. Turn your team into walking landing pages.
             </p>
          </motion.div>

          {/* The Expanding Portal */}
          <motion.div
             style={{
               width: circleSize,
               height: circleSize,
               borderRadius: circleRadius,
               y: circleY
             }}
             className="absolute bg-black border border-electric-blue/30 flex items-center justify-center z-20 overflow-hidden shadow-[0_0_100px_rgba(14,165,233,0.3)]"
          >
             {/* The Content Inside the Portal */}
             <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-electric-blue/10 via-transparent to-transparent" />

                <motion.div style={{ scale: chipScale, opacity: chipOpacity, rotate: chipRotate }}>
                   <NfcChipVisual className="w-[300px] h-[300px] md:w-[500px] md:h-[500px]" />
                </motion.div>
             </div>
          </motion.div>

          {/* Final "Getting Started" Content */}
          <motion.div
             style={{ opacity: finalContentOpacity, y: finalContentY }}
             className="absolute z-30 flex flex-col items-center justify-center w-full"
          >
             <h3 className="text-6xl md:text-8xl font-bold mb-12 text-center leading-none tracking-tighter">
                <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 opacity-50 mb-2">GETTING</span>
                <span className="text-electric-blue drop-shadow-[0_0_30px_rgba(14,165,233,0.5)]">STARTED</span>
             </h3>
             <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button size="lg" className="bg-electric-blue hover:bg-electric-blue/90 text-white rounded-full px-10 h-16 text-xl transition-all hover:scale-105 shadow-[0_0_30px_rgba(14,165,233,0.4)] border-none cursor-pointer">
                   Launch Platform <ChevronRight className="ml-2 w-6 h-6" />
                </Button>
                <div className="flex items-center gap-3 text-sm text-white/60">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                        <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                    </div>
                    <span>Watch the film</span>
                </div>
             </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
             style={{ opacity: textOpacity }}
             className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40"
          >
             <span className="text-[10px] uppercase tracking-[0.3em]">Scroll to explore</span>
             <div className="w-px h-16 bg-gradient-to-b from-electric-blue to-transparent" />
          </motion.div>
       </div>
    </div>
  );
}
