"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Home, Gamepad2, Phone, LogIn, Menu, X, User, LogOut, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

// =============================================================================
// MainHeader — Auth-aware + Responsive Hamburger Menu
// Hiển thị avatar/tên user khi đã đăng nhập, nút đăng xuất
// =============================================================================

const NAV_LINKS = [
    { href: "/", label: "Trang chủ", icon: Home },
    { href: "/materials", label: "Tài liệu", icon: BookOpen },
    { href: "/news", label: "Trò chơi", icon: Gamepad2 },
    { href: "/contact", label: "Liên hệ", icon: Phone },
];

export function MainHeader() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const supabase = createClient();

        // Lấy session hiện tại
        supabase.auth.getUser().then((res: { data: { user: { id: string; email?: string | null } | null } }) => {
            const u = res.data.user;
            if (u) {
                setUser({ id: u.id, email: u.email || undefined });
                // Fetch profile
                supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", u.id)
                    .single()
                    .then((res: { data: unknown }) => {
                        if (res.data) setProfile(res.data as Profile);
                    });
            }
        });

        // Lắng nghe auth state change
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event: string, session: { user: { id: string; email?: string | null } } | null) => {
                if (session?.user) {
                    setUser({ id: session.user.id, email: session.user.email || undefined });
                    const { data } = await supabase
                        .from("profiles")
                        .select("*")
                        .eq("id", session.user.id)
                        .single();
                    if (data) setProfile(data as Profile);
                } else {
                    setUser(null);
                    setProfile(null);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setDropdownOpen(false);
        window.location.href = "/";
    };

    const displayName = profile?.full_name || user?.email?.split("@")[0] || "User";
    const avatarUrl = profile?.avatar_url;
    const isAdmin = profile?.role === "admin";

    return (
        <header className="bg-white shadow-sm border-b-4 border-yellow-400 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo + Desktop Nav */}
                <div className="flex items-center space-x-4">
                    <Link
                        href="/"
                        className="bg-red-500 text-white p-2 rounded-lg font-black text-lg sm:text-xl transform -rotate-2 border-2 border-black hover:scale-105 transition-transform shrink-0"
                    >
                        HỌC TẬP VUI VẺ
                    </Link>
                    <nav className="hidden md:flex space-x-6 font-bold text-gray-600">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="hover:text-yellow-500 transition-colors flex items-center gap-1"
                            >
                                <link.icon size={16} />
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Right side — Auth state */}
                <div className="flex items-center space-x-3">
                    {user ? (
                        /* Đã đăng nhập */
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 rounded-full pl-1 pr-4 py-1 transition-all"
                            >
                                {/* Avatar */}
                                <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-orange-200 to-pink-200 flex items-center justify-center text-sm font-bold text-orange-700 shrink-0">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    ) : (
                                        displayName.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <span className="font-bold text-sm text-gray-700 hidden sm:block max-w-[120px] truncate">
                                    {displayName}
                                </span>
                            </button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {dropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 top-12 bg-white rounded-xl shadow-xl border-2 border-gray-100 py-2 w-52 z-50"
                                    >
                                        {/* Tên + email */}
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="font-bold text-sm text-gray-800 truncate">{displayName}</p>
                                            {user.email && (
                                                <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                                            )}
                                            {isAdmin && (
                                                <span className="inline-flex items-center gap-1 bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-[9px] font-bold mt-1">
                                                    <Shield size={8} /> Admin
                                                </span>
                                            )}
                                        </div>

                                        <Link
                                            href="/profile"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <User size={14} /> Trang cá nhân
                                        </Link>

                                        {isAdmin && (
                                            <Link
                                                href="/admin"
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <Shield size={14} /> Admin Dashboard
                                            </Link>
                                        )}

                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors w-full text-left"
                                        >
                                            <LogOut size={14} /> Đăng xuất
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        /* Chưa đăng nhập */
                        <>
                            <span className="text-sm font-bold text-gray-500 hidden sm:block">
                                Chào mừng bạn nhỏ!
                            </span>
                            <Link
                                href="/login"
                                className="bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 rounded-full font-bold shadow-lg transition-all active:scale-95 flex items-center gap-2 text-sm sm:text-base"
                            >
                                <LogIn size={16} />
                                <span className="hidden sm:inline">Đăng nhập</span>
                            </Link>
                        </>
                    )}

                    {/* Hamburger button (mobile) */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Menu"
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.nav
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
                    >
                        <div className="px-4 py-4 space-y-2">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-yellow-50 font-bold text-gray-700 transition-colors"
                                >
                                    <link.icon size={20} className="text-orange-500" />
                                    {link.label}
                                </Link>
                            ))}
                            {user && (
                                <>
                                    <hr className="border-gray-100" />
                                    <Link href="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-yellow-50 font-bold text-gray-700">
                                        <User size={20} className="text-green-500" /> Trang cá nhân
                                    </Link>
                                    {isAdmin && (
                                        <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-yellow-50 font-bold text-gray-700">
                                            <Shield size={20} className="text-red-500" /> Admin
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </header>
    );
}
