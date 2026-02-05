"use client";

import { use } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Star, MapPin, Utensils, DollarSign, ChefHat } from "lucide-react";

const MOCK_COMPANY = {
    name: "La Piazza Italia",
    type: "Restaurant",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop",
    google_url: "https://google.com/maps",
    tripadvisor_url: "https://tripadvisor.com",
};

export default function HospitalityPage({ params }: { params: Promise<{ companyId: string }> }) {
    const { companyId } = use(params);
    return (
        <main className="relative min-h-screen bg-black pb-10">

            {/* Header Image */}
            <div className="h-[250px] relative">
                <div className="absolute inset-0 bg-linear-to-b from-transparent to-black z-10" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={MOCK_COMPANY.image} alt={MOCK_COMPANY.name} className="w-full h-full object-cover" />

                <div className="absolute bottom-4 left-6 z-20">
                    <span className="px-2 py-1 rounded-md bg-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                        {MOCK_COMPANY.type}
                    </span>
                    <h1 className="text-3xl font-bold text-white">{MOCK_COMPANY.name}</h1>
                </div>
            </div>

            <div className="px-6 relative z-20 -mt-2 space-y-8">

                {/* Review Section */}
                <section>
                    <p className="text-zinc-400 text-sm mb-4">Wie hat es Ihnen gefallen? Bewerten Sie uns in Sekunden.</p>
                    <div className="grid grid-cols-2 gap-4">
                        <Button className="h-24 flex flex-col items-center justify-center gap-2 bg-zinc-900 border border-white/10 hover:bg-zinc-800 hover:border-white/20 transition-all rounded-xl" onClick={() => window.open(MOCK_COMPANY.google_url, '_blank')}>
                            <MapPin className="text-blue-500" size={28} />
                            <span className="font-semibold text-white">Google</span>
                        </Button>
                        <Button className="h-24 flex flex-col items-center justify-center gap-2 bg-zinc-900 border border-white/10 hover:bg-zinc-800 hover:border-white/20 transition-all rounded-xl" onClick={() => window.open(MOCK_COMPANY.tripadvisor_url, '_blank')}>
                            <div className="w-7 h-7 rounded-sm bg-green-500 flex items-center justify-center text-black font-bold text-xs" >TA</div>
                            <span className="font-semibold text-white">TripAdvisor</span>
                        </Button>
                    </div>
                </section>

                {/* Menu & Tipping */}
                <section className="space-y-4">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <ChefHat className="text-orange-500" size={20} /> Service
                    </h3>

                    <Button variant="outline" className="w-full justify-start h-14 bg-zinc-900/50 border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-900">
                        <Utensils className="mr-4 text-zinc-500" />
                        Digitale Speisekarte ansehen
                    </Button>

                    <div className="p-4 rounded-xl bg-gradient-to-br from-green-900/20 to-zinc-900 border border-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                    <DollarSign size={20} />
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold text-sm">Trinkgeld geben?</h4>
                                    <p className="text-zinc-500 text-xs">Kommt zu 100% beim Team an.</p>
                                </div>
                            </div>
                            <Button size="sm" className="bg-green-600 hover:bg-green-500 text-white rounded-full px-6">
                                Pay
                            </Button>
                        </div>

                        <div className="flex gap-2 justify-between">
                            <Button variant="ghost" size="sm" className="flex-1 bg-white/5 hover:bg-white/10 text-xs">2€</Button>
                            <Button variant="ghost" size="sm" className="flex-1 bg-white/5 hover:bg-white/10 text-xs">5€</Button>
                            <Button variant="ghost" size="sm" className="flex-1 bg-white/5 hover:bg-white/10 text-xs">10€</Button>
                        </div>
                    </div>
                </section>

            </div>

            <div className="mt-12 text-center">
                <p className="text-[10px] text-zinc-700">Service provided by NFCwear</p>
            </div>

        </main>
    );
}
