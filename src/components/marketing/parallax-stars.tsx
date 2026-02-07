import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function ParallaxStars() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  // Generate stars
  const stars = Array.from({ length: 100 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
    color: ['#FBBF24', '#A855F7', '#FFFFFF'][Math.floor(Math.random() * 3)]
  }));

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div style={{ y }} className="w-full h-[150%] relative -top-[25%]">
        {stars.map((star) => (
           <motion.div
             key={star.id}
             className="absolute rounded-full"
             initial={{ opacity: 0.2 }}
             animate={{ opacity: [0.2, 0.8, 0.2] }}
             transition={{
                duration: star.duration,
                repeat: Infinity,
                delay: star.delay,
                ease: "easeInOut"
             }}
             style={{
               top: star.top,
               left: star.left,
               width: `${star.size}px`,
               height: `${star.size}px`,
               backgroundColor: star.color,
               boxShadow: `0 0 ${star.size * 2}px ${star.color}`
             }}
           />
        ))}
      </motion.div>
      {/* Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
      />
    </div>
  );
}
