// =============================================================================
// Supabase Browser Client (Singleton)
// Dùng trong Client Components (component có "use client")
// Singleton đảm bảo 1 instance duy nhất → giữ session đồng bộ
// =============================================================================

import { createBrowserClient } from "@supabase/ssr";

/**
 * Tạo Supabase client cho phía browser (Client Components).
 * createBrowserClient đã tự động quản lý singleton nội bộ trên trình duyệt.
 */
export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}
