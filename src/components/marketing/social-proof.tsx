"use client";

import { motion } from "framer-motion";

export function SocialProof() {
    const logos = [
        "ACME Corp", "GlobalVentures", "TechStart", "Omega Solutions", "FutureWear"
    ];

    return (
        <section className="py-20 bg-background border-t border-border">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm font-medium text-muted-foreground mb-8 uppercase tracking-widest">
                    Trusted by Innovative Companies
                </p>

                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    {logos.map((logo, idx) => (
                        <span key={idx} className="text-xl md:text-2xl font-bold font-mono text-muted-foreground hover:text-foreground transition-colors cursor-default">
                            {logo}
                        </span>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-20 max-w-4xl mx-auto"
                >
                    <blockquote className="text-2xl md:text-3xl font-medium text-foreground leading-relaxed">
                        &quot;Unser Sales-Team hat <span className="text-blue-400">3x mehr Leads</span> auf der letzten Messe gesammelt. Das Dashboard ist ein Gamechanger.&quot;
                    </blockquote>
                    <cite className="block mt-6 not-italic text-muted-foreground">
                        <span className="text-foreground font-semibold">Max Mustermann</span> — CEO @ Example GmbH
                    </cite>
                </motion.div>
            </div>
        </section>
    );
}
