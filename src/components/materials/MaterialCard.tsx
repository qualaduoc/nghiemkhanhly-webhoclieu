import Link from "next/link";
import { Download, Star } from "lucide-react";
import type { Material } from "@/types/database";
import { formatDownloadCount } from "@/lib/utils";

// =============================================================================
// MaterialCard - Card hiển thị tài liệu đơn lẻ
// Dùng trong trang chủ (Mới nhất, Tải nhiều nhất) và trang danh sách
// =============================================================================

interface MaterialCardProps {
    material: Material;
    averageRating?: number;
}

export function MaterialCard({ material, averageRating }: MaterialCardProps) {
    return (
        <Link
            href={`/materials/${material.id}`}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border-2 border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all group"
        >
            {/* Ảnh bìa */}
            <div className="relative h-40 bg-gradient-to-br from-orange-100 to-pink-100 overflow-hidden">
                {material.cover_image ? (
                    <img
                        src={material.cover_image}
                        alt={material.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">
                        📄
                    </div>
                )}
                {/* Badge loại file */}
                <span className="absolute top-2 right-2 bg-white/90 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase text-gray-600">
                    {material.file_type}
                </span>
            </div>

            {/* Nội dung */}
            <div className="p-4">
                <h3 className="font-bold text-gray-800 line-clamp-2 text-sm mb-2 group-hover:text-orange-600 transition-colors">
                    {material.title}
                </h3>

                {material.summary && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                        {material.summary}
                    </p>
                )}

                {/* Footer card: rating + download count */}
                <div className="flex items-center justify-between text-xs text-gray-400">
                    {/* Rating trung bình */}
                    <div className="flex items-center gap-1">
                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                        <span className="font-bold">
                            {averageRating ? averageRating.toFixed(1) : "—"}
                        </span>
                    </div>

                    {/* Lượt tải */}
                    <div className="flex items-center gap-1">
                        <Download size={12} />
                        <span>{formatDownloadCount(material.download_count)}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
