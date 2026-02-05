"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Mic, Send, ThumbsUp, ThumbsDown, Meh, Check } from "lucide-react";
import { cn } from "@/lib/utils";

import { captureLead, updateLeadSentiment } from "@/lib/actions/leads";

// ... other imports

export function ConnectForm({ ownerId, ownerName }: { ownerId: string, ownerName: string }) {
    const [step, setStep] = useState<"visitor_form" | "owner_feedback">("visitor_form");
    const [isRecording, setIsRecording] = useState(false);
    const [sentiment, setSentiment] = useState<"hot" | "warm" | "cold" | null>(null);
    const [loading, setLoading] = useState(false);

    // State to store the lead ID after capture, so we can update it with sentiment later
    const [currentLeadId, setCurrentLeadId] = useState<string | null>(null);

    async function handleVisitorSubmit(formData: FormData) {
        setLoading(true);
        const res = await captureLead(formData, ownerId);
        setLoading(false);

        if (res.error) {
            alert(res.error); // Simple alert for now
            return;
        }

        if (res.data?.id) {
            setCurrentLeadId(res.data.id);
        }

        // Move to feedback step (Simulation of "Push Notification" happening on Owner's side)
        setStep("owner_feedback");
    }

    async function handleOwnerSubmit() {
        if (!currentLeadId) return;

        if (sentiment) {
            await updateLeadSentiment(currentLeadId, sentiment, isRecording ? "Voice note captured (simulated)" : undefined);
        }

        alert("Lead & Sentiment saved to Supabase!");
        setStep("visitor_form");
    }

    if (step === "visitor_form") {
        return (
            <>
                <DialogHeader>
                    <DialogTitle>Let&apos;s Connect!</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Teile deine Kontaktdaten direkt mit {ownerName}.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleVisitorSubmit} className="space-y-4 py-4">
                    <Input name="name" placeholder="Dein Name" className="bg-black/50 border-white/10" required />
                    <Input name="email" type="email" placeholder="Deine E-Mail" className="bg-black/50 border-white/10" required />
                    <Input name="linkedin" placeholder="LinkedIn URL (optional)" className="bg-black/50 border-white/10" />
                    <Textarea name="message" placeholder="Nachricht..." className="bg-black/50 border-white/10" />
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500" disabled={loading}>
                        {loading ? "Senden..." : "Senden"}
                    </Button>
                </form>
            </>
        );
    }

    // Simulated "Owner View" that appears after a lead is captured (Simulating Push Notification open)
    return (
        <>
            <DialogHeader>
                <DialogTitle className="text-orange-400">⚡ New Lead Captured!</DialogTitle>
                <DialogDescription className="text-zinc-400">
                    (Simulation: Owner received push notification)
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">

                <div className="space-y-2">
                    <p className="text-sm font-medium text-white">How was the vibe?</p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className={cn("flex-1 border-white/10 hover:bg-red-500/20 hover:text-red-400", sentiment === 'cold' && "bg-red-500/20 text-red-400 border-red-500")}
                            onClick={() => setSentiment("cold")}
                        >
                            <ThumbsDown size={18} className="mr-2" /> Cold
                        </Button>
                        <Button
                            variant="outline"
                            className={cn("flex-1 border-white/10 hover:bg-yellow-500/20 hover:text-yellow-400", sentiment === 'warm' && "bg-yellow-500/20 text-yellow-400 border-yellow-500")}
                            onClick={() => setSentiment("warm")}
                        >
                            <Meh size={18} className="mr-2" /> Warm
                        </Button>
                        <Button
                            variant="outline"
                            className={cn("flex-1 border-white/10 hover:bg-green-500/20 hover:text-green-400", sentiment === 'hot' && "bg-green-500/20 text-green-400 border-green-500")}
                            onClick={() => setSentiment("hot")}
                        >
                            <ThumbsUp size={18} className="mr-2" /> Hot
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-sm font-medium text-white">Quick Voice Note</p>
                    <div
                        className={cn(
                            "h-16 rounded-xl border border-dashed border-white/20 flex items-center justify-center cursor-pointer transition-all",
                            isRecording ? "bg-red-500/10 border-red-500 animate-pulse" : "hover:bg-white/5"
                        )}
                        onClick={() => setIsRecording(!isRecording)}
                    >
                        {isRecording ? (
                            <span className="text-red-400 flex items-center gap-2 text-sm font-bold">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" /> Recording... (Tap to stop)
                            </span>
                        ) : (
                            <span className="text-zinc-500 flex items-center gap-2 text-sm">
                                <Mic size={18} /> Tap to record context
                            </span>
                        )}
                    </div>
                </div>

            </div>
        </>
    )
}

