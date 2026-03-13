// =============================================================================
// TypeScript Interfaces cho toàn bộ Database
// Dự án: Website Chia sẻ Học liệu - nghiemkhanhly
// =============================================================================

/** Vai trò người dùng trong hệ thống */
export type UserRole = "admin" | "user";

/** Loại file tài liệu trên Google Drive */
export type FileType = "pdf" | "docx" | "pptx" | "xlsx" | "zip" | "other";

/** Khối lớp tiểu học (1-5) */
export type GradeLevel = 1 | 2 | 3 | 4 | 5;

/** Đánh giá sao (1-5) */
export type Rating = 1 | 2 | 3 | 4 | 5;

// =============================================================================
// Bảng profiles - Thông tin người dùng
// Tự động tạo khi user đăng ký qua trigger on_auth_user_created
// =============================================================================
export interface Profile {
  id: string; // UUID, khớp với auth.users.id
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  updated_at: string; // ISO timestamp
}

// =============================================================================
// Bảng categories - Danh mục học liệu (Môn học + Khối lớp)
// Ví dụ: Toán Lớp 1, Tiếng Việt Lớp 3...
// =============================================================================
export interface Category {
  id: string; // UUID
  name: string; // Tên môn học: Toán, Tiếng Việt, Tiếng Anh...
  grade: GradeLevel; // Khối lớp: 1, 2, 3, 4, 5
  created_at: string;
}

// =============================================================================
// Bảng materials - Tài liệu / Học liệu
// Mỗi tài liệu liên kết với 1 danh mục (category)
// File lưu trên Google Drive, chỉ lưu drive_id
// =============================================================================
export interface Material {
  id: string; // UUID
  title: string; // Tên tài liệu
  summary: string | null; // Tóm tắt ngắn
  description: string | null; // Mô tả chi tiết (rich text HTML)
  cover_image: string | null; // URL ảnh bìa
  drive_id: string; // ID file trên Google Drive
  external_url: string | null; // Link tải khác (không qua Drive)
  file_type: FileType; // Loại file: pdf, docx...
  download_count: number; // Số lượt tải
  category_id: string; // FK -> categories.id
  created_at: string;
}

// =============================================================================
// Bảng materials kèm thông tin category (JOIN)
// Dùng khi hiển thị danh sách tài liệu
// =============================================================================
export interface MaterialWithCategory extends Material {
  category: Category;
}

// =============================================================================
// Bảng reviews - Đánh giá tài liệu (1-5 sao + bình luận)
// Mỗi user chỉ đánh giá 1 lần cho mỗi tài liệu
// =============================================================================
export interface Review {
  id: string; // UUID
  material_id: string; // FK -> materials.id
  user_id: string; // FK -> profiles.id (auth.users.id)
  rating: Rating; // 1-5 sao
  comment: string | null; // Bình luận
  created_at: string;
}

// =============================================================================
// Bảng reviews kèm thông tin profile (JOIN)
// Dùng khi hiển thị danh sách đánh giá
// =============================================================================
export interface ReviewWithProfile extends Review {
  profile: Pick<Profile, "full_name" | "avatar_url">;
}

// =============================================================================
// Bảng news - Trò chơi vui học (game link)
// =============================================================================
export interface News {
  id: string; // UUID
  title: string;
  content: string; // Mô tả HTML
  thumbnail: string | null; // URL ảnh thumbnail
  game_url: string | null; // Link chơi game
  created_at: string;
}

// =============================================================================
// Bảng download_history - Lịch sử tải tài liệu
// Dùng để tracking và hiển thị trong trang cá nhân
// =============================================================================
export interface DownloadHistory {
  id: string; // UUID
  user_id: string; // FK -> profiles.id
  material_id: string; // FK -> materials.id
  downloaded_at: string;
}

// =============================================================================
// Bảng download_history kèm thông tin material (JOIN)
// Dùng trong trang cá nhân
// =============================================================================
export interface DownloadHistoryWithMaterial extends DownloadHistory {
  material: Pick<Material, "title" | "cover_image" | "file_type">;
}

// =============================================================================
// Types phụ trợ cho API & Components
// =============================================================================

/** Params tìm kiếm / lọc tài liệu */
export interface MaterialSearchParams {
  query?: string; // Từ khóa tìm kiếm
  grade?: GradeLevel; // Lọc theo lớp
  category_id?: string; // Lọc theo danh mục
  sort_by?: "newest" | "most_downloaded"; // Sắp xếp
  page?: number; // Phân trang
  per_page?: number;
}

/** Thống kê tổng quan cho Admin Dashboard */
export interface DashboardStats {
  total_materials: number;
  total_users: number;
  total_downloads: number;
  total_reviews: number;
}

/** Dữ liệu biểu đồ lượt tải theo ngày */
export interface DownloadChartData {
  date: string; // YYYY-MM-DD
  count: number;
}

/** Form data khi tạo/sửa tài liệu (Admin) */
export interface MaterialFormData {
  title: string;
  summary: string;
  description: string;
  cover_image: string;
  drive_id: string;
  external_url: string;
  file_type: FileType;
  category_id: string;
}

/** Form data khi tạo/sửa danh mục (Admin) */
export interface CategoryFormData {
  name: string;
  grade: GradeLevel;
}

/** Form data khi tạo/sửa trò chơi (Admin) */
export interface NewsFormData {
  title: string;
  content: string;
  thumbnail: string;
  game_url: string;
}

/** Cấu hình website (Admin Settings) */
export interface SiteSettings {
  id: string;
  site_name: string;
  site_description: string;
  meta_keywords: string;
  meta_author: string;
  hero_avatar_url: string;
  hero_avatar_name: string;
  footer_copyright: string;
  footer_slogan: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  facebook_url: string;
  youtube_url: string;
  zalo_url: string;
  og_image: string;
  updated_at: string;
}

/** Vai trò người gửi ý kiến */
export type FeedbackRole = "phu_huynh" | "hoc_sinh" | "giao_vien" | "khac";

/** Bảng feedbacks - Ý kiến đóng góp */
export interface Feedback {
  id: string;
  user_id: string | null;
  author_name: string;
  author_role: FeedbackRole;
  content: string;
  is_approved: boolean;
  created_at: string;
}
