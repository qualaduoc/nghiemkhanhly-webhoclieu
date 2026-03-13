import Link from "next/link";
import { Home, BookOpen, Palette, Calendar, Trophy } from "lucide-react";
import type { SiteSettings } from "@/types/database";

// =============================================================================
// LeftSidebar - Thanh bên trái
// Gồm: Avatar mascot (từ props settings) + Menu navigation colorful
//       + Góc cập nhật tin mới
// =============================================================================

const MENU_ITEMS = [
    {
        href: "/",
        label: "Trang chủ",
        emoji: "🏠",
        icon: Home,
        bg: "bg-teal-500",
        border: "border-teal-700",
    },
    {
        href: "/materials",
        label: "Tài liệu",
        emoji: "📚",
        icon: BookOpen,
        bg: "bg-orange-400",
        border: "border-orange-600",
    },
    {
        href: "/news",
        label: "Trò chơi",
        emoji: "🎮",
        icon: Palette,
        bg: "bg-purple-400",
        border: "border-purple-600",
    },
    {
        href: "/news",
        label: "Sự kiện",
        emoji: "📅",
        icon: Calendar,
        bg: "bg-blue-400",
        border: "border-blue-600",
    },
    {
        href: "/materials?sort=most_downloaded",
        label: "Tải nhiều nhất",
        emoji: "🏆",
        icon: Trophy,
        bg: "bg-yellow-600",
        border: "border-yellow-800",
    },
];

export function LeftSidebar({ settings }: { settings?: SiteSettings | null }) {
    const avatarUrl = settings?.hero_avatar_url || "";
    const avatarName = settings?.hero_avatar_name || "Gấu Thông Thái";

    return (
        <aside className="w-64 dotted-bg bg-sidebar-bg p-4 flex flex-col items-center space-y-6 shrink-0 hidden lg:flex">
            {/* Avatar Mascot — đọc từ settings */}
            <div className="text-center">
                <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-inner overflow-hidden mb-2 mx-auto">
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt={avatarName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-yellow-200 to-orange-300 flex items-center justify-center text-5xl">
                            🐻
                        </div>
                    )}
                </div>
                <div className="bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm inline-block">
                    {avatarName}
                </div>
            </div>

            {/* Menu Navigation */}
            <nav className="w-full space-y-3">
                {MENU_ITEMS.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`block ${item.bg} text-white p-3 rounded-xl shadow-md border-b-4 ${item.border} flex items-center space-x-3 hover:translate-x-1 transition-all`}
                    >
                        <span className="text-xl">{item.emoji}</span>
                        <span className="font-bold">{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* Góc Cập Nhật */}
            <div className="bg-blue-100 p-4 rounded-xl border-2 border-blue-200 w-full mt-10">
                <p className="text-xs font-bold text-blue-800 text-center">
                    GÓC CẬP NHẬT
                </p>
                <div className="mt-2 text-[10px] space-y-2">
                    <div className="bg-white p-1.5 rounded text-gray-700">
                        🌟 Bài giảng mới lớp 3
                    </div>
                    <div className="bg-white p-1.5 rounded text-gray-700">
                        🎁 Tài liệu ôn tập học kỳ
                    </div>
                    <div className="bg-white p-1.5 rounded text-gray-700">
                        📝 Đề thi thử mới nhất
                    </div>
                </div>
            </div>
        </aside>
    );
}
