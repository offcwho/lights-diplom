import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { INITIAL_PRODUCTS } from "../module/catalog.data";

type Product = {
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

type CatalogContextValue = {
    // фильтры
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
    resetFilters: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    handleColorToggle: (v: string) => void;


    // результат
    filteredProducts: Product[];

    // избранное и корзина
    favorites: (string | number)[];
    toggleFavorite: (id: string | number) => void;
    cart: Product[];
    addToCart: (item: Product) => void;
};

const PRODUCTS_DATA = [
    { id: 1, name: "YDV LOUNGE CHAIR", price: 1000, category: "chairs", color: "grey", img: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=600&auto=format&fit=crop", lifestyleImg: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800", desc: "Премиальное кресло с глубокой посадкой и выразительной фактурной простежкой силуэта.", material: "Шерсть / Матовый черный металл" },
    { id: 2, name: "JASPER CEMENT LAMP", price: 650, category: "lighting", color: "grey", img: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=600&auto=format&fit=crop", lifestyleImg: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800", desc: "Архитектурный подвесной купол из мелкозернистого монолитного бетона марки M500.", material: "Бетон / Шлифованная латунь" },
    { id: 3, name: "YUN MINIMAL CHAIR", price: 1000, category: "chairs", color: "green", img: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=600&auto=format&fit=crop", lifestyleImg: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800", desc: "Минималистичный стул из массива дуба со сложной геометрией ножек и оливковой обивкой.", material: "Массив дуба / Текстиль букле" },
    { id: 4, name: "TICK INDUSTRIAL BLACK", price: 1000, category: "armchairs", color: "black", img: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=600&auto=format&fit=crop", lifestyleImg: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800", desc: "Строгое кресло в стиле функционального брутализма. Идеальный баланс металла и кожи.", material: "Натуральная кожа / Вороненая сталь" },
    { id: 5, name: "STRT IVORY SPHERE", price: 1000, category: "chairs", color: "white", img: "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?q=80&w=600&auto=format&fit=crop", lifestyleImg: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=800", desc: "Авангардная мебельная форма с мягким скругленным основанием оттенка слоновой кости.", material: "Эко-мех Shearling / Ясень" },
    { id: 6, name: "RAW CONCRETE MONOLITH", price: 1200, category: "lighting", color: "grey", img: "https://images.unsplash.com/photo-1543242594-c8bae8b9e728?q=80&w=600&auto=format&fit=crop", lifestyleImg: "https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?q=80&w=800", desc: "Напольный световой объект, высеченный из архитектурного камня с направленным конусным лучом.", material: "Фибробетон / LED COB матрица" },
];

const CatalogContext = createContext<CatalogContextValue | null>(null);

export const CatalogProvider = ({ children }: { children: ReactNode }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedMaterial, setSelectedMaterial] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("default");
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [maxPrice, setMaxPrice] = useState<number>(1500);

    const [favorites, setFavorites] = useState<(string | number)[]>([]);
    const [cart, setCart] = useState<Product[]>([]);

    const toggleFavorite = (id: string | number) => {
        setFavorites(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
    };

    const addToCart = (item: Product) => {
        setCart(prev => [...prev, item]);
    };

    const resetFilters = () => {
        setSelectedCategory("all");
        setSelectedColors([]);
        setMaxPrice(1500);
    };

    const handleColorToggle = (colorId: string) => {
        setSelectedColors(prev =>
            prev.includes(colorId) ? prev.filter(c => c !== colorId) : [...prev, colorId]
        );
    };

    const filteredProducts = useMemo(() => {
        let result = [...PRODUCTS_DATA];

        if (selectedCategory !== "all") {
            result = result.filter(p => p.category === selectedCategory);
        }
        if (selectedColors.length > 0) {
            result = result.filter(p => selectedColors.includes(p.color));
        }
        result = result.filter(p => p.price <= maxPrice);

        if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
        if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);

        return result;
    }, [selectedCategory, selectedColors, maxPrice, sortBy]);

    const value: CatalogContextValue = {
        searchQuery, setSearchQuery,
        selectedCategory, setSelectedCategory,
        selectedMaterial, setSelectedMaterial,
        sortBy, setSortBy,
        showMobileFilters, setShowMobileFilters,
        filteredProducts,
        favorites, toggleFavorite,
        selectedColors, setSelectedColors,
        maxPrice, setMaxPrice,
        cart, addToCart,
        resetFilters,
        handleColorToggle,
    };

    return (
        <CatalogContext.Provider value={value}>
            {children}
        </CatalogContext.Provider>
    );
};

export const useCatalog = () => {
    const ctx = useContext(CatalogContext);
    if (!ctx) {
        throw new Error("useCatalog должен использоваться внутри <CatalogProvider>");
    }
    return ctx;
};