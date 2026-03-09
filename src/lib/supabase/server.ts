// =============================================================================
// Supabase Server Client
// Dùng trong Server Components, Server Actions, Route Handlers
// =============================================================================

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Tạo Supabase client cho phía server.
 * Tự động gắn cookie để xác thực người dùng.
 *
 * Ví dụ (trong Server Component):
 * ```tsx
 * const supabase = await createClient();
 * const { data } = await supabase.from("materials").select("*");
 * ```
 */
export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // Server Component không thể set cookie.
                        // Middleware sẽ xử lý refresh token.
                    }
                },
            },
        }
    );
}
