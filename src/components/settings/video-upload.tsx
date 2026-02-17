import { useState } from "react";
import { X, Video, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";

interface VideoUploadProps {
    currentUrl: string | null;
    authUserId: string;
    onUploaded: (url: string) => void;
    onRemoved: () => void;
}

export function VideoUpload({ currentUrl, authUserId, onUploaded, onRemoved }: VideoUploadProps) {
    const [uploading, setUploading] = useState(false);

    async function handleUpload(file: File | undefined) {
        if (!file || !authUserId) return;

        if (file.size > 10 * 1024 * 1024) {
            alert("Video darf maximal 10 MB groß sein.");
            return;
        }

        if (!file.type.startsWith("video/")) {
            alert("Bitte wählen Sie eine Videodatei aus.");
            return;
        }

        setUploading(true);
        const ext = file.name.split(".").pop() || "mp4";
        const path = `${authUserId}/greeting.${ext}`;

        const { error: uploadError } = await supabase.storage
            .from("public-files")
            .upload(path, file, { upsert: true, contentType: file.type });

        if (uploadError) {
            alert(`Upload fehlgeschlagen: ${uploadError.message}`);
            setUploading(false);
            return;
        }

        const { data } = supabase.storage.from("public-files").getPublicUrl(path);
        const url = `${data.publicUrl}?t=${Date.now()}`;
        onUploaded(url);
        setUploading(false);
    }

    return (
        <div className="space-y-3">
            {currentUrl ? (
                <div className="relative rounded-xl overflow-hidden border border-border bg-black">
                    <video
                        src={currentUrl}
                        className="w-full max-h-48 object-contain"
                        controls
                        muted
                    />
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={onRemoved}
                    >
                        <X className="h-3 w-3 mr-1" /> Entfernen
                    </Button>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center h-28 rounded-xl border-2 border-dashed border-border hover:border-muted-foreground/30 cursor-pointer transition-colors">
                    {uploading ? (
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    ) : (
                        <>
                            <Video className="h-6 w-6 text-muted-foreground mb-1.5" />
                            <span className="text-xs text-muted-foreground">Video hochladen (max 10 MB)</span>
                        </>
                    )}
                    <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        disabled={uploading}
                        onChange={(e) => handleUpload(e.target.files?.[0])}
                    />
                </label>
            )}
            <p className="text-[10px] text-muted-foreground">Kurzes Begrüßungsvideo im Loom-Stil. Wird rund auf dem Profil angezeigt.</p>
        </div>
    );
}
