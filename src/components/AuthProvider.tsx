"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        // Lắng nghe mọi sự thay đổi về trạng thái đăng nhập/đăng xuất
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event) => {
            // Khi vừa đăng nhập thành công hoặc đăng xuất, ép Next.js refresh lại UI
            if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
                router.refresh();
            }
        });

        // Dọn dẹp listener khi component unmount để tránh rò rỉ bộ nhớ
        return () => {
            subscription.unsubscribe();
        };
    }, [router, supabase]);

    return <>{children}</>;
}
