import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface VideoGreetingProps {
    videoUrl: string;
}

export function VideoGreeting({ videoUrl }: VideoGreetingProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [muted, setMuted] = useState(true);
    const [playing, setPlaying] = useState(false);

    function handleTap() {
        const video = videoRef.current;
        if (!video) return;

        if (!playing) {
            video.play();
            setPlaying(true);
        }

        setMuted(!muted);
        video.muted = !video.muted;
    }

    return (
        <div className="flex flex-col items-center gap-2">
            <div
                className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 cursor-pointer shadow-lg shadow-black/30 group"
                onClick={handleTap}
            >
                <video
                    ref={videoRef}
                    src={videoUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    onPlay={() => setPlaying(true)}
                />
                {/* Ring animation */}
                <div className="absolute inset-0 rounded-full border-2 border-white/40 animate-pulse pointer-events-none" />
                {/* Mute indicator */}
                <div className="absolute bottom-0.5 right-0.5 bg-black/70 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {muted ? (
                        <VolumeX className="h-3 w-3 text-white" />
                    ) : (
                        <Volume2 className="h-3 w-3 text-white" />
                    )}
                </div>
            </div>
            <p className="text-[10px] text-white/50">
                {muted ? "Tippen zum Anhören" : "Tippen zum Stummschalten"}
            </p>
        </div>
    );
}
