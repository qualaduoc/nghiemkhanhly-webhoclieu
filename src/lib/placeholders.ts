// =============================================================================
// Placeholder thumbnails — Icon đẹp thay ảnh bìa khi không có
// Dùng cho MaterialCard + GameCard trên trang chủ
// =============================================================================

import type { FileType } from "@/types/database";

// Map icon + gradient theo loại file tài liệu
const FILE_TYPE_STYLES: Record<string, { icon: string; from: string; to: string }> = {
    pdf: { icon: "📕", from: "from-red-200", to: "to-red-100" },
    docx: { icon: "📘", from: "from-blue-200", to: "to-blue-100" },
    pptx: { icon: "📙", from: "from-orange-200", to: "to-amber-100" },
    xlsx: { icon: "📗", from: "from-green-200", to: "to-emerald-100" },
    zip: { icon: "📦", from: "from-gray-200", to: "to-slate-100" },
    other: { icon: "📄", from: "from-purple-200", to: "to-indigo-100" },
};

// Map icon + gradient theo từ khóa trong tiêu đề tài liệu
const SUBJECT_KEYWORDS: { match: string[]; icon: string; from: string; to: string }[] = [
    { match: ["toán", "math"], icon: "🧮", from: "from-orange-200", to: "to-yellow-100" },
    { match: ["tiếng việt", "tập đọc", "kể chuyện"], icon: "📖", from: "from-pink-200", to: "to-rose-100" },
    { match: ["tiếng anh", "english"], icon: "🔤", from: "from-blue-200", to: "to-cyan-100" },
    { match: ["khoa học", "tự nhiên"], icon: "🔬", from: "from-emerald-200", to: "to-green-100" },
    { match: ["đạo đức"], icon: "⭐", from: "from-yellow-200", to: "to-amber-100" },
    { match: ["lịch sử", "địa lý"], icon: "🗺️", from: "from-indigo-200", to: "to-blue-100" },
    { match: ["giáo án"], icon: "📋", from: "from-teal-200", to: "to-cyan-100" },
    { match: ["đề thi", "kiểm tra", "đề ôn"], icon: "📝", from: "from-red-200", to: "to-orange-100" },
    { match: ["phiếu"], icon: "📃", from: "from-lime-200", to: "to-green-100" },
];

// Game placeholder icons
const GAME_ICONS = ["🎮", "🎯", "🧩", "🎲", "🏆", "🎪", "🎨", "🎵", "🧠", "🚀"];

export function getMaterialPlaceholder(title: string, fileType?: FileType | string) {
    const titleLower = title.toLowerCase();

    // Ưu tiên match theo tiêu đề
    for (const kw of SUBJECT_KEYWORDS) {
        if (kw.match.some((m) => titleLower.includes(m))) {
            return { icon: kw.icon, from: kw.from, to: kw.to };
        }
    }

    // Fallback theo loại file
    const ft = FILE_TYPE_STYLES[fileType || "other"] || FILE_TYPE_STYLES.other;
    return { icon: ft.icon, from: ft.from, to: ft.to };
}

export function getGamePlaceholder(title: string) {
    // Chọn icon dựa trên hash đơn giản của title → cùng title = cùng icon
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
        hash = ((hash << 5) - hash + title.charCodeAt(i)) | 0;
    }
    const idx = Math.abs(hash) % GAME_ICONS.length;
    return GAME_ICONS[idx];
}
