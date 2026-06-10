'use client'

import { Container } from "@/components/Container"
import { CatalogProvider } from "../module/catalog.context"
import { CatalogFilters, CatalogHeading, CatalogList, CatalogSearch, CatalogTopbar } from ".."
import { Sliders } from "lucide-react"
import { useEffect, useState } from "react"
import { useHeaderHeight } from "@/hooks/useHeaderHeight"
import { AnimatePresence } from "framer-motion"
import { PageItem, PageStagger } from "@/components/Animations"

export const CatalogUi = () => {
    const { headerHeight } = useHeaderHeight();
    const [isOpenFilters, setIsOpenFilters] = useState(false);

    return (
        <CatalogProvider>
            <Container className="py-12 space-y-0 pb-0!">
                <CatalogHeading className="mb-8" />
                <CatalogTopbar className="mb-6 md:relative xs:sticky top-3 z-99" onOpen={() => setIsOpenFilters(!isOpenFilters)} />
                <AnimatePresence>
                    {isOpenFilters && (
                        <CatalogFilters
                            className={`lg:col-span-4 space-y-8 lg:block ${isOpenFilters ? 'xs:fixed!' : 'xs:hidden'} xs:absolute xs:top-0 xs:left-0 w-full z-100 h-screen top`}
                            style={{ paddingTop: headerHeight + 24 + 'px' }}
                            onClose={() => setIsOpenFilters(false)}
                        />
                    )}
                </AnimatePresence>
                <PageStagger className="grid xs:grid-cols-1 lg:grid-cols-14 gap-8 items-start">
                    <PageItem className={`lg:col-span-4 space-y-8 lg:block xs:hidden sticky top-2`}>
                        <CatalogFilters />
                    </PageItem>
                    <PageItem className="lg:col-span-10">
                        <CatalogList className="lg:col-span-10" />
                    </PageItem>
                </PageStagger>

            </Container>
        </CatalogProvider>
    )
}