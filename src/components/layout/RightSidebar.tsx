"use client";

import { useState, useEffect } from "react";
import { Search, Users, Globe, UserPlus, Eye } from "lucide-react";
import { getVisitorStats } from "@/lib/visitor-stats";

// =============================================================================
// RightSidebar - Thanh bên phải
// Gồm: Góc Phụ Huynh + Tìm bài học nhanh + Thống kê truy cập
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
    const [stats, setStats] = useState(getVisitorStats);

    // Cập nhật số online mỗi 5 giây cho hiệu ứng real-time
    useEffect(() => {
        const interval = setInterval(() => {
            setStats((prev) => ({
                ...prev,
                online: Math.floor(Math.random() * 30 + 5),
            }));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

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

            {/* Thống kê truy cập */}
            <section className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border-2 border-indigo-100 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-3 font-black text-center text-sm">
                    📊 THỐNG KÊ TRUY CẬP
                </div>
                <div className="p-4 space-y-3">
                    {/* Tổng truy cập */}
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <Globe size={16} className="text-indigo-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] text-gray-500 font-medium">Tổng lượt truy cập</p>
                            <p className="text-sm font-black text-indigo-700">
                                {stats.totalVisitors.toLocaleString("vi-VN")}
                            </p>
                        </div>
                    </div>

                    {/* Đang online */}
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center relative">
                            <Users size={16} className="text-green-600" />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse border-2 border-white" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] text-gray-500 font-medium">Đang online</p>
                            <p className="text-sm font-black text-green-600">
                                {stats.online}
                                <span className="text-[9px] text-green-400 font-medium ml-1">người</span>
                            </p>
                        </div>
                    </div>

                    {/* Lượt xem hôm nay */}
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Eye size={16} className="text-orange-500" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] text-gray-500 font-medium">Lượt xem hôm nay</p>
                            <p className="text-sm font-black text-orange-600">{stats.todayViews}</p>
                        </div>
                    </div>

                    {/* Thành viên mới */}
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-pink-100 rounded-lg flex items-center justify-center">
                            <UserPlus size={16} className="text-pink-500" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] text-gray-500 font-medium">Thành viên mới hôm nay</p>
                            <p className="text-sm font-black text-pink-600">+{stats.newMembers}</p>
                        </div>
                    </div>
                </div>
            </section>
        </aside>
    );
}
