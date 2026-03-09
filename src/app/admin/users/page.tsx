"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, ArrowLeft, Shield, User } from "lucide-react";
import { getUsers, updateUserRole } from "@/lib/actions";

import type { Profile, UserRole } from "@/types/database";

// =============================================================================
// Admin Users — Xem danh sách & phân quyền
// =============================================================================

export default function AdminUsersPage() {
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try { setUsers(await getUsers()); } catch (err) { console.error(err); }
        setLoading(false);
    };

    useEffect(() => { loadData(); }, []);

    const handleRoleChange = async (userId: string, newRole: UserRole) => {
        if (!confirm(`Đổi quyền thành "${newRole}"?`)) return;
        try {
            await updateUserRole(userId, newRole);
            await loadData();
        } catch (err) { alert("Lỗi: " + (err as Error).message); }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b-4 border-blue-500">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/admin" className="text-gray-500 hover:text-gray-700"><ArrowLeft size={20} /></Link>
                        <h1 className="font-black text-gray-700 flex items-center gap-2"><Users size={20} /> Quản lý Người dùng</h1>
                    </div>
                    <span className="text-sm font-bold text-gray-400">{users.length} người dùng</span>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {loading ? (
                    <div className="text-center py-20"><div className="animate-bounce text-4xl mb-3">👥</div><p className="font-bold text-gray-400">Đang tải...</p></div>
                ) : (
                    <>
                        <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b">
                                        <th className="text-left p-4 text-sm font-bold text-gray-600">Người dùng</th>
                                        <th className="text-left p-4 text-sm font-bold text-gray-600 hidden sm:table-cell">Quyền</th>
                                        <th className="text-right p-4 text-sm font-bold text-gray-600">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u) => (
                                        <tr key={u.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full flex items-center justify-center text-lg font-bold text-orange-700 shrink-0">
                                                        {u.avatar_url ? (
                                                            <img src={u.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                                                        ) : (
                                                            (u.full_name || "?").charAt(0)
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-gray-800">{u.full_name || "Chưa đặt tên"}</p>
                                                        <p className="text-[10px] text-gray-400">{u.id.slice(0, 8)}...</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 hidden sm:table-cell">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${u.role === "admin" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                                                    }`}>
                                                    {u.role === "admin" ? <Shield size={10} /> : <User size={10} />}
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <select
                                                    value={u.role}
                                                    onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                                                    className="border-2 border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold focus:border-blue-400 focus:outline-none"
                                                >
                                                    <option value="user">User</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {users.length === 0 && (
                                <div className="text-center py-16">
                                    <span className="text-4xl mb-3 block">👤</span>
                                    <p className="font-bold text-gray-400">Chưa có người dùng nào</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
