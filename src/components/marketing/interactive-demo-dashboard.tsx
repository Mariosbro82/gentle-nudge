import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScanLine,
  Users,
  Eye,
  BarChart3,
  Zap,
  TrendingUp,
  Bell,
  ChevronRight,
  Smartphone,
  Globe,
  Clock,
  Star,
  Trophy,
  Settings,
  Megaphone,
  UserCog,
} from "lucide-react";

const DEMO_STATS = [
  { title: "Gesamt Scans", value: "2.847", change: "+12% diese Woche", icon: ScanLine },
  { title: "Aktive Kontakte", value: "1.293", change: "+8% diese Woche", icon: Users },
  { title: "Aktive Chips", value: "48", change: "3 neue zugewiesen", icon: Zap },
  { title: "Profil Aufrufe", value: "7.521", change: "+23% diese Woche", icon: Eye },
];

const DEMO_LEADS = [
  { name: "Julia Meier", company: "TechCorp GmbH", time: "vor 2 Min.", sentiment: "hot" },
  { name: "Thomas Weber", company: "InnoVentures AG", time: "vor 8 Min.", sentiment: "warm" },
  { name: "Sarah Koch", company: "Digital Solutions", time: "vor 15 Min.", sentiment: "hot" },
  { name: "Max Richter", company: "CloudBase Inc.", time: "vor 23 Min.", sentiment: "warm" },
  { name: "Anna Schmidt", company: "Smart Systems", time: "vor 31 Min.", sentiment: "cold" },
];

const DEMO_DEVICES = [
  { uid: "NFC-001", user: "Max Müller", mode: "Corporate", lastScan: "vor 5 Min.", status: "online" },
  { uid: "NFC-002", user: "Lisa Wagner", mode: "Hospitality", lastScan: "vor 12 Min.", status: "online" },
  { uid: "NFC-003", user: "Tom Braun", mode: "Campaign", lastScan: "vor 1 Std.", status: "online" },
  { uid: "NFC-004", user: "Eva Klein", mode: "Corporate", lastScan: "vor 3 Std.", status: "offline" },
];

const DEMO_RANKING = [
  { name: "Max Müller", role: "Sales Lead", scans: 342, leads: 67, score: 677, avatar: "MM" },
  { name: "Lisa Wagner", role: "Account Manager", scans: 298, leads: 54, score: 568, avatar: "LW" },
  { name: "Tom Braun", role: "Business Dev", scans: 256, leads: 41, score: 461, avatar: "TB" },
  { name: "Eva Klein", role: "Sales Rep", scans: 189, leads: 32, score: 349, avatar: "EK" },
  { name: "Sarah Koch", role: "Marketing", scans: 145, leads: 28, score: 285, avatar: "SK" },
];

const CHART_DATA = [35, 52, 41, 68, 55, 82, 63, 91, 78, 95, 72, 60, 85, 92, 88];

type Tab = "dashboard" | "leads" | "devices" | "analytics" | "ranking" | "campaigns" | "team" | "settings";

