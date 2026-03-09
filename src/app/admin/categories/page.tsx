"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, FolderOpen, ArrowLeft, X, Save } from "lucide-react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/lib/actions";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/Animations";
import { GRADE_LEVELS } from "@/lib/constants";
import type { Category, CategoryFormData, GradeLevel } from "@/types/database";

// =============================================================================
// Admin Categories — CRUD
// =============================================================================

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<CategoryFormData>({ name: "", grade: 1 as GradeLevel });
    const [saving, setSaving] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try { setCategories(await getCategories()); } catch (err) { console.error(err); }
        setLoading(false);
    };

    useEffect(() => { loadData(); }, []);

    const openCreate = () => { setEditingId(null); setForm({ name: "", grade: 1 as GradeLevel }); setShowForm(true); };
    const openEdit = (cat: Category) => { setEditingId(cat.id); setForm({ name: cat.name, grade: cat.grade }); setShowForm(true); };

    const handleSave = async () => {
        if (!form.name) { alert("Vui lòng nhập tên môn học!"); return; }
        setSaving(true);
        try {
            editingId ? await updateCategory(editingId, form) : await createCategory(form);
            setShowForm(false);
            await loadData();
        } catch (err) { alert("Lỗi: " + (err as Error).message); }
        setSaving(false);
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Xóa danh mục "${name}"? Tất cả tài liệu thuộc danh mục này cũng sẽ bị ảnh hưởng.`)) return;
        try { await deleteCategory(id); await loadData(); } catch (err) { alert("Lỗi: " + (err as Error).message); }
    };

    // Nhóm theo lớp
    const groupedByGrade = GRADE_LEVELS.map((gl) => ({
        ...gl,
        items: categories.filter((c) => c.grade === gl.value),
    }));

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b-4 border-teal-500">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/admin" className="text-gray-500 hover:text-gray-700"><ArrowLeft size={20} /></Link>
                        <h1 className="font-black text-gray-700 flex items-center gap-2"><FolderOpen size={20} /> Quản lý Danh mục</h1>
                    </div>
                    <button onClick={openCreate} className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-all active:scale-95">
                        <Plus size={16} /> Thêm mới
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Modal Form */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <FadeUp>
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="font-black text-xl">{editingId ? "Sửa danh mục" : "Thêm danh mục"}</h2>
                                    <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-bold text-gray-600 block mb-1">Tên môn học *</label>
                                        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:border-teal-400 focus:outline-none" placeholder="Toán, Tiếng Việt..." />
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-gray-600 block mb-1">Khối lớp *</label>
                                        <select value={form.grade} onChange={(e) => setForm({ ...form, grade: Number(e.target.value) as GradeLevel })}
                                            className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:border-teal-400 focus:outline-none">
                                            {GRADE_LEVELS.map((gl) => (<option key={gl.value} value={gl.value}>{gl.label}</option>))}
                                        </select>
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button onClick={handleSave} disabled={saving}
                                            className="flex-1 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                                            <Save size={16} /> {saving ? "Đang lưu..." : editingId ? "Cập nhật" : "Tạo mới"}
                                        </button>
                                        <button onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-600">Hủy</button>
                                    </div>
                                </div>
                            </div>
                        </FadeUp>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-20"><div className="animate-bounce text-4xl mb-3">📁</div><p className="font-bold text-gray-400">Đang tải...</p></div>
                ) : (
                    <StaggerContainer className="space-y-6">
                        {groupedByGrade.map((group) => (
                            <StaggerItem key={group.value}>
                                <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 overflow-hidden">
                                    <div className="bg-gray-50 px-4 py-3 border-b font-black text-gray-700">{group.label}</div>
                                    <div className="divide-y">
                                        {group.items.length > 0 ? group.items.map((cat) => (
                                            <div key={cat.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
                                                <span className="font-bold text-sm text-gray-700">{cat.name}</span>
                                                <div className="flex gap-2">
                                                    <button onClick={() => openEdit(cat)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-500"><Pencil size={14} /></button>
                                                    <button onClick={() => handleDelete(cat.id, cat.name)} className="p-2 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={14} /></button>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="p-4 text-center text-sm text-gray-400">Chưa có danh mục</div>
                                        )}
                                    </div>
                                </div>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                )}
            </main>
        </div>
    );
}
