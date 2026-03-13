import Link from "next/link";
import { MainHeader, MainFooter } from "@/components/layout";
import { PageTransition, FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/Animations";
import { Calendar, Gamepad2, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import type { News } from "@/types/database";

// =============================================================================
// Trang Trò chơi vui học — Danh sách các game học tập
// =============================================================================

export default async function GamesPage() {
    let gameList: News[] = [];

    try {
        const supabase = await createClient();
        const { data } = await supabase.from("news").select("*").order("created_at", { ascending: false });
        gameList = (data || []) as News[];
    } catch {
        gameList = [];
    }

    return (
        <>
            <MainHeader />
            <PageTransition>
                <main className="max-w-4xl mx-auto px-4 py-8">
                    <FadeUp>
                        <h1 className="text-3xl font-black text-green-600 mb-2">🎮 Trò Chơi Vui Học</h1>
                        <p className="text-gray-500 mb-8">Học mà chơi, chơi mà học — Các trò chơi giáo dục thú vị!</p>
                    </FadeUp>

                    <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {gameList.map((game) => (
                            <StaggerItem key={game.id}>
                                <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group">
                                    <div className="h-40 bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-100 flex items-center justify-center relative">
                                        {game.thumbnail ? (
                                            <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-5xl group-hover:scale-110 transition-transform">🎮</span>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <h2 className="font-black text-gray-800 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                                            {game.title}
                                        </h2>
                                        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                            {game.content.replace(/<[^>]*>/g, "").slice(0, 100)}...
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                                <Calendar size={10} />{formatDate(game.created_at, "long")}
                                            </span>
                                            {game.game_url ? (
                                                <a
                                                    href={game.game_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-xs font-black flex items-center gap-1 transition-all active:scale-95 shadow-md"
                                                >
                                                    <Gamepad2 size={14} /> Chơi ngay
                                                </a>
                                            ) : (
                                                <Link
                                                    href={`/news/${game.id}`}
                                                    className="text-sm font-bold text-green-600 flex items-center gap-1 hover:gap-2 transition-all"
                                                >
                                                    Xem thêm <ExternalLink size={12} />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>

                    {gameList.length === 0 && (
                        <FadeUp className="text-center py-20">
                            <span className="text-5xl mb-4 block">🎮</span>
                            <p className="font-bold text-gray-500 text-lg">Chưa có trò chơi nào</p>
                        </FadeUp>
                    )}
                </main>
            </PageTransition>
            <MainFooter />
        </>
    );
}
