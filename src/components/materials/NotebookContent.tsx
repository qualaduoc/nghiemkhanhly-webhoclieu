"use client";

import { useState } from "react";
import type { GradeLevel, Category, Material, Feedback } from "@/types/database";
import { GradeTabs } from "@/components/materials/GradeTabs";
import { SubjectCard } from "@/components/materials/SubjectCard";
import { MaterialCard } from "@/components/materials/MaterialCard";
import { FeedbackSection } from "@/components/feedback/FeedbackSection";

// =============================================================================
// NotebookContent - Phần nội dung chính dạng sổ ghi (Notebook Style)
// Bao gồm: Tabs Khối lớp + Danh mục môn học + Tài liệu mới + Tài liệu hot
// =============================================================================

interface NotebookContentProps {
    categories: Category[];
    latestMaterials: Material[];
    popularMaterials: Material[];
    feedbacks: Feedback[];
}

export function NotebookContent({
    categories,
    latestMaterials,
    popularMaterials,
    feedbacks,
}: NotebookContentProps) {
    const [activeGrade, setActiveGrade] = useState<GradeLevel>(1);

    // Lọc danh mục theo khối lớp đang chọn
    const filteredCategories = categories.filter(
        (cat) => cat.grade === activeGrade
    );

    return (
        <section className="flex-grow p-4 md:p-8 relative">
            <div className="bg-notebook-bg min-h-full rounded-tr-3xl rounded-br-3xl shadow-2xl relative p-6 md:p-12 border-l border-gray-200">
                {/* Gáy sổ notebook */}
                <div className="notebook-spine hidden md:flex">
                    {Array.from({ length: 16 }).map((_, i) => (
                        <div key={i} className="ring" />
                    ))}
                </div>

                {/* Tabs Khối lớp (nằm trên notebook) */}
                <div className="flex flex-wrap gap-2 md:absolute md:-top-10 md:left-12 mb-6 md:mb-0">
                    <GradeTabs activeGrade={activeGrade} onGradeChange={setActiveGrade} />
                </div>

                {/* Tiêu đề section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-4 border-green-500 pb-4 mb-8">
                    <h1 className="text-3xl md:text-4xl font-black text-green-600 tracking-tighter">
                        DANH MỤC BÀI HỌC
                    </h1>
                    <span className="text-sm font-bold text-gray-400 italic mt-2 sm:mt-0">
                        Cùng nhau khám phá kiến thức mới!
                    </span>
                </div>

                {/* Grid danh mục môn học */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {filteredCategories.length > 0 ? (
                        filteredCategories.map((category) => (
                            <SubjectCard key={category.id} category={category} />
                        ))
                    ) : (
                        // Hiển thị skeleton khi chưa có data
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm flex space-x-4">
                                <div className="w-16 h-16 skeleton shrink-0 rounded-xl" />
                                <div className="flex-1 space-y-2">
                                    <div className="skeleton h-5 w-2/3" />
                                    <div className="skeleton h-3 w-full" />
                                    <div className="skeleton h-3 w-4/5" />
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Section: Tài liệu mới nhất */}
                {latestMaterials.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-black text-gray-700 mb-6 flex items-center">
                            <span className="mr-2">🆕</span> Tài Liệu Mới Nhất
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {latestMaterials.map((material) => (
                                <MaterialCard key={material.id} material={material} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Section: Tải nhiều nhất */}
                {popularMaterials.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-black text-gray-700 mb-6 flex items-center">
                            <span className="mr-2">🔥</span> Tải Nhiều Nhất
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {popularMaterials.map((material) => (
                                <MaterialCard key={material.id} material={material} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Section: Ý kiến đóng góp */}
                <FeedbackSection feedbacks={feedbacks} />

                {/* Lời nhắn Mascot */}
                <div className="mt-16 flex justify-center">
                    <div className="speech-bubble p-6 max-w-lg shadow-xl border-4 border-yellow-400">
                        <p className="text-center font-bold text-gray-700 text-lg">
                            Chào bạn nhỏ! Bạn đã tìm thấy bài học mà mình yêu thích chưa?
                            Nếu cần hỗ trợ, đừng ngần ngại hỏi Gấu Thông Thái nhé!
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
