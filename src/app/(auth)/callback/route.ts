// =============================================================================
// Auth Callback Route
// Xử lý redirect sau khi đăng nhập Google thành công
// =============================================================================

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/";

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            const response = NextResponse.redirect(`${origin}${next}`);
            // Force Next.js redirect to respect the Supabase cookies
            return response;
        } else {
            console.error("Auth callback error:", error);
        }
    }

    // Nếu có lỗi, redirect về trang chủ
    return NextResponse.redirect(`${origin}/?error=auth_callback_error`);
}
