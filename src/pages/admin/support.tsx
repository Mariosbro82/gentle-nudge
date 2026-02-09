
import { HelpCircle } from "lucide-react";

export default function AdminSupportPage() {
    return (
        <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
                <HelpCircle className="w-8 h-8 text-pink-500" />
                <h1 className="text-3xl font-bold text-white">Support & Help</h1>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-12 text-center text-zinc-500">
                Support ticket management and help resources will be implemented here.
            </div>
        </div>
    );
}
