'use client'

import { motion } from "framer-motion";
import { useCatalog } from "../module/catalog.context";
import { springSmooth } from "@/lib/motion";

const CHIPS = [
    { id: 'default', label: 'Все' },
    { id: 'price-asc', label: 'Дешевле' },
    { id: 'price-desc', label: 'Дороже' },
    { id: 'popular', label: 'Популярные' },
];

export const SortChipsUi = () => {
    const { sortBy, setSortBy } = useCatalog();
    return (
        <div className="flex gap-1.5 mb-5 p-1 bg-zinc-100 rounded-2xl w-fit">
            {CHIPS.map(chip => {
                const isActive = sortBy === chip.id;
                return (
                    <button
                        key={chip.id}
                        onClick={() => setSortBy(chip.id)}
                        className="relative px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-colors"
                    >
                        {isActive && (
                            <motion.span
                                layoutId="sort-chip-pill"
                                transition={springSmooth}
                                className="absolute inset-0 bg-white rounded-xl shadow-sm"
                            />
                        )}
                        <span className={`relative z-10 transition-colors duration-150 ${
                            isActive ? 'text-black' : 'text-zinc-400 hover:text-zinc-600'
                        }`}>
                            {chip.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};
