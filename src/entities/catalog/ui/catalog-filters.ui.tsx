'use client'

import { AnimatePresence, motion } from "framer-motion";
import { Search, Sliders, X } from "lucide-react"
import { useCatalog } from "../module/catalog.context";
import { CatalogCategories, CatalogColors, CatalogRange, CatalogSelect } from "..";
import { PremiumSpring } from "../module/catalog.animations";
import { PageItem, PageStagger } from "@/components/Animations";
import { useHeaderHeight } from "@/hooks/useHeaderHeight";
import { useSheetDrag } from "@/hooks/useSheetDrag";

export const CatalogFiltersUi = ({ className, style, onClose, isOpen = false }: { className?: string; style?: React.CSSProperties; onClose: () => void; isOpen?: boolean }) => {
    const {
        selectedCategory,
        selectedColors,
        maxPrice,
        resetFilters,
    } = useCatalog();

    const isFiltered = selectedCategory !== "all" || selectedColors.length > 0 || maxPrice < 1500;
    const { headerHeight, dockHeight } = useHeaderHeight();

    // Подключаем наш обновленный хук умного трекинга скролла
    const { rootRef, transformY, paddingBottom } = useSheetDrag({
        isOpen,
        setIsOpen: (openState) => {
            if (!openState) onClose();
        },
        variant: 'dismiss',
        maxPullUp: -60
    });

    const filtersContent = (
        // Убираем безусловный overflow-y-auto, переносим его только на десктоп (lg)
        <PageStagger className="p-6 space-y-6 lg:overflow-y-auto lg:overflow-x-hidden">
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
                    
                    {/* debug
                     <button
                        className="lg:hidden block"
                        onClick={onClose}
                    >
                        <X size={16} />
                    </button>
                    */}
                </div>
            </PageItem>
            <PageItem>
                <CatalogCategories />
            </PageItem>
            <PageItem>
                <CatalogColors />
            </PageItem>
            <PageItem className="xs:block sm:hidden">
                <CatalogSelect />
            </PageItem>
            <PageItem>
                <CatalogRange />
            </PageItem>
        </PageStagger>
    );

    return (
        <motion.div
            ref={rootRef}
            className={`${className} xs:fixed z-10000 xs:bottom-0 xs:rounded-b-none md:rounded-3xl xs:w-full xs:left-0 w-auto filters-sheet backdrop-blur-xl bg-white/30 rounded-3xl border border-black/5 lg:sticky lg:top-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden pb-[var(--sheet-pb)] [--sheet-pb:0px]`}
            style={{
                ...style,
                ['--sheet-offset' as string]: `${headerHeight + dockHeight + 36}px`,
                overscrollBehavior: 'contain',
                y: transformY,
                paddingBottom,
            }}
        >
            {/* Десктопная версия */}
            <div className="hidden lg:block space-y-8">
                {filtersContent}
            </div>

            {/* Мобильная версия шторки */}
            <div className="lg:hidden block overflow-y-hidden overflow-x-hidden">
                {/* Индикатор/хэндл шторки */}
                <div className="flex justify-center py-4 select-none sticky top-0 bg-transparent z-10">
                    <motion.div
                        className="w-10 h-1 rounded-full bg-zinc-300"
                        animate={{ y: [0, 3, 0] }}
                        transition={{ repeat: 2, duration: 0.9, delay: 0.5, ease: 'easeInOut' }}
                    />
                </div>
                
                {/* Единый главный скролл-контейнер на мобилке */}
                <div className="overflow-y-auto max-h-[75vh] pb-6">
                    {filtersContent}
                </div>
            </div>
        </motion.div>
    )
}