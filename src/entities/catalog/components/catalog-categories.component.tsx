'use client'

import { motion } from "framer-motion";
import { useCatalog } from "../module/catalog.context";
import { PremiumSpring, TightSpring } from "../module/catalog.animations";
import { useEffect, useState } from "react";
import { categoriesApi } from "@/lib/api";
import { Category } from "@/lib/types";

const LIMIT = 4;

export const CatalogCategoriesComponent = () => {

    const { selectedCategory, setSelectedCategory } = useCatalog();
    const [categories, setCategories] = useState<Category[]>();
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        categoriesApi.list()
            .then((data) => setCategories(data))
            .catch(() => setCategories([]))
            .finally(() => setLoading(false));
    }, [])

    if (categories) {
        const visible = expanded ? categories : categories.slice(0, LIMIT);
        const hasMore = categories.length > LIMIT;
        return (
            <div className="space-y-3" >
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Категория</h4>
                <div className="space-y-1 text-xs font-bold uppercase relative">
                    {visible.map((category) => {
                        const isSelected = selectedCategory === category.id;
                        return (
                            <label
                                key={category.id}
                                className="flex items-center space-x-3 cursor-pointer group py-1.5 relative select-none"
                                onClick={() => setSelectedCategory(category.id)}
                            >
                                {/* Вместо дефолтного инпута строим кастомный интерактивный маркер */}
                                <div className="relative w-3.5 h-3.5 rounded-full border border-black/10 flex items-center justify-center bg-zinc-50 group-hover:border-black/30 transition-colors">
                                    <motion.div
                                        initial={false}
                                        animate={{
                                            scale: isSelected ? 1 : 0,
                                            opacity: isSelected ? 1 : 0,
                                        }}
                                        transition={TightSpring}
                                        className="w-1.5 h-1.5 rounded-full bg-black"
                                    />
                                </div>

                                {/* Текст плавно смещается вправо, если вкладка активна */}
                                <motion.span
                                    animate={{
                                        x: isSelected ? 4 : 0,
                                        color: isSelected ? "#111111" : "#71717a"
                                    }}
                                    transition={PremiumSpring}
                                    className="font-bold transition-colors group-hover:text-black"
                                >
                                    {category.name}
                                </motion.span>
                            </label>
                        );
                    })}
                </div>

                {hasMore && (
                    <button
                        type="button"
                        onClick={() => setExpanded(prev => !prev)}
                        className="mt-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors"
                    >
                        {expanded ? 'Скрыть' : `Показать ещё ${categories.length - LIMIT}`}
                    </button>
                )}
            </div>
        )
    }
}