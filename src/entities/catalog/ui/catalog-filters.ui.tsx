'use client'

import { Search, Sliders, X } from "lucide-react"
import { useCatalog } from "../module/catalog.context";
import { animate, AnimatePresence, motion, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { CatalogCategories, CatalogColors, CatalogRange, CatalogSelect } from "..";
import { PremiumSpring } from "../module/catalog.animations";
import { PageItem, PageStagger } from "@/components/Animations";
import { useHeaderHeight } from "@/hooks/useHeaderHeight";

export const CatalogFiltersUi = ({ className, style, onClose, isOpen }: { className?: string; style?: React.CSSProperties; onClose: () => void; isOpen?: boolean }) => {
    const {
        selectedCategory,
        selectedColors,
        maxPrice,
        resetFilters,
    } = useCatalog();

    const isFiltered = selectedCategory !== "all" || selectedColors.length > 0 || maxPrice < 1500;
    const { headerHeight, dockHeight } = useHeaderHeight();

    const y = useMotionValue(0);
    const rootRef = useRef<HTMLDivElement>(null);

    // Реактивный стейт для отслеживания мобильной версии
    const [isMobile, setIsMobile] = useState(false);

    // Сохраняем актуальные рефы для тач-событий
    const isOpenRef = useRef(isOpen);
    isOpenRef.current = isOpen;

    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    // --- 1. Отслеживание изменения размера экрана (для DevTools и ресайза) ---
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        handleResize(); // Проверка при монтировании
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // --- 2. Синхронизация isOpen и адаптива с положением шторки ---
    useEffect(() => {
        if (!isMobile) {
            // На десктопе сбрасываем сдвиг в 0, чтобы панель не улетала вниз
            y.set(0);
            return;
        }

        if (isOpen) {
            // Плавно открываем шторку на мобилке
            animate(y, 0, { type: 'spring', stiffness: 320, damping: 30 });
        } else {
            // Прячем шторку вниз за пределы экрана
            animate(y, window.innerHeight || 1000, { type: 'spring', stiffness: 300, damping: 35 });
        }
    }, [isOpen, isMobile, y]);

    // --- 3. Свайп-жесты по блоку ---
    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;

        let startY = 0;
        let startT = 0;
        let mode: 'drag' | 'scroll' | undefined;

        const onTouchStart = (e: TouchEvent) => {
            startY = e.touches[0].clientY;
            startT = Date.now();
            mode = undefined;
            y.stop();
        };

        const onTouchMove = (e: TouchEvent) => {
            if (!isOpenRef.current || window.innerWidth >= 1024) return;

            const delta = e.touches[0].clientY - startY;

            if (mode === undefined && Math.abs(delta) > 8) {
                mode = (delta > 0 && el.scrollTop <= 1) ? 'drag' : 'scroll';
            }

            if (mode === 'drag') {
                e.preventDefault();
                y.set(Math.max(delta, 0) * 0.55);
            }
        };

        const onTouchEnd = (e: TouchEvent) => {
            if (mode !== 'drag') { mode = undefined; return; }
            mode = undefined;

            const deltaY = e.changedTouches[0].clientY - startY;
            const deltaT = Date.now() - startT;
            const velocity = deltaY / Math.max(deltaT, 1);

            if (deltaY > 50 || (deltaY > 15 && velocity > 0.4)) {
                animate(y, window.innerHeight || 1000, {
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                    onComplete: () => {
                        onCloseRef.current();
                    }
                });
            } else {
                animate(y, 0, { type: 'spring', stiffness: 400, damping: 28 });
            }
        };

        el.addEventListener('touchstart', onTouchStart, { passive: true });
        el.addEventListener('touchmove', onTouchMove, { passive: false });
        el.addEventListener('touchend', onTouchEnd, { passive: true });

        return () => {
            el.removeEventListener('touchstart', onTouchStart);
            el.removeEventListener('touchmove', onTouchMove);
            el.removeEventListener('touchend', onTouchEnd);
        };
    }, [y]);

    const filtersContent = (
        <PageStagger className="overflow-y-auto overflow-x-hidden p-6 space-y-6">
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
                        className="lg:hidden xs:block"
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
            className={`${className} xs:fixed z-10000 xs:bottom-0 xs:rounded-b-none md:rounded-3xl xs:w-full xs:left-0 w-auto filters-sheet backdrop-blur-xl bg-white/30 rounded-3xl border border-black/5 lg:sticky lg:top-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden`}
            style={{
                ...style,
                ['--sheet-offset' as string]: `${headerHeight + dockHeight + 36}px`,
                overscrollBehavior: 'contain',
                y,
            }}
        >
            {/* Десктопная версия */}
            <div className="hidden lg:block space-y-8">
                {filtersContent}
            </div>

            {/* Мобильная версия шторки */}
            <div className="lg:hidden block overflow-y-hidden overflow-x-hidden">
                <div className="flex justify-center py-4 select-none sticky top-0">
                    <motion.div
                        className="w-10 h-1 rounded-full bg-zinc-300"
                        animate={{ y: [0, 3, 0] }}
                        transition={{ repeat: 2, duration: 0.9, delay: 0.5, ease: 'easeInOut' }}
                    />
                </div>
                <div className="overflow-y-scroll max-h-120">
                    {filtersContent}
                </div>
            </div>
        </motion.div>
    )
}