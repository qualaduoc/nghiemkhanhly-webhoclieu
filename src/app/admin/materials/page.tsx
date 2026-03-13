"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Plus,
    Pencil,
    Trash2,
    FileText,
    ArrowLeft,
    X,
    Save,
} from "lucide-react";
import {
    getMaterials,
    getCategories,
    createMaterial,
    updateMaterial,
    deleteMaterial,
} from "@/lib/actions";
import { FadeUp } from "@/components/ui/Animations";
import { formatDownloadCount, extractDriveId } from "@/lib/utils";
import { FILE_TYPES } from "@/lib/constants";
import type { Material, Category, MaterialFormData, FileType } from "@/types/database";

// =============================================================================
// Admin Materials — CRUD đầy đủ
// =============================================================================

const EMPTY_FORM: MaterialFormData = {
    title: "",
    summary: "",
    description: "",
    cover_image: "",
    drive_id: "",
    external_url: "",
    file_type: "pdf",
    category_id: "",
};

export default function AdminMaterialsPage() {
    const [materials, setMaterials] = useState<(Material & { category: Category })[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<MaterialFormData>(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const [mats, cats] = await Promise.all([getMaterials(), getCategories()]);
            setMaterials(mats);
            setCategories(cats);
        } catch (err) {
            console.error("Lỗi tải data:", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const openCreate = () => {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setShowForm(true);
    };

    const openEdit = (mat: Material) => {
        setEditingId(mat.id);
        setForm({
            title: mat.title,
            summary: mat.summary || "",
            description: mat.description || "",
            cover_image: mat.cover_image || "",
            drive_id: mat.drive_id,
            external_url: mat.external_url || "",
            file_type: mat.file_type,
            category_id: mat.category_id,
        });
        setShowForm(true);
    };

    const handleSave = async () => {
        if (!form.title || (!form.drive_id && !form.external_url) || !form.category_id) {
            alert("Vui lòng điền Tiêu đề, Link tải (Drive hoặc Link khác) và Danh mục!");
            return;
        }
        setSaving(true);
        try {
            if (editingId) {
                await updateMaterial(editingId, form);
            } else {
                await createMaterial(form);
            }
            setShowForm(false);
            await loadData();
        } catch (err) {
            alert("Lỗi: " + (err as Error).message);
        }
        setSaving(false);
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Xóa tài liệu "${title}"?`)) return;
        try {
            await deleteMaterial(id);
            await loadData();
        } catch (err) {
            alert("Lỗi xóa: " + (err as Error).message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b-4 border-orange-500">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/admin" className="text-gray-500 hover:text-gray-700">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="font-black text-gray-700 flex items-center gap-2">
                            <FileText size={20} /> Quản lý Tài liệu
                        </h1>
                    </div>
                    <button
                        onClick={openCreate}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-all active:scale-95"
                    >
                        <Plus size={16} /> Thêm mới
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <FadeUp>
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="font-black text-xl text-gray-800">
                                        {editingId ? "Sửa tài liệu" : "Thêm tài liệu mới"}
                                    </h2>
                                    <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {/* Title */}
                                    <div>
                                        <label className="text-sm font-bold text-gray-600 block mb-1">Tiêu đề *</label>
                                        <input
                                            value={form.title}
                                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                                            className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                                            placeholder="Giáo án Toán lớp 3..."
                                        />
                                    </div>

                                    {/* Summary */}
                                    <div>
                                        <label className="text-sm font-bold text-gray-600 block mb-1">Tóm tắt</label>
                                        <textarea
                                            value={form.summary}
                                            onChange={(e) => setForm({ ...form, summary: e.target.value })}
                                            rows={2}
                                            className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:border-orange-400 focus:outline-none resize-none"
                                            placeholder="Mô tả ngắn..."
                                        />
                                    </div>

                                    {/* Google Drive Link */}
                                    <div>
                                        <label className="text-sm font-bold text-gray-600 block mb-1">Link Google Drive</label>
                                        <input
                                            value={form.drive_id}
                                            onChange={(e) => setForm({ ...form, drive_id: extractDriveId(e.target.value) })}
                                            className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:border-orange-400 focus:outline-none"
                                            placeholder="Dán link Google Drive hoặc ID vào đây..."
                                        />
                                        <p className="text-[10px] text-gray-400 mt-1">
                                            📋 Paste cả link → hệ thống tự bóc ID và tải trực tiếp
                                        </p>
                                        {form.drive_id && (
                                            <p className="text-[10px] text-green-600 font-bold mt-1">
                                                ✅ Drive ID: {form.drive_id}
                                            </p>
                                        )}
                                    </div>

                                    {/* Link tải khác */}
                                    <div>
                                        <label className="text-sm font-bold text-gray-600 block mb-1">Link tải khác</label>
                                        <input
                                            value={form.external_url}
                                            onChange={(e) => setForm({ ...form, external_url: e.target.value })}
                                            className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:border-blue-400 focus:outline-none"
                                            placeholder="https://example.com/file.pdf"
                                        />
                                        <p className="text-[10px] text-gray-400 mt-1">
                                            🔗 Nếu điền link này, nút Tải sẽ mở link này thay vì Google Drive
                                        </p>
                                    </div>

                                    {/* Category + File Type */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-bold text-gray-600 block mb-1">Danh mục *</label>
                                            <select
                                                value={form.category_id}
                                                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                                                className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:border-orange-400 focus:outline-none"
                                            >
                                                <option value="">-- Chọn danh mục --</option>
                                                {categories.map((cat) => (
                                                    <option key={cat.id} value={cat.id}>
                                                        Lớp {cat.grade} - {cat.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-gray-600 block mb-1">Loại file</label>
                                            <select
                                                value={form.file_type}
                                                onChange={(e) => setForm({ ...form, file_type: e.target.value as FileType })}
                                                className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:border-orange-400 focus:outline-none"
                                            >
                                                {FILE_TYPES.map((ft) => (
                                                    <option key={ft.value} value={ft.value}>
                                                        {ft.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Cover Image */}
                                    <div>
                                        <label className="text-sm font-bold text-gray-600 block mb-1">URL ảnh bìa</label>
                                        <input
                                            value={form.cover_image}
                                            onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
                                            className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:border-orange-400 focus:outline-none"
                                            placeholder="https://..."
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="text-sm font-bold text-gray-600 block mb-1">Mô tả chi tiết (HTML)</label>
                                        <textarea
                                            value={form.description}
                                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                                            rows={4}
                                            className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:border-orange-400 focus:outline-none resize-none font-mono"
                                            placeholder="<p>Nội dung...</p>"
                                        />
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                                        >
                                            <Save size={16} />
                                            {saving ? "Đang lưu..." : editingId ? "Cập nhật" : "Tạo mới"}
                                        </button>
                                        <button
                                            onClick={() => setShowForm(false)}
                                            className="px-6 py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-600 hover:bg-gray-50"
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </FadeUp>
                    </div>
                )}

                {/* Table */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-bounce text-4xl mb-3">📄</div>
                        <p className="font-bold text-gray-400">Đang tải danh sách...</p>
                    </div>
                ) : (
                    <>
                        <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b">
                                        <th className="text-left p-4 text-sm font-bold text-gray-600">Tài liệu</th>
                                        <th className="text-left p-4 text-sm font-bold text-gray-600 hidden md:table-cell">Danh mục</th>
                                        <th className="text-left p-4 text-sm font-bold text-gray-600 hidden sm:table-cell">Loại</th>
                                        <th className="text-right p-4 text-sm font-bold text-gray-600 hidden sm:table-cell">Tải</th>
                                        <th className="text-right p-4 text-sm font-bold text-gray-600">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {materials.map((mat) => (
                                        <tr key={mat.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                                            <td className="p-4">
                                                <p className="font-bold text-sm text-gray-800 line-clamp-1">{mat.title}</p>
                                                {mat.summary && (
                                                    <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{mat.summary}</p>
                                                )}
                                            </td>
                                            <td className="p-4 hidden md:table-cell">
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">
                                                    Lớp {mat.category?.grade} - {mat.category?.name}
                                                </span>
                                            </td>
                                            <td className="p-4 hidden sm:table-cell">
                                                <span className="text-xs font-bold uppercase text-gray-500">{mat.file_type}</span>
                                            </td>
                                            <td className="p-4 text-right hidden sm:table-cell">
                                                <span className="text-xs font-bold text-gray-500">
                                                    {formatDownloadCount(mat.download_count)}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => openEdit(mat)}
                                                        className="p-2 hover:bg-blue-50 rounded-lg text-blue-500 transition-colors"
                                                        title="Sửa"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(mat.id, mat.title)}
                                                        className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                                                        title="Xóa"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {materials.length === 0 && (
                                <div className="text-center py-16">
                                    <span className="text-4xl mb-3 block">📂</span>
                                    <p className="font-bold text-gray-400">Chưa có tài liệu nào</p>
                                    <button onClick={openCreate} className="mt-4 text-orange-500 font-bold text-sm hover:underline">
                                        + Thêm tài liệu đầu tiên
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
