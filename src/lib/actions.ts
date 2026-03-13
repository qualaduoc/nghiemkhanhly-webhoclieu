"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type {
    Category,
    CategoryFormData,
    Material,
    MaterialFormData,
    News,
    NewsFormData,
    GradeLevel,
    SiteSettings,
    Feedback,
    FeedbackRole,
} from "@/types/database";

// =============================================================================
// Server Actions — Admin CRUD
// Tất cả mutations đều revalidate cache để UI luôn mới nhất
// =============================================================================

// ── Categories ────────────────────────────────────────────────────────────────

export async function getCategories() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("grade")
        .order("name");
    if (error) throw error;
    return data as Category[];
}

export async function createCategory(formData: CategoryFormData) {
    const supabase = await createClient();
    const { error } = await supabase.from("categories").insert(formData);
    if (error) throw error;
    revalidatePath("/admin/categories");
    revalidatePath("/");
}

export async function updateCategory(id: string, formData: CategoryFormData) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("categories")
        .update(formData)
        .eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/categories");
    revalidatePath("/");
}

export async function deleteCategory(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/categories");
    revalidatePath("/");
}

// ── Materials ─────────────────────────────────────────────────────────────────

export async function getMaterials(options?: {
    grade?: GradeLevel;
    category_id?: string;
    query?: string;
    sort_by?: "newest" | "most_downloaded";
    limit?: number;
}) {
    const supabase = await createClient();
    let q = supabase.from("materials").select("*, category:categories(*)");

    if (options?.category_id) q = q.eq("category_id", options.category_id);
    if (options?.query) q = q.ilike("title", `%${options.query}%`);
    if (options?.sort_by === "most_downloaded") {
        q = q.order("download_count", { ascending: false });
    } else {
        q = q.order("created_at", { ascending: false });
    }
    if (options?.limit) q = q.limit(options.limit);

    const { data, error } = await q;
    if (error) throw error;
    return data as (Material & { category: Category })[];
}

export async function getMaterialById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("materials")
        .select("*, category:categories(*)")
        .eq("id", id)
        .single();
    if (error) return null;
    return data as Material & { category: Category };
}

export async function createMaterial(formData: MaterialFormData) {
    const supabase = await createClient();
    const { error } = await supabase.from("materials").insert(formData);
    if (error) throw error;
    revalidatePath("/admin/materials");
    revalidatePath("/materials");
    revalidatePath("/");
}

export async function updateMaterial(id: string, formData: MaterialFormData) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("materials")
        .update(formData)
        .eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/materials");
    revalidatePath(`/materials/${id}`);
    revalidatePath("/");
}

export async function deleteMaterial(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("materials").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/materials");
    revalidatePath("/materials");
    revalidatePath("/");
}

// ── News ──────────────────────────────────────────────────────────────────────

export async function getNews(limit?: number) {
    const supabase = await createClient();
    let q = supabase
        .from("news")
        .select("*")
        .order("created_at", { ascending: false });
    if (limit) q = q.limit(limit);
    const { data, error } = await q;
    if (error) throw error;
    return data as News[];
}

export async function getNewsById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("id", id)
        .single();
    if (error) return null;
    return data as News;
}

export async function createNews(formData: NewsFormData) {
    const supabase = await createClient();
    const { error } = await supabase.from("news").insert(formData);
    if (error) throw error;
    revalidatePath("/admin/news");
    revalidatePath("/news");
}

export async function updateNews(id: string, formData: NewsFormData) {
    const supabase = await createClient();
    const { error } = await supabase.from("news").update(formData).eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/news");
    revalidatePath(`/news/${id}`);
}

export async function deleteNews(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("news").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/news");
    revalidatePath("/news");
}

// ── Users (Admin) ─────────────────────────────────────────────────────────────

export async function getUsers() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("updated_at", { ascending: false });
    if (error) throw error;
    return data;
}

export async function updateUserRole(userId: string, role: "admin" | "user") {
    const supabase = await createClient();
    const { error } = await supabase
        .from("profiles")
        .update({ role })
        .eq("id", userId);
    if (error) throw error;
    revalidatePath("/admin/users");
}

// ── Reviews ───────────────────────────────────────────────────────────────────

export async function getReviewsByMaterial(materialId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("reviews")
        .select("*, profile:profiles(full_name, avatar_url)")
        .eq("material_id", materialId)
        .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
}

