'use client'

import { Container } from "@/components/Container"
import { useCatalog } from "../module/catalog.context"
import { BannerSlider, CatalogFilters, CatalogList, CatalogTopbar, CategoryRow, FlashSale, ProductCard, SortChips } from ".."
import { useHeaderHeight } from "@/hooks/useHeaderHeight"
import { motion } from "framer-motion"
import { PageItem, PageStagger } from "@/components/Animations"
import { CatalogToolbarUi } from "./catalog-toolbar.ui"
import { StuckSentinel } from "@/hooks/useStack"
import { Suspense, useEffect } from "react"
import { useSearchParams } from "next/navigation"

function CategoryParamSync() {
    const params = useSearchParams();
    const { setSelectedCategory } = useCatalog();

    useEffect(() => {
        const cat = params.get('category');
        if (cat) setSelectedCategory(cat);
    }, [params, setSelectedCategory]);

    return null;
}

export const CatalogUi = () => {
    const { headerHeight } = useHeaderHeight();
    const { filteredProducts, resetFilters, setIsOpenFilters, isOpenFilters } = useCatalog();

    return (
        <Container className="px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
            <Suspense><CategoryParamSync /></Suspense>
            <PageStagger className="space-y-10 lg:space-y-6">

                {/* Баннер-слайдер */}
                <PageItem>
                    <BannerSlider />
                </PageItem>

                {/* Секция категорий */}
                <PageItem>
                    <div className="flex items-end justify-between mb-5">
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-1">
                                По типу
                            </p>
                            <h2 className="text-xl font-black uppercase tracking-tight leading-none">
                                Коллекции
                            </h2>
                        </div>
                    </div>
                    <CategoryRow />
                </PageItem>

                {/* Тулбар поиска (только md+) */}
                <PageItem className="xs:hidden md:block">
                    <div className="sticky z-40" style={{ top: headerHeight + 8 }}>
                        <CatalogToolbarUi
                            onOpen={() => setIsOpenFilters(!isOpenFilters)}
                        />
                    </div>
                    <StuckSentinel />
                </PageItem>

                {/* Основная сетка: фильтры + товары */}
                <PageItem>
                    <div className="grid grid-cols-1 lg:grid-cols-14 gap-8 items-start">

                        <CatalogFilters
                            className="lg:col-span-4"
                            isOpen={isOpenFilters}
                            onClose={() => setIsOpenFilters(false)}
                        />

                        <div className="lg:col-span-10">
                            <FlashSale />
                            <SortChips />

                            {filteredProducts.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="py-24 text-center space-y-4"
                                >
                                    <p className="text-sm font-black uppercase tracking-widest text-zinc-300">
                                        Ничего не найдено
                                    </p>
                                    <button
                                        onClick={resetFilters}
                                        className="text-[10px] font-black uppercase tracking-widest bg-[#111111] text-white px-6 py-3 rounded-xl hover:bg-zinc-800 transition-colors"
                                    >
                                        Сбросить фильтры
                                    </button>
                                </motion.div>
                            ) : (
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-7 lg:gap-x-6 lg:gap-y-10">
                                    {filteredProducts.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </PageItem>

            </PageStagger>
        </Container>
    );
};
