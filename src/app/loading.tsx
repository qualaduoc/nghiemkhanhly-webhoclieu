// =============================================================================
// Loading State toàn cục
// Hiển thị khi chuyển trang
// =============================================================================

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-page-bg">
            <div className="text-center">
                <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <span className="text-4xl">🐻</span>
                </div>
                <p className="font-bold text-gray-500 text-lg">Đang tải...</p>
                <p className="text-sm text-gray-400 mt-1">
                    Gấu Thông Thái đang chuẩn bị bài học cho bạn!
                </p>
            </div>
        </div>
    );
}
