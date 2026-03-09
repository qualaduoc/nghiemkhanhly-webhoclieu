"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Settings,
    Search,
    Image,
    Phone,
    FileText,
    Save,
    Check,
    Loader2,
} from "lucide-react";
import { getSiteSettings, updateSiteSettings } from "@/lib/actions";
import type { SiteSettings } from "@/types/database";

// =============================================================================
// Admin Settings — Cấu hình toàn bộ website
// 4 tabs: SEO & Meta | Giao diện | Liên hệ | Chân trang
// =============================================================================

const TABS = [
    { id: "seo", label: "SEO & Meta", icon: Search, color: "text-blue-500" },
    { id: "appearance", label: "Giao diện", icon: Image, color: "text-orange-500" },
    { id: "contact", label: "Liên hệ", icon: Phone, color: "text-green-500" },
    { id: "footer", label: "Chân trang", icon: FileText, color: "text-pink-500" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState<TabId>("seo");
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        getSiteSettings().then((data) => {
            setSettings(data);
            setLoading(false);
        });
    }, []);

    const handleSave = async () => {
        if (!settings) return;
        setSaving(true);
        setSaved(false);
        try {
            const { id, updated_at, ...rest } = settings;
            await updateSiteSettings(rest);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            alert("Lỗi lưu cài đặt: " + (err as Error).message);
        }
        setSaving(false);
    };

    const update = (key: keyof SiteSettings, value: string) => {
        if (!settings) return;
        setSettings({ ...settings, [key]: value });
        setSaved(false);
    };

    if (loading || !settings) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-bounce text-4xl mb-3">⚙️</div>
                    <p className="font-bold text-gray-400">Đang tải cài đặt...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b-4 border-purple-500">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/admin" className="text-gray-500 hover:text-gray-700">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="font-black text-gray-700 flex items-center gap-2">
                            <Settings size={20} /> Cài đặt Website
                        </h1>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-all active:scale-95 ${saved
                                ? "bg-green-500 text-white"
                                : "bg-purple-500 hover:bg-purple-600 text-white"
                            } disabled:opacity-50`}
                    >
                        {saving ? (
                            <><Loader2 size={16} className="animate-spin" /> Đang lưu...</>
                        ) : saved ? (
                            <><Check size={16} /> Đã lưu!</>
                        ) : (
                            <><Save size={16} /> Lưu cài đặt</>
                        )}
                    </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8">
                {/* Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all ${activeTab === tab.id
                                    ? "bg-white shadow-md border-2 border-gray-200 text-gray-800"
                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                }`}
                        >
                            <tab.icon size={16} className={activeTab === tab.id ? tab.color : ""} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ─── Tab: SEO & Meta ─── */}
                {activeTab === "seo" && (
                    <div className="space-y-6">
                        <SectionCard title="🔍 SEO & Metadata" desc="Cấu hình metadata cho search engines">
                            <Field label="Tên website" value={settings.site_name}
                                onChange={(v) => update("site_name", v)}
                                placeholder="Kho Học Liệu Tiểu Học" />
                            <Field label="Mô tả website (Meta Description)" value={settings.site_description}
                                onChange={(v) => update("site_description", v)}
                                placeholder="Mô tả ngắn gọn, hấp dẫn (150-160 ký tự)"
                                multiline hint="Hiển thị dưới tiêu đề trên Google. Tối ưu 150-160 ký tự." />
                            <Field label="Từ khóa (Meta Keywords)" value={settings.meta_keywords}
                                onChange={(v) => update("meta_keywords", v)}
                                placeholder="giáo án, đề thi, tài liệu tiểu học, lớp 1, lớp 2..."
                                hint="Phân cách bằng dấu phẩy. Ví dụ: giáo án, đề thi, tài liệu" />
                            <Field label="Tác giả (Author)" value={settings.meta_author}
                                onChange={(v) => update("meta_author", v)}
                                placeholder="Nghiêm Khánh Ly" />
                            <Field label="Ảnh Open Graph (OG Image URL)" value={settings.og_image}
                                onChange={(v) => update("og_image", v)}
                                placeholder="https://example.com/og-image.jpg"
                                hint="Ảnh hiển thị khi chia sẻ link trên Facebook, Zalo. Kích thước tối ưu: 1200x630px" />
                            {settings.og_image && (
                                <div className="mt-2">
                                    <p className="text-xs font-bold text-gray-500 mb-1">Xem trước:</p>
                                    <img src={settings.og_image} alt="OG Preview" className="w-full max-w-md h-40 object-cover rounded-xl border-2 border-gray-200" />
                                </div>
                            )}
                        </SectionCard>
                    </div>
                )}

                {/* ─── Tab: Giao diện ─── */}
                {activeTab === "appearance" && (
                    <div className="space-y-6">
                        <SectionCard title="🐻 Hero Avatar (Mascot)" desc="Ảnh đại diện chú gấu ở sidebar trái">
                            <Field label="Tên mascot" value={settings.hero_avatar_name}
                                onChange={(v) => update("hero_avatar_name", v)}
                                placeholder="Gấu Thông Thái" />
                            <Field label="URL ảnh avatar" value={settings.hero_avatar_url}
                                onChange={(v) => update("hero_avatar_url", v)}
                                placeholder="https://example.com/bear-avatar.png"
                                hint="Ảnh vuông tốt nhất. Nếu để trống sẽ dùng emoji 🐻 mặc định" />

                            {/* Preview */}
                            <div className="mt-4 flex items-center gap-6">
                                <div className="text-center">
                                    <div className="w-28 h-28 bg-white rounded-full border-4 border-white shadow-inner overflow-hidden mx-auto">
                                        {settings.hero_avatar_url ? (
                                            <img src={settings.hero_avatar_url} alt="Avatar preview"
                                                className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-yellow-200 to-orange-300 flex items-center justify-center text-4xl">
                                                🐻
                                            </div>
                                        )}
                                    </div>
                                    <div className="bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm inline-block mt-2">
                                        {settings.hero_avatar_name || "Gấu Thông Thái"}
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500">
                                    <p className="font-bold text-gray-700 mb-1">Xem trước:</p>
                                    <p>Đây là cách mascot sẽ hiển thị trong sidebar trái trên trang chủ.</p>
                                </div>
                            </div>
                        </SectionCard>
                    </div>
                )}

                {/* ─── Tab: Liên hệ ─── */}
                {activeTab === "contact" && (
                    <div className="space-y-6">
                        <SectionCard title="📞 Thông tin liên hệ" desc="Hiển thị ở footer và trang liên hệ">
                            <Field label="Email" value={settings.contact_email}
                                onChange={(v) => update("contact_email", v)}
                                placeholder="contact@hoclieu.vn" />
                            <Field label="Số điện thoại" value={settings.contact_phone}
                                onChange={(v) => update("contact_phone", v)}
                                placeholder="0912 345 678" />
                            <Field label="Địa chỉ" value={settings.contact_address}
                                onChange={(v) => update("contact_address", v)}
                                placeholder="123 Đường ABC, Quận XYZ, TP.HCM" />
                        </SectionCard>

                        <SectionCard title="🌐 Mạng xã hội" desc="Liên kết đến các trang mạng xã hội">
                            <Field label="Facebook URL" value={settings.facebook_url}
                                onChange={(v) => update("facebook_url", v)}
                                placeholder="https://facebook.com/your-page" />
                            <Field label="YouTube URL" value={settings.youtube_url}
                                onChange={(v) => update("youtube_url", v)}
                                placeholder="https://youtube.com/@your-channel" />
                            <Field label="Zalo" value={settings.zalo_url}
                                onChange={(v) => update("zalo_url", v)}
                                placeholder="https://zalo.me/your-number" />
                        </SectionCard>
                    </div>
                )}

                {/* ─── Tab: Chân trang ─── */}
                {activeTab === "footer" && (
                    <div className="space-y-6">
                        <SectionCard title="🦶 Chân trang (Footer)" desc="Nội dung hiển thị ở cuối trang">
                            <Field label="Bản quyền (Copyright)" value={settings.footer_copyright}
                                onChange={(v) => update("footer_copyright", v)}
                                placeholder="© 2024 Bản quyền thuộc về..." />
                            <Field label="Slogan" value={settings.footer_slogan}
                                onChange={(v) => update("footer_slogan", v)}
                                placeholder="SÁNG TẠO - KẾT NỐI - THÀNH CÔNG" />
                        </SectionCard>
                    </div>
                )}
            </main>
        </div>
    );
}

// =============================================================================
// Sub-components
// =============================================================================

function SectionCard({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-6">
            <h2 className="font-black text-gray-800 text-lg">{title}</h2>
            <p className="text-xs text-gray-400 mb-6">{desc}</p>
            <div className="space-y-5">{children}</div>
        </div>
    );
}

function Field({
    label, value, onChange, placeholder, multiline, hint,
}: {
    label: string; value: string; onChange: (v: string) => void;
    placeholder?: string; multiline?: boolean; hint?: string;
}) {
    const inputClass = "w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all";
    return (
        <div>
            <label className="text-sm font-bold text-gray-600 block mb-1">{label}</label>
            {multiline ? (
                <textarea value={value} onChange={(e) => onChange(e.target.value)}
                    rows={3} className={`${inputClass} resize-none`} placeholder={placeholder} />
            ) : (
                <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
                    className={inputClass} placeholder={placeholder} />
            )}
            {hint && <p className="text-[10px] text-gray-400 mt-1">💡 {hint}</p>}
        </div>
    );
}
