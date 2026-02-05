"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Download, Linkedin, Mail, Phone, Globe, UserPlus, FileText } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ConnectForm } from "./connect-form";

interface ProfileViewProps {
    user: any;
}

export function ProfileView({ user }: ProfileViewProps) {
    const generateVCard = () => {
        // Generate vCard blob
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${user.name}
ORG:${user.company}
TITLE:${user.title}
TEL;TYPE=WORK,VOICE:${user.phone}
EMAIL:${user.email}
URL:${user.website}
END:VCARD`;

        const blob = new Blob([vcard], { type: "text/vcard" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${user.name}.vcf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <main className="relative min-h-screen bg-black pb-20 overflow-x-hidden">

            {/* LinkedIn-Style Banner Area */}
            <div className="h-48 w-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900 opacity-80" />
                <img
                    src={user.banner}
                    alt="Banner"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </div>

            {/* Profile Info Card (Liquid Glass) */}
            <div className="px-4 -mt-24 relative z-10 flex flex-col items-center">

                {/* Glass Container */}
                <div className="w-full max-w-md p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col items-center text-center">

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="p-1.5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mb-4 -mt-20 shadow-xl"
                    >
                        <Avatar className="w-32 h-32 border-4 border-black bg-zinc-900">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>FH</AvatarFallback>
                        </Avatar>
                    </motion.div>
                </div>

                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-2xl font-bold text-white mb-1"
                >
                    {user.name}
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-zinc-400 text-sm font-medium mb-1"
                >
                    {user.title} @ <span className="text-white">{user.company}</span>
                </motion.p>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-zinc-500 text-xs max-w-[260px] leading-relaxed mb-8"
                >
                    {user.bio}
                </motion.p>

                {/* Action Buttons */}
                <div className="w-full space-y-3 mb-8">
                    <Button className="w-full bg-white text-black hover:bg-zinc-200 h-12 rounded-xl text-base font-semibold shadow-[0_0_20px_rgba(255,255,255,0.1)]" onClick={generateVCard}>
                        <UserPlus size={18} className="mr-2" /> Kontakt speichern
                    </Button>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full border-blue-500/20 text-blue-400 hover:bg-blue-950/30 h-12 rounded-xl border-dashed">
                                <FileText size={18} className="mr-2" /> Daten austauschen
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-zinc-900 border-zinc-800 text-white w-[90%] rounded-xl">
                            <ConnectForm ownerName={user.name} ownerId={user.id} />
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Social Links Grid */}
                <div className="grid grid-cols-4 gap-4 w-full">
                    <a href={`tel:${user.phone}`} className="flex flex-col items-center gap-2 group">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-zinc-800 transition-all">
                            <Phone size={20} />
                        </div>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Call</span>
                    </a>
                    <a href={`mailto:${user.email}`} className="flex flex-col items-center gap-2 group">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-zinc-800 transition-all">
                            <Mail size={20} />
                        </div>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Email</span>
                    </a>
                    <a href={user.linkedin} target="_blank" className="flex flex-col items-center gap-2 group">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-zinc-800 transition-all">
                            <Linkedin size={20} />
                        </div>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Social</span>
                    </a>
                    <a href={user.website} target="_blank" className="flex flex-col items-center gap-2 group">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-zinc-800 transition-all">
                            <Globe size={20} />
                        </div>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Web</span>
                    </a>
                </div>

            </div>

            {/* Footer Branding */}
            <div className="absolute bottom-6 w-full text-center">
                <p className="text-[10px] text-zinc-600 font-medium">Powered by NFCwear</p>
            </div>

        </main>
    );
}
