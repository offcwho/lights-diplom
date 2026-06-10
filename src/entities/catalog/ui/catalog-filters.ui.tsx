'use client'

import { Search, Sliders, X } from "lucide-react"
import { useCatalog } from "../module/catalog.context";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { CatalogCategories, CatalogColors, CatalogRange, CatalogSelect } from "..";
import { PremiumSpring } from "../module/catalog.animations";
import { PageItem, PageStagger } from "@/components/Animations";

export const CatalogFiltersUi = ({ className, style, onClose }: { className?: string; style?: React.CSSProperties; onClose?: () => void; }) => {
    const {
        searchQuery, setSearchQuery,
        selectedCategory,
        selectedColors,
        maxPrice,
        resetFilters,
    } = useCatalog();

    const isFiltered = selectedCategory !== "all" || selectedColors.length > 0 || maxPrice < 1500;

    return (
        <motion.aside
            className={`${className}`}
            style={style}
        >
            <PageStagger className="bg-white p-6 rounded-3xl border border-black/5 sticky top-6 space-y-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden">
                <PageItem>
                    <div className="flex items-center justify-between border-b border-black/5 pb-4 h-9">
                        <span className="text-xs font-black uppercase tracking-wider flex items-center text-zinc-900">
                            <Sliders size={14} className="mr-2" /> Световые Сценарии
                        </span>

                        <AnimatePresence>
                            {isFiltered && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8, x: 15 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, x: 15 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={PremiumSpring}
                                    onClick={resetFilters}
                                    className="text-[10px] font-bold uppercase bg-[#111111] text-white px-3 py-1.5 rounded-full hover:bg-zinc-800 transition-colors shadow-sm"
                                >
                                    Очистить
                                </motion.button>
                            )}
                        </AnimatePresence>
                        <button
                            className="lg:hidden xs:block"
                            onClick={onClose}
                        >
                            <X size={16} />
                        </button>
                    </div>
                </PageItem>
                <PageItem>
                    <CatalogCategories />
                </PageItem>
                <PageItem>
                    <CatalogColors />
                </PageItem>
                <PageItem>
                    <CatalogSelect />
                </PageItem>
                <PageItem>
                    <CatalogRange />
                </PageItem>
            </PageStagger>



        </motion.aside>
    )
}