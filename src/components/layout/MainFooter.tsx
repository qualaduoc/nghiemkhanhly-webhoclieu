import Link from "next/link";
import { Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";
import type { SiteSettings } from "@/types/database";

// =============================================================================
// MainFooter - Chân trang (nhận settings qua props)
// Gồm: Logo + Copyright + Liên kết + Social icons + Liên hệ + Slogan
// =============================================================================

export function MainFooter({ settings }: { settings?: SiteSettings | null }) {
    const s = settings;

    return (
        <footer className="bg-teal-600 text-white mt-12 py-8">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
                {/* Logo + Copyright */}
                <div className="mb-4 md:mb-0">
                    <div className="font-black text-xl mb-2">
                        {s?.site_name || "HỌC TẬP VUI VẺ"}
                    </div>
                    <p className="text-xs opacity-80">
                        {s?.footer_copyright ||
                            "© 2024 Bản quyền thuộc về Nhóm Phát Triển Giáo Dục Tiểu Học"}
                    </p>
                    {s && (s.contact_email || s.contact_phone) && (
                        <div className="mt-2 space-y-1">
                            {s.contact_email && (
                                <p className="text-[10px] opacity-70 flex items-center gap-1">
                                    <Mail size={10} /> {s.contact_email}
                                </p>
                            )}
                            {s.contact_phone && (
                                <p className="text-[10px] opacity-70 flex items-center gap-1">
                                    <Phone size={10} /> {s.contact_phone}
                                </p>
                            )}
                            {s.contact_address && (
                                <p className="text-[10px] opacity-70 flex items-center gap-1">
                                    <MapPin size={10} /> {s.contact_address}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Liên kết */}
                <div className="flex space-x-8 text-sm font-bold">
                    <Link href="/about" className="hover:underline">Về chúng tôi</Link>
                    <Link href="/privacy" className="hover:underline">Chính sách bảo mật</Link>
                    <Link href="/terms" className="hover:underline">Điều khoản sử dụng</Link>
                </div>

                {/* Social Icons */}
                <div className="mt-4 md:mt-0 flex space-x-4">
                    {s?.facebook_url ? (
                        <a href={s.facebook_url} target="_blank" rel="noopener noreferrer"
                            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/40 transition-colors"
                            aria-label="Facebook">
                            <Facebook size={14} />
                        </a>
                    ) : (
                        <a href="#" className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/40 transition-colors" aria-label="Facebook">
                            <Facebook size={14} />
                        </a>
                    )}
                    {s?.youtube_url ? (
                        <a href={s.youtube_url} target="_blank" rel="noopener noreferrer"
                            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/40 transition-colors"
                            aria-label="Youtube">
                            <Youtube size={14} />
                        </a>
                    ) : (
                        <a href="#" className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/40 transition-colors" aria-label="Youtube">
                            <Youtube size={14} />
                        </a>
                    )}
                    {s?.zalo_url && (
                        <a href={s.zalo_url} target="_blank" rel="noopener noreferrer"
                            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/40 transition-colors"
                            aria-label="Zalo">
                            <span className="text-xs font-black">Z</span>
                        </a>
                    )}
                </div>
            </div>

            {/* Slogan */}
            <div className="text-center mt-6 text-[10px] opacity-50 uppercase tracking-widest">
                {s?.footer_slogan || "Sáng tạo - Kết nối - Thành công"}
            </div>
        </footer>
    );
}