export async function createReview(
    materialId: string,
    rating: number,
    comment: string
) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Cần đăng nhập để đánh giá");

    const { error } = await supabase.from("reviews").insert({
        material_id: materialId,
        user_id: user.id,
        rating,
        comment: comment || null,
    });
    if (error) throw error;
    revalidatePath(`/materials/${materialId}`);
}

// ── Dashboard Stats ───────────────────────────────────────────────────────────

export async function getDashboardStats() {
    const supabase = await createClient();

    const [materials, users, reviews] = await Promise.all([
        supabase.from("materials").select("download_count"),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("reviews").select("id", { count: "exact", head: true }),
    ]);

    const totalDownloads =
        materials.data?.reduce((sum, m) => sum + (m.download_count || 0), 0) || 0;

    return {
        total_materials: materials.data?.length || 0,
        total_users: users.count || 0,
        total_downloads: totalDownloads,
        total_reviews: reviews.count || 0,
    };
}

// ── Download ──────────────────────────────────────────────────────────────────

export async function recordDownload(materialId: string) {
    const supabase = await createClient();

    // Tăng download_count
    await supabase.rpc("increment_download", { p_material_id: materialId });

    // Ghi lịch sử (nếu đã đăng nhập)
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (user) {
        await supabase.from("download_history").insert({
            user_id: user.id,
            material_id: materialId,
        });
    }

    revalidatePath(`/materials/${materialId}`);
}

// ── Site Settings ─────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: Omit<SiteSettings, "id" | "updated_at"> = {
    site_name: "Kho Học Liệu Tiểu Học",
    site_description:
        "Nền tảng chia sẻ tài liệu, giáo án, đề thi cho giáo viên tiểu học từ lớp 1 đến lớp 5.",
    meta_keywords: "",
    meta_author: "Nghiêm Khánh Ly",
    hero_avatar_url: "",
    hero_avatar_name: "Gấu Thông Thái",
    footer_copyright: "© 2024 Bản quyền thuộc về Nhóm Phát Triển Giáo Dục Tiểu Học",
    footer_slogan: "SÁNG TẠO - KẾT NỐI - THÀNH CÔNG",
    contact_email: "",
    contact_phone: "",
    contact_address: "",
    facebook_url: "",
    youtube_url: "",
    zalo_url: "",
    og_image: "",
};

export async function getSiteSettings(): Promise<SiteSettings> {
    try {
        const supabase = await createClient();
        const { data } = await supabase
            .from("site_settings")
            .select("*")
            .limit(1)
            .single();
        if (data) return data as SiteSettings;
    } catch {
        // Table chưa tạo hoặc chưa có data
    }
    return { id: "", updated_at: new Date().toISOString(), ...DEFAULT_SETTINGS };
}

export async function updateSiteSettings(
    settings: Partial<Omit<SiteSettings, "id" | "updated_at">>
) {
    const supabase = await createClient();
    const { data: existing } = await supabase
        .from("site_settings")
        .select("id")
        .limit(1)
        .single();

    if (existing) {
        const { error } = await supabase
            .from("site_settings")
            .update({ ...settings, updated_at: new Date().toISOString() })
            .eq("id", existing.id);
        if (error) throw error;
    } else {
        const { error } = await supabase.from("site_settings").insert(settings);
        if (error) throw error;
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");
}

// ── Feedbacks (Ý kiến đóng góp) ──────────────────────────────────────────────

export async function getApprovedFeedbacks() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("feedbacks")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false })
        .limit(20);
    if (error) throw error;
    return (data || []) as Feedback[];
}

export async function getAllFeedbacks() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("feedbacks")
        .select("*")
        .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []) as Feedback[];
}

export async function createFeedback(feedback: {
    author_name: string;
    author_role: FeedbackRole;
    content: string;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("feedbacks").insert({
        ...feedback,
        user_id: user?.id || null,
        is_approved: false,
    });
    if (error) throw error;
    revalidatePath("/");
}

export async function toggleFeedbackApproval(id: string, approved: boolean) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("feedbacks")
        .update({ is_approved: approved })
        .eq("id", id);
    if (error) throw error;
    revalidatePath("/");
    revalidatePath("/admin/feedbacks");
}

export async function deleteFeedback(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("feedbacks").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/");
    revalidatePath("/admin/feedbacks");
}
