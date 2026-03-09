"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Newspaper, ArrowLeft, X, Save } from "lucide-react";
import { getNews, createNews, updateNews, deleteNews } from "@/lib/actions";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/Animations";
import { formatDate } from "@/lib/utils";
import type { News, NewsFormData } from "@/types/database";

// =============================================================================
// Admin News — CRUD tin tức
// =============================================================================

const EMPTY_FORM: NewsFormData = { title: "", content: "", thumbnail: "" };

export default function AdminNewsPage() {
    const [newsList, setNewsList] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<NewsFormData>(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try { setNewsList(await getNews()); } catch (err) { console.error(err); }
        setLoading(false);
    };

    useEffect(() => { loadData(); }, []);

    const openCreate = () => { setEditingId(null); setForm(EMPTY_FORM); setShowForm(true); };
    const openEdit = (n: News) => {
        setEditingId(n.id);
        setForm({ title: n.title, content: n.content, thumbnail: n.thumbnail || "" });
        setShowForm(true);
    };

    const handleSave = async () => {
        if (!form.title || !form.content) { alert("Vui lòng điền Tiêu đề và Nội dung!"); return; }
        setSaving(true);
        try {
            editingId ? await updateNews(editingId, form) : await createNews(form);
            setShowForm(false);
            await loadData();
        } catch (err) { alert("Lỗi: " + (err as Error).message); }
        setSaving(false);
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Xóa tin "${title}"?`)) return;
        try { await deleteNews(id); await loadData(); } catch (err) { alert("Lỗi: " + (err as Error).message); }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b-4 border-pink-500">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/admin" className="text-gray-500 hover:text-gray-700"><ArrowLeft size={20} /></Link>
                        <h1 className="font-black text-gray-700 flex items-center gap-2"><Newspaper size={20} /> Quản lý Tin tức</h1>
                    </div>
                    <button onClick={openCreate} className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-all active:scale-95">
                        <Plus size={16} /> Thêm bài viết
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Modal Form */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <FadeUp>
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="font-black text-xl">{editingId ? "Sửa bài viết" : "Thêm bài viết"}</h2>
                                    <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-bold text-gray-600 block mb-1">Tiêu đề *</label>
                                        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                                            className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:border-pink-400 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-gray-600 block mb-1">URL ảnh thumbnail</label>
                                        <input value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                                            className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:border-pink-400 focus:outline-none" placeholder="https://..." />
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-gray-600 block mb-1">Nội dung (HTML) *</label>
                                        <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                                            rows={10} className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:border-pink-400 focus:outline-none resize-none font-mono"
                                            placeholder="<h2>Tiêu đề</h2><p>Nội dung...</p>" />
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button onClick={handleSave} disabled={saving}
                                            className="flex-1 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                                            <Save size={16} /> {saving ? "Đang lưu..." : editingId ? "Cập nhật" : "Đăng bài"}
                                        </button>
                                        <button onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-600">Hủy</button>
                                    </div>
                                </div>
                            </div>
                        </FadeUp>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-20"><div className="animate-bounce text-4xl mb-3">📰</div><p className="font-bold text-gray-400">Đang tải...</p></div>
                ) : (
                    <StaggerContainer className="space-y-4">
                        {newsList.map((n) => (
                            <StaggerItem key={n.id}>
                                <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-4 flex items-center justify-between hover:shadow-md transition-all">
                                    <div className="flex-1 min-w-0 mr-4">
                                        <p className="font-bold text-sm text-gray-800 line-clamp-1">{n.title}</p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">{formatDate(n.created_at, "long")}</p>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <button onClick={() => openEdit(n)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-500"><Pencil size={14} /></button>
                                        <button onClick={() => handleDelete(n.id, n.title)} className="p-2 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            </StaggerItem>
                        ))}
                        {newsList.length === 0 && (
                            <div className="text-center py-16">
                                <span className="text-4xl mb-3 block">📰</span>
                                <p className="font-bold text-gray-400">Chưa có bài viết nào</p>
                                <button onClick={openCreate} className="mt-4 text-pink-500 font-bold text-sm hover:underline">+ Thêm bài viết đầu tiên</button>
                            </div>
                        )}
                    </StaggerContainer>
                )}
            </main>
        </div>
    );
}
