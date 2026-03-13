import { MainHeader, MainFooter, LeftSidebar, RightSidebar } from "@/components/layout";
import { NotebookContent } from "@/components/materials/NotebookContent";
import { PageTransition } from "@/components/ui/Animations";
import type { Category, Material, GradeLevel } from "@/types/database";
import { createClient } from "@/lib/supabase/server";
import { getSiteSettings, getApprovedFeedbacks } from "@/lib/actions";

// =============================================================================
// Trang chủ — Server Component (fetch Supabase thực)
// Fallback mock data nếu chưa config hoặc DB chưa có dữ liệu
// =============================================================================

// Mock data fallback (khi DB trống hoặc chưa kết nối)
const FALLBACK_CATEGORIES: Category[] = [
  { id: "1", name: "Toán", grade: 1 as GradeLevel, created_at: new Date().toISOString() },
  { id: "2", name: "Tiếng Việt", grade: 1 as GradeLevel, created_at: new Date().toISOString() },
  { id: "3", name: "Tiếng Anh", grade: 1 as GradeLevel, created_at: new Date().toISOString() },
  { id: "4", name: "Đạo đức", grade: 1 as GradeLevel, created_at: new Date().toISOString() },
  { id: "5", name: "Tự nhiên và Xã hội", grade: 1 as GradeLevel, created_at: new Date().toISOString() },
  { id: "6", name: "Toán", grade: 2 as GradeLevel, created_at: new Date().toISOString() },
  { id: "7", name: "Tiếng Việt", grade: 2 as GradeLevel, created_at: new Date().toISOString() },
  { id: "8", name: "Tiếng Anh", grade: 2 as GradeLevel, created_at: new Date().toISOString() },
  { id: "9", name: "Toán", grade: 3 as GradeLevel, created_at: new Date().toISOString() },
  { id: "10", name: "Tiếng Việt", grade: 3 as GradeLevel, created_at: new Date().toISOString() },
  { id: "11", name: "Tiếng Anh", grade: 3 as GradeLevel, created_at: new Date().toISOString() },
  { id: "12", name: "Toán", grade: 4 as GradeLevel, created_at: new Date().toISOString() },
  { id: "13", name: "Tiếng Việt", grade: 4 as GradeLevel, created_at: new Date().toISOString() },
  { id: "14", name: "Khoa học", grade: 4 as GradeLevel, created_at: new Date().toISOString() },
  { id: "15", name: "Toán", grade: 5 as GradeLevel, created_at: new Date().toISOString() },
  { id: "16", name: "Tiếng Việt", grade: 5 as GradeLevel, created_at: new Date().toISOString() },
  { id: "17", name: "Khoa học", grade: 5 as GradeLevel, created_at: new Date().toISOString() },
];

async function fetchData() {
  try {
    const supabase = await createClient();

    const [catRes, latestRes, popularRes] = await Promise.all([
      supabase.from("categories").select("*").order("grade").order("name"),
      supabase.from("materials").select("*").order("created_at", { ascending: false }).limit(6),
      supabase.from("materials").select("*").order("download_count", { ascending: false }).limit(6),
    ]);

    return {
      categories: (catRes.data?.length ? catRes.data : FALLBACK_CATEGORIES) as Category[],
      latestMaterials: (latestRes.data || []) as Material[],
      popularMaterials: (popularRes.data || []) as Material[],
    };
  } catch {
    return {
      categories: FALLBACK_CATEGORIES,
      latestMaterials: [] as Material[],
      popularMaterials: [] as Material[],
    };
  }
}

export default async function HomePage() {
  const [{ categories, latestMaterials, popularMaterials }, settings, feedbacks] = await Promise.all([
    fetchData(),
    getSiteSettings(),
    getApprovedFeedbacks().catch(() => []),
  ]);

  return (
    <>
      <MainHeader />
      <PageTransition>
        <main className="flex flex-col lg:flex-row max-w-7xl mx-auto mt-4 min-h-[800px]">
          <LeftSidebar settings={settings} />
          <NotebookContent
            categories={categories}
            latestMaterials={latestMaterials}
            popularMaterials={popularMaterials}
            feedbacks={feedbacks}
          />
          <RightSidebar />
        </main>
      </PageTransition>
      <MainFooter settings={settings} />
    </>
  );
}
