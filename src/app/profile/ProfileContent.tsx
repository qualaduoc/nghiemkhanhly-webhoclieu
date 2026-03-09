"use client";

import { useState } from "react";
import { User, Download, FileText, Calendar, LogOut, Save } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

interface DownloadItem {
    id: string;
    downloaded_at: string;
    material: {
        title: string;
        file_type: string;
    };
}

export default function ProfileContent({
    initialProfile,
    email,
    downloads
}: {
    initialProfile: Profile;
    email: string;
    downloads: DownloadItem[];
}) {
    const [profile, setProfile] = useState<Profile>(initialProfile);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(initialProfile.full_name || "");
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        const supabase = createClient();
        const { error } = await supabase
            .from("profiles")
            .update({ full_name: editName, updated_at: new Date().toISOString() })
            .eq("id", profile.id);

        if (!error) {
            setProfile({ ...profile, full_name: editName });
            setIsEditing(false);
        } else {
            alert("Lỗi cập nhật: " + error.message);
        }
        setSaving(false);
    };

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.href = "/";
    };

    return (
        <main className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-black text-green-600 mb-8 flex items-center gap-2">
                <User size={28} />
                Trang Cá Nhân
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Card thông tin */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-6 text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-md overflow-hidden">
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar"
                                    className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                                "🐻"
                            )}
                        </div>

                        {isEditing ? (
                            <div className="space-y-3">
                                <input value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full border-2 border-gray-200 rounded-lg p-2 text-center text-sm font-bold focus:border-green-400 focus:outline-none" />
                                <div className="flex gap-2 justify-center">
                                    <button onClick={handleSave} disabled={saving}
                                        className="bg-green-500 text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 disabled:opacity-50">
                                        <Save size={12} /> {saving ? "Lưu..." : "Lưu"}
                                    </button>
                                    <button onClick={() => setIsEditing(false)}
                                        className="bg-gray-200 text-gray-600 px-4 py-1.5 rounded-full text-xs font-bold">
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 className="font-black text-gray-800 text-lg mb-1">
                                    {profile.full_name || "Chưa đặt tên"}
                                </h2>
                                {email && (
                                    <p className="text-xs text-gray-400 mb-1">{email}</p>
                                )}
                                <button onClick={() => setIsEditing(true)}
                                    className="text-xs text-green-600 font-bold hover:underline">
                                    Chỉnh sửa
                                </button>
                            </>
                        )}

                        <span className="inline-block mt-3 bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                            {profile.role}
                        </span>

                        <button onClick={handleLogout}
                            className="mt-6 w-full bg-red-50 text-red-500 py-2 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                            <LogOut size={14} /> Đăng xuất
                        </button>
                    </div>
                </div>

                {/* Lịch sử tải */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-6">
                        <h2 className="font-black text-gray-700 text-lg mb-4 flex items-center gap-2">
                            <Download size={18} />
                            Lịch sử tải ({downloads.length})
                        </h2>

                        <div className="space-y-3">
                            {downloads.map((item) => (
                                <div key={item.id}
                                    className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center shrink-0">
                                        <FileText size={18}
                                            className={
                                                item.material?.file_type === "pdf" ? "text-red-500"
                                                    : item.material?.file_type === "docx" ? "text-blue-500"
                                                        : "text-gray-500"
                                            } />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm text-gray-700 truncate">
                                            {item.material?.title || "Tài liệu"}
                                        </p>
                                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                            <Calendar size={10} />
                                            Tải lúc {formatDate(item.downloaded_at, "long")}
                                        </span>
                                    </div>
                                    <span className="bg-white px-2 py-0.5 rounded text-[10px] font-bold text-gray-500 uppercase border">
                                        {item.material?.file_type || "?"}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {downloads.length === 0 && (
                            <div className="text-center py-10">
                                <span className="text-4xl mb-3 block">📥</span>
                                <p className="font-bold text-gray-400">Bạn chưa tải tài liệu nào</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
