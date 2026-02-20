import { useEffect, useState } from "react";
import { FileText, FileSpreadsheet, File, Download, FolderOpen } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface UserFile {
    id: string;
    file_name: string;
    file_url: string;
    file_type: string | null;
    file_size: number | null;
}

interface ResourcesSectionProps {
    userId: string;
    accentColor?: string;
}

function getFileIcon(type: string | null) {
    if (!type) return <File className="h-5 w-5 text-zinc-400" />;
    if (type.includes("pdf")) return <FileText className="h-5 w-5 text-red-400" />;
    if (type.includes("spreadsheet") || type.includes("excel") || type.includes("csv"))
        return <FileSpreadsheet className="h-5 w-5 text-green-400" />;
    if (type.includes("word") || type.includes("document"))
        return <FileText className="h-5 w-5 text-blue-400" />;
    if (type.includes("image")) return <File className="h-5 w-5 text-purple-400" />;
    return <File className="h-5 w-5 text-zinc-400" />;
}

function formatFileSize(bytes: number | null) {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ResourcesSection({ userId, accentColor }: ResourcesSectionProps) {
    const [files, setFiles] = useState<UserFile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFiles() {
            const { data } = await supabase
                .from("user_files" as any)
                .select("id, file_name, file_url, file_type, file_size")
                .eq("user_id", userId)
                .order("created_at", { ascending: false });
            setFiles((data as any as UserFile[]) || []);
            setLoading(false);
        }
        fetchFiles();
    }, [userId]);

    async function trackClick(fileId: string) {
        await supabase.from("file_clicks" as any).insert({
            file_id: fileId,
        } as any);
    }

    if (loading || files.length === 0) return null;

    const accent = accentColor || "#4f46e5";

    return (
        <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
                <FolderOpen className="h-4 w-4" style={{ color: accent }} />
                <h3 className="text-sm font-semibold text-white">Ressourcen</h3>
            </div>
            <div className="space-y-2">
                {files.map((file) => (
                    <a
                        key={file.id}
                        href={file.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackClick(file.id)}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors group border border-white/[0.10]"
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                        }}
                    >
                        {getFileIcon(file.file_type)}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{file.file_name}</p>
                            {file.file_size && (
                                <p className="text-[10px] text-white/40">{formatFileSize(file.file_size)}</p>
                            )}
                        </div>
                        <Download className="h-4 w-4 text-white/40 group-hover:text-white transition-colors flex-shrink-0" />
                    </a>
                ))}
            </div>
        </div>
    );
}
