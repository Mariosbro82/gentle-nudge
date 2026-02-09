import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ShoppingCart, ArrowLeft, Star, ShieldCheck, Truck, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const products = {
    "premium-nfc-tshirt": {
        name: "Premium NFC T-Shirt",
        price: "49.00",
        images: ["/assets/shop/model-premium.png", "/assets/shop/closeup.png"],
        description: "Unser Flaggschiff-Produkt. Ein T-Shirt, das mehr kann als nur gut auszusehen. Gefertigt aus 240gsm schwerer Premium-Baumwolle, bietet es nicht nur exzellenten Tragekomfort, sondern integriert modernste NTAG424 Chip-Technologie im Ärmel.",
        details: [
            "100% Bio-Baumwolle (Fair-Trade)",
            "Wasserfester NFC-Chip (waschbar)",
            "Zertifizierte Produktion in der EU",
            "Inklusive lebenslangem Software-Support"
        ]
    },
    "lifestyle-nfc-tee": {
        name: "Lifestyle NFC Tee",
        price: "39.00",
        images: ["/assets/shop/lifestyle.png", "/assets/shop/closeup.png"],
        description: "Das perfekte T-Shirt für den urbanen Lifestyle. Leicht, atmungsaktiv und immer bereit für den nächsten Tap.",
        details: [
            "Leichte Funktionsbaumwolle",
            "Integrierter NFC-Bereich im Ärmel",
            "Moderne Passform (Oversized)",
            "Umweltfreundliche Farben"
        ]
    }
};

export default function ProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const product = products[id as keyof typeof products];
    const [selectedSize, setSelectedSize] = useState("M");
    const [activeImage, setActiveImage] = useState(0);

    if (!product) return <div>Product not found</div>;

    return (
        <main className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <Navbar />

            <section className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <Link to="/shop" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-12 transition-colors">
                        <ArrowLeft size={20} />
                        <span>Zurück zum Shop</span>
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-32">
                        {/* Image Gallery */}
                        <div className="space-y-6">
                            <motion.div
                                key={activeImage}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="aspect-[4/5] rounded-3xl overflow-hidden bg-zinc-900 border border-white/5"
                            >
                                <img
                                    src={product.images[activeImage]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(i)}
                                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? "border-blue-500" : "border-transparent opacity-50 hover:opacity-100"
                                            }`}
                                    >
                                        <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col">
                            <div className="mb-8">
                                <div className="flex items-center gap-2 text-blue-500 font-medium mb-4">
                                    <Star size={16} className="fill-current" />
                                    <span>Premium Hardware</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>
                                <div className="text-3xl font-bold text-white mb-6">€{product.price}</div>
                                <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                                    {product.description}
                                </p>
                            </div>

                            {/* Sizes */}
                            <div className="mb-10">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4">Größe auswählen</h4>
                                <div className="flex gap-4">
                                    {["S", "M", "L", "XL"].map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`w-14 h-14 rounded-full border-2 flex items-center justify-center font-bold transition-all ${selectedSize === size
                                                ? "border-blue-500 bg-blue-500 text-white"
                                                : "border-white/10 hover:border-white/30 text-zinc-400"
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Action */}
                            <div className="flex flex-col gap-4 mb-12">
                                <Button
                                    onClick={() => navigate('/shop/checkout')}
                                    className="h-16 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-lg font-bold shadow-lg shadow-blue-600/20"
                                >
                                    <ShoppingCart className="mr-2" />
                                    In den Warenkorb
                                </Button>
                                <p className="text-center text-zinc-500 text-sm italic">
                                    Blitzschneller Versand in 2-3 Werktagen.
                                </p>
                            </div>

                            {/* Trust Features */}
                            <div className="grid grid-cols-3 gap-6 pt-12 border-t border-white/10">
                                <div className="flex flex-col items-center text-center gap-2">
                                    <ShieldCheck className="text-blue-500" />
                                    <span className="text-xs font-medium text-zinc-400">Garantie</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-2">
                                    <Truck className="text-purple-500" />
                                    <span className="text-xs font-medium text-zinc-400">Gratis Versand</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-2">
                                    <RefreshCcw className="text-indigo-500" />
                                    <span className="text-xs font-medium text-zinc-400">30 Tage Rückgabe</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
