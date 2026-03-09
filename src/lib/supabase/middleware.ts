// =============================================================================
// Supabase Middleware Helper
// Refresh token + kiểm tra auth cho các route được bảo vệ
// =============================================================================

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Cập nhật session Supabase (refresh token nếu hết hạn).
 * Kiểm tra quyền truy cập cho các route bảo vệ:
 * - /admin/* → chỉ cho role "admin"
 * - /profile → phải đăng nhập
 */
export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    // Nếu chưa config Supabase (dev mode), skip middleware
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
        return supabaseResponse;
    }

    const supabase = createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    // Gắn cookie vào request (để Server Components đọc được)
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    // Tạo response mới với cookie đã cập nhật
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    // Gắn cookie vào response (để browser lưu lại)
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Lấy thông tin user hiện tại (đồng thời refresh token nếu cần)
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    // =========================================================================
    // Bảo vệ route /profile → phải đăng nhập
    // =========================================================================
    if (pathname.startsWith("/profile") && !user) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("redirect", pathname);
        return NextResponse.redirect(url);
    }

    // =========================================================================
    // Bảo vệ route /admin/* → phải đăng nhập + role admin
    // =========================================================================
    if (pathname.startsWith("/admin")) {
        // Chưa đăng nhập → redirect về login
        if (!user) {
            const url = request.nextUrl.clone();
            url.pathname = "/login";
            url.searchParams.set("redirect", pathname);
            return NextResponse.redirect(url);
        }

        // Kiểm tra role admin trong bảng profiles
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        // Không phải admin → redirect về trang chủ
        if (!profile || profile.role !== "admin") {
            const url = request.nextUrl.clone();
            url.pathname = "/";
            return NextResponse.redirect(url);
        }
    }

    return supabaseResponse;
}
