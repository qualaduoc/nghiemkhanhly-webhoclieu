// =============================================================================
// Thống kê truy cập ảo — Dùng chung cho Trang chủ + Admin
// Thuật toán seed-based: cùng ngày = cùng số, ngày mới = tăng tự nhiên
// =============================================================================

function seededRandom(seed: number): number {
    const x = Math.sin(seed * 9301 + 49297) * 233280;
    return x - Math.floor(x);
}

export interface VisitorStats {
    totalVisitors: number;
    online: number;
    newMembers: number;
    todayViews: number;
    totalMembers: number;
    totalMaterials: number;
}

export interface MonthlyReport {
    month: number;
    year: number;
    label: string;
    visitors: number;
    views: number;
    newMembers: number;
    downloads: number;
}

export function getVisitorStats(): VisitorStats {
    const now = new Date();
    const launchDate = new Date("2025-09-01");
    const daysSinceLaunch = Math.floor(
        (now.getTime() - launchDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const daySeed =
        now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();

    // Tổng truy cập: base 850, tăng ~15-45 mỗi ngày
    let totalVisitors = 850;
    for (let i = 0; i < daysSinceLaunch; i++) {
        totalVisitors += Math.floor(seededRandom(daySeed - i) * 30 + 15);
    }

    // Thành viên mới hôm nay: 1-5
    const newMembers = Math.floor(seededRandom(daySeed + 777) * 4 + 1);

    // Lượt xem hôm nay: 20-80
    const todayViews = Math.floor(seededRandom(daySeed + 555) * 60 + 20);

    // Online: 0 mặc định — Client sẽ tự random qua useEffect (tránh hydration mismatch)
    const online = 0;

    // Tổng thành viên: base 35, tăng ~1-3 mỗi ngày
    let totalMembers = 35;
    for (let i = 0; i < daysSinceLaunch; i++) {
        totalMembers += Math.floor(seededRandom(daySeed - i + 333) * 2 + 1);
    }

    // Tổng tài liệu: base 12, tăng ~0-1 mỗi ngày
    let totalMaterials = 12;
    for (let i = 0; i < daysSinceLaunch; i++) {
        totalMaterials += Math.floor(seededRandom(daySeed - i + 999) * 1.2);
    }

    return { totalVisitors, online, newMembers, todayViews, totalMembers, totalMaterials };
}

// =============================================================================
// Báo cáo theo tháng — Từ T9/2025 đến tháng hiện tại
// =============================================================================

export function getMonthlyReports(): MonthlyReport[] {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const reports: MonthlyReport[] = [];

    // Bắt đầu từ T9/2025
    let year = 2025;
    let month = 9;

    while (year < currentYear || (year === currentYear && month <= currentMonth)) {
        const monthSeed = year * 100 + month;
        const daysInMonth = new Date(year, month, 0).getDate();

        // Tháng đầu ít, tăng dần theo thời gian
        const monthIndex = (year - 2025) * 12 + (month - 9);
        const growthFactor = 1 + monthIndex * 0.12; // Tăng 12% mỗi tháng

        // Lượt truy cập tháng: 400-900 * growth
        const visitors = Math.floor(
            (seededRandom(monthSeed + 1) * 500 + 400) * growthFactor
        );

        // Lượt xem tháng: visitors * 2.5-4
        const views = Math.floor(
            visitors * (seededRandom(monthSeed + 2) * 1.5 + 2.5)
        );

        // Thành viên mới tháng: 8-25 * growth
        const newMembers = Math.floor(
            (seededRandom(monthSeed + 3) * 17 + 8) * growthFactor
        );

        // Lượt tải tháng: 30-120 * growth
        const downloads = Math.floor(
            (seededRandom(monthSeed + 4) * 90 + 30) * growthFactor
        );

        // Nếu là tháng hiện tại, tính theo tỷ lệ ngày đã qua
        const dayRatio = (year === currentYear && month === currentMonth)
            ? now.getDate() / daysInMonth
            : 1;

        reports.push({
            month,
            year,
            label: `T${month}/${year}`,
            visitors: Math.floor(visitors * dayRatio),
            views: Math.floor(views * dayRatio),
            newMembers: Math.floor(newMembers * dayRatio),
            downloads: Math.floor(downloads * dayRatio),
        });

        // Tháng tiếp theo
        month++;
        if (month > 12) {
            month = 1;
            year++;
        }
    }

    return reports;
}
