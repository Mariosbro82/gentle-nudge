"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar, ArrowRight, Mail, Building2, MessageSquare, Star } from "lucide-react";
import { PressLogosStrip } from "@/components/marketing/social-proof";

const CALENDLY_URL = "https://calendly.com/solutions-nfcwear/30min";

export function ContactSection() {
    return (
        <section id="contact" className="py-32 md:py-40 bg-background relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/[0.03] rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/[0.05] rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-6 max-w-6xl relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-center mb-16 md:mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wide uppercase mb-6">
                        <Mail className="w-3.5 h-3.5" />
                        Kontakt
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-[1.1] mb-5">
                        Bereit für den digitalen{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Handshake?</span>
                    </h2>
                    <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Starten Sie noch heute mit NFCwear und machen Sie Ihre Corporate Fashion messbar.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

                    {/* Left Col: Calendly CTA + Trust */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="lg:col-span-2 flex flex-col gap-6"
                    >
                        {/* Digital Handshake Image */}
                        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group">
                            <img
                                src="/assets/founders-contact.jpeg"
                                alt="Die Gründer von Severmore – Tjark & Noah"
                                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary-foreground text-[10px] font-bold uppercase tracking-wider mb-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                    NFC Connect
                                </div>
                                <h3 className="text-background text-lg font-extrabold tracking-tight">Der digitale Handshake</h3>
                                <p className="text-background/70 text-xs mt-1">Kontakte austauschen – ohne Papierkarten.</p>
                            </div>
                        </div>

                        {/* Calendly Card */}
                        <div className="group relative p-7 rounded-2xl bg-foreground text-background overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgb(0,0,0,0.15)]">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-background/10 flex items-center justify-center">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-extrabold tracking-tight">Demo buchen</h3>
                                        <p className="text-background/50 text-xs">30 Min. · Unverbindlich</p>
                                    </div>
                                </div>
                                <Button
                                    className="w-full bg-background text-foreground hover:bg-background/90 font-semibold h-11 text-sm transition-all duration-300 group/btn"
                                    onClick={() => window.open(CALENDLY_URL, '_blank')}
                                >
                                    Termin vereinbaren
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                </Button>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="p-5 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm space-y-4">
                            <div className="flex items-center gap-3 text-sm text-foreground">
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <span className="font-semibold text-xs">5/5 Kundenbewertung</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                                <span>🏆</span>
                                <span>Gründungspreis U21 Gewinner 2025</span>
                            </div>
                            <div className="h-px bg-border/50" />
                            <PressLogosStrip />
                        </div>
                    </motion.div>

                    {/* Right Col: Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
                        className="lg:col-span-3 p-8 md:p-10 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <MessageSquare className="w-5 h-5 text-primary" />
                            <h3 className="text-xl font-extrabold text-foreground tracking-tight">Nachricht schreiben</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-8">Oder schreiben Sie uns direkt – wir antworten innerhalb von 24h.</p>

                        <form className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Name</label>
                                    <Input placeholder="Max Mustermann" className="bg-background/50 border-input text-foreground h-11" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-muted-foreground uppercase font-semibold tracking-wider flex items-center gap-1.5">
                                        <Building2 className="w-3 h-3" />
                                        Firma
                                    </label>
                                    <Input placeholder="Example GmbH" className="bg-background/50 border-input text-foreground h-11" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">E-Mail</label>
                                <Input type="email" placeholder="max@example.com" className="bg-background/50 border-input text-foreground h-11" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Interesse an</label>
                                <Select>
                                    <SelectTrigger className="bg-background/50 border-input text-foreground h-11">
                                        <SelectValue placeholder="Bitte wählen..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border-border text-popover-foreground">
                                        <SelectItem value="corporate">Corporate Mode (Sales)</SelectItem>
                                        <SelectItem value="hospitality">Hospitality Mode</SelectItem>
                                        <SelectItem value="campaign">Campaigns / Events</SelectItem>
                                        <SelectItem value="enterprise">Enterprise Whitelabel</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Nachricht</label>
                                <Textarea placeholder="Erzählen Sie uns von Ihrem Projekt..." className="bg-background/50 border-input text-foreground min-h-[130px] resize-none" />
                            </div>

                            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 font-semibold text-sm transition-all duration-300 hover:shadow-[0_4px_20px_hsl(var(--primary)/0.3)] group">
                                Anfrage senden
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Button>

                            <p className="text-xs text-muted-foreground text-center">
                                Mit dem Absenden stimmen Sie unserer{" "}
                                <a href="/privacy" className="underline underline-offset-2 hover:text-foreground transition-colors">Datenschutzerklärung</a> zu.
                            </p>
                        </form>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
