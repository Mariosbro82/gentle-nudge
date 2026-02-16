"use client";

import { motion } from "framer-motion";
import { Briefcase, Utensils, Megaphone, CheckCircle2 } from "lucide-react";

export function FeaturesSection() {
    const modes = [
        {
            id: "corporate",
            icon: Briefcase,
            title: "Vertrieb",
            subtitle: "Vom Wearable zum Lead-Funnel",
            description: "Automatisiertes Lead-Capturing via NFC-Touchpoint. Jeder physische Kontakt wird zum qualifizierten CRM-Datensatz – mit Zero-Friction User Experience.",
            color: "blue",
            features: ["Digitale vCard (RFC 6350)", "Bidirektionales Lead-Capturing", "CRM-Pipeline Integration", "Automated Follow-Up Workflows"],
        },
        {
            id: "campaign",
            icon: Megaphone,
            title: "Kampagnen",
            subtitle: "Omnichannel-Marketing am Körper",
            description: "Multi-Tenant Kampagnensteuerung über das SaaS-Dashboard. A/B-Testing, Geo-Targeting und zeitgesteuerte Redirects – skalierbar für Enterprise-Rollouts.",
            color: "purple",
            features: ["Zentrales Campaign Management", "Dynamic Link Routing", "Conversion-optimierte Landing Pages", "Scheduled Deployment & Rollback"],
        },
        {
            id: "hospitality",
            icon: Utensils,
            title: "Bewertung",
            subtitle: "Review-Automation ohne Medienbruch",
            description: "Conversion-optimierter Review-Funnel direkt am Point of Service. Steigern Sie Ihre Net Promoter Scores durch friktionsloses Micro-Engagement.",
            color: "orange",
            features: ["Google Review Funnel", "Digitale Speisekarte (QR-Fallback)", "Multi-Platform Aggregation", "Integrated Payment Gateway (Stripe)"],
        },
    ];

    return (
        <section id="features" className="py-24 bg-background relative">
            <div className="container mx-auto px-4">

                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                        Ein Chip. <span className="text-blue-500">Drei Use Cases.</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Mode-Switch in Echtzeit via Cloud Dashboard. Zero-App-Dependency. Plug & Play Deployment.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {modes.map((mode, index) => (
                        <motion.div
                            key={mode.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="p-8 rounded-2xl bg-card border border-border hover:border-foreground/20 hover:bg-accent/50 transition-all group"
                        >
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-${mode.color}-500/10 text-${mode.color}-500 group-hover:scale-110 transition-transform duration-300`}>
                                <mode.icon size={28} className={
                                    mode.color === 'blue' ? 'text-blue-400' :
                                        mode.color === 'orange' ? 'text-orange-400' : 'text-purple-400'
                                } />
                            </div>

                            <h3 className="text-2xl font-bold text-foreground mb-2">{mode.title}</h3>
                            <p className={`text-sm font-medium mb-4 ${mode.color === 'blue' ? 'text-blue-400' :
                                mode.color === 'orange' ? 'text-orange-400' : 'text-purple-400'
                                }`}>
                                {mode.subtitle}
                            </p>

                            <p className="text-muted-foreground mb-8 leading-relaxed text-sm">
                                {mode.description}
                            </p>

                            <ul className="space-y-3">
                                {mode.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <CheckCircle2 size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
