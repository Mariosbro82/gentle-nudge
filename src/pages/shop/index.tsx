import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingBag, ChevronRight, Star } from "lucide-react";

const products = [
    {
        id: "premium-nfc-tshirt",
        name: "Premium NFC T-Shirt",
        price: "49.00",
        image: "/assets/shop/model-premium.png",
        description: "Schweres Baumwoll-T-Shirt mit integriertem NFC-Chip im Ärmel.",
        rating: 5,
        tag: "Bestseller"
    },
    {
        id: "lifestyle-nfc-tee",
        name: "Lifestyle NFC Tee",
        price: "39.00",
        image: "/assets/shop/lifestyle.png",
        description: "Leichtes, atmungsaktives T-Shirt für den urbanen Alltag.",
        rating: 4,
        tag: "New"
    }
];

export default function ShopPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <Navbar />

            <section className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">The Fleet</h1>
                            <p className="text-zinc-400 text-lg max-w-xl">
                                Unsere Hardware-Kollektion. Hochwertige Textilien treffen auf unsichtbare Technologie.
                                Jedes Stück ist ein Tor zu Ihrer digitalen Identität.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 text-zinc-400 font-medium"
                        >
                            <span>Alle Produkte</span>
                            <ChevronRight size={20} />
                        </motion.div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group cursor-pointer"
                            >
                                <Link to={`/shop/${product.id}`}>
                                    <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-zinc-900 mb-6 relative">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        {product.tag && (
                                            <div className="absolute top-6 left-6 px-4 py-1 rounded-full bg-white text-black text-xs font-bold uppercase tracking-widest">
                                                {product.tag}
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-2xl font-bold mb-1">{product.name}</h3>
                                            <p className="text-zinc-500 text-sm mb-2">{product.description}</p>
                                            <div className="flex gap-1">
                                                {[...Array(product.rating)].map((_, i) => (
                                                    <Star key={i} size={14} className="fill-blue-500 text-blue-500" />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-xl font-bold">
                                            €{product.price}
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Details Section */}
                    <div className="p-12 md:p-20 rounded-[3rem] bg-zinc-900/50 border border-white/5 relative overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-3xl md:text-5xl font-bold mb-8">NFC Technik im Detail</h2>
                                <div className="space-y-6">
                                    <div className="flex gap-6">
                                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                                            <ShoppingBag className="text-blue-500" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-semibold mb-2">Pflegeleicht</h4>
                                            <p className="text-zinc-500 leading-relaxed">
                                                Die Technik ist wasserfest versiegelt. Normal waschbar bis 40°C.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
                                            <Star className="text-purple-500" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-semibold mb-2">Plug & Play</h4>
                                            <p className="text-zinc-500 leading-relaxed">
                                                Keine Batterie notwendig. Ein einfacher Tap genügt.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-3xl overflow-hidden border border-white/10 aspect-square">
                                <img
                                    src="/assets/shop/closeup.png"
                                    alt="NFC Chip Detail"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
