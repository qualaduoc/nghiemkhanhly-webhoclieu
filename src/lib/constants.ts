// =============================================================================
// Hằng số dùng chung trong dự án
// =============================================================================

import type { GradeLevel } from "@/types/database";

/** Danh sách khối lớp tiểu học */
export const GRADE_LEVELS: { value: GradeLevel; label: string }[] = [
    { value: 1, label: "Lớp 1" },
    { value: 2, label: "Lớp 2" },
    { value: 3, label: "Lớp 3" },
    { value: 4, label: "Lớp 4" },
    { value: 5, label: "Lớp 5" },
];

/** Danh sách môn học tiểu học */
export const SUBJECTS = [
    "Toán",
    "Tiếng Việt",
    "Tiếng Anh",
    "Đạo đức",
    "Tự nhiên và Xã hội",
    "Khoa học",
    "Lịch sử và Địa lý",
] as const;

/** Danh sách loại file hỗ trợ */
export const FILE_TYPES = [
    { value: "pdf", label: "PDF", color: "text-red-600" },
    { value: "docx", label: "Word", color: "text-blue-600" },
    { value: "pptx", label: "PowerPoint", color: "text-orange-600" },
    { value: "xlsx", label: "Excel", color: "text-green-600" },
    { value: "zip", label: "ZIP", color: "text-yellow-600" },
    { value: "other", label: "Khác", color: "text-gray-600" },
] as const;

/** Số lượng items mỗi trang (phân trang) */
export const ITEMS_PER_PAGE = 12;

/** Tên website */
export const SITE_NAME = "Kho Học Liệu Tiểu Học";
export const SITE_DESCRIPTION =
    "Nền tảng chia sẻ tài liệu, giáo án, đề thi cho giáo viên tiểu học từ lớp 1 đến lớp 5.";
