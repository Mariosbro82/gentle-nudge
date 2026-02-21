import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const SITE_PASSWORD = "nfcwear2026";
const STORAGE_KEY = "nfcwear_site_access";

// Realistic code snippets that cycle through
const CODE_LINES = [
  'import { SecureChannel } from "@crypto/handshake";',
  'import { TokenVault } from "./lib/vault";',
  '',
  'const vault = TokenVault.init({ algo: "AES-256-GCM" });',
  '',
  'interface SessionPayload {',
  '  nonce: string;',
  '  timestamp: number;',
  '  fingerprint: Uint8Array;',
  '  ttl: number;',
  '}',
  '',
  'async function deriveKey(seed: string, salt: Uint8Array) {',
  '  const encoder = new TextEncoder();',
  '  const keyMaterial = await crypto.subtle.importKey(',
  '    "raw", encoder.encode(seed), "PBKDF2", false, ["deriveBits"]',
  '  );',
  '',
  '  return crypto.subtle.deriveBits(',
  '    { name: "PBKDF2", salt, iterations: 100_000, hash: "SHA-256" },',
  '    keyMaterial, 256',
  '  );',
  '}',
  '',
  'class HandshakeProtocol {',
  '  private channel: SecureChannel;',
  '  private sessionKey: CryptoKey | null = null;',
  '',
  '  constructor(endpoint: string) {',
  '    this.channel = new SecureChannel(endpoint, {',
  '      protocol: "TLS_1_3",',
  '      cipherSuite: "CHACHA20_POLY1305",',
  '    });',
  '  }',
  '',
  '  async negotiate(clientHello: Uint8Array) {',
  '    const serverHello = await this.channel.send(clientHello);',
  '    const sharedSecret = await this.computeECDH(serverHello);',
  '',
  '    this.sessionKey = await crypto.subtle.importKey(',
  '      "raw", sharedSecret, { name: "AES-GCM" }, false, ["encrypt"]',
  '    );',
  '',
  '    return { status: "established", cipher: "AES-256-GCM" };',
  '  }',
  '',
  '  private async computeECDH(peerKey: ArrayBuffer) {',
  '    const keyPair = await crypto.subtle.generateKey(',
  '      { name: "ECDH", namedCurve: "P-384" }, true, ["deriveBits"]',
  '    );',
  '    return crypto.subtle.deriveBits(',
  '      { name: "ECDH", public: peerKey }, keyPair.privateKey, 256',
  '    );',
  '  }',
  '}',
  '',
  'async function verifyIntegrity(payload: SessionPayload) {',
  '  const hash = await crypto.subtle.digest(',
  '    "SHA-512", new Uint8Array(payload.fingerprint)',
  '  );',
  '  const isValid = vault.compare(hash, payload.nonce);',
  '  if (!isValid) throw new Error("INTEGRITY_CHECK_FAILED");',
  '  return { verified: true, algo: "SHA-512" };',
  '}',
  '',
  'export async function bootstrap(config: Record<string, unknown>) {',
  '  const protocol = new HandshakeProtocol(config.endpoint as string);',
  '  const hello = crypto.getRandomValues(new Uint8Array(32));',
  '  const session = await protocol.negotiate(hello);',
  '  console.info(`[secure] ${session.cipher} channel ready`);',
  '  return session;',
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
        className="absolute inset-0 overflow-hidden font-mono text-sm leading-7 opacity-[0.25] p-4 pt-4 columns-2 gap-8"
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
