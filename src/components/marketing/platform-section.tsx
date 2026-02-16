import { motion } from "framer-motion";
import { Laptop, Zap, Share2, BarChart3 } from "lucide-react";

export function PlatformSection() {
    const features = [
        {
            icon: <Laptop className="w-8 h-8 text-blue-400" />,
            title: "Multi-Tenant Dashboard",
            description: "Fleet Management für alle Wearables. Role-Based Access, Bulk-Provisioning und Real-Time Device Status auf einer Plattform."
        },
        {
            icon: <Zap className="w-8 h-8 text-yellow-400" />,
            title: "OTA-Updates",
            description: "Over-the-Air Configuration Changes mit Zero Downtime. Instant Deployment ohne App-Dependency."
        },
        {
            icon: <Share2 className="w-8 h-8 text-purple-400" />,
            title: "API-First Integrations",
            description: "RESTful API & Webhook-Layer für nahtlose CRM-, ERP- und Marketing-Automation-Anbindung. Salesforce, HubSpot, Zapier-ready."
        },
        {
            icon: <BarChart3 className="w-8 h-8 text-green-400" />,
            title: "Business Intelligence",
            description: "Granulare KPI-Dashboards mit Scan-Analytics, Lead-Attribution und Conversion-Tracking. Exportierbar als CSV oder via API."
        }
    ];

    return (
        <section id="software" className="py-24 bg-background relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] bg-[size:50px_50px]" />
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 to-neutral-600 dark:from-neutral-200 dark:to-neutral-600 mb-4">
                        Die Severmore Cloud™
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        End-to-End Wearable Management als Cloud-native SaaS.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 rounded-2xl bg-card border border-border hover:border-blue-500/50 transition-colors group"
                        >
                            <div className="mb-4 p-3 rounded-xl bg-accent w-fit group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Dashboard Preview Mockup */}
                <div className="mt-20 relative rounded-3xl border border-border overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-blue-500/5 blur-3xl" />
                    <img
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop"
                        alt="Dashboard Preview"
                        className="w-full h-auto opacity-80 hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="bg-background/80 backdrop-blur-sm text-foreground px-6 py-3 rounded-full border border-border">
                            Interaktives Dashboard
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
