import React from "react";
import { Armchair, Lamp, Sofa, LayoutGrid, HelpCircle } from "lucide-react";
import { springSmooth } from "@/lib/motion";
import { useCatalog } from "../module/catalog.context";
import { motion } from "framer-motion";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
    all: LayoutGrid,
    chairs: Armchair,
    armchairs: Sofa,
    lighting: Lamp,
};

export const CategoryRowUi = () => {
    const { selectedCategory, setSelectedCategory, countByCategory, categories, loading } = useCatalog();

    if (loading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 lg:h-18 animate-pulse bg-white/60 rounded-3xl border border-black/5" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {categories?.map(cat => {
                const Icon = ICON_MAP[cat.id] ?? HelpCircle;
                const isActive = selectedCategory === cat.id;

                return (
                    <motion.button
                        key={cat.id}
                        whileTap={{ scale: 0.97 }}
                        transition={springSmooth}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex items-center gap-3 px-4 py-4 rounded-3xl border transition-all duration-250 text-left ${
                            isActive
                                ? 'bg-[#111111] text-white border-transparent shadow-[0_12px_30px_-6px_rgba(0,0,0,0.25)]'
                                : 'bg-white text-zinc-700 border-black/6 hover:border-black/20 hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08)]'
                        }`}
                    >
                        {/* Icon */}
                        <span className={`flex items-center justify-center w-9 h-9 rounded-2xl shrink-0 transition-colors ${
                            isActive ? 'bg-white/10' : 'bg-zinc-100'
                        }`}>
                            <Icon size={16} />
                        </span>

                        {/* Label + count */}
                        <span className="flex flex-col min-w-0">
                            <span className="text-xs font-bold tracking-tight truncate capitalize">
                                {cat.name}
                            </span>
                            <span className={`text-[10px] font-medium mt-0.5 transition-colors ${
                                isActive ? 'text-white/45' : 'text-zinc-400'
                            }`}>
                                {countByCategory(cat.id)} поз.
                            </span>
                        </span>
                    </motion.button>
                );
            })}
        </div>
    );
};
