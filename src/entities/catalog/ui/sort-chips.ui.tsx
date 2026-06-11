'use client'

import { motion } from "framer-motion";
import { useCatalog } from "../module/catalog.context";
import { springSmooth } from "@/lib/motion";

const CHIPS = [
    { id: 'default', label: 'Все' },
    { id: 'price-asc', label: 'Дешевле' },
    { id: 'price-desc', label: 'Дороже' },
];

export const SortChipsUi = () => {
    const { sortBy, setSortBy } = useCatalog();
    return (
        <div className="flex gap-2 mb-5">
            {CHIPS.map(chip => {
                const isActive = sortBy === chip.id;
                return (
                    <button
                        key={chip.id}
                        onClick={() => setSortBy(chip.id)}
                        className="relative px-4 py-2 text-[11px] font-semibold rounded-full"
                    >
                        {isActive && (
                            <motion.span
                                layoutId="sort-chip-pill"
                                transition={springSmooth}
                                className="absolute inset-0 bg-[#111111] rounded-full"
                            />
                        )}
                        <span className={`relative z-10 transition-colors duration-200
                                          ${isActive ? 'text-white' : 'text-zinc-500 hover:text-black'}`}>
                            {chip.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};
