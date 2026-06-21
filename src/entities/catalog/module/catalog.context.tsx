'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { categoriesApi, productsApi } from "@/lib/api";
import type { Product as ApiProduct, Category } from "@/lib/types";

export type Product = {
    id: string | number;
    name: string;
    slug: string;
    category: Category;
    price: string | number;
    color: string;
    images: string[];
    lifestyleImg: string;
    desc: string;
    material: string;
    stock: number;
    attributes: { name: string; value: string }[];
};

function toProduct(product: ApiProduct): Product {
    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        category: product.category ?? "",
        price: product.price,
        color: product.color ?? "",
        images: product.images,
        lifestyleImg: product.images?.[0],
        desc: product.description ?? "",
        material: product.material ?? "",
        stock: product.stock,
        attributes: Array.isArray(product.attributes) ? product.attributes as { name: string; value: string }[] : [],
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
    inStockOnly: boolean;
    setInStockOnly: (v: boolean) => void;
    showMobileFilters: boolean;
    setShowMobileFilters: (v: boolean) => void;
    resetFilters: () => void;
    handleColorToggle: (v: string) => void;
    countByCategory: (categoryId: string) => React.ReactNode;

    isOpenFilters: boolean;
    setIsOpenFilters: (open: boolean) => void;

    loading: boolean;
    filteredProducts: Product[];

    favorites: (string | number)[];
    toggleFavorite: (id: string | number) => void;
    cart: Product[];
    addToCart: (item: Product) => void;
    openFilters: (open: boolean) => void;

    products: Product[] | undefined;
    categories: Category[] | undefined;
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
    const [inStockOnly, setInStockOnly] = useState(false);

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const [favorites, setFavorites] = useState<(string | number)[]>([]);
    const [cart, setCart] = useState<Product[]>([]);
    const [isOpenFilters, setIsOpenFilters] = useState(false);
    const [categories, setCategories] = useState<Category[]>();

    useEffect(() => {
        setLoading(true);
        categoriesApi.list()
            .then((data) => {
                // 1. Создаем копию массива, чтобы не мутировать исходные данные
                const shuffled = [...data];

                // 2. Перемешиваем массив
                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }

                // 3. Берем первые 3 категории из перемешанного списка
                const randomThree = shuffled.slice(0, 3);

                // 4. Всегда добавляем "all" в самое начало
                const finalCategories = [
                    { id: 'all', name: 'Все товары', slug: '' }, // Иконку подвяжем в самом UI
                    ...randomThree
                ];

                setCategories(finalCategories);
            })
            .catch(() => setCategories([{ id: 'all', name: 'Все товары', slug: '' }]))
            .finally(() => setLoading(false));
    }, []);

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
        setInStockOnly(false);
    };

    const countByCategory = (categoryId: string) =>
        categoryId === "all"
            ? products.length
            : products.filter((product) => product.category.id === categoryId).length;

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
                (product) =>
                    product.name.toLowerCase().includes(query) ||
                    product.desc.toLowerCase().includes(query) ||
                    product.material.toLowerCase().includes(query)
            );
        }

        if (selectedCategory !== "all") {
            result = result.filter((product) => product.category.id === selectedCategory);
        }
        if (selectedColors.length > 0) {
            result = result.filter((product) => selectedColors.includes(product.color));
        }
        result = result.filter((product) => Number(product.price) <= maxPrice);
        if (inStockOnly) result = result.filter((product) => product.stock > 0);

        if (sortBy === "price-asc") result.sort((a, b) => Number(a.price) - Number(b.price));
        if (sortBy === "price-desc") result.sort((a, b) => Number(b.price) - Number(a.price));

        return result;
    }, [products, searchQuery, selectedCategory, selectedColors, maxPrice, sortBy, inStockOnly]);

    const value: CatalogContextValue = {
        products,
        searchQuery, setSearchQuery,
        selectedCategory, setSelectedCategory,
        selectedMaterial, setSelectedMaterial,
        sortBy, setSortBy,
        inStockOnly, setInStockOnly,
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
        categories,
    };

    return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
};

export const useCatalog = () => {
    const ctx = useContext(CatalogContext);
    if (!ctx) throw new Error("useCatalog должен использоваться внутри <CatalogProvider>");
    return ctx;
};