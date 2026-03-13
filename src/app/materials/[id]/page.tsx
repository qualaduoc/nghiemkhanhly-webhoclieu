import Link from "next/link";
import { MainHeader, MainFooter } from "@/components/layout";
import { PageTransition, FadeUp } from "@/components/ui/Animations";
import { ArrowLeft, Download, Star, Calendar } from "lucide-react";
import { formatDate, formatDownloadCount, getDriveViewUrl } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { ReviewSection } from "@/components/materials/ReviewSection";
import { DownloadButton } from "@/components/materials/DownloadButton";
import type { Material, Category } from "@/types/database";

// =============================================================================
// Trang chi tiết tài liệu — Server Component fetch thật
// =============================================================================

export default async function MaterialDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    let material: (Material & { category: Category }) | null = null;
    let avgRating = 0;
    let reviewCount = 0;

    try {
        const supabase = await createClient();

        const { data: mat } = await supabase
            .from("materials")
            .select("*, category:categories(*)")
            .eq("id", id)
            .single();
        material = mat as (Material & { category: Category }) | null;

        if (material) {
            const { data: reviews } = await supabase
                .from("reviews")
                .select("rating")
                .eq("material_id", id);
            if (reviews && reviews.length > 0) {
                avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
                reviewCount = reviews.length;
            }
        }
    } catch {
        material = null;
    }

    if (!material) {
        return (
            <>
                <MainHeader />
                <main className="min-h-[60vh] flex items-center justify-center">
                    <div className="text-center">
                        <span className="text-5xl mb-4 block">📄</span>
                        <p className="font-bold text-gray-500 text-lg">Không tìm thấy tài liệu</p>
                        <Link href="/materials" className="mt-4 inline-block text-green-600 font-bold hover:underline">
                            ← Quay lại danh sách
                        </Link>
                    </div>
                </main>
                <MainFooter />
            </>
        );
    }

    return (
        <>
            <MainHeader />
            <PageTransition>
                <main className="max-w-4xl mx-auto px-4 py-8">
                    <Link href="/materials" className="inline-flex items-center gap-2 text-gray-500 hover:text-green-600 font-bold text-sm mb-6 transition-colors">
                        <ArrowLeft size={16} /> Quay lại danh sách
                    </Link>

                    <FadeUp>
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100">
                            {/* Cover */}
                            <div className="h-52 bg-gradient-to-br from-orange-100 via-pink-50 to-blue-100 flex items-center justify-center">
                                {material.cover_image ? (
                                    <img src={material.cover_image} alt={material.title} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-7xl">📄</span>
                                )}
                            </div>

                            <div className="p-6 md:p-8">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                        {material.file_type}
                                    </span>
                                    {material.category && (
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                            Lớp {material.category.grade} - {material.category.name}
                                        </span>
                                    )}
                                </div>

                                <h1 className="text-2xl font-black text-gray-800 mb-4">{material.title}</h1>

                                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
                                    <span className="flex items-center gap-1"><Calendar size={14} />{formatDate(material.created_at, "long")}</span>
                                    <span className="flex items-center gap-1"><Download size={14} />{formatDownloadCount(material.download_count)} lượt tải</span>
                                    <span className="flex items-center gap-1"><Star size={14} className="text-yellow-500" />{avgRating.toFixed(1)} ({reviewCount} đánh giá)</span>
                                </div>

                                {material.summary && (
                                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg mb-6">
                                        <p className="text-gray-700 font-medium">{material.summary}</p>
                                    </div>
                                )}

                                {material.description && (
                                    <div className="prose prose-sm max-w-none mb-8" dangerouslySetInnerHTML={{ __html: material.description }} />
                                )}

                                <DownloadButton materialId={material.id} driveId={material.drive_id} externalUrl={material.external_url} />
                            </div>
                        </div>
                    </FadeUp>

                    {/* Reviews */}
                    <ReviewSection materialId={material.id} />
                </main>
            </PageTransition>
            <MainFooter />
        </>
    );
}
