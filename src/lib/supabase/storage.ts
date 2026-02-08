import { supabase } from "@/integrations/supabase/client";

const BUCKET = "profile-images";

export async function uploadProfileImage(
    authUserId: string,
    file: File,
    type: "profile" | "banner"
): Promise<string> {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${authUserId}/${type}.${ext}`;

    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: true, contentType: file.type });

    if (error) throw error;

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return `${data.publicUrl}?t=${Date.now()}`;
}

export async function deleteProfileImage(
    authUserId: string,
    type: "profile" | "banner"
): Promise<void> {
    const { data: files } = await supabase.storage
        .from(BUCKET)
        .list(authUserId, { search: type });

    if (files && files.length > 0) {
        const paths = files.map((f) => `${authUserId}/${f.name}`);
        await supabase.storage.from(BUCKET).remove(paths);
    }
}
