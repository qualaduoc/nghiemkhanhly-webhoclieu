"use client";

import { useState } from "react";
import { MessageCircle, Send, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { createFeedback } from "@/lib/actions";
import type { Feedback, FeedbackRole } from "@/types/database";

const ROLE_LABELS: Record<FeedbackRole, { label: string; emoji: string; color: string }> = {
    phu_huynh: { label: "Phụ huynh", emoji: "👨‍👩‍👧", color: "bg-blue-100 text-blue-700" },
    hoc_sinh: { label: "Học sinh", emoji: "🎒", color: "bg-green-100 text-green-700" },
    giao_vien: { label: "Giáo viên", emoji: "👩‍🏫", color: "bg-orange-100 text-orange-700" },
    khac: { label: "Khác", emoji: "💬", color: "bg-gray-100 text-gray-700" },
};

export function FeedbackSection({ feedbacks }: { feedbacks: Feedback[] }) {
    const [showForm, setShowForm] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const [name, setName] = useState("");
    const [role, setRole] = useState<FeedbackRole>("phu_huynh");
    const [content, setContent] = useState("");
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleOpenForm = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setIsLoggedIn(false);
            return;
        }
        setIsLoggedIn(true);
        setName(user.email?.split("@")[0] || "");
        setShowForm(true);
    };

    const handleSubmit = async () => {
        if (!name.trim() || !content.trim()) {
            alert("Vui lòng điền đầy đủ Họ tên và Nội dung!");
            return;
        }
        setSending(true);
        try {
            await createFeedback({ author_name: name, author_role: role, content });
            setSent(true);
            setShowForm(false);
            setContent("");
        } catch {
            alert("Có lỗi xảy ra, vui lòng thử lại!");
        }
        setSending(false);
    };

    return (
        <section className="mt-8">
            <h2 className="text-xl font-black text-gray-700 mb-4 flex items-center gap-2">
                <MessageCircle size={22} className="text-teal-500" />
                Ý kiến đóng góp
            </h2>

            {/* Danh sách ý kiến đã duyệt */}
            <div className="space-y-3 mb-6">
                {feedbacks.length === 0 && (
                    <p className="text-center text-gray-400 py-6">Chưa có ý kiến nào.</p>
                )}
                {feedbacks.map((fb) => {
                    const info = ROLE_LABELS[fb.author_role] || ROLE_LABELS.khac;
                    return (
                        <div key={fb.id} className="bg-white rounded-xl p-4 border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">{info.emoji}</span>
                                <span className="font-bold text-sm text-gray-700">{fb.author_name}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${info.color}`}>
                                    {info.label}
                                </span>
                                <span className="text-[10px] text-gray-400 ml-auto">
                                    {new Date(fb.created_at).toLocaleDateString("vi-VN")}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">{fb.content}</p>
                        </div>
                    );
                })}
            </div>

            {/* Nút gửi ý kiến */}
            {sent ? (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
                    <Star size={24} className="text-green-500 mx-auto mb-2" />
                    <p className="font-bold text-green-700">Cảm ơn bạn đã gửi ý kiến!</p>
                    <p className="text-xs text-green-600 mt-1">Ý kiến sẽ được Admin xét duyệt trước khi hiển thị.</p>
                </div>
            ) : !showForm ? (
                <div className="text-center">
                    <button
                        onClick={handleOpenForm}
                        className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-full font-bold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2 mx-auto"
                    >
                        <Send size={16} />
                        Gửi ý kiến đóng góp
                    </button>
                    {isLoggedIn === false && (
                        <p className="text-xs text-red-500 mt-2 font-bold">
                            ⚠️ Bạn cần <a href="/login" className="underline">đăng nhập</a> để gửi ý kiến!
                        </p>
                    )}
                </div>
            ) : (
                <div className="bg-teal-50 rounded-xl p-5 border-2 border-teal-200">
                    <h3 className="font-bold text-teal-700 mb-4">📝 Viết ý kiến của bạn</h3>
                    <div className="space-y-3">
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border-2 border-gray-200 rounded-lg p-2.5 text-sm focus:border-teal-400 focus:outline-none"
                            placeholder="Họ và tên..."
                        />
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as FeedbackRole)}
                            className="w-full border-2 border-gray-200 rounded-lg p-2.5 text-sm focus:border-teal-400 focus:outline-none"
                        >
                            <option value="phu_huynh">👨‍👩‍👧 Phụ huynh</option>
                            <option value="hoc_sinh">🎒 Học sinh</option>
                            <option value="giao_vien">👩‍🏫 Giáo viên</option>
                            <option value="khac">💬 Khác</option>
                        </select>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={3}
                            className="w-full border-2 border-gray-200 rounded-lg p-2.5 text-sm focus:border-teal-400 focus:outline-none resize-none"
                            placeholder="Chia sẻ ý kiến, góp ý, đề xuất..."
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleSubmit}
                                disabled={sending}
                                className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 rounded-lg font-bold text-sm transition-all disabled:opacity-50 flex items-center gap-1"
                            >
                                <Send size={14} /> {sending ? "Đang gửi..." : "Gửi"}
                            </button>
                            <button
                                onClick={() => setShowForm(false)}
                                className="bg-gray-200 text-gray-600 px-5 py-2 rounded-lg font-bold text-sm"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
