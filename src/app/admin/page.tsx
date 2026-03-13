"use client";

import { useState, useEffect } from "react";

import Link from "next/link";
import {
    BarChart3,
    BookOpen,
    Users,
    FolderOpen,
    Download,
    TrendingUp,
    FileText,
    Newspaper,
    Settings,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts";
import { formatDownloadCount } from "@/lib/utils";
import { getVisitorStats } from "@/lib/visitor-stats";
import type { DashboardStats, DownloadChartData } from "@/types/database";

// =============================================================================
// Admin Dashboard
// Hiển thị: thống kê tổng quan + biểu đồ lượt tải + menu quản lý
// =============================================================================

// Mock data
const MOCK_STATS: DashboardStats = {
    total_materials: 127,
    total_users: 1543,
    total_downloads: 23456,
    total_reviews: 892,
};

const MOCK_CHART_DATA: DownloadChartData[] = [
    { date: "T2", count: 45 },
    { date: "T3", count: 62 },
    { date: "T4", count: 38 },
    { date: "T5", count: 85 },
    { date: "T6", count: 71 },
    { date: "T7", count: 53 },
    { date: "CN", count: 29 },
];

const MOCK_MONTHLY_DATA = [
    { date: "Th1", count: 320 },
    { date: "Th2", count: 450 },
    { date: "Th3", count: 380 },
    { date: "Th4", count: 520 },
    { date: "Th5", count: 680 },
    { date: "Th6", count: 410 },
    { date: "Th7", count: 550 },
    { date: "Th8", count: 390 },
    { date: "Th9", count: 720 },
    { date: "Th10", count: 850 },
    { date: "Th11", count: 680 },
    { date: "Th12", count: 920 },
];

const STAT_CARDS = [
    {
        label: "Tổng tài liệu",
        value: MOCK_STATS.total_materials,
        icon: BookOpen,
        color: "bg-orange-100 text-orange-600",
        borderColor: "border-orange-200",
    },
    {
        label: "Tổng người dùng",
        value: MOCK_STATS.total_users,
        icon: Users,
        color: "bg-blue-100 text-blue-600",
        borderColor: "border-blue-200",
    },
    {
        label: "Tổng lượt tải",
        value: MOCK_STATS.total_downloads,
        icon: Download,
        color: "bg-green-100 text-green-600",
        borderColor: "border-green-200",
    },
    {
        label: "Tổng đánh giá",
        value: MOCK_STATS.total_reviews,
        icon: TrendingUp,
        color: "bg-pink-100 text-pink-600",
        borderColor: "border-pink-200",
    },
];

const ADMIN_MENU = [
    {
        label: "Quản lý Tài liệu",
        href: "/admin/materials",
        icon: FileText,
        desc: "Thêm, sửa, xóa tài liệu",
        color: "bg-orange-500",
    },
    {
        label: "Quản lý Danh mục",
        href: "/admin/categories",
        icon: FolderOpen,
        desc: "Quản lý môn học & khối lớp",
        color: "bg-teal-500",
    },
    {
        label: "Quản lý Người dùng",
        href: "/admin/users",
        icon: Users,
        desc: "Xem danh sách & phân quyền",
        color: "bg-blue-500",
    },
    {
        label: "Quản lý Tin tức",
        href: "/admin/news",
        icon: Newspaper,
        desc: "Đăng bài & quản lý tin tức",
        color: "bg-pink-500",
    },
    {
        label: "Cài đặt Website",
        href: "/admin/settings",
        icon: Settings,
        desc: "SEO, avatar, footer, liên hệ",
        color: "bg-purple-500",
    },
];

export default function AdminDashboardPage() {
    const [visitorStats, setVisitorStats] = useState(getVisitorStats);

    // Cập nhật online mỗi 5 giây — khớp với trang chủ
    useEffect(() => {
        const interval = setInterval(() => {
            setVisitorStats((prev) => ({
                ...prev,
                online: Math.floor(Math.random() * 30 + 5),
            }));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Admin Header */}
            <header className="bg-white shadow-sm border-b-4 border-green-500">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="bg-red-500 text-white p-2 rounded-lg font-black text-sm transform -rotate-2 border-2 border-black"
                        >
                            HỌC TẬP VUI VẺ
                        </Link>
                        <span className="text-gray-400">|</span>
                        <h1 className="font-black text-gray-700 flex items-center gap-2">
                            <BarChart3 size={20} />
                            Admin Dashboard
                        </h1>
                    </div>
                    <Link
                        href="/"
                        className="text-sm font-bold text-gray-500 hover:text-green-600 transition-colors"
                    >
                        ← Về trang chủ
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {STAT_CARDS.map((stat) => (
                        <div
                            key={stat.label}
                            className={`bg-white rounded-2xl p-6 shadow-sm border-2 ${stat.borderColor}`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div
                                    className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}
                                >
                                    <stat.icon size={22} />
                                </div>
                            </div>
                            <p className="text-2xl font-black text-gray-800">
                                {formatDownloadCount(stat.value)}
                            </p>
                            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Biểu đồ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Biểu đồ cột: Lượt tải tuần */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100">
                        <h2 className="font-black text-gray-700 mb-4">
                            📊 Lượt tải theo tuần
                        </h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={MOCK_CHART_DATA}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: "12px",
                                        border: "none",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    }}
                                />
                                <Bar
                                    dataKey="count"
                                    fill="#FF8A65"
                                    radius={[8, 8, 0, 0]}
                                    name="Lượt tải"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Biểu đồ đường: Lượt tải theo tháng */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100">
                        <h2 className="font-black text-gray-700 mb-4">
                            📈 Lượt tải theo tháng
                        </h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={MOCK_MONTHLY_DATA}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: "12px",
                                        border: "none",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#4ECDC4"
                                    strokeWidth={3}
                                    dot={{ fill: "#4ECDC4", r: 4 }}
                                    name="Lượt tải"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Thống kê truy cập */}
                <h2 className="font-black text-gray-700 text-xl mb-4">
                    📊 Thống kê truy cập
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    <div className="bg-white rounded-2xl p-4 shadow-sm border-2 border-indigo-100 text-center">
                        <p className="text-2xl font-black text-indigo-600">{visitorStats.totalVisitors.toLocaleString("vi-VN")}</p>
                        <p className="text-xs text-gray-500 font-medium mt-1">🌐 Tổng truy cập</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm border-2 border-green-100 text-center">
                        <div className="flex items-center justify-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <p className="text-2xl font-black text-green-600">{visitorStats.online}</p>
                        </div>
                        <p className="text-xs text-gray-500 font-medium mt-1">👥 Đang online</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm border-2 border-orange-100 text-center">
                        <p className="text-2xl font-black text-orange-600">{visitorStats.todayViews}</p>
                        <p className="text-xs text-gray-500 font-medium mt-1">👁️ Xem hôm nay</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm border-2 border-pink-100 text-center">
                        <p className="text-2xl font-black text-pink-600">+{visitorStats.newMembers}</p>
                        <p className="text-xs text-gray-500 font-medium mt-1">🆕 TV mới hôm nay</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm border-2 border-blue-100 text-center">
                        <p className="text-2xl font-black text-blue-600">{visitorStats.totalMembers.toLocaleString("vi-VN")}</p>
                        <p className="text-xs text-gray-500 font-medium mt-1">👤 Tổng thành viên</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm border-2 border-amber-100 text-center">
                        <p className="text-2xl font-black text-amber-600">{visitorStats.totalMaterials}</p>
                        <p className="text-xs text-gray-500 font-medium mt-1">📄 Tổng tài liệu</p>
                    </div>
                </div>

                {/* Menu quản lý */}
                <h2 className="font-black text-gray-700 text-xl mb-4">
                    ⚙️ Quản lý
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {ADMIN_MENU.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all group"
                        >
                            <div
                                className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform`}
                            >
                                <item.icon size={24} />
                            </div>
                            <h3 className="font-black text-gray-700">{item.label}</h3>
                            <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
