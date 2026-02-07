import { Navbar } from "@/components/marketing/navbar";

export default function CompanyPage() {
    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="container mx-auto px-6 pt-32">
                <h1 className="text-4xl font-bold mb-4">Über Uns</h1>
                <p className="text-zinc-400">Die Geschichte von NFCwear und unsere Vision.</p>
            </div>
        </main>
    );
}
