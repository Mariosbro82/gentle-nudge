import { Navbar } from "@/components/marketing/navbar";

export default function ProductsPage() {
    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="container mx-auto px-6 pt-32">
                <h1 className="text-4xl font-bold mb-4">Produkte & Showcase</h1>
                <p className="text-zinc-400">Hier werden bald unsere innovativen NFC-Produkte präsentiert.</p>
            </div>
        </main>
    );
}
