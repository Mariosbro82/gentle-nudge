import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, Smartphone, ShieldCheck, Zap } from "lucide-react";

const products = [
    {
        id: "premium-nfc-tshirt",
        name: "Signature Tee",
        price: "49.00",
        image: "/assets/shop/model-premium.png", // Assuming this exists or using placeholder
        description: "Heavyweight Cotton. Integrated NFC.",
        tag: "Bestseller",
        color: "bg-[#F5F5F5] dark:bg-[#1a1a1a]"
    },
    {
        id: "lifestyle-nfc-tee",
        name: "Urban Flow",
        price: "39.00",
        image: "/assets/shop/lifestyle.png", // Assuming this exists
        description: "Lightweight. Breathable. Smart.",
        tag: "New Arrival",
        color: "bg-[#F0F4FF] dark:bg-[#1a1e2e]"
    }
];

export default function ShopPage() {
    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-blue-500/30 overflow-x-hidden">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 border-b border-border pb-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="text-sm font-bold text-blue-500 tracking-wider uppercase mb-2 block">Die Kollektion</span>
                            <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-4 text-foreground">
                                The Fleet
                            </h1>
                            <p className="text-muted-foreground text-xl max-w-xl leading-relaxed">
                                Kleidung, die mehr kann. Verbinde dich mit deiner Welt durch einen einfachen Tap.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="hidden md:flex items-center gap-2 text-foreground font-medium border-b border-foreground pb-1 cursor-pointer hover:opacity-70 transition-opacity"
                        >
                            <span>Alle Produkte ansehen</span>
                            <ChevronRight size={16} />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Product Grid */}
            <section className="px-6 pb-32">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2, duration: 0.8 }}
                                className="group cursor-pointer"
                            >
                                <Link to={`/shop/${product.id}`} className="block">
                                    <div className={`aspect-[3/4] rounded-[2rem] overflow-hidden ${product.color} mb-8 relative`}>
                                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm opacity-50">
                                            {/* Placeholder if image fails to load or for visual balance */}
                                            {/* <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" /> */}
                                            <div className="text-center">
                                                <span className="block mb-2">Produktbild</span>
                                                <span className="text-xs opacity-70">{product.name}</span>
                                            </div>
                                        </div>
                                        {/* Actual Image Overlay (Uncomment when images are confirmed working) */}
                                        <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out mix-blend-multiply dark:mix-blend-normal" />

                                        <div className="absolute top-6 left-6">
                                            {product.tag && (
                                                <span className="inline-block px-4 py-1.5 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md text-xs font-bold uppercase tracking-widest text-foreground shadow-sm">
                                                    {product.tag}
                                                </span>
                                            )}
                                        </div>
                                        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="w-12 h-12 rounded-full bg-white dark:bg-black text-foreground flex items-center justify-center shadow-lg">
                                                <ChevronRight size={20} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-start px-2">
                                        <div>
                                            <h3 className="text-3xl font-bold mb-2 text-foreground group-hover:text-blue-500 transition-colors">{product.name}</h3>
                                            <p className="text-muted-foreground text-base mb-3">{product.description}</p>
                                        </div>
                                        <div className="text-2xl font-bold text-foreground">
                                            €{product.price}
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Dynamic Tech Specs */}
            <section className="py-24 px-6 bg-foreground text-background">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-blue-400 font-bold tracking-wider uppercase text-sm mb-4 block">Technology</span>
                            <h2 className="text-4xl md:text-6xl font-bold mb-8">
                                Intelligenz trifft <br />
                                Textil.
                            </h2>
                            <p className="text-lg text-white/70 mb-12 max-w-md leading-relaxed">
                                Jedes Severmore Produkt ist mit einem eigens entwickelten NFC-Chip ausgestattet.
                                Waschfest, unsichtbar und sofort einsatzbereit.
                            </p>

                            <div className="space-y-8">
                                <div className="flex gap-4 items-start">
                                    <div className="p-3 rounded-xl bg-white/10 text-white">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-1">Waterproof Shield</h4>
                                        <p className="text-white/60">Zertifiziert waschbar bis 40°C. Hält ein Leben lang.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="p-3 rounded-xl bg-white/10 text-white">
                                        <Smartphone size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-1">iOS & Android</h4>
                                        <p className="text-white/60">Keine App nötig. Funktioniert nativ mit allen modernen Smartphones.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="p-3 rounded-xl bg-white/10 text-white">
                                        <Zap size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-1">Instant Connect</h4>
                                        <p className="text-white/60">Teile Socials, Websites oder Kontaktdaten in Millisekunden.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square rounded-[3rem] overflow-hidden bg-white/5 border border-white/10 relative">
                                {/* Abstract Visual Representation of the Chip/Tech */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-64 h-64 rounded-full border border-white/20 animate-pulse flex items-center justify-center">
                                        <div className="w-48 h-48 rounded-full border border-white/40 animate-[spin_10s_linear_infinite] flex items-center justify-center">
                                            <div className="w-32 h-32 rounded-full bg-blue-500 blur-[80px]" />
                                        </div>
                                    </div>
                                </div>
                                <img src="/assets/shop/closeup.png" alt="Tech Detail" className="relative z-10 w-full h-full object-cover mix-blend-overlay opacity-50" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

