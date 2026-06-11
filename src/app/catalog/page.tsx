'use client'


import { Catalog } from "@/entities/catalog";
import { CatalogProvider } from "@/entities/catalog/module/catalog.context";

export default function CatalogPage() {
    return (
        <CatalogProvider>
            <Catalog />
        </CatalogProvider>
    )
}