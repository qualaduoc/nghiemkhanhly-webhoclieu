"use client";

import { useState } from "react";
import Link from "next/link";
import { Gamepad2 } from "lucide-react";
import type { GradeLevel, Category, Material, Feedback, News } from "@/types/database";
import { GradeTabs } from "@/components/materials/GradeTabs";
import { SubjectCard } from "@/components/materials/SubjectCard";
import { MaterialCard } from "@/components/materials/MaterialCard";
import { FeedbackSection } from "@/components/feedback/FeedbackSection";

// =============================================================================
// NotebookContent - Phần nội dung chính dạng sổ ghi (Notebook Style)
// Bao gồm: Danh mục (compact) + Trò chơi + Tài liệu mới + Tài liệu hot
// =============================================================================

interface NotebookContentProps {
    categories: Category[];
    latestMaterials: Material[];
    popularMaterials: Material[];
    feedbacks: Feedback[];
    games: News[];
}

export function NotebookContent({
    categories,
    latestMaterials,
    popularMaterials,
    feedbacks,
    games,
}: NotebookContentProps) {
    const [activeGrade, setActiveGrade] = useState<GradeLevel>(1);

    const filteredCategories = categories.filter(
        (cat) => cat.grade === activeGrade
    );

    return (
        <section className="flex-grow p-4 md:p-8 relative">
            <div className="bg-notebook-bg min-h-full rounded-tr-3xl rounded-br-3xl shadow-2xl relative p-6 md:p-12 border-l border-gray-200">
                {/* Gáy sổ notebook */}
                <div className="notebook-spine hidden md:flex">
                    {Array.from({ length: 16 }).map((_, i) => (
                        <div key={i} className="ring" />
                    ))}
                </div>

                {/* Tabs Khối lớp */}
                <div className="flex flex-wrap gap-2 md:absolute md:-top-10 md:left-12 mb-6 md:mb-0">
                    <GradeTabs activeGrade={activeGrade} onGradeChange={setActiveGrade} />
                </div>

                {/* Tiêu đề Danh mục — compact */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-4 border-green-500 pb-3 mb-4">
                    <h1 className="text-2xl md:text-3xl font-black text-green-600 tracking-tighter">
                        DANH MỤC BÀI HỌC
                    </h1>
                    <span className="text-xs font-bold text-gray-400 italic mt-1 sm:mt-0">
                        Chọn môn để xem tài liệu
                    </span>
                </div>

                {/* Grid danh mục — compact 3 cột */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                    {filteredCategories.length > 0 ? (
                        filteredCategories.map((category) => (
                            <SubjectCardCompact key={category.id} category={category} />
                        ))
                    ) : (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3">
                                <div className="w-10 h-10 skeleton shrink-0 rounded-lg" />
                                <div className="flex-1 space-y-1">
                                    <div className="skeleton h-4 w-2/3" />
                                    <div className="skeleton h-2 w-full" />
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Section: Trò chơi vui học */}
                {games.length > 0 && (
                    <div className="mt-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-black text-gray-700 flex items-center gap-2">
                                <span>🎮</span> Trò Chơi Vui Học
                            </h2>
                            <Link
                                href="/news"
                                className="text-xs font-bold text-green-600 hover:underline"
                            >
                                Xem tất cả →
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {games.slice(0, 6).map((game) => (
                                <div key={game.id} className="bg-white rounded-xl border-2 border-purple-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden group">
                                    <div className="h-28 bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-100 flex items-center justify-center">
                                        {game.thumbnail ? (
                                            <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-4xl group-hover:scale-110 transition-transform">🎮</span>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <h3 className="font-black text-sm text-gray-800 line-clamp-1 group-hover:text-purple-600 transition-colors mb-2">
                                            {game.title}
                                        </h3>
                                        <p className="text-[10px] text-gray-400 line-clamp-1 mb-2">
                                            {game.content.replace(/<[^>]*>/g, "").slice(0, 60)}
                                        </p>
                                        {game.game_url ? (
                                            <a
                                                href={game.game_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-full text-[10px] font-black transition-all active:scale-95 shadow-sm"
                                            >
                                                <Gamepad2 size={12} /> Chơi ngay
                                            </a>
                                        ) : (
                                            <Link
                                                href={`/news/${game.id}`}
                                                className="text-[10px] font-bold text-purple-600 hover:underline"
                                            >
                                                Xem thêm →
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Section: Tài liệu mới nhất */}
                {latestMaterials.length > 0 && (
                    <div className="mt-10">
                        <h2 className="text-2xl font-black text-gray-700 mb-6 flex items-center">
                            <span className="mr-2">🆕</span> Tài Liệu Mới Nhất
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {latestMaterials.map((material) => (
                                <MaterialCard key={material.id} material={material} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Section: Tải nhiều nhất */}
                {popularMaterials.length > 0 && (
                    <div className="mt-10">
                        <h2 className="text-2xl font-black text-gray-700 mb-6 flex items-center">
                            <span className="mr-2">🔥</span> Tải Nhiều Nhất
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {popularMaterials.map((material) => (
                                <MaterialCard key={material.id} material={material} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Section: Ý kiến đóng góp */}
                <FeedbackSection feedbacks={feedbacks} />

                {/* Lời nhắn Mascot */}
                <div className="mt-16 flex justify-center">
                    <div className="speech-bubble p-6 max-w-lg shadow-xl border-4 border-yellow-400">
                        <p className="text-center font-bold text-gray-700 text-lg">
                            Chào bạn nhỏ! Bạn đã tìm thấy bài học mà mình yêu thích chưa?
                            Nếu cần hỗ trợ, đừng ngần ngại hỏi Gấu Thông Thái nhé!
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

// =============================================================================
// SubjectCardCompact — Phiên bản thu gọn của SubjectCard
// =============================================================================

const COMPACT_STYLES: Record<string, { emoji: string; bg: string; text: string }> = {
    "Toán": { emoji: "➕", bg: "bg-orange-100", text: "text-orange-600" },
    "Tiếng Việt": { emoji: "📖", bg: "bg-pink-100", text: "text-pink-600" },
    "Tự nhiên và Xã hội": { emoji: "🌿", bg: "bg-green-100", text: "text-green-600" },
    "Tiếng Anh": { emoji: "🔤", bg: "bg-blue-100", text: "text-blue-600" },
    "Đạo đức": { emoji: "⭐", bg: "bg-yellow-100", text: "text-yellow-600" },
    "Khoa học": { emoji: "🔬", bg: "bg-emerald-100", text: "text-emerald-600" },
    "Lịch sử và Địa lý": { emoji: "🗺️", bg: "bg-indigo-100", text: "text-indigo-600" },
};

function SubjectCardCompact({ category }: { category: Category }) {
    const style = COMPACT_STYLES[category.name] || { emoji: "📚", bg: "bg-gray-100", text: "text-gray-600" };

    return (
        <Link
            href={`/materials?category_id=${category.id}`}
            className="bg-white border-2 border-gray-100 rounded-xl p-3 shadow-sm flex items-center gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all group"
        >
            <div className={`w-10 h-10 ${style.bg} rounded-lg flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform`}>
                {style.emoji}
            </div>
            <div className="min-w-0">
                <h3 className={`font-black ${style.text} text-sm leading-tight`}>
                    {category.name}
                </h3>
                <p className="text-[10px] text-gray-400">Lớp {category.grade}</p>
            </div>
        </Link>
    );
}
