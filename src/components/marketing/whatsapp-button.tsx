import { MessageCircle, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WHATSAPP_NUMBER = "4915565824919";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hey%20Severmore%20Team%2C%20ich%20habe%20eine%20Frage%20%F0%9F%91%8B`;

export function WhatsAppButton() {
  const [showPopup, setShowPopup] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!dismissed) setShowPopup(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, [dismissed]);

  function handleDismiss() {
    setShowPopup(false);
    setDismissed(true);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-72 rounded-2xl border border-border bg-card p-4 shadow-xl shadow-black/10"
          >
            <button
              onClick={handleDismiss}
              className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Schließen"
            >
              <X className="w-4 h-4" />
            </button>
            <p className="text-sm font-semibold text-foreground mb-1">
              👋 Hey, können wir helfen?
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              Du hast Fragen zu unseren Produkten oder zur Plattform? Schreib uns direkt per WhatsApp – wir antworten in Minuten!
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-sm font-medium text-white hover:brightness-110 transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              Jetzt chatten
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 hover:scale-110 hover:shadow-xl transition-all duration-200"
      >
        <MessageCircle className="w-7 h-7 fill-current" />
      </a>
    </div>
  );
}
