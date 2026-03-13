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
 * Tự động bóc Google Drive/Docs file ID từ bất kỳ dạng link nào.
 * Hỗ trợ:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=drive_link
 * - https://docs.google.com/presentation/d/FILE_ID/edit
 * - https://docs.google.com/document/d/FILE_ID/edit
 * - https://docs.google.com/spreadsheets/d/FILE_ID/edit
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID&export=download
 * - Hoặc chỉ là FILE_ID thuần
 */
export function extractDriveId(input: string): string {
    if (!input) return "";
    const trimmed = input.trim();

    // Pattern 1: /d/FILE_ID/ — tổng quát cho tất cả link Google (Drive, Docs, Slides, Sheets)
    const dMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (dMatch) return dMatch[1];

    // Pattern 2: ?id=FILE_ID hoặc &id=FILE_ID
    const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch) return idMatch[1];

    // Pattern 3: /folders/FOLDER_ID (cho folder links)
    const folderMatch = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    if (folderMatch) return folderMatch[1];

    // Nếu không match pattern nào → coi như đã là ID thuần
    return trimmed;
}

/**
 * Tạo URL Google Drive để tải file trực tiếp (direct download).
 * Không lộ link Drive gốc.
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
