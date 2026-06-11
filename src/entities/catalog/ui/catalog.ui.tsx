'use client'

import { Container } from "@/components/Container"
import { CatalogProvider, useCatalog } from "../module/catalog.context"
import { CatalogFilters, CatalogList, CatalogTopbar, CategoryRow, FlashSale, ProductCard, PromoBanner, SortChips } from ".."
import { useHeaderHeight } from "@/hooks/useHeaderHeight"
import { AnimatePresence, motion } from "framer-motion"
import { PageItem, PageStagger } from "@/components/Animations"
import { useEffect, useState } from "react"
import { CatalogToolbarUi } from "./catalog-toolbar.ui"
import { StuckSentinel, useStuck } from "@/hooks/useStack"

export const CatalogUi = () => {
    const { headerHeight } = useHeaderHeight();
    const [isOpenFilters, setIsOpenFilters] = useState(false);
    const { filteredProducts } = useCatalog();

    return (
        <Container className="px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
            <PageStagger className="space-y-10 lg:space-y-4">

                {/* ТУЛБАР — первый, прилипает при скролле */}
                <PageItem>
                    <div className="sticky z-40" style={{ top: headerHeight + 8 }}>
                        <CatalogToolbarUi
                            onOpen={() => setIsOpenFilters(!isOpenFilters)}
                        />
                    </div>
                    <StuckSentinel />
                </PageItem>

                {/* Баннер */}
                <PageItem className="mb-10">
                    <PromoBanner />
                </PageItem>

                {/* Категории */}
                <PageItem className="mb-8">
                    <h2 className="text-base font-black tracking-tight mb-4">Категории</h2>
                    <CategoryRow />
                </PageItem>

                {/* Товары */}
                <PageItem>
                    <div className="grid grid-cols-1 lg:grid-cols-14 gap-8 items-start">

                        <CatalogFilters
                            className="lg:col-span-4"
                            isOpen={isOpenFilters}
                            onClose={() => setIsOpenFilters(!isOpenFilters)}
                        />


                        <div className="lg:col-span-10">
                            <FlashSale />
                            <SortChips />
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-7 lg:gap-x-6 lg:gap-y-10">
                                {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
                            </div>
                        </div>
                    </div>
                </PageItem>

            </PageStagger>

            {/* Мобильная шторка фильтров */}

        </Container>
    );
};