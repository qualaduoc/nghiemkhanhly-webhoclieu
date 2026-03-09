import Link from "next/link";
import { MainHeader, MainFooter } from "@/components/layout";
import { PageTransition, FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/Animations";
import { Calendar, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import type { News } from "@/types/database";

// =============================================================================
// Trang Tin Tức — Server Component fetch thật
// =============================================================================

export default async function NewsPage() {
    let newsList: News[] = [];

    try {
        const supabase = await createClient();
        const { data } = await supabase.from("news").select("*").order("created_at", { ascending: false });
        newsList = (data || []) as News[];
    } catch {
        newsList = [];
    }

    return (
        <>
            <MainHeader />
            <PageTransition>
                <main className="max-w-4xl mx-auto px-4 py-8">
                    <FadeUp>
                        <h1 className="text-3xl font-black text-green-600 mb-2">📰 Tin Tức & Bài Viết</h1>
                        <p className="text-gray-500 mb-8">Cập nhật thông tin giáo dục và chia sẻ kinh nghiệm.</p>
                    </FadeUp>

                    <StaggerContainer className="space-y-6">
                        {newsList.map((news) => (
                            <StaggerItem key={news.id}>
                                <Link href={`/news/${news.id}`} className="block bg-white rounded-2xl shadow-sm border-2 border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all group">
                                    <div className="flex flex-col sm:flex-row">
                                        <div className="sm:w-48 h-40 sm:h-auto bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center shrink-0">
                                            {news.thumbnail ? <img src={news.thumbnail} alt={news.title} className="w-full h-full object-cover" /> : <span className="text-4xl">📰</span>}
                                        </div>
                                        <div className="p-5 flex-1 flex flex-col justify-between">
                                            <div>
                                                <h2 className="font-bold text-lg text-gray-800 group-hover:text-green-600 transition-colors mb-2 line-clamp-2">{news.title}</h2>
                                                <p className="text-sm text-gray-500 line-clamp-2">{news.content.replace(/<[^>]*>/g, "").slice(0, 150)}...</p>
                                            </div>
                                            <div className="flex items-center justify-between mt-4">
                                                <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={12} />{formatDate(news.created_at, "long")}</span>
                                                <span className="text-sm font-bold text-green-600 flex items-center gap-1 group-hover:gap-2 transition-all">Đọc thêm <ArrowRight size={14} /></span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>

                    {newsList.length === 0 && (
                        <FadeUp className="text-center py-20">
                            <span className="text-5xl mb-4 block">📰</span>
                            <p className="font-bold text-gray-500 text-lg">Chưa có bài viết nào</p>
                        </FadeUp>
                    )}
                </main>
            </PageTransition>
            <MainFooter />
        </>
    );
}
