import Link from "next/link";
import type { Category } from "@/types/database";

// =============================================================================
// SubjectCard - Card môn học theo phong cách reference
// Mỗi card có icon + tên môn + mô tả ngắn, border màu riêng
// =============================================================================

// Map màu sắc theo tên môn học
const SUBJECT_STYLES: Record<
    string,
    { emoji: string; bgIcon: string; borderColor: string; textColor: string }
> = {
    Toán: {
        emoji: "➕",
        bgIcon: "bg-card-orange",
        borderColor: "border-orange-200",
        textColor: "text-orange-600",
    },
    "Tiếng Việt": {
        emoji: "📖",
        bgIcon: "bg-card-pink",
        borderColor: "border-pink-200",
        textColor: "text-pink-600",
    },
    "Tự nhiên và Xã hội": {
        emoji: "🌿",
        bgIcon: "bg-card-green",
        borderColor: "border-green-200",
        textColor: "text-green-600",
    },
    "Tiếng Anh": {
        emoji: "🔤",
        bgIcon: "bg-card-blue",
        borderColor: "border-blue-200",
        textColor: "text-blue-600",
    },
    "Đạo đức": {
        emoji: "⭐",
        bgIcon: "bg-yellow-200",
        borderColor: "border-yellow-200",
        textColor: "text-yellow-600",
    },
    "Khoa học": {
        emoji: "🔬",
        bgIcon: "bg-emerald-200",
        borderColor: "border-emerald-200",
        textColor: "text-emerald-600",
    },
    "Lịch sử và Địa lý": {
        emoji: "🗺️",
        bgIcon: "bg-indigo-200",
        borderColor: "border-indigo-200",
        textColor: "text-indigo-600",
    },
};

// Mô tả mặc định theo môn học
const SUBJECT_DESCRIPTIONS: Record<string, string> = {
    Toán: "Phép nhân, phép chia và các hình khối cơ bản trong cuộc sống.",
    "Tiếng Việt":
        "Tập đọc, kể chuyện và những bài thơ hay về gia đình.",
    "Tự nhiên và Xã hội":
        "Tìm hiểu về thế giới động vật và môi trường xung quanh.",
    "Tiếng Anh":
        "Từ vựng về màu sắc, đồ vật và giao tiếp căn bản.",
    "Đạo đức": "Bài học về lễ phép, yêu thương và trách nhiệm.",
    "Khoa học": "Khám phá thế giới tự nhiên qua thí nghiệm vui.",
    "Lịch sử và Địa lý": "Tìm hiểu lịch sử và các vùng miền Việt Nam.",
};

interface SubjectCardProps {
    category: Category;
    materialCount?: number;
}

export function SubjectCard({ category, materialCount }: SubjectCardProps) {
    const style = SUBJECT_STYLES[category.name] || {
        emoji: "📚",
        bgIcon: "bg-gray-200",
        borderColor: "border-gray-200",
        textColor: "text-gray-600",
    };

    const description =
        SUBJECT_DESCRIPTIONS[category.name] || `Tài liệu ${category.name} lớp ${category.grade}`;

    return (
        <Link
            href={`/materials?category_id=${category.id}`}
            className={`bg-white border-2 ${style.borderColor} rounded-2xl p-6 shadow-sm flex space-x-4 hover:shadow-md transition-all cursor-pointer group`}
        >
            {/* Icon môn học */}
            <div
                className={`w-16 h-16 ${style.bgIcon} rounded-xl flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform`}
            >
                {style.emoji}
            </div>

            {/* Nội dung */}
            <div className="min-w-0">
                <h3 className={`font-black ${style.textColor} text-lg`}>
                    {category.name}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                    {description}
                </p>
                {materialCount !== undefined && (
                    <span className="text-xs text-gray-400 mt-1 inline-block">
                        {materialCount} tài liệu
                    </span>
                )}
            </div>
        </Link>
    );
}
