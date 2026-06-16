'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { productsApi } from "@/lib/api";
import type { Product as ApiProduct } from "@/lib/types";

export type Product = {
    id: string | number;
    name: string;
    category: string;
    price: string | number;
    color: string;
    img: string;
    lifestyleImg: string;
    desc: string;
    material: string;
};

function toProduct(product: ApiProduct): Product {
    return {
        id: product.id,
        name: product.name,
        category: product.category?.slug ?? "",
        price: product.price,
        color: product.color ?? "",
        img: product.imageUrl,
        lifestyleImg: product.images?.[0] ?? product.imageUrl,
        desc: product.description ?? "",
        material: product.material ?? "",
    };
}

type CatalogContextValue = {
    searchQuery: string;
    setSearchQuery: (v: string) => void;
    selectedCategory: string;
    setSelectedCategory: (v: string) => void;
    selectedColors: string[];
    setSelectedColors: (v: string[]) => void;
    maxPrice: number;
    setMaxPrice: (v: number) => void;
    selectedMaterial: string;
    setSelectedMaterial: (v: string) => void;
    sortBy: string;
    setSortBy: (v: string) => void;
    showMobileFilters: boolean;
    setShowMobileFilters: (v: boolean) => void;
    resetFilters: () => void;
    handleColorToggle: (v: string) => void;
    countByCategory: (categoryId: string) => React.ReactNode;

    isOpenFilters: boolean;
    setIsOpenFilters: (open: boolean) => void;
    openFilters: (open: boolean) => void;

    loading: boolean;
    filteredProducts: Product[];

    favorites: (string | number)[];
    toggleFavorite: (id: string | number) => void;
    cart: Product[];
    addToCart: (item: Product) => void;
};

const CatalogContext = createContext<CatalogContextValue | null>(null);

export const CatalogProvider = ({ children }: { children: ReactNode }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedMaterial, setSelectedMaterial] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("default");
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [maxPrice, setMaxPrice] = useState<number>(1500);

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const [favorites, setFavorites] = useState<(string | number)[]>([]);
    const [cart, setCart] = useState<Product[]>([]);
    const [isOpenFilters, setIsOpenFilters] = useState(false);

    useEffect(() => {
        productsApi
            .list({ limit: 100 })
            .then((data) => setProducts(data.items.map(toProduct)))
            .catch(() => setProducts([]))
            .finally(() => setLoading(false));
    }, []);

    const toggleFavorite = (id: string | number) => {
        setFavorites((prev) =>
            prev.includes(id) ? prev.filter((product) => product !== id) : [...prev, id]
        );
    };

    const openFilters = (open: boolean) => {
        setIsOpenFilters(open);
    }

    const addToCart = (item: Product) => {
        setCart((prev) => [...prev, item]);
    };

    const resetFilters = () => {
        setSearchQuery("");
        setSelectedCategory("all");
        setSelectedColors([]);
        setMaxPrice(1500);
    };

    const countByCategory = (categoryId: string) =>
        categoryId === "all"
            ? products.length
            : products.filter((product) => product.category === categoryId).length;

    const handleColorToggle = (colorId: string) => {
        setSelectedColors((prev) =>
            prev.includes(colorId) ? prev.filter((c) => c !== colorId) : [...prev, colorId]
        );
    };

    const filteredProducts = useMemo(() => {
        let result = [...products];

        const query = searchQuery.trim().toLowerCase();
        if (query) {
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(query) ||
                    p.desc.toLowerCase().includes(query) ||
                    p.material.toLowerCase().includes(query)
            );
        }

        if (selectedCategory !== "all") {
            result = result.filter((p) => p.category === selectedCategory);
        }
        if (selectedColors.length > 0) {
            result = result.filter((p) => selectedColors.includes(p.color));
        }
        result = result.filter((p) => Number(p.price) <= maxPrice);

        if (sortBy === "price-asc") result.sort((a, b) => Number(a.price) - Number(b.price));
        if (sortBy === "price-desc") result.sort((a, b) => Number(b.price) - Number(a.price));

        return result;
    }, [products, searchQuery, selectedCategory, selectedColors, maxPrice, sortBy]);

    const value: CatalogContextValue = {
        searchQuery, setSearchQuery,
        selectedCategory, setSelectedCategory,
        selectedMaterial, setSelectedMaterial,
        sortBy, setSortBy,
        showMobileFilters, setShowMobileFilters,
        loading,
        filteredProducts,
        favorites, toggleFavorite,
        selectedColors, setSelectedColors,
        maxPrice, setMaxPrice,
        cart, addToCart,
        resetFilters,
        handleColorToggle,
        countByCategory,
        isOpenFilters,
        setIsOpenFilters,
        openFilters,
    };

    return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
};

export const useCatalog = () => {
    const ctx = useContext(CatalogContext);
    if (!ctx) throw new Error("useCatalog должен использоваться внутри <CatalogProvider>");
    return ctx;
};