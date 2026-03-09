import { MainHeader, MainFooter } from "@/components/layout";
import { MaterialCard } from "@/components/materials/MaterialCard";
import { PageTransition, FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/Animations";
import { createClient } from "@/lib/supabase/server";
import { GradeTabsFilter } from "@/components/materials/GradeTabsFilter";
import type { Material } from "@/types/database";

// =============================================================================
// Trang Tài Liệu — Server Component fetch thật
// =============================================================================

export default async function MaterialsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const params = await searchParams;
    let materials: Material[] = [];

    try {
        const supabase = await createClient();
        let q = supabase.from("materials").select("*");

        if (params.query) q = q.ilike("title", `%${params.query}%`);
        if (params.category_id) q = q.eq("category_id", params.category_id);
        if (params.sort === "popular") {
            q = q.order("download_count", { ascending: false });
        } else {
            q = q.order("created_at", { ascending: false });
        }

        const { data } = await q.limit(24);
        materials = (data || []) as Material[];
    } catch {
        materials = [];
    }

    return (
        <>
            <MainHeader />
            <PageTransition>
                <main className="max-w-7xl mx-auto px-4 py-8">
                    <FadeUp>
                        <h1 className="text-3xl font-black text-green-600 mb-2">📚 Kho Tài Liệu</h1>
                        <p className="text-gray-500 mb-6">Tìm kiếm và tải tài liệu học tập miễn phí cho tiểu học.</p>
                    </FadeUp>

                    {/* Bộ lọc (Client Component) */}
                    <GradeTabsFilter />

                    {/* Grid tài liệu */}
                    <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
                        {materials.map((material) => (
                            <StaggerItem key={material.id}>
                                <MaterialCard material={material} />
                            </StaggerItem>
                        ))}
                    </StaggerContainer>

                    {materials.length === 0 && (
                        <FadeUp className="text-center py-20">
                            <span className="text-5xl mb-4 block">🔍</span>
                            <p className="font-bold text-gray-500 text-lg">Chưa có tài liệu nào</p>
                            <p className="text-sm text-gray-400">Hãy thêm tài liệu từ trang Admin nhé!</p>
                        </FadeUp>
                    )}
                </main>
            </PageTransition>
            <MainFooter />
        </>
    );
}
