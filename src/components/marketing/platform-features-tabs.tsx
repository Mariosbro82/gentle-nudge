import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Users, Shield, Smartphone, TrendingUp, Eye, UserPlus, Lock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
    {
        id: "analytics",
        title: "Echtzeit Analytics",
        description: "Verfolgen Sie Scans, Interaktionen und Nutzerverhalten in Echtzeit. Treffen Sie datenbasierte Entscheidungen.",
        icon: BarChart3,
        accent: "from-blue-500 to-cyan-400",
        accentBg: "bg-blue-500/10 border-blue-500/20 text-blue-400",
        mockup: AnalyticsMockup,
    },
    {
        id: "nfc",
        title: "NFC Management",
        description: "Verwalten Sie tausende von Chips mit einem Klick. Volle Kontrolle über Ihre Assets.",
        icon: Smartphone,
        accent: "from-purple-500 to-pink-400",
        accentBg: "bg-purple-500/10 border-purple-500/20 text-purple-400",
        mockup: NfcMockup,
    },
    {
        id: "users",
        title: "Nutzerverwaltung",
        description: "Rollenbasierte Zugriffsrechte für Ihr ganzes Team. Skalierbar und sicher.",
        icon: Users,
        accent: "from-green-500 to-emerald-400",
        accentBg: "bg-green-500/10 border-green-500/20 text-green-400",
        mockup: UsersMockup,
    },
    {
        id: "security",
        title: "Sicherheit & Datenschutz",
        description: "DSGVO-konform und verschlüsselt. Ihre Daten gehören Ihnen und sind geschützt.",
        icon: Shield,
        accent: "from-red-500 to-orange-400",
        accentBg: "bg-red-500/10 border-red-500/20 text-red-400",
        mockup: SecurityMockup,
    },
];

