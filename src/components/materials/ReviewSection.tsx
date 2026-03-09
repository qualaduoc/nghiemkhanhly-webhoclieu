"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { getReviewsByMaterial, createReview } from "@/lib/actions";
import { formatDate } from "@/lib/utils";
import { FadeUp } from "@/components/ui/Animations";

// =============================================================================
// ReviewSection — Đánh giá sao + bình luận (Client Component)
// =============================================================================

interface ReviewData {
    id: string;
    rating: number;
    comment: string | null;
    created_at: string;
    profile: { full_name: string | null; avatar_url: string | null };
}

export function ReviewSection({ materialId }: { materialId: string }) {
    const [reviews, setReviews] = useState<ReviewData[]>([]);
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [sending, setSending] = useState(false);

    useEffect(() => {
        getReviewsByMaterial(materialId)
            .then((data) => setReviews(data as ReviewData[]))
            .catch(() => { });
    }, [materialId]);

    const handleSubmit = async () => {
        if (!userRating) { alert("Vui lòng chọn số sao!"); return; }
        setSending(true);
        try {
            await createReview(materialId, userRating, comment);
            setUserRating(0);
            setComment("");
            const data = await getReviewsByMaterial(materialId);
            setReviews(data as ReviewData[]);
        } catch (err) {
            alert((err as Error).message);
        }
        setSending(false);
    };

    return (
        <FadeUp className="mt-10">
            <h2 className="text-xl font-black text-gray-700 mb-6 flex items-center gap-2">
                <Star size={20} className="text-yellow-500" /> Đánh giá ({reviews.length})
            </h2>

            {/* Form */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 mb-6">
                <p className="font-bold text-gray-700 mb-3">Để lại đánh giá:</p>
                <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setUserRating(star)}
                            className="transition-transform hover:scale-125"
                        >
                            <Star
                                size={28}
                                className={`${star <= (hoverRating || userRating)
                                        ? "text-yellow-500 fill-yellow-500"
                                        : "text-gray-300"
                                    } transition-colors`}
                            />
                        </button>
                    ))}
                </div>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Viết nhận xét (không bắt buộc)..."
                    rows={3}
                    className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:border-green-400 focus:outline-none resize-none transition-all"
                />
                <button
                    onClick={handleSubmit}
                    disabled={sending}
                    className="mt-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-full font-bold text-sm transition-all"
                >
                    {sending ? "Đang gửi..." : "Gửi đánh giá"}
                </button>
            </div>

            {/* List */}
            <div className="space-y-4">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full flex items-center justify-center text-sm font-bold text-orange-700">
                                {(review.profile?.full_name || "?").charAt(0)}
                            </div>
                            <div>
                                <span className="font-bold text-sm text-gray-700">{review.profile?.full_name || "Ẩn danh"}</span>
                                <span className="text-xs text-gray-400 ml-2">{formatDate(review.created_at)}</span>
                            </div>
                        </div>
                        <div className="flex gap-0.5 mb-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} size={14} className={s <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} />
                            ))}
                        </div>
                        {review.comment && <p className="text-sm text-gray-600">{review.comment}</p>}
                    </div>
                ))}
            </div>
        </FadeUp>
    );
}
