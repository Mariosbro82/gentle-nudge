import { useEffect, useState } from "react";
import { X, Download, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isIos() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isInStandaloneMode() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as any).standalone === true
  );
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showAndroid, setShowAndroid] = useState(false);
  const [showIos, setShowIos] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show if already installed or previously dismissed this session
    if (isInStandaloneMode()) return;
    if (sessionStorage.getItem("pwa-dismissed")) return;

    // Android / Chrome: listen for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowAndroid(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // iOS: show manual instructions after short delay
    if (isIos()) {
      const timer = setTimeout(() => setShowIos(true), 2000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("beforeinstallprompt", handler);
      };
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function dismiss() {
    setDismissed(true);
    setShowAndroid(false);
    setShowIos(false);
    sessionStorage.setItem("pwa-dismissed", "1");
  }

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
    dismiss();
  }

  if (dismissed || isInStandaloneMode()) return null;

  // ── Android Sheet ──
  if (showAndroid) {
    return (
      <Sheet open onOpenChange={(open) => !open && dismiss()}>
        <SheetContent
          side="bottom"
          className="rounded-t-2xl border-t border-border bg-background px-6 pb-8 pt-4"
        >
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-muted" />

          <div className="flex items-start gap-4">
            <img
              src="/pwa-icon-192.png"
              alt="NFCwear"
              className="h-14 w-14 rounded-xl shadow-lg"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold">NFCwear installieren</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Für schnelleren Zugriff auf der Messe – direkt vom Homescreen.
              </p>
            </div>
            <button
              onClick={dismiss}
              className="rounded-full p-1.5 text-muted-foreground hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <Button
            onClick={handleInstall}
            className="mt-6 w-full gap-2"
            size="lg"
          >
            <Download className="h-5 w-5" />
            App installieren
          </Button>
        </SheetContent>
      </Sheet>
    );
  }

  // ── iOS Popover ──
  if (showIos) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-500">
        <div className="relative rounded-2xl border border-border bg-background/95 backdrop-blur-xl p-4 shadow-2xl">
          <button
            onClick={dismiss}
            className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-3">
            <img
              src="/pwa-icon-192.png"
              alt="NFCwear"
              className="h-11 w-11 rounded-xl shadow-md"
            />
            <div className="flex-1 pr-6">
              <h3 className="text-sm font-semibold">NFCwear installieren</h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Tippe auf{" "}
                <Share className="inline h-3.5 w-3.5 -mt-0.5 text-blue-500" />{" "}
                <span className="font-medium text-foreground">Teilen</span> und
                wähle{" "}
                <span className="font-medium text-foreground">
                  „Zum Home-Bildschirm"
                </span>
              </p>
            </div>
          </div>

          {/* Arrow pointing down to Safari toolbar */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-0 w-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-border" />
        </div>
      </div>
    );
  }

  return null;
}
