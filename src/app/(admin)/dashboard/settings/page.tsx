import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "./settings-form";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
    const supabase = await createClient();

    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
        redirect("/login");
    }

    // Fetch profile data
    const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single();

    // Use profile or fallback to auth metadata or empty
    const userData = profile || {
        name: authUser.user_metadata?.name || "",
        email: authUser.email,
        id: authUser.id
    };

    return <SettingsForm user={userData} />;
}
