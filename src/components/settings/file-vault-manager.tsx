import { useEffect, useState } from "react";
import { Upload, Trash2, FileText, FileSpreadsheet, File, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";

interface UserFile {
    id: string;
    file_name: string;
    file_url: string;
    file_type: string | null;
    file_size: number | null;
    download_count: number;
    created_at: string;
}

interface FileVaultManagerProps {
    userId: string;
    authUserId: string;
}

function getFileIcon(type: string | null) {
    if (!type) return <File className="h-5 w-5 text-muted-foreground" />;
    if (type.includes("pdf")) return <FileText className="h-5 w-5 text-red-400" />;
    if (type.includes("spreadsheet") || type.includes("excel") || type.includes("csv"))
        return <FileSpreadsheet className="h-5 w-5 text-green-400" />;
    if (type.includes("word") || type.includes("document"))
        return <FileText className="h-5 w-5 text-blue-400" />;
    return <File className="h-5 w-5 text-muted-foreground" />;
}

function formatFileSize(bytes: number | null) {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileVaultManager({ userId, authUserId }: FileVaultManagerProps) {
    const [files, setFiles] = useState<UserFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFiles();
    }, [userId]);

    async function fetchFiles() {
        const { data } = await supabase
            .from("user_files" as any)
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });
        setFiles((data as any as UserFile[]) || []);
        setLoading(false);
    }

    async function handleUpload(file: File | undefined) {
        if (!file || !authUserId) return;

        if (file.size > 20 * 1024 * 1024) {
            alert("Datei darf maximal 20 MB groß sein.");
            return;
        }

        setUploading(true);
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${authUserId}/files/${Date.now()}_${safeName}`;

        const { error: uploadError } = await supabase.storage
            .from("public-files")
            .upload(path, file, { contentType: file.type });

        if (uploadError) {
            alert(`Upload fehlgeschlagen: ${uploadError.message}`);
            setUploading(false);
            return;
        }

        const { data: urlData } = supabase.storage.from("public-files").getPublicUrl(path);

        const { error } = await supabase.from("user_files" as any).insert({
            user_id: userId,
            file_name: file.name,
            file_url: urlData.publicUrl,
            file_type: file.type,
            file_size: file.size,
        } as any);

        if (error) {
            alert(`Speichern fehlgeschlagen: ${error.message}`);
        } else {
            await fetchFiles();
        }
        setUploading(false);
    }

    async function handleDelete(fileId: string) {
        if (!confirm("Datei wirklich löschen?")) return;
        await supabase.from("user_files" as any).delete().eq("id", fileId);
        setFiles(files.filter((f) => f.id !== fileId));
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-20">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            <label className="flex flex-col items-center justify-center h-24 rounded-xl border-2 border-dashed border-border hover:border-muted-foreground/30 cursor-pointer transition-colors">
                {uploading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : (
                    <>
                        <Upload className="h-5 w-5 text-muted-foreground mb-1" />
                        <span className="text-xs text-muted-foreground">Datei hochladen (PDF, DOCX, etc.)</span>
                    </>
                )}
                <input
                    type="file"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => handleUpload(e.target.files?.[0])}
                />
            </label>

            {/* File List */}
            {files.length > 0 && (
                <div className="space-y-2">
                    {files.map((file) => (
                        <div
                            key={file.id}
                            className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border"
                        >
                            {getFileIcon(file.file_type)}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{file.file_name}</p>
                                <p className="text-[10px] text-muted-foreground">
                                    {formatFileSize(file.file_size)}
                                    {file.download_count > 0 && ` · ${file.download_count} Downloads`}
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(file.id)}
                                className="text-destructive hover:text-destructive/80 flex-shrink-0"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            {files.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-2">
                    Noch keine Dateien hochgeladen. Dateien werden auf Ihrem Profil angezeigt.
                </p>
            )}
        </div>
    );
}
