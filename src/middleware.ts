// =============================================================================
// Next.js Middleware
// Chạy trước MỌI request, xử lý auth session & bảo vệ route
// =============================================================================

import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
    return await updateSession(request);
}

// Cấu hình các route cần chạy middleware
// Bỏ qua static files, images, favicon
export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
