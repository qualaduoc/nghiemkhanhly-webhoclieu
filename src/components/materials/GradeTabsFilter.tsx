"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter } from "lucide-react";
import { GRADE_LEVELS, SUBJECTS } from "@/lib/constants";
import type { GradeLevel } from "@/types/database";

// =============================================================================
// GradeTabsFilter — Client Component cho trang /materials
// Lọc theo Khối lớp + Môn + Tìm kiếm
// =============================================================================

export function GradeTabsFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("query") || "");

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (query) params.set("query", query);
        router.push(`/materials?${params.toString()}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSearch();
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100">
            {/* Thanh tìm kiếm */}
            <div className="relative mb-4">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Tìm kiếm tài liệu theo tên..."
                    className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-100 text-sm font-medium transition-all"
                />
            </div>

            {/* Tabs khối lớp */}
            <div className="mb-3">
                <label className="text-sm font-bold text-gray-600 flex items-center gap-1 mb-2">
                    <Filter size={14} /> Lọc nhanh:
                </label>
                <div className="flex flex-wrap gap-2">
                    {GRADE_LEVELS.map((gl) => (
                        <button
                            key={gl.value}
                            onClick={() => router.push(`/materials?grade=${gl.value}`)}
                            className="px-4 py-1.5 rounded-full text-sm font-bold bg-gray-100 text-gray-600 hover:bg-green-500 hover:text-white transition-all"
                        >
                            {gl.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Filter môn */}
            <div className="flex flex-wrap gap-2">
                {SUBJECTS.map((subject) => (
                    <button
                        key={subject}
                        onClick={() => router.push(`/materials?query=${subject}`)}
                        className="px-3 py-1 rounded-full text-xs font-bold bg-gray-50 text-gray-500 hover:bg-orange-100 hover:text-orange-600 transition-all"
                    >
                        {subject}
                    </button>
                ))}
            </div>
        </div>
    );
}
