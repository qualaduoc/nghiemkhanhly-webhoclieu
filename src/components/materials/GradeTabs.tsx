"use client";

import { useState } from "react";
import Link from "next/link";
import type { GradeLevel } from "@/types/database";
import { GRADE_LEVELS } from "@/lib/constants";

// =============================================================================
// GradeTabs - Tabs chuyển đổi khối lớp (Khối 1 → Khối 5)
// Hiệu ứng tab nổi lên khi active, theo style Nintendo reference
// =============================================================================

interface GradeTabsProps {
    activeGrade: GradeLevel;
    onGradeChange: (grade: GradeLevel) => void;
}

export function GradeTabs({ activeGrade, onGradeChange }: GradeTabsProps) {
    return (
        <div className="flex space-x-2">
            {GRADE_LEVELS.map((grade) => (
                <button
                    key={grade.value}
                    onClick={() => onGradeChange(grade.value)}
                    className={`px-6 py-2 rounded-t-xl font-black text-sm transition-all ${activeGrade === grade.value
                            ? "tab-active shadow-md"
                            : "bg-gray-400 text-white hover:bg-gray-500"
                        }`}
                >
                    {grade.label}
                </button>
            ))}
        </div>
    );
}
