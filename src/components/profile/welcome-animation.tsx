import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ProfileUser } from "@/types/profile";

interface WelcomeAnimationProps {
    user: ProfileUser;
    onComplete: () => void;
}

export function WelcomeAnimation({ user, onComplete }: WelcomeAnimationProps) {
    const [phase, setPhase] = useState<"avatar" | "text" | "done">("avatar");
    const [displayedText, setDisplayedText] = useState("");

    // Resolve {{name}} variable in greeting
    const greetingText = (user.customGreeting || "Willkommen auf meinem Profil 👋")
        .replace(/\{\{name\}\}/g, user.name);

    // Typewriter effect
    useEffect(() => {
        if (phase !== "text") return;
        let i = 0;
        const interval = setInterval(() => {
            i++;
            setDisplayedText(greetingText.slice(0, i));
            if (i >= greetingText.length) {
                clearInterval(interval);
                setTimeout(() => setPhase("done"), 800);
            }
        }, 45);
        return () => clearInterval(interval);
    }, [phase, greetingText]);

    // Transition from avatar to text
    useEffect(() => {
        if (phase === "avatar") {
            const timer = setTimeout(() => setPhase("text"), 1400);
            return () => clearTimeout(timer);
        }
    }, [phase]);

    // Complete animation
    useEffect(() => {
        if (phase === "done") {
            const timer = setTimeout(onComplete, 400);
            return () => clearTimeout(timer);
        }
    }, [phase, onComplete]);

    const isEmoji = user.avatarStyle === "emoji";

    return (
        <AnimatePresence>
            {phase !== "done" && (
                <motion.div
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
                    style={{ backgroundColor: user.backgroundColor || "#0a0a0a" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Avatar / Emoji */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                        className="mb-8"
                    >
                        {isEmoji ? (
                            <motion.div
                                className="text-7xl select-none"
                                animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                                transition={{ duration: 1.2, ease: "easeInOut" }}
                            >
                                {user.avatarEmoji || "👋"}
                            </motion.div>
                        ) : (
                            <motion.div
                                className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl shadow-black/50"
                                animate={{ boxShadow: ["0 0 0px rgba(255,255,255,0.1)", "0 0 30px rgba(255,255,255,0.15)", "0 0 0px rgba(255,255,255,0.1)"] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                        style={{ objectPosition: user.profilePicPosition || "50% 50%" }}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-white/10 flex items-center justify-center text-white text-3xl font-bold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Typewriter Text */}
                    {phase === "text" && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-center px-8 max-w-sm"
                        >
                            <p className="text-xl font-semibold text-white leading-relaxed">
                                {displayedText}
                                <motion.span
                                    className="inline-block w-0.5 h-5 bg-white/70 ml-0.5 align-middle"
                                    animate={{ opacity: [1, 0] }}
                                    transition={{ duration: 0.6, repeat: Infinity }}
                                />
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
