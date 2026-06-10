'use client'

import { motion } from "framer-motion";
import { useCatalog } from "../module/catalog.context";
import { PremiumSpring, TightSpring } from "../module/catalog.animations";

export const CatalogCategoriesComponent = () => {

    const { selectedCategory, setSelectedCategory } = useCatalog();
    return (

        <div className="space-y-3" >
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Category</h4>
            <div className="space-y-1 text-xs font-bold uppercase relative">
                {[
                    { id: "all", label: "Все товары" },
                    { id: "chairs", label: "Chairs / Stools" },
                    { id: "armchairs", label: "Armchairs" },
                    { id: "lighting", label: "Concrete Lighting" }
                ].map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                        <label
                            key={cat.id}
                            className="flex items-center space-x-3 cursor-pointer group py-1.5 relative select-none"
                            onClick={() => setSelectedCategory(cat.id)}
                        >
                            {/* Вместо дефолтного инпута строим кастомный интерактивный маркер */}
                            <div className="relative w-3.5 h-3.5 rounded-full border border-black/10 flex items-center justify-center bg-zinc-50 group-hover:border-black/30 transition-colors">
                                {isSelected && (
                                    <motion.div
                                        layoutId="activeCategoryDot"
                                        className="w-1.5 h-1.5 rounded-full bg-black"
                                        transition={TightSpring}
                                    />
                                )}
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
                                {cat.label}
                            </motion.span>
                        </label>
                    );
                })}
            </div>
        </div>
    )
}