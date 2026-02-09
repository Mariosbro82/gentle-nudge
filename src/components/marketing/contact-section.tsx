"use client";

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
import { Calendar } from "lucide-react";

export function ContactSection() {
    return (
        <section id="contact" className="py-24 bg-background relative">
            <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* Left Col: Copy & Calendly */}
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                            Bereit für den digitalen <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Handshake?</span>
                        </h2>
                        <p className="text-muted-foreground text-lg mb-10">
                            Starten Sie noch heute mit NFCwear und revolutionieren Sie Ihre Corporate Fashion. Vereinbaren Sie eine Demo oder schreiben Sie uns.
                        </p>

                        <div className="flex gap-6 flex-col sm:flex-row">
                            <div className="flex-1 p-6 rounded-xl bg-card border border-border hover:border-blue-500/30 transition-colors">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                        <Calendar size={20} />
                                    </div>
                                    <h3 className="text-foreground font-semibold">Direkt Termin buchen</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-6">Wählen Sie einen passenden Slot für eine 15-minütige Demo.</p>
                                <Button className="w-full bg-foreground text-background hover:bg-foreground/90" onClick={() => window.open('https://calendly.com', '_blank')}>
                                    Calendly öffnen
                                </Button>
                            </div>

                            {/* Digital Handshake Image - 2:3 Ratio */}
                            <div className="hidden sm:block relative w-[200px] aspect-[2/3] rounded-2xl overflow-hidden border border-border shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 group">

                                <img
                                    src="/assets/digital-handshake.png"
                                    alt="Digital Handshake"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute bottom-4 left-4 z-20">
                                    <div className="bg-blue-500/20 backdrop-blur-md border border-blue-500/30 text-blue-400 text-[10px] font-bold px-2 py-1 rounded-full inline-block">
                                        NFC CONNECT
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Form */}
                    <div className="p-8 rounded-2xl bg-card border border-border backdrop-blur-sm">
                        <h3 className="text-xl font-bold text-foreground mb-6">Kontakt aufnehmen</h3>
                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-muted-foreground uppercase font-semibold">Name</label>
                                    <Input placeholder="Max Mustermann" className="bg-background/50 border-input text-foreground" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-muted-foreground uppercase font-semibold">Firma</label>
                                    <Input placeholder="Example GmbH" className="bg-background/50 border-input text-foreground" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-muted-foreground uppercase font-semibold">E-Mail</label>
                                <Input type="email" placeholder="max@example.com" className="bg-background/50 border-input text-foreground" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-muted-foreground uppercase font-semibold">Interesse an</label>
                                <Select>
                                    <SelectTrigger className="bg-background/50 border-input text-foreground">
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
                                <label className="text-xs text-muted-foreground uppercase font-semibold">Nachricht</label>
                                <Textarea placeholder="Erzählen Sie uns von Ihrem Projekt..." className="bg-background/50 border-input text-foreground min-h-[120px]" />
                            </div>

                            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                                Anfrage senden
                            </Button>
                        </form>
                    </div>

                </div>
            </div>
        </section>
    );
}
