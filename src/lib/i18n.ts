// Lightweight i18n system for public profiles
export type SupportedLang = "de" | "en" | "es" | "fr";

const translations: Record<SupportedLang, Record<string, string>> = {
  de: {
    "save_contact": "Kontakt speichern",
    "about_me": "Über mich",
    "call": "Anrufen",
    "email": "E-Mail",
    "web": "Web",
    "visit_website": "Website besuchen",
    "live_event": "Live Event",
    "contact_form_title": "Nachricht senden",
    "contact_form_name": "Ihr Name",
    "contact_form_email": "Ihre E-Mail",
    "contact_form_phone": "Ihre Telefonnummer",
    "contact_form_message": "Ihre Nachricht",
    "contact_form_submit": "Nachricht senden",
    "contact_form_consent": "Ich stimme der Verarbeitung meiner Daten zu.",
    "chat_with_ai": "Chatte mit meiner KI",
    "chat_placeholder": "Schreibe eine Nachricht...",
    "chat_error": "Leider ist der Assistent gerade nicht erreichbar. Bitte versuchen Sie es später erneut.",
    "resources": "Ressourcen",
    "powered_by": "Powered by Severmore",
    "language": "Sprache",
  },
  en: {
    "save_contact": "Save Contact",
    "about_me": "About me",
    "call": "Call",
    "email": "Email",
    "web": "Web",
    "visit_website": "Visit Website",
    "live_event": "Live Event",
    "contact_form_title": "Send a message",
    "contact_form_name": "Your Name",
    "contact_form_email": "Your Email",
    "contact_form_phone": "Your Phone",
    "contact_form_message": "Your Message",
    "contact_form_submit": "Send Message",
    "contact_form_consent": "I consent to the processing of my data.",
    "chat_with_ai": "Chat with my AI",
    "chat_placeholder": "Type a message...",
    "chat_error": "The assistant is currently unavailable. Please try again later.",
    "resources": "Resources",
    "powered_by": "Powered by Severmore",
    "language": "Language",
  },
  es: {
    "save_contact": "Guardar Contacto",
    "about_me": "Sobre mí",
    "call": "Llamar",
    "email": "Correo",
    "web": "Web",
    "visit_website": "Visitar Web",
    "live_event": "Evento en Vivo",
    "contact_form_title": "Enviar mensaje",
    "contact_form_name": "Su Nombre",
    "contact_form_email": "Su Correo",
    "contact_form_phone": "Su Teléfono",
    "contact_form_message": "Su Mensaje",
    "contact_form_submit": "Enviar Mensaje",
    "contact_form_consent": "Acepto el procesamiento de mis datos.",
    "chat_with_ai": "Chatea con mi IA",
    "chat_placeholder": "Escribe un mensaje...",
    "chat_error": "El asistente no está disponible. Inténtelo de nuevo más tarde.",
    "resources": "Recursos",
    "powered_by": "Powered by Severmore",
    "language": "Idioma",
  },
  fr: {
    "save_contact": "Enregistrer le Contact",
    "about_me": "À propos",
    "call": "Appeler",
    "email": "E-mail",
    "web": "Web",
    "visit_website": "Visiter le Site",
    "live_event": "Événement en Direct",
    "contact_form_title": "Envoyer un message",
    "contact_form_name": "Votre Nom",
    "contact_form_email": "Votre E-mail",
    "contact_form_phone": "Votre Téléphone",
    "contact_form_message": "Votre Message",
    "contact_form_submit": "Envoyer",
    "contact_form_consent": "J'accepte le traitement de mes données.",
    "chat_with_ai": "Discuter avec mon IA",
    "chat_placeholder": "Écrivez un message...",
    "chat_error": "L'assistant est actuellement indisponible. Veuillez réessayer plus tard.",
    "resources": "Ressources",
    "powered_by": "Powered by Severmore",
    "language": "Langue",
  },
};

export const LANG_LABELS: Record<SupportedLang, string> = {
  de: "Deutsch",
  en: "English",
  es: "Español",
  fr: "Français",
};

export function detectLanguage(): SupportedLang {
  const browserLang = navigator.language.slice(0, 2).toLowerCase();
  if (browserLang in translations) return browserLang as SupportedLang;
  return "de";
}

export function t(key: string, lang: SupportedLang): string {
  return translations[lang]?.[key] || translations["de"][key] || key;
}
