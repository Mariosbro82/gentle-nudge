import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "4915565824919";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 hover:scale-110 hover:shadow-xl transition-all duration-200"
    >
      <MessageCircle className="w-7 h-7 fill-current" />
    </a>
  );
}
