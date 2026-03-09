import Link from "next/link";
import { MainHeader, MainFooter } from "@/components/layout";
import { PageTransition, FadeUp } from "@/components/ui/Animations";
import { ArrowLeft, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import type { News } from "@/types/database";

// =============================================================================
// Trang chi tiết tin tức — Server Component fetch thật
// =============================================================================

export default async function NewsDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    let news: News | null = null;

    try {
        const supabase = await createClient();
        const { data } = await supabase.from("news").select("*").eq("id", id).single();
        news = data as News | null;
    } catch {
        news = null;
    }

    if (!news) {
        return (
            <>
                <MainHeader />
                <main className="min-h-[60vh] flex items-center justify-center">
                    <div className="text-center">
                        <span className="text-5xl mb-4 block">📰</span>
                        <p className="font-bold text-gray-500 text-lg">Không tìm thấy bài viết</p>
                        <Link href="/news" className="mt-4 inline-block text-green-600 font-bold hover:underline">← Quay lại</Link>
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
                <main className="max-w-3xl mx-auto px-4 py-8">
                    <Link href="/news" className="inline-flex items-center gap-2 text-gray-500 hover:text-green-600 font-bold text-sm mb-6 transition-colors">
                        <ArrowLeft size={16} /> Quay lại
                    </Link>
                    <FadeUp>
                        <article className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100">
                            <div className="h-52 bg-gradient-to-br from-teal-100 via-green-50 to-blue-100 flex items-center justify-center">
                                {news.thumbnail ? <img src={news.thumbnail} alt={news.title} className="w-full h-full object-cover" /> : <span className="text-7xl">📰</span>}
                            </div>
                            <div className="p-6 md:p-8">
                                <span className="text-sm text-gray-400 flex items-center gap-1 mb-4"><Calendar size={14} />{formatDate(news.created_at, "long")}</span>
                                <h1 className="text-2xl font-black text-gray-800 mb-6">{news.title}</h1>
                                <div className="prose prose-sm max-w-none prose-headings:text-gray-800" dangerouslySetInnerHTML={{ __html: news.content }} />
                            </div>
                        </article>
                    </FadeUp>
                </main>
            </PageTransition>
            <MainFooter />
        </>
    );
}
