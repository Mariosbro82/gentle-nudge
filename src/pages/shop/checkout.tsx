import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Lock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function CheckoutPage() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        // Simulate Stripe payment
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            setTimeout(() => {
                navigate('/shop');
            }, 3000);
        }, 2000);
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center space-y-6"
                >
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 size={40} className="text-green-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Zahlung erfolgreich!</h1>
                    <p className="text-zinc-400">
                        Vielen Dank für Ihre Bestellung. Wir bereiten den Versand Ihrer NFCwear Produkte vor.
                    </p>
                    <p className="text-zinc-500 text-sm">
                        Weiterleitung zum Shop in Kürze...
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-zinc-950 text-white selection:bg-blue-500/30">
            <div className="max-w-5xl mx-auto px-6 py-12 md:py-20 lg:py-24">
                <Link to="/shop" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-12 transition-colors">
                    <ArrowLeft size={20} />
                    <span>Zurück zum Shop</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Form */}
                    <div className="lg:col-span-7">
                        <h1 className="text-3xl font-bold mb-10">Checkout</h1>

                        <form onSubmit={handlePayment} className="space-y-8">
                            <section>
                                <h3 className="text-zinc-500 font-bold text-sm uppercase tracking-widest mb-6">Versanddetails</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        placeholder="Vorname"
                                        className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors w-full"
                                        required
                                    />
                                    <input
                                        placeholder="Nachname"
                                        className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors w-full"
                                        required
                                    />
                                </div>
                                <input
                                    placeholder="E-Mail-Adresse"
                                    type="email"
                                    className="mt-4 bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors w-full"
                                    required
                                />
                                <input
                                    placeholder="Straße & Hausnummer"
                                    className="mt-4 bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors w-full"
                                    required
                                />
                            </section>

                            <section>
                                <h3 className="text-zinc-500 font-bold text-sm uppercase tracking-widest mb-6">Zahlungsmittel</h3>
                                <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden">
                                    <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <CreditCard className="text-blue-500" />
                                            <span className="font-medium">Kreditkarte</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="w-8 h-5 bg-zinc-800 rounded"></div>
                                            <div className="w-8 h-5 bg-zinc-800 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div className="relative">
                                            <input
                                                placeholder="Kartennummer"
                                                className="bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors w-full pl-12"
                                                required
                                            />
                                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                placeholder="MM / YY"
                                                className="bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors w-full"
                                                required
                                            />
                                            <input
                                                placeholder="CVC"
                                                className="bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors w-full"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <Button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full h-16 rounded-2xl bg-white text-black hover:bg-zinc-200 text-lg font-bold transition-all relative"
                            >
                                {isProcessing ? (
                                    <div className="flex items-center gap-3">
                                        <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                        <span>Zahlung wird verarbeitet...</span>
                                    </div>
                                ) : (
                                    <span>Jetzt bezahlen — €49,00</span>
                                )}
                            </Button>

                            <div className="flex items-center justify-center gap-6 text-zinc-500">
                                <div className="flex items-center gap-2 text-xs">
                                    <ShieldCheck size={14} />
                                    <span>Sichere SSL-Zahlung</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <Lock size={14} />
                                    <span>Stripe-verschlüsselt</span>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 sticky top-24">
                            <h3 className="text-xl font-bold mb-8">Bestellübersicht</h3>
                            <div className="space-y-6 mb-8">
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-16 h-16 rounded-xl bg-black border border-white/10 overflow-hidden shrink-0">
                                            <img src="/assets/shop/model-premium.png" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium">Premium NFC T-Shirt</h4>
                                            <p className="text-xs text-zinc-500">Größe: M • Farbe: Schwarz</p>
                                        </div>
                                    </div>
                                    <span className="font-bold">€49,00</span>
                                </div>
                            </div>

                            <div className="space-y-3 pt-6 border-t border-white/5 mb-6">
                                <div className="flex justify-between text-sm text-zinc-400">
                                    <span>Zwischensumme</span>
                                    <span>€49,00</span>
                                </div>
                                <div className="flex justify-between text-sm text-zinc-400">
                                    <span>Versand</span>
                                    <span className="text-green-500">Gratis</span>
                                </div>
                            </div>

                            <div className="flex justify-between text-xl font-bold pt-6 border-t border-white/5">
                                <span>Gesamt</span>
                                <span className="text-white">€49,00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
