"use client";

// =============================================================================
// Error Boundary toàn cục
// Hiển thị khi có lỗi runtime
// =============================================================================

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-page-bg">
            <div className="text-center max-w-md">
                <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">😢</span>
                </div>
                <h2 className="font-black text-2xl text-gray-700 mb-2">
                    Ối, có lỗi xảy ra rồi!
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                    Đừng lo, Gấu Thông Thái sẽ giúp bạn khắc phục ngay.
                </p>
                <button
                    onClick={reset}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-all active:scale-95"
                >
                    Thử lại
                </button>
            </div>
        </div>
    );
}
