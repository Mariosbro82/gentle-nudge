
import { getUserBySlug } from "@/lib/actions/users";
import { ProfileView } from "./profile-view";

export default async function CorporateProfilePage({ params }: { params: Promise<{ userId: string }> }) {

    const resolvedParams = await params;
    const slug = resolvedParams.userId;
    // Fetch real data
    const realUser = await getUserBySlug(slug);

    console.log(`[ProfilePage] Fetching for slug: ${slug}`, realUser);

    if (!realUser) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-500">User not found</h1>
                    <p className="text-zinc-500 mt-2">Could not find profile for: {slug}</p>
                    <p className="text-xs text-zinc-700 mt-4">Debug: Ensure slug matches database record.</p>
                </div>
            </div>
        );
    }

    // Map DB fields to View Props
    // Note: We use the EXACT data from DB. No 'Founder & CEO' fallbacks.
    const user = {
        name: realUser.name || "No Name",
        title: realUser.job_title || "",
        company: realUser.company_name || "",
        bio: realUser.bio || "",
        email: realUser.email || "",
        phone: realUser.phone || "",
        website: realUser.website || "",
        linkedin: realUser.social_links?.linkedin || realUser.linkedin_url || "",
        avatar: realUser.profile_pic || "", // If null, AvatarFallback will handle it
        banner: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&auto=format&fit=crop&q=60", // Generic banner is fine for now
        id: realUser.id
    };

    return <ProfileView user={user} />;
}
