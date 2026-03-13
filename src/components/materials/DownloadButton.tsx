"use client";

import { Download } from "lucide-react";
import { recordDownload } from "@/lib/actions";
import { getDriveDownloadUrl } from "@/lib/utils";

// =============================================================================
// DownloadButton — Ưu tiên external_url, fallback Google Drive direct download
// =============================================================================

export function DownloadButton({
    materialId,
    driveId,
    externalUrl,
}: {
    materialId: string;
    driveId: string;
    externalUrl?: string | null;
}) {
    const handleClick = async () => {
        try {
            await recordDownload(materialId);
        } catch {
            // Không block download nếu lỗi ghi lịch sử
        }

        // Ưu tiên: external_url > Google Drive direct download
        if (externalUrl) {
            window.open(externalUrl, "_blank", "noopener,noreferrer");
        } else {
            // Direct download qua Google Drive — không lộ link gốc
            const link = document.createElement("a");
            link.href = getDriveDownloadUrl(driveId);
            link.setAttribute("download", "");
            link.setAttribute("target", "_blank");
            link.rel = "noopener noreferrer";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <button
            onClick={handleClick}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3"
        >
            <Download size={24} />
            TẢI VỀ TÀI LIỆU
        </button>
    );
}
