'use client'

import { Container } from "@/components/Container"
import { CatalogProvider } from "../module/catalog.context"
import { CatalogFilters, CatalogHeading, CatalogList } from ".."
import { Sliders } from "lucide-react"
import { useEffect, useState } from "react"
import { useHeaderHeight } from "@/hooks/useHeaderHeight"
import { AnimatePresence } from "framer-motion"

export const CatalogUi = () => {
    const headerHeight = useHeaderHeight();
    const [isOpenFilters, setIsOpenFilters] = useState(false);

    return (
        <CatalogProvider>
            <Container className="py-12 space-y-12">
                <CatalogHeading className="lg:mb-8 xs:mb-0" />
                <button
                    onClick={() => { setIsOpenFilters(() => !isOpenFilters) }}
                    className={`sticky z-99 md:w-100 xs:w-30 top-0 bottom-0 mx-auto py-3 bg-white rounded-b-2xl items-center  justify-center lg:hidden xs:flex mb-8`}
                >
                    <Sliders />
                </button>
                <div className="grid xs:grid-cols-1 lg:grid-cols-14 gap-8 items-start">
                    <AnimatePresence>
                        {isOpenFilters && (
                            <CatalogFilters
                                className={`lg:col-span-4 space-y-8 lg:block ${isOpenFilters ? 'xs:fixed!' : 'xs:hidden'} xs:absolute xs:top-0 xs:left-0 w-full z-100 h-full top`}
                                style={{ marginTop: headerHeight + 100 + 'px' }}
                                onClose={() => setIsOpenFilters(false)}
                            />
                        )}
                    </AnimatePresence>
                    <CatalogFilters
                        className={`lg:col-span-4 space-y-8 lg:block xs:hidden`}
                    />
                    <CatalogList className="lg:col-span-10" />
                </div>
            </Container>
        </CatalogProvider>
    )
}