"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Check,
    X,
    Trash2,
    MessageCircle,
    Eye,
    EyeOff,
} from "lucide-react";
import {
    getAllFeedbacks,
    toggleFeedbackApproval,
    deleteFeedback,
} from "@/lib/actions";
import type { Feedback, FeedbackRole } from "@/types/database";

const ROLE_LABELS: Record<FeedbackRole, { label: string; emoji: string }> = {
    phu_huynh: { label: "Phụ huynh", emoji: "👨‍👩‍👧" },
    hoc_sinh: { label: "Học sinh", emoji: "🎒" },
    giao_vien: { label: "Giáo viên", emoji: "👩‍🏫" },
    khac: { label: "Khác", emoji: "💬" },
};

export default function AdminFeedbacksPage() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "approved" | "pending">("all");

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getAllFeedbacks();
            setFeedbacks(data);
        } catch (err) {
            console.error("Lỗi tải feedbacks:", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleToggle = async (id: string, approved: boolean) => {
        try {
            await toggleFeedbackApproval(id, approved);
            await loadData();
        } catch (err) {
            alert("Lỗi: " + (err as Error).message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Xóa ý kiến này?")) return;
        try {
            await deleteFeedback(id);
            await loadData();
        } catch (err) {
            alert("Lỗi: " + (err as Error).message);
        }
    };

    const filtered = feedbacks.filter((fb) => {
        if (filter === "approved") return fb.is_approved;
        if (filter === "pending") return !fb.is_approved;
        return true;
    });

    const approvedCount = feedbacks.filter((f) => f.is_approved).length;
    const pendingCount = feedbacks.filter((f) => !f.is_approved).length;

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b-4 border-teal-500">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/admin" className="text-gray-400 hover:text-teal-600 transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-xl font-black text-gray-800 flex items-center gap-2">
                            <MessageCircle size={22} className="text-teal-500" />
                            Quản lý Ý kiến đóng góp
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
                            ✅ {approvedCount} đã duyệt
                        </span>
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-bold">
                            ⏳ {pendingCount} chờ duyệt
                        </span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Filter */}
                <div className="flex gap-2 mb-6">
                    {[
                        { key: "all", label: `Tất cả (${feedbacks.length})` },
                        { key: "approved", label: `Đã duyệt (${approvedCount})` },
                        { key: "pending", label: `Chờ duyệt (${pendingCount})` },
                    ].map((f) => (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key as typeof filter)}
                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                                filter === f.key
                                    ? "bg-teal-500 text-white shadow-md"
                                    : "bg-white border-2 border-gray-200 text-gray-600 hover:border-teal-300"
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-400 font-bold">Đang tải...</div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <span className="text-5xl block mb-4">💬</span>
                        <p className="text-gray-400 font-bold">Không có ý kiến nào</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map((fb) => {
                            const info = ROLE_LABELS[fb.author_role] || ROLE_LABELS.khac;
                            return (
                                <div
                                    key={fb.id}
                                    className={`bg-white rounded-xl p-5 border-2 shadow-sm transition-all ${
                                        fb.is_approved ? "border-green-200" : "border-yellow-200"
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-lg">{info.emoji}</span>
                                                <span className="font-black text-gray-700">{fb.author_name}</span>
                                                <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                                    {info.label}
                                                </span>
                                                {fb.is_approved ? (
                                                    <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                        <Eye size={10} /> Hiển thị
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                        <EyeOff size={10} /> Chờ duyệt
                                                    </span>
                                                )}
                                                <span className="text-[10px] text-gray-400 ml-auto">
                                                    {new Date(fb.created_at).toLocaleString("vi-VN")}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed">{fb.content}</p>
                                        </div>
                                        <div className="flex gap-1 shrink-0">
                                            {fb.is_approved ? (
                                                <button
                                                    onClick={() => handleToggle(fb.id, false)}
                                                    className="p-2 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition-colors"
                                                    title="Ẩn"
                                                >
                                                    <EyeOff size={16} />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleToggle(fb.id, true)}
                                                    className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                                                    title="Duyệt"
                                                >
                                                    <Check size={16} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(fb.id)}
                                                className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                                                title="Xóa"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
