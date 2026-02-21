import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const SITE_PASSWORD = "nfcwear2026";
const STORAGE_KEY = "nfcwear_site_access";

// Realistic code snippets that cycle through
const CODE_LINES = [
  'import { createClient } from "@supabase/supabase-js";',
  'import { NTAG424 } from "@nfc/secure-tap";',
  '',
  'const supabase = createClient(SUPABASE_URL, ANON_KEY);',
  '',
  'interface ChipConfig {',
  '  uid: string;',
  '  mode: "corporate" | "hospitality" | "campaign";',
  '  sun_cmac: string;',
  '  assigned_user_id: string;',
  '}',
  '',
  'async function resolveNfcTap(uid: string, cmac: string) {',
  '  const verified = await NTAG424.verifySUN(uid, cmac);',
  '  if (!verified) throw new Error("CMAC_INVALID");',
  '',
  '  const { data: chip } = await supabase',
  '    .from("chips")',
  '    .select("*, users(*), campaign_overrides(*)")',
  '    .eq("uid", uid)',
  '    .single();',
  '',
  '  if (!chip) throw new Error("CHIP_NOT_FOUND");',
  '',
  '  // Check for active campaign override',
  '  const override = chip.campaign_overrides?.find(',
  '    (c: any) => c.active && new Date(c.end_date) > new Date()',
  '  );',
  '',
  '  if (override) return { redirect: override.target_url };',
  '',
  '  // Route based on active mode',
  '  switch (chip.active_mode) {',
  '    case "corporate":',
  '      return { profile: `/p/${chip.users.slug}` };',
  '    case "hospitality":',
  '      return { redirect: chip.review_data?.url };',
  '    case "campaign":',
  '      return { redirect: chip.target_url };',
  '    default:',
  '      return { profile: `/p/${chip.users.slug}` };',
  '  }',
  '}',
  '',
  '// Log scan event for analytics',
  'async function logScan(chipId: string, req: Request) {',
  '  const ua = req.headers.get("user-agent") ?? "";',
  '  const ip = req.headers.get("x-forwarded-for") ?? "";',
  '',
  '  await supabase.from("scans").insert({',
  '    chip_id: chipId,',
  '    user_agent: ua,',
  '    ip_address: ip,',
  '    device_type: detectDevice(ua),',
  '    mode_at_scan: "corporate",',
  '  });',
  '}',
  '',
  'export async function handleNfcRequest(req: Request) {',
  '  const url = new URL(req.url);',
  '  const uid = url.pathname.split("/").pop();',
  '  const cmac = url.searchParams.get("sun");',
  '',
  '  if (!uid || !cmac) return new Response("Bad Request", { status: 400 });',
  '',
  '  const result = await resolveNfcTap(uid, cmac);',
  '  await logScan(uid, req);',
  '',
  '  return Response.redirect(result.redirect ?? result.profile);',
  '}',
];

function CodeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleLines, setVisibleLines] = useState<{ text: string; id: number }[]>([]);
  const lineCounter = useRef(0);

  useEffect(() => {
    // Start with some lines already visible
    const initial = CODE_LINES.slice(0, 12).map((text, i) => ({
      text,
      id: i,
    }));
    lineCounter.current = 12;
    setVisibleLines(initial);

    const interval = setInterval(() => {
      const idx = lineCounter.current % CODE_LINES.length;
      lineCounter.current++;

      setVisibleLines((prev) => {
        const next = [...prev, { text: CODE_LINES[idx], id: lineCounter.current }];
        // Keep max 30 lines visible
        if (next.length > 30) return next.slice(-30);
        return next;
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visibleLines]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10" />

      <div
        ref={containerRef}
        className="absolute inset-0 overflow-hidden font-mono text-xs leading-6 opacity-[0.07] p-8 pt-16"
      >
        {visibleLines.map((line) => (
          <div key={line.id} className="whitespace-pre text-foreground">
            <span className="text-muted-foreground/50 inline-block w-8 text-right mr-4">
              {(line.id % CODE_LINES.length) + 1}
            </span>
            {colorizeLine(line.text)}
          </div>
        ))}
        {/* Blinking cursor */}
        <span className="inline-block w-2 h-4 bg-foreground animate-pulse ml-12" />
      </div>
    </div>
  );
}

// Simple syntax highlighting using semantic tokens
function colorizeLine(line: string) {
  if (line.trim() === '') return '\u00A0';
  if (line.trim().startsWith('//')) return <span className="opacity-50">{line}</span>;
  if (line.trim().startsWith('import') || line.trim().startsWith('export') || line.trim().startsWith('async') || line.trim().startsWith('const') || line.trim().startsWith('case') || line.trim().startsWith('switch') || line.trim().startsWith('if') || line.trim().startsWith('return') || line.trim().startsWith('default') || line.trim().startsWith('interface')) {
    const keyword = line.match(/^\s*(import|export|async|const|case|switch|if|return|default|interface|function|await|throw|new)/)?.[0] ?? '';
    const rest = line.slice(keyword.length);
    return <><span className="opacity-80">{keyword}</span>{rest}</>;
  }
  return line;
}

export function PasswordGate({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "granted") {
      setAuthorized(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SITE_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "granted");
      setAuthorized(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (authorized) return <>{children}</>;

  return (
    <div className="dark min-h-screen relative flex items-center justify-center bg-background overflow-hidden">
      <CodeBackground />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 w-full max-w-sm px-6"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Logo / Brand */}
          <div className="space-y-3 text-center">
            <div className="inline-flex items-center gap-2 text-muted-foreground text-xs font-mono tracking-widest uppercase">
              <span className="inline-block w-2 h-2 rounded-full bg-chart-1 animate-pulse" />
              build in progress
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              NFCwear <span className="text-muted-foreground font-normal">by severmore</span>
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Staging Environment — Zugang mit Passwort
            </p>
          </div>

          {/* Input */}
          <div className="space-y-3">
            <div
              className={`glass-card rounded-xl transition-all duration-300 ${
                isFocused ? "ring-1 ring-chart-1/30 shadow-[0_0_30px_-8px_hsl(var(--chart-1)/0.15)]" : ""
              } ${error ? "ring-1 ring-destructive/40" : ""}`}
            >
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Passwort eingeben"
                autoFocus
                className="w-full px-4 py-3.5 bg-transparent text-foreground placeholder:text-muted-foreground/50 focus:outline-none text-sm font-mono"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-destructive font-mono pl-1"
              >
                → Zugang verweigert
              </motion.p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-foreground text-background font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Authenticate
          </button>

          {/* Footer hint */}
          <p className="text-center text-[11px] text-muted-foreground/40 font-mono">
            v0.9.0-beta · NTAG424 DNA · Secure Access
          </p>
        </form>
      </motion.div>
    </div>
  );
}
