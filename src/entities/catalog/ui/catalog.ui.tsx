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
            <button
                onClick={() => { setIsOpenFilters(() => !isOpenFilters) }}
                className={`fixed z-99 top-0 bottom-0 left-0 py-3 px-3 h-fit bg-white rounded-r-2xl items-center  justify-center lg:hidden xs:flex`}
                style={{ top: headerHeight + 'px' + '100px' }}
            >
                <Sliders />
            </button>
            <Container className="py-12 space-y-12">
                <CatalogHeading className="mb-8" />
                <div className="grid xs:grid-cols-1 lg:grid-cols-14 gap-8 items-start">
                    <AnimatePresence>
                        {isOpenFilters && (
                            <CatalogFilters
                                className={`lg:col-span-4 space-y-8 lg:block ${isOpenFilters ? 'xs:fixed!' : 'xs:hidden'} xs:absolute xs:top-0 xs:left-0 w-full z-100 h-full top`}
                                style={{ marginTop: headerHeight + 'px' + '100px' }}
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