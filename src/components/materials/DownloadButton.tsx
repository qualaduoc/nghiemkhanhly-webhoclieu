"use client";

import { Download } from "lucide-react";
import { recordDownload } from "@/lib/actions";
import { getDriveViewUrl } from "@/lib/utils";

// =============================================================================
// DownloadButton — Ghi lịch sử + mở Google Drive
// =============================================================================

export function DownloadButton({
    materialId,
    driveId,
}: {
    materialId: string;
    driveId: string;
}) {
    const handleClick = async () => {
        try {
            await recordDownload(materialId);
        } catch {
            // Không block download nếu lỗi ghi lịch sử
        }
        window.open(getDriveViewUrl(driveId), "_blank");
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
