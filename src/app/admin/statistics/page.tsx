"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Globe,
    Users,
    Eye,
    UserPlus,
    Download,
    TrendingUp,
    Calendar,
    ChevronLeft,
    ChevronRight,
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
    Legend,
} from "recharts";
import { getMonthlyReports, getVisitorStats } from "@/lib/visitor-stats";
import type { MonthlyReport } from "@/lib/visitor-stats";

// =============================================================================
// Admin Statistics — Báo cáo thống kê truy cập theo Tháng/Năm
// =============================================================================

export default function AdminStatisticsPage() {
    const reports = useMemo(() => getMonthlyReports(), []);
    const [visitorStats, setVisitorStats] = useState(getVisitorStats);

    // Lọc theo năm
    const availableYears = useMemo(() => {
        const years = [...new Set(reports.map((r) => r.year))];
        return years.sort((a, b) => b - a);
    }, [reports]);

    const [selectedYear, setSelectedYear] = useState(availableYears[0]);

    const filteredReports = useMemo(
        () => reports.filter((r) => r.year === selectedYear),
        [reports, selectedYear]
    );

    // Tổng hợp năm
    const yearSummary = useMemo(() => {
        return filteredReports.reduce(
            (acc, r) => ({
                visitors: acc.visitors + r.visitors,
                views: acc.views + r.views,
                newMembers: acc.newMembers + r.newMembers,
                downloads: acc.downloads + r.downloads,
            }),
            { visitors: 0, views: 0, newMembers: 0, downloads: 0 }
        );
    }, [filteredReports]);

    // Cập nhật online
    useEffect(() => {
        const interval = setInterval(() => {
            setVisitorStats((prev) => ({
                ...prev,
                online: Math.floor(Math.random() * 10 + 2),
            }));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b-4 border-indigo-500">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/admin" className="text-gray-400 hover:text-indigo-600 transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-xl font-black text-gray-800">
                            📊 Thống kê truy cập
                        </h1>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Realtime Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    <StatCard
                        icon={<Globe size={18} className="text-indigo-600" />}
                        value={visitorStats.totalVisitors.toLocaleString("vi-VN")}
                        label="Tổng truy cập"
                        border="border-indigo-100"
                        color="text-indigo-600"
                    />
                    <StatCard
                        icon={
                            <div className="relative">
                                <Users size={18} className="text-green-600" />
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            </div>
                        }
                        value={String(visitorStats.online)}
                        label="Đang online"
                        border="border-green-100"
                        color="text-green-600"
                    />
                    <StatCard
                        icon={<Eye size={18} className="text-orange-500" />}
                        value={String(visitorStats.todayViews)}
                        label="Xem hôm nay"
                        border="border-orange-100"
                        color="text-orange-600"
                    />
                    <StatCard
                        icon={<UserPlus size={18} className="text-pink-500" />}
                        value={`+${visitorStats.newMembers}`}
                        label="TV mới hôm nay"
                        border="border-pink-100"
                        color="text-pink-600"
                    />
                    <StatCard
                        icon={<Users size={18} className="text-blue-600" />}
                        value={visitorStats.totalMembers.toLocaleString("vi-VN")}
                        label="Tổng thành viên"
                        border="border-blue-100"
                        color="text-blue-600"
                    />
                    <StatCard
                        icon={<Download size={18} className="text-amber-500" />}
                        value={String(visitorStats.totalMaterials)}
                        label="Tổng tài liệu"
                        border="border-amber-100"
                        color="text-amber-600"
                    />
                </div>

                {/* Bộ lọc Năm */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-black text-gray-700 text-lg flex items-center gap-2">
                        <Calendar size={20} />
                        Báo cáo năm {selectedYear}
                    </h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                const idx = availableYears.indexOf(selectedYear);
                                if (idx < availableYears.length - 1) setSelectedYear(availableYears[idx + 1]);
                            }}
                            disabled={selectedYear === availableYears[availableYears.length - 1]}
                            className="p-2 rounded-lg bg-white border-2 border-gray-200 hover:border-indigo-300 disabled:opacity-30 transition-all"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        {availableYears.map((y) => (
                            <button
                                key={y}
                                onClick={() => setSelectedYear(y)}
                                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                                    selectedYear === y
                                        ? "bg-indigo-500 text-white shadow-md"
                                        : "bg-white border-2 border-gray-200 text-gray-600 hover:border-indigo-300"
                                }`}
                            >
                                {y}
                            </button>
                        ))}
                        <button
                            onClick={() => {
                                const idx = availableYears.indexOf(selectedYear);
                                if (idx > 0) setSelectedYear(availableYears[idx - 1]);
                            }}
                            disabled={selectedYear === availableYears[0]}
                            className="p-2 rounded-lg bg-white border-2 border-gray-200 hover:border-indigo-300 disabled:opacity-30 transition-all"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Tổng hợp năm */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <SummaryCard label="Tổng lượt truy cập" value={yearSummary.visitors} icon="🌐" color="bg-indigo-50 text-indigo-700" />
                    <SummaryCard label="Tổng lượt xem" value={yearSummary.views} icon="👁️" color="bg-orange-50 text-orange-700" />
                    <SummaryCard label="Thành viên mới" value={yearSummary.newMembers} icon="🆕" color="bg-pink-50 text-pink-700" />
                    <SummaryCard label="Lượt tải tài liệu" value={yearSummary.downloads} icon="📥" color="bg-teal-50 text-teal-700" />
                </div>

                {/* Biểu đồ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Biểu đồ cột: Truy cập + Lượt xem */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100">
                        <h3 className="font-black text-gray-700 mb-4">
                            📊 Truy cập & Lượt xem theo tháng
                        </h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={filteredReports}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 11 }} />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: "12px",
                                        border: "none",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    }}
                                />
                                <Legend wrapperStyle={{ fontSize: 12 }} />
                                <Bar dataKey="visitors" fill="#6366f1" radius={[6, 6, 0, 0]} name="Truy cập" />
                                <Bar dataKey="views" fill="#f97316" radius={[6, 6, 0, 0]} name="Lượt xem" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Biểu đồ đường: Thành viên mới + Lượt tải */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100">
                        <h3 className="font-black text-gray-700 mb-4">
                            📈 Thành viên & Lượt tải theo tháng
                        </h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={filteredReports}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 11 }} />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: "12px",
                                        border: "none",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    }}
                                />
                                <Legend wrapperStyle={{ fontSize: 12 }} />
                                <Line type="monotone" dataKey="newMembers" stroke="#ec4899" strokeWidth={3} dot={{ r: 4 }} name="TV mới" />
                                <Line type="monotone" dataKey="downloads" stroke="#14b8a6" strokeWidth={3} dot={{ r: 4 }} name="Lượt tải" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bảng chi tiết */}
                <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-6 py-4">
                        <h3 className="font-black flex items-center gap-2">
                            <TrendingUp size={18} />
                            Chi tiết theo tháng — Năm {selectedYear}
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-100">
                                    <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase">Tháng</th>
                                    <th className="px-6 py-3 text-right text-xs font-black text-gray-500 uppercase">Truy cập</th>
                                    <th className="px-6 py-3 text-right text-xs font-black text-gray-500 uppercase">Lượt xem</th>
                                    <th className="px-6 py-3 text-right text-xs font-black text-gray-500 uppercase">TV mới</th>
                                    <th className="px-6 py-3 text-right text-xs font-black text-gray-500 uppercase">Lượt tải</th>
                                    <th className="px-6 py-3 text-right text-xs font-black text-gray-500 uppercase">Tăng trưởng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReports.map((r, idx) => {
                                    const prev = idx > 0 ? filteredReports[idx - 1] : null;
                                    const growth = prev
                                        ? Math.round(((r.visitors - prev.visitors) / prev.visitors) * 100)
                                        : 0;
                                    return (
                                        <tr key={r.label} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-sm text-gray-700">
                                                Tháng {r.month}/{r.year}
                                            </td>
                                            <td className="px-6 py-4 text-right font-black text-sm text-indigo-600">
                                                {r.visitors.toLocaleString("vi-VN")}
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-sm text-orange-600">
                                                {r.views.toLocaleString("vi-VN")}
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-sm text-pink-600">
                                                +{r.newMembers}
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-sm text-teal-600">
                                                {r.downloads}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {idx === 0 ? (
                                                    <span className="text-xs text-gray-400">—</span>
                                                ) : (
                                                    <span className={`text-xs font-black px-2 py-1 rounded-full ${
                                                        growth >= 0
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}>
                                                        {growth >= 0 ? "↑" : "↓"}{Math.abs(growth)}%
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot>
                                <tr className="bg-gray-50 font-black">
                                    <td className="px-6 py-4 text-sm text-gray-700">TỔNG CỘNG</td>
                                    <td className="px-6 py-4 text-right text-sm text-indigo-700">{yearSummary.visitors.toLocaleString("vi-VN")}</td>
                                    <td className="px-6 py-4 text-right text-sm text-orange-700">{yearSummary.views.toLocaleString("vi-VN")}</td>
                                    <td className="px-6 py-4 text-right text-sm text-pink-700">+{yearSummary.newMembers}</td>
                                    <td className="px-6 py-4 text-right text-sm text-teal-700">{yearSummary.downloads}</td>
                                    <td className="px-6 py-4"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}

// Sub-components
function StatCard({ icon, value, label, border, color }: {
    icon: React.ReactNode; value: string; label: string; border: string; color: string;
}) {
    return (
        <div className={`bg-white rounded-2xl p-4 shadow-sm border-2 ${border} text-center`}>
            <div className="flex justify-center mb-2">{icon}</div>
            <p className={`text-xl font-black ${color}`}>{value}</p>
            <p className="text-[10px] text-gray-500 font-medium mt-1">{label}</p>
        </div>
    );
}

function SummaryCard({ label, value, icon, color }: {
    label: string; value: number; icon: string; color: string;
}) {
    return (
        <div className={`${color} rounded-2xl p-5 text-center`}>
            <span className="text-2xl">{icon}</span>
            <p className="text-2xl font-black mt-1">{value.toLocaleString("vi-VN")}</p>
            <p className="text-xs font-medium mt-1 opacity-70">{label}</p>
        </div>
    );
}
