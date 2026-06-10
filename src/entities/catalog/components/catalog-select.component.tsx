'use client'

import { useEffect, useState } from "react";
import { useCatalog } from "../module/catalog.context";
import { AnimatePresence, motion } from "framer-motion";

export const CatalogSelectComponent = () => {
    const [isSortOpen, setIsSortOpen] = useState(false);

    useEffect(() => {
        setSortBy("popularity")
    }, [])

    const { sortBy, setSortBy } = useCatalog();
    return (
        <div className="pt-4 border-t border-black/5 space-y-3 relative">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 select-none">Сортировать</h4>

            <div className="relative">
                {/* ТРИГГЕР (Кнопка селекта) */}
                <button
                    type="button"
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="w-full bg-[#F4F3F0] hover:bg-[#eae9e5] text-xs font-bold uppercase tracking-wider rounded-xl p-3 flex items-center justify-between outline-none transition-colors select-none"
                >
                    <span>
                        {sortBy === "popularity" && "По популярности"}
                        {sortBy === "price-asc" && "от низкой к высокой"}
                        {sortBy === "price-desc" && "Цена: от высокой к низкой"}
                    </span>

                    {/* Анимированная стрелочка */}
                    <motion.div
                        animate={{ rotate: isSortOpen ? 180 : 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="text-[10px] text-zinc-500 font-black"
                    >
                        ▼
                    </motion.div>
                </button>

                {/* ВЫПАДАЮЩИЙ СПИСОК (Теперь без фрагментов, каждый элемент отслеживается отдельно) */}
                <AnimatePresence>
                    {/* 1. Плавная фоновая вуаль при клике мимо */}
                    {isSortOpen && (
                        <motion.div
                            key="sort-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-10 cursor-default"
                            onClick={() => setIsSortOpen(false)}
                        />
                    )}

                    {/* 2. Само выпадающее меню */}
                    {isSortOpen && (
                        <motion.div
                            key="sort-dropdown-menu"
                            initial={{ opacity: 0, scale: 0.96, y: -4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: -4 }}
                            transition={{ type: "spring", stiffness: 400, damping: 28 }}
                            className="absolute left-0 right-0 mt-1.5 bg-white border border-black/5 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden z-20 p-1"
                        >
                            {[
                                { value: "popularity", label: "По популярности" },
                                { value: "price-asc", label: "Цена: от низкой к высокой" },
                                { value: "price-desc", label: "Цена: от высокой к низкой" }
                            ].map((option) => {
                                const isSelected = sortBy === option.value;
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                            setSortBy(option.value);
                                            setIsSortOpen(false);
                                        }}
                                        className="w-full text-left text-xs font-bold uppercase tracking-wider rounded-lg p-2.5 relative group select-none outline-none flex items-center justify-between"
                                    >
                                        {/* Контент пункта */}
                                        <span className={`relative z-10 transition-colors duration-200 ${isSelected ? "text-black font-black" : "text-zinc-500 group-hover:text-black"}`}>
                                            {option.label}
                                        </span>

                                        {/* Маркер активного пункта */}
                                        {isSelected && (
                                            <motion.div
                                                layoutId="activeSelectionDash"
                                                className="w-1 h-3 bg-black rounded-full relative z-10"
                                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                            />
                                        )}

                                        {/* Фоновый ховер */}
                                        <div className="absolute inset-0 bg-zinc-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg z-0" />
                                    </button>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}