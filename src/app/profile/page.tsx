import { redirect } from "next/navigation";
import { MainHeader, MainFooter } from "@/components/layout";
import { createClient } from "@/lib/supabase/server";
import ProfileContent from "./ProfileContent";
import type { Profile } from "@/types/database";

// =============================================================================
// Trang Cá nhân (Server Component)
// Fetch dữ liệu an toàn trên server, tránh lỗi cache/navigation của trình duyệt
// =============================================================================

export default async function ProfilePage() {
    const supabase = await createClient();

    // 1. Fetch User
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect("/login");
    }

    // 2. Fetch Profile
    const { data: profileData, error: profileErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    let profile: Profile;

    if (profileErr || !profileData) {
        // Fallback mock nếu trigger chưa kịp tạo
        profile = {
            id: user.id,
            full_name: user.email?.split("@")[0] || "User",
            role: "user",
            avatar_url: null,
        } as Profile;
    } else {
        profile = profileData as Profile;
    }

    // 3. Fetch Download History
    let downloads: any[] = [];
    const { data: downloadData } = await supabase
        .from("download_history")
        .select("id, downloaded_at, material:materials(title, file_type)")
        .eq("user_id", user.id)
        .order("downloaded_at", { ascending: false })
        .limit(20);

    if (Array.isArray(downloadData)) {
        downloads = downloadData.map((d: any) => ({
            id: d.id as string,
            downloaded_at: d.downloaded_at as string,
            material: d.material as { title: string; file_type: string },
        }));
    }

    return (
        <>
            <MainHeader />
            <ProfileContent
                initialProfile={profile}
                email={user.email || ""}
                downloads={downloads}
            />
            <MainFooter />
        </>
    );
}
