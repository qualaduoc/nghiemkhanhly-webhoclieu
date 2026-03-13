// =============================================================================
// Thống kê truy cập ảo — Dùng chung cho Trang chủ + Admin Dashboard
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

export function getVisitorStats(): VisitorStats {
    const now = new Date();
    const launchDate = new Date("2025-09-01");
    const daysSinceLaunch = Math.floor(
        (now.getTime() - launchDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const daySeed =
        now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();

    // Tổng truy cập: tăng ~120-280 mỗi ngày
    let totalVisitors = 12450;
    for (let i = 0; i < daysSinceLaunch; i++) {
        totalVisitors += Math.floor(seededRandom(daySeed - i) * 160 + 120);
    }

    // Thành viên mới hôm nay: 3-15
    const newMembers = Math.floor(seededRandom(daySeed + 777) * 12 + 3);

    // Lượt xem hôm nay: 80-350
    const todayViews = Math.floor(seededRandom(daySeed + 555) * 270 + 80);

    // Online: 5-35
    const online = Math.floor(Math.random() * 30 + 5);

    // Tổng thành viên: tăng ~2-8 mỗi ngày
    let totalMembers = 245;
    for (let i = 0; i < daysSinceLaunch; i++) {
        totalMembers += Math.floor(seededRandom(daySeed - i + 333) * 6 + 2);
    }

    // Tổng tài liệu: tăng ~0-3 mỗi ngày
    let totalMaterials = 85;
    for (let i = 0; i < daysSinceLaunch; i++) {
        totalMaterials += Math.floor(seededRandom(daySeed - i + 999) * 3);
    }

    return { totalVisitors, online, newMembers, todayViews, totalMembers, totalMaterials };
}