export function InteractiveDemoDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  const sidebarItems: { label: string; icon: React.ElementType; tab: Tab }[] = [
    { label: "Dashboard", icon: BarChart3, tab: "dashboard" },
    { label: "Leads", icon: Users, tab: "leads" },
    { label: "Geräte", icon: Smartphone, tab: "devices" },
    { label: "Ranking", icon: Trophy, tab: "ranking" },
    { label: "Kampagnen", icon: Megaphone, tab: "campaigns" },
    { label: "Team", icon: UserCog, tab: "team" },
    { label: "Analytics", icon: TrendingUp, tab: "analytics" },
    { label: "Einstellungen", icon: Settings, tab: "settings" },
  ];

  return (
    <div className="w-full glass-card-strong rounded-2xl overflow-hidden shadow-2xl border border-border/50 select-none">
      {/* Browser Chrome */}
      <div className="h-10 border-b border-border/30 flex items-center px-4 gap-2 bg-card/60">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
        </div>
        <div className="ml-4 h-5 flex-1 max-w-xs glass-subtle rounded-md flex items-center px-3">
          <Globe className="size-3 text-muted-foreground mr-2" />
          <span className="text-[10px] text-muted-foreground">app.nfcwear.com/dashboard</span>
        </div>
      </div>

      <div className="flex min-h-[420px] md:min-h-[480px]">
        {/* Sidebar */}
        <div className="w-14 md:w-48 border-r border-border/30 bg-card/40 p-2 md:p-3 flex flex-col gap-1">
          <div className="flex items-center gap-2 px-2 py-2 mb-3">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <span className="text-[10px] font-bold text-primary-foreground">N</span>
            </div>
            <span className="text-xs font-semibold text-foreground hidden md:block">NFCwear</span>
          </div>
          {sidebarItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`flex items-center gap-2.5 px-2 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === item.tab
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              <item.icon className="size-4 shrink-0" />
              <span className="hidden md:block">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && <DashboardView key="dashboard" />}
            {activeTab === "leads" && <LeadsView key="leads" />}
            {activeTab === "devices" && <DevicesView key="devices" />}
            {activeTab === "ranking" && <RankingView key="ranking" />}
            {activeTab === "campaigns" && <CampaignsView key="campaigns" />}
            {activeTab === "team" && <TeamView key="team" />}
            {activeTab === "analytics" && <AnalyticsView key="analytics" />}
            {activeTab === "settings" && <SettingsView key="settings" />}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating notification */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 2, type: "spring", bounce: 0.4 }}
        className="absolute top-14 right-4 md:right-6 glass-card rounded-lg p-3 flex gap-3 items-center shadow-xl max-w-[220px]"
      >
        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
          <Bell className="size-3.5 text-green-500" />
        </div>
        <div>
          <p className="text-[10px] font-medium text-foreground">Neuer Lead erfasst!</p>
          <p className="text-[9px] text-muted-foreground">Julia Meier · TechCorp</p>
        </div>
      </motion.div>
    </div>
  );
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

function DashboardView() {
  return (
    <PageTransition>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm md:text-base font-semibold text-foreground">Dashboard</h3>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] text-muted-foreground">Live</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
          {DEMO_STATS.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="glass-card rounded-lg p-3"
            >
              <div className="flex items-center justify-between mb-1">
                <stat.icon className="size-3.5 text-muted-foreground" />
                <span className="text-[9px] text-green-500 font-medium">{stat.change.split(" ")[0]}</span>
              </div>
              <p className="text-lg md:text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-[9px] text-muted-foreground mt-0.5">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Chart + Feed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="glass-card rounded-lg p-4 h-48"
          >
            <p className="text-xs font-medium text-foreground mb-3">Scans (30 Tage)</p>
            <div className="flex items-end h-28 gap-[3px] md:gap-1">
              {CHART_DATA.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.6 + i * 0.04, duration: 0.4 }}
                  className="flex-1 bg-primary/25 rounded-t-sm hover:bg-primary/50 transition-colors cursor-pointer"
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="glass-card rounded-lg p-4 h-48 overflow-hidden"
          >
            <p className="text-xs font-medium text-foreground mb-3">Live Scan Feed</p>
            <div className="space-y-2.5">
              {DEMO_LEADS.slice(0, 3).map((lead, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${lead.sentiment === "hot" ? "bg-red-400" : lead.sentiment === "warm" ? "bg-yellow-400" : "bg-blue-400"}`} />
                    <div>
                      <p className="text-[11px] font-medium text-foreground">{lead.name}</p>
                      <p className="text-[9px] text-muted-foreground">{lead.company}</p>
                    </div>
                  </div>
                  <span className="text-[9px] text-muted-foreground">{lead.time}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}

