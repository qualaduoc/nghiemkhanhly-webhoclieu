"use client";

import { useState } from "react";
import { Search } from "lucide-react";

// =============================================================================
// RightSidebar - Thanh bên phải
// Gồm: Góc Phụ Huynh (tin tức cho PH) + Tìm bài học nhanh
// =============================================================================

const QUICK_TAGS = [
    "#ToanLop3",
    "#KeChuyen",
    "#English",
    "#DaoDoc",
    "#TuNhien",
    "#DeThi",
];

export function RightSidebar() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <aside className="w-72 p-4 pt-12 space-y-8 hidden xl:block">
            {/* Góc Phụ Huynh */}
            <section>
                <div className="bg-white rounded-2xl shadow-md overflow-hidden border-2 border-teal-200">
                    <div className="bg-teal-500 text-white p-3 font-black text-center">
                        GÓC PHỤ HUYNH
                    </div>
                    <div className="p-4 space-y-4">
                        {/* Bài viết nổi bật */}
                        <div className="group cursor-pointer">
                            <div className="overflow-hidden rounded-lg mb-2">
                                <div className="w-full h-32 bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center text-4xl transition-transform group-hover:scale-105">
                                    📖
                                </div>
                            </div>
                            <h4 className="font-bold text-sm text-teal-700">
                                Cẩm nang đồng hành cùng con
                            </h4>
                            <p className="text-[10px] text-gray-500">
                                Cách giúp trẻ yêu thích việc tự học tại nhà...
                            </p>
                        </div>

                        <hr className="border-teal-100" />

                        {/* Tin tức nhỏ */}
                        <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-1 rounded-lg transition-colors">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg shrink-0 flex items-center justify-center text-xl">
                                📢
                            </div>
                            <div>
                                <h4 className="font-bold text-xs text-gray-700">
                                    Thông báo lịch thi học kỳ
                                </h4>
                                <p className="text-[9px] text-gray-400">Cập nhật mới nhất</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-1 rounded-lg transition-colors">
                            <div className="w-12 h-12 bg-green-100 rounded-lg shrink-0 flex items-center justify-center text-xl">
                                🔍
                            </div>
                            <div>
                                <h4 className="font-bold text-xs text-gray-700">
                                    Khám phá tiềm năng của trẻ
                                </h4>
                                <p className="text-[9px] text-gray-400">
                                    Trắc nghiệm tính cách miễn phí
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tìm Bài Học Nhanh */}
            <section className="bg-teal-50 p-6 rounded-2xl border-dashed border-2 border-teal-300">
                <h3 className="font-black text-teal-700 mb-4 text-center">
                    TÌM BÀI HỌC NHANH
                </h3>
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-full border-teal-200 border-2 text-sm pl-10 pr-4 py-2 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200 transition-all"
                        placeholder="Gõ từ khóa..."
                    />
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-400"
                    />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    {QUICK_TAGS.map((tag) => (
                        <span
                            key={tag}
                            className="bg-white px-2 py-1 rounded-md text-[10px] font-bold text-teal-600 border border-teal-100 cursor-pointer hover:bg-teal-100 transition-colors"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </section>
        </aside>
    );
}