export function PlatformFeaturesTabs() {
    const [active, setActive] = useState(0);
    const current = features[active];
    const Mockup = current.mockup;

    return (
        <section className="py-24 px-6 bg-muted/30">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Mächtige Werkzeuge</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Alles, was Sie brauchen, um Ihre physischen Produkte mit der digitalen Welt zu verbinden.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* Tab list */}
                    <div className="lg:col-span-2 flex flex-col gap-3">
                        {features.map((f, i) => {
                            const Icon = f.icon;
                            const isActive = i === active;
                            return (
                                <motion.button
                                    key={f.id}
                                    onClick={() => setActive(i)}
                                    className={cn(
                                        "relative text-left p-5 rounded-2xl border transition-all duration-300 group",
                                        isActive
                                            ? "bg-card border-border shadow-lg"
                                            : "bg-transparent border-transparent hover:bg-card/50 hover:border-border/50"
                                    )}
                                    layout
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-tab-glow"
                                            className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${f.accent} opacity-[0.06]`}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <div className="relative flex items-start gap-4">
                                        <div className={cn("p-2.5 rounded-xl border shrink-0 transition-colors", f.accentBg)}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h3 className={cn("font-bold text-lg transition-colors", isActive ? "text-foreground" : "text-muted-foreground")}>{f.title}</h3>
                                                <ChevronRight className={cn("w-4 h-4 transition-all", isActive ? "opacity-100 translate-x-0 text-muted-foreground" : "opacity-0 -translate-x-2")} />
                                            </div>
                                            <AnimatePresence mode="wait">
                                                {isActive && (
                                                    <motion.p
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="text-sm text-muted-foreground leading-relaxed mt-1.5"
                                                    >
                                                        {f.description}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Mockup area */}
                    <div className="lg:col-span-3 relative min-h-[400px]">
                        <div className="absolute -inset-1 bg-gradient-to-r opacity-20 blur-2xl rounded-3xl" style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
                        <div className="relative h-full rounded-2xl border border-border bg-card overflow-hidden">
                            {/* Browser chrome */}
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                                </div>
                                <div className="flex-1 mx-4">
                                    <div className="bg-background rounded-md px-3 py-1 text-xs text-muted-foreground font-mono">
                                        cloud.severmore.de/{current.id}
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={current.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -12 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="p-6"
                                >
                                    <Mockup />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ── Mini Mockup Components ── */

function AnalyticsMockup() {
    const bars = [35, 58, 42, 72, 65, 88, 54, 76, 90, 68, 82, 95];
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Total Scans", value: "12.847", change: "+23%", icon: Eye },
                    { label: "Neue Leads", value: "1.294", change: "+18%", icon: UserPlus },
                    { label: "Conversion", value: "34.2%", change: "+5.1%", icon: TrendingUp },
                ].map((kpi) => (
                    <div key={kpi.label} className="p-4 rounded-xl bg-muted/50 border border-border">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
                            <kpi.icon className="w-3.5 h-3.5" /> {kpi.label}
                        </div>
                        <div className="text-2xl font-bold">{kpi.value}</div>
                        <div className="text-xs text-green-500 font-medium mt-1">{kpi.change}</div>
                    </div>
                ))}
            </div>
            <div>
                <div className="text-sm font-medium mb-3 text-muted-foreground">Scans pro Tag</div>
                <div className="flex items-end gap-1.5 h-32">
                    {bars.map((h, i) => (
                        <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ delay: i * 0.05, duration: 0.4, ease: "easeOut" }}
                            className="flex-1 rounded-t-md bg-gradient-to-t from-blue-500 to-cyan-400 opacity-80"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function NfcMockup() {
    const devices = [
        { name: "Max Müller", mode: "Corporate", status: "active" },
        { name: "Lisa Schmidt", mode: "Campaign", status: "active" },
        { name: "Tom Bauer", mode: "Corporate", status: "idle" },
        { name: "Anna Weber", mode: "Hospitality", status: "active" },
    ];
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="font-semibold">Aktive Geräte</h4>
                <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
                    {devices.length} verbunden
                </span>
            </div>
            <div className="space-y-2">
                {devices.map((d, i) => (
                    <motion.div
                        key={d.name}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-muted/50 border border-border"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                                <Smartphone className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="text-sm font-medium">{d.name}</div>
                                <div className="text-xs text-muted-foreground">{d.mode}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className={cn("w-2 h-2 rounded-full", d.status === "active" ? "bg-green-500" : "bg-muted-foreground/40")} />
                            <span className="text-xs text-muted-foreground capitalize">{d.status === "active" ? "Aktiv" : "Inaktiv"}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

function UsersMockup() {
    const roles = [
        { name: "Admin", count: 2, color: "bg-blue-500" },
        { name: "Manager", count: 5, color: "bg-green-500" },
        { name: "Mitarbeiter", count: 23, color: "bg-muted-foreground/40" },
    ];
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h4 className="font-semibold">Team-Rollen</h4>
                <span className="text-xs text-muted-foreground">30 Mitglieder</span>
            </div>
            {roles.map((r, i) => (
                <motion.div
                    key={r.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="space-y-2"
                >
                    <div className="flex justify-between text-sm">
                        <span className="font-medium">{r.name}</span>
                        <span className="text-muted-foreground">{r.count}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(r.count / 30) * 100}%` }}
                            transition={{ delay: i * 0.1 + 0.2, duration: 0.6, ease: "easeOut" }}
                            className={cn("h-full rounded-full", r.color)}
                        />
                    </div>
                </motion.div>
            ))}
            <div className="grid grid-cols-2 gap-3 pt-2">
                {["SSO Login", "2FA aktiv", "Audit Log", "IP-Whitelist"].map((feat, i) => (
                    <motion.div
                        key={feat}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + i * 0.05 }}
                        className="flex items-center gap-2 text-xs text-muted-foreground p-2 rounded-lg bg-muted/50"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        {feat}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

function SecurityMockup() {
    const checks = [
        { label: "DSGVO-Konformität", status: "passed" },
        { label: "AES-256 Verschlüsselung", status: "passed" },
        { label: "SUN-Authentifizierung", status: "passed" },
        { label: "Letzte Sicherheitsprüfung", status: "passed" },
    ];
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                    <Shield className="w-6 h-6 text-green-500" />
                </div>
                <div>
                    <h4 className="font-semibold">Sicherheitsstatus</h4>
                    <p className="text-sm text-green-500">Alle Checks bestanden</p>
                </div>
            </div>
            <div className="space-y-2">
                {checks.map((c, i) => (
                    <motion.div
                        key={c.label}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-muted/50 border border-border"
                    >
                        <div className="flex items-center gap-3">
                            <Lock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{c.label}</span>
                        </div>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.1 + 0.3, type: "spring" }}
                            className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center"
                        >
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
