import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

// Font Nunito — phong cách dễ đọc, thân thiện trẻ em
const nunito = Nunito({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-kids",
  display: "swap",
});

// SEO Metadata cho toàn website
export const metadata: Metadata = {
  title: {
    default: "Học Tập Vui Vẻ - Kho Học Liệu Tiểu Học",
    template: "%s | Học Tập Vui Vẻ",
  },
  description:
    "Nền tảng chia sẻ tài liệu, giáo án, đề thi cho giáo viên và học sinh tiểu học từ lớp 1 đến lớp 5. Miễn phí, dễ tải, đa dạng môn học.",
  keywords: [
    "học liệu tiểu học",
    "tài liệu giáo viên",
    "giáo án lớp 1",
    "đề thi tiểu học",
    "toán lớp 3",
    "tiếng việt lớp 2",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${nunito.variable} min-h-screen antialiased`} style={{ fontFamily: "var(--font-kids), 'Nunito', sans-serif" }}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
