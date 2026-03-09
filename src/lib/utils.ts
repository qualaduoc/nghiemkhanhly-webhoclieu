// =============================================================================
// Utility Functions
// Các hàm tiện ích dùng chung trong dự án
// =============================================================================

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Gộp class CSS với Tailwind Merge (tránh conflict class).
 * Dùng kết hợp với Shadcn/UI components.
 *
 * Ví dụ: cn("px-4 py-2", isActive && "bg-blue-500", className)
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format ngày tháng sang tiếng Việt.
 * Ví dụ: "09/03/2026" hoặc "09 tháng 03, 2026"
 */
export function formatDate(dateString: string, style: "short" | "long" = "short"): string {
    const date = new Date(dateString);

    if (style === "long") {
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    }

    return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

/**
 * Format số lượt tải với đơn vị K, M.
 * Ví dụ: 1500 → "1.5K", 1000000 → "1M"
 */
export function formatDownloadCount(count: number): string {
    if (count >= 1_000_000) {
        return `${(count / 1_000_000).toFixed(1)}M`;
    }
    if (count >= 1_000) {
        return `${(count / 1_000).toFixed(1)}K`;
    }
    return count.toString();
}

/**
 * Tạo URL Google Drive để tải/xem file từ drive_id.
 */
export function getDriveDownloadUrl(driveId: string): string {
    return `https://drive.google.com/uc?export=download&id=${driveId}`;
}

export function getDriveViewUrl(driveId: string): string {
    return `https://drive.google.com/file/d/${driveId}/view`;
}

/**
 * Cắt ngắn text với "..." nếu quá dài.
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trimEnd() + "...";
}