function LeadsView() {
  return (
    <PageTransition>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm md:text-base font-semibold text-foreground">Leads</h3>
          <span className="text-[10px] glass-card rounded-full px-2.5 py-1 text-muted-foreground">{DEMO_LEADS.length} Kontakte</span>
        </div>

        <div className="space-y-2">
          {DEMO_LEADS.map((lead, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="glass-card rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-accent/30 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                  {lead.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">{lead.name}</p>
                  <p className="text-[10px] text-muted-foreground">{lead.company}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${
                  lead.sentiment === "hot"
                    ? "bg-red-500/15 text-red-400"
                    : lead.sentiment === "warm"
                    ? "bg-yellow-500/15 text-yellow-500"
                    : "bg-blue-500/15 text-blue-400"
                }`}>
                  {lead.sentiment === "hot" ? "🔥 Hot" : lead.sentiment === "warm" ? "Warm" : "Cold"}
                </span>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="size-3" />
                  <span className="text-[9px]">{lead.time}</span>
                </div>
                <ChevronRight className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}

function DevicesView() {
  return (
    <PageTransition>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm md:text-base font-semibold text-foreground">Geräte</h3>
          <span className="text-[10px] glass-card rounded-full px-2.5 py-1 text-muted-foreground">{DEMO_DEVICES.length} Chips</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {DEMO_DEVICES.map((device, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="glass-card rounded-lg p-3 cursor-pointer hover:bg-accent/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="size-3.5 text-primary" />
                  <span className="text-xs font-medium text-foreground">{device.uid}</span>
                </div>
                <div className={`w-1.5 h-1.5 rounded-full ${device.status === "online" ? "bg-green-500" : "bg-muted-foreground/40"}`} />
              </div>
              <p className="text-[10px] text-muted-foreground">{device.user} · {device.mode}</p>
              <p className="text-[9px] text-muted-foreground mt-1">Letzter Scan: {device.lastScan}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}

function AnalyticsView() {
  const weekData = [
    { day: "Mo", scans: 78, leads: 12 },
    { day: "Di", scans: 92, leads: 18 },
    { day: "Mi", scans: 65, leads: 8 },
    { day: "Do", scans: 110, leads: 24 },
    { day: "Fr", scans: 95, leads: 20 },
    { day: "Sa", scans: 42, leads: 5 },
    { day: "So", scans: 28, leads: 3 },
  ];
  const maxScans = Math.max(...weekData.map(d => d.scans));

  return (
    <PageTransition>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm md:text-base font-semibold text-foreground">Analytics</h3>
          <span className="text-[10px] glass-card rounded-full px-2.5 py-1 text-muted-foreground">Letzte 7 Tage</span>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Conversion Rate", value: "34.2%", icon: TrendingUp },
            { label: "Avg. Scans/Tag", value: "73", icon: BarChart3 },
            { label: "Top Performer", value: "Max M.", icon: Star },
          ].map((kpi, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="glass-card rounded-lg p-3 text-center"
            >
              <kpi.icon className="size-3.5 text-muted-foreground mx-auto mb-1" />
              <p className="text-base font-bold text-foreground">{kpi.value}</p>
              <p className="text-[9px] text-muted-foreground">{kpi.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Bar chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-lg p-4 h-52"
        >
          <p className="text-xs font-medium text-foreground mb-3">Scans pro Tag</p>
          <div className="flex items-end h-32 gap-2">
            {weekData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.scans / maxScans) * 100}%` }}
                  transition={{ delay: 0.5 + i * 0.06, duration: 0.4 }}
                  className="w-full bg-primary/30 rounded-t-sm hover:bg-primary/50 transition-colors cursor-pointer relative group"
                >
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.scans}
                  </span>
                </motion.div>
                <span className="text-[9px] text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}

function RankingView() {
  return (
    <PageTransition>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm md:text-base font-semibold text-foreground">Team Ranking</h3>
          <span className="text-[10px] glass-card rounded-full px-2.5 py-1 text-muted-foreground">Letzte 30 Tage</span>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-2 items-end">
          {[DEMO_RANKING[1], DEMO_RANKING[0], DEMO_RANKING[2]].map((person, i) => {
            const heights = ["h-20", "h-28", "h-16"];
            const medals = ["🥈", "🥇", "🥉"];
            return (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 * i }}
                className="flex flex-col items-center gap-1"
              >
                <span className="text-lg">{medals[i]}</span>
                <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary text-[10px] font-bold">
                  {person.avatar}
                </div>
                <p className="text-[10px] font-medium text-foreground text-center truncate w-full">{person.name}</p>
                <div className={`w-full ${heights[i]} bg-primary/10 rounded-t-lg flex items-center justify-center border border-primary/20`}>
                  <span className="text-xs font-bold text-primary">{person.score}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Full list */}
        <div className="space-y-1.5">
          {DEMO_RANKING.map((person, i) => (
            <motion.div
              key={person.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + 0.06 * i }}
              className="glass-card rounded-lg p-2.5 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-bold text-muted-foreground w-4 text-center">#{i + 1}</span>
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[9px] font-bold">
                  {person.avatar}
                </div>
                <div>
                  <p className="text-[11px] font-medium text-foreground">{person.name}</p>
                  <p className="text-[9px] text-muted-foreground">{person.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[9px] text-muted-foreground">
                <span>{person.scans} Scans</span>
                <span>{person.leads} Leads</span>
                <span className="font-bold text-primary">{person.score} Pts</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}

function CampaignsView() {
  const campaigns = [
    { name: "Messe München 2026", status: "Aktiv", chips: 12, scans: 847, conversion: "32%" },
    { name: "Partner Event Berlin", status: "Aktiv", chips: 8, scans: 423, conversion: "28%" },
    { name: "Q1 Sales Push", status: "Beendet", chips: 24, scans: 1.203, conversion: "41%" },
  ];

  return (
    <PageTransition>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm md:text-base font-semibold text-foreground">Kampagnen</h3>
          <span className="text-[10px] glass-card rounded-full px-2.5 py-1 text-primary cursor-pointer hover:bg-primary/10 transition-colors">+ Neue Kampagne</span>
        </div>

        <div className="space-y-2">
          {campaigns.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="glass-card rounded-lg p-3 cursor-pointer hover:bg-accent/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-foreground">{c.name}</p>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${c.status === "Aktiv" ? "bg-green-500/15 text-green-400" : "bg-muted text-muted-foreground"}`}>
                  {c.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-[9px] text-muted-foreground">
                <span>{c.chips} Chips</span>
                <span>{c.scans} Scans</span>
                <span className="text-primary font-medium">{c.conversion} Conv.</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}

function TeamView() {
  const members = [
    { name: "Max Müller", role: "Admin", email: "max@company.de", status: "Aktiv" },
    { name: "Lisa Wagner", role: "Mitglied", email: "lisa@company.de", status: "Aktiv" },
    { name: "Tom Braun", role: "Mitglied", email: "tom@company.de", status: "Aktiv" },
    { name: "Eva Klein", role: "Viewer", email: "eva@company.de", status: "Eingeladen" },
  ];

  return (
    <PageTransition>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm md:text-base font-semibold text-foreground">Team</h3>
          <span className="text-[10px] glass-card rounded-full px-2.5 py-1 text-primary cursor-pointer hover:bg-primary/10 transition-colors">+ Einladen</span>
        </div>

        <div className="space-y-2">
          {members.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="glass-card rounded-lg p-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                  {m.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">{m.name}</p>
                  <p className="text-[9px] text-muted-foreground">{m.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-accent text-muted-foreground">{m.role}</span>
                <span className={`text-[9px] ${m.status === "Aktiv" ? "text-green-400" : "text-yellow-400"}`}>{m.status}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}

function SettingsView() {
  const settingSections = [
    { label: "Profil bearbeiten", desc: "Name, Bio, Foto, Kontaktdaten" },
    { label: "Template wählen", desc: "Design für öffentliches Profil" },
    { label: "Webhook-Integration", desc: "CRM-Anbindung via Zapier, Salesforce" },
    { label: "Follow-Up E-Mails", desc: "Automatische Nachfass-E-Mails" },
    { label: "Ghost Mode", desc: "Profil temporär deaktivieren" },
  ];

  return (
    <PageTransition>
      <div className="space-y-4">
        <h3 className="text-sm md:text-base font-semibold text-foreground">Einstellungen</h3>
        <div className="space-y-2">
          {settingSections.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="glass-card rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-accent/30 transition-colors group"
            >
              <div>
                <p className="text-xs font-medium text-foreground">{s.label}</p>
                <p className="text-[9px] text-muted-foreground">{s.desc}</p>
              </div>
              <ChevronRight className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
