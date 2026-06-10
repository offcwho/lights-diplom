'use client'

import { useCatalog } from "../module/catalog.context"

export const CatalogHeadingUi = ({ className }: { className?: string }) => {
    const {
        filteredProducts
    } = useCatalog()

    return (
        <div className={`${className} flex flex-col lg:flex-row lg:items-end justify-between gap-6 bg-white lg:p-8 md:p-6 sm:p-4 xs:p-3 rounded-3xl`}>
            <div>
                <span className="text-xs uppercase font-bold tracking-[0.3em] text-zinc-400 block mb-2">Collection 2026</span>
                <h1 className="text-5xl md:text-7xl font-black tracking-tight uppercase leading-none xs:text-xl sm:text-4xl">
                    ARCHITECTURAL<br />OBJECTS
                </h1>
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Results: <span className="text-black font-black">{filteredProducts.length} Variants</span>
            </div>
        </div>
    )
}