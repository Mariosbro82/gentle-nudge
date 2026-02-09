import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { uploadProfileImage, deleteProfileImage } from "@/lib/supabase/storage";

interface ImageUploadProps {
    type: "profile" | "banner";
    currentUrl: string | null;
    authUserId: string;
    onUploaded: (url: string) => void;
    onRemoved: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function ImageUpload({ type, currentUrl, authUserId, onUploaded, onRemoved }: ImageUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);

        if (!file.type.startsWith("image/")) {
            setError("Bitte wähle ein Bild aus.");
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setError("Datei ist zu groß (max. 5 MB).");
            return;
        }

        setUploading(true);
        try {
            const url = await uploadProfileImage(authUserId, file, type);
            onUploaded(url);
        } catch (err: any) {
            setError(err.message || "Upload fehlgeschlagen.");
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = "";
        }
    }

    async function handleRemove() {
        setUploading(true);
        try {
            await deleteProfileImage(authUserId, type);
            onRemoved();
        } catch (err: any) {
            setError(err.message || "Löschen fehlgeschlagen.");
        } finally {
            setUploading(false);
        }
    }

    const isProfile = type === "profile";

    return (
        <div>
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                className="hidden"
            />

            {isProfile ? (
                /* Profile picture - circular */
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        disabled={uploading}
                        className="relative w-20 h-20 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden hover:border-blue-500/50 transition-colors group"
                    >
                        {currentUrl ? (
                            <img src={currentUrl} alt="Profilbild" className="w-full h-full object-cover" />
                        ) : (
                            <Camera className="h-6 w-6 text-muted-foreground group-hover:text-blue-400 transition-colors" />
                        )}
                        {uploading && (
                            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                                <Loader2 className="h-5 w-5 animate-spin text-foreground" />
                            </div>
                        )}
                    </button>
                    <div className="space-y-1">
                        <p className="text-sm font-medium">Profilbild</p>
                        <p className="text-xs text-muted-foreground">JPG, PNG oder WebP. Max 5 MB.</p>
                        {currentUrl && (
                            <button
                                type="button"
                                onClick={handleRemove}
                                disabled={uploading}
                                className="text-xs text-red-400 hover:text-red-300"
                            >
                                Entfernen
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                /* Banner - wide rectangle */
                <div>
                    <p className="text-sm font-medium mb-2">Banner</p>
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        disabled={uploading}
                        className="relative w-full h-24 rounded-lg bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden hover:border-blue-500/50 transition-colors group"
                    >
                        {currentUrl ? (
                            <img src={currentUrl} alt="Banner" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center gap-1">
                                <Camera className="h-5 w-5 text-muted-foreground group-hover:text-blue-400 transition-colors" />
                                <span className="text-xs text-muted-foreground">Banner hochladen</span>
                            </div>
                        )}
                        {uploading && (
                            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                                <Loader2 className="h-5 w-5 animate-spin text-foreground" />
                            </div>
                        )}
                    </button>
                    <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-muted-foreground">Empfohlen: 1200x300px</p>
                        {currentUrl && (
                            <button
                                type="button"
                                onClick={handleRemove}
                                disabled={uploading}
                                className="text-xs text-red-400 hover:text-red-300"
                            >
                                Entfernen
                            </button>
                        )}
                    </div>
                </div>
            )}

            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        </div>
    );
}
