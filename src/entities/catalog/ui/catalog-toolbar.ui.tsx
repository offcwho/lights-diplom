'use client'

import { Search, Sliders, X, ChevronDown, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useCatalog } from "../module/catalog.context";
import { springSmooth } from "@/lib/motion";
import { CatalogSearch } from "..";

const SORT_OPTIONS = [
    { value: 'popular', label: 'По популярности' },
    { value: 'price-asc', label: 'Сначала дешевле' },
    { value: 'price-desc', label: 'Сначала дороже' },
] as const;

export const CatalogToolbarUi = ({ onOpen, className }: { onOpen?: () => void; className?: string; }) => {
    const {
        searchQuery, setSearchQuery,
        selectedCategory, selectedColors, maxPrice,
        sortBy, setSortBy,
        filteredProducts,
    } = useCatalog();

    const activeFiltersCount =
        (selectedCategory !== 'all' ? 1 : 0) +
        selectedColors.length +
        (maxPrice < 1500 ? 1 : 0);

    return (
        <div className={`flex items-stretch gap-2 sm:gap-3 ${className ?? ''}`}>
            {/* ЕДИНАЯ КАПСУЛА — фиксированная высота h-12 на всё */}
            <div className="flex-1 min-w-0 h-12 flex items-stretch bg-white border border-black/10 rounded-2xl
                            shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden
                            transition-colors focus-within:border-black/30">

                {/* Поиск — голый, без своей коробки */}
                <div className="relative flex-1 min-w-0 flex items-center">
                    <Search size={14} className="absolute left-4 text-zinc-400 pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Поиск светильников..."
                        className="w-full h-full bg-transparent pl-10 pr-9 text-xs font-medium outline-none
                                   placeholder:text-zinc-400"
                    />
                    <AnimatePresence>
                        {searchQuery.length > 0 && (
                            <motion.button
                                type="button"
                                initial={{ opacity: 0, scale: 0.6 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.6 }}
                                whileTap={{ scale: 0.85 }}
                                transition={springSmooth}
                                onClick={() => setSearchQuery('')}
                                aria-label="Очистить поиск"
                                className="absolute right-2.5 p-1 rounded-full text-zinc-400 hover:text-black hover:bg-black/5 transition-colors"
                            >
                                <X size={12} />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>

                {/* Счётчик */}
                <div className="hidden md:flex items-center px-4 border-l border-black/5 shrink-0">
                    <motion.span
                        key={filteredProducts.length}
                        initial={{ opacity: 0.4, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className="text-[10px] font-mono font-bold text-zinc-400 whitespace-nowrap tabular-nums"
                    >
                        {filteredProducts.length} поз.
                    </motion.span>
                </div>

                {/* Сортировка */}
                <SortDropdown value={sortBy} onChange={setSortBy} />
            </div>

            {/* Кнопка фильтров — мобилка, та же высота h-12 */}
            <motion.button
                whileTap={{ scale: 0.93 }}
                transition={springSmooth}
                onClick={onOpen}
                className="lg:hidden relative shrink-0 w-12 h-12 bg-[#111111] text-white rounded-2xl shadow-sm
                           flex items-center justify-center"
                aria-label="Открыть фильтры"
            >
                <Sliders size={16} />
                <AnimatePresence>
                    {activeFiltersCount > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={springSmooth}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-600 text-white text-[9px] font-black rounded-full flex items-center justify-center"
                        >
                            {activeFiltersCount}
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
};

/* ------- Кастомный дропдаун сортировки ------- */
const SortDropdown = ({ value, onChange }: {
    value: string;
    onChange: (v: string) => void;
}) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // закрытие по клику вне
    useEffect(() => {
        if (!open) return;
        const onClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, [open]);

    const current = SORT_OPTIONS.find(o => o.value === value) ?? SORT_OPTIONS[0];

    return (
        <div ref={ref} className="hidden lg:flex relative shrink-0 border-l border-black/5">
            <button
                onClick={() => setOpen(prev => !prev)}
                className="h-full flex items-center gap-2 px-5 text-[11px] font-semibold
                   text-zinc-700 hover:text-black hover:bg-black/[0.03] transition-colors whitespace-nowrap"
            >
                {current.label}
                <motion.span animate={{ rotate: open ? 180 : 0 }} transition={springSmooth}>
                    <ChevronDown size={12} />
                </motion.span>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.ul
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={springSmooth}
                        className="absolute right-0 top-full mt-2 w-52 bg-white border border-black/5 rounded-2xl
                                   shadow-[0_12px_40px_rgba(0,0,0,0.08)] p-1.5 z-50 origin-top"
                    >
                        {SORT_OPTIONS.map(opt => {
                            const isActive = opt.value === value;
                            return (
                                <li key={opt.value}>
                                    <button
                                        onClick={() => { onChange(opt.value); setOpen(false); }}
                                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl
                                                    text-[10px] font-bold uppercase tracking-wider text-left transition-colors
                                                    ${isActive ? 'bg-black text-white' : 'text-zinc-600 hover:bg-black/5'}`}
                                    >
                                        {opt.label}
                                        {isActive && <Check size={12} />}
                                    </button>
                                </li>
                            );
                        })}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};