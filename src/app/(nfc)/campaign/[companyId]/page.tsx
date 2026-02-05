"use client";

import { use } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Timer, ArrowRight, Tag } from "lucide-react";

const MOCK_CAMPAIGN = {
    title: "Black Friday Pre-Access",
    subtitle: "Exklusiv für NFC-Scanner",
    discount: "25%",
    code: "FRIDAY25",
    ends_in: "04:23:12",
    brand: "SNIPES"
};

export default function CampaignPage({ params }: { params: Promise<{ companyId: string }> }) {
    const { companyId } = use(params);
    return (
        <main className="relative min-h-screen bg-black flex flex-col">

            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-10">

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-8"
                >
                    <span className="px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-bold tracking-widest uppercase">
                        Campaign
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-black text-white italic tracking-tighter mb-2"
                >
                    {MOCK_CAMPAIGN.title}
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-zinc-400 text-lg mb-10"
                >
                    {MOCK_CAMPAIGN.subtitle}
                </motion.p>

                {/* Discount Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="w-full max-w-sm p-6 rounded-2xl bg-gradient-to-tr from-purple-900/40 to-black border border-purple-500/30 backdrop-blur-xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Tag size={120} />
                    </div>

                    <div className="relative z-10">
                        <p className="text-zinc-400 text-sm mb-1 uppercase tracking-wider">Dein Code</p>
                        <div className="text-4xl font-mono text-white font-bold tracking-widest bg-white/5 p-4 rounded-lg border-dashed border border-white/20 mb-4">
                            {MOCK_CAMPAIGN.code}
                        </div>
                        <div className="flex items-center justify-center gap-2 text-purple-400 text-sm font-medium">
                            <Timer size={16} /> Endet in {MOCK_CAMPAIGN.ends_in}
                        </div>
                    </div>
                </motion.div>

            </div>

            {/* Sticky Bottom CTA */}
            <div className="p-6 bg-black border-t border-white/10">
                <Button className="w-full bg-purple-600 hover:bg-purple-500 text-white h-14 rounded-xl text-lg font-bold shadow-[0_0_30px_rgba(147,51,234,0.3)] group">
                    Jetzt shoppen <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>

            {/* Background Effects */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(147,51,234,0.15),transparent_70%)]" />
            </div>

        </main>
    );
}
