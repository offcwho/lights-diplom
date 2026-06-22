'use client'

import { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/lib/types";
import { favouritesApi } from "@/lib/api"; // Путь к твоему файлу API
import { toast } from "sonner";

type FavouritesContextValue = {
    favouriteItems: Product[];
    setFavouriteItems: (v: Product[]) => void;
    addItemFavourite: (id: string) => Promise<void>;
    removeItem: (id: string) => Promise<void>;
    toggleItem: (id: string) => Promise<void>;
    isFavourite: (id: string) => boolean;
    loading: boolean;
    
    // Массовый выбор
    selectedIds: string[];
    toggleSelect: (id: string) => void;
    toggleSelectAll: () => void;
    removeSelected: () => Promise<void>;
    clearSelection: () => void;
};

const FavouritesContext = createContext<FavouritesContextValue | undefined>(undefined);

export const FavouritesProvider = ({ children }: { children: React.ReactNode }) => {
    // Начинаем с пустого массива, так как данные полетят с сервера
    const [favouriteItems, setFavouriteItems] = useState<Product[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // 1. ПЕРВИЧНАЯ ЗАГРУЗКА СПИСКА С СЕРВЕРА
    useEffect(() => {
        setLoading(true);
        favouritesApi.list()
            .then((data) => setFavouriteItems(data))
            .catch((err) => console.error("Ошибка загрузки избранного:", err))
            .finally(() => setLoading(false));
    }, []);

    // 2. ИНТЕГРАЦИЯ МЕТОДОВ С API
    const addItemFavourite = async (id: string) => {
        try {
            const updatedItems = await favouritesApi.add(id);
            setFavouriteItems(updatedItems);
            toast.success('Добавлено в избранное');
        } catch {
            toast.error('Не удалось добавить в избранное');
        }
    };

    const removeItem = async (id: string) => {
        try {
            const updatedItems = await favouritesApi.remove(id);
            setFavouriteItems(updatedItems);
            setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
            toast.success('Удалено из избранного');
        } catch {
            toast.error('Не удалось удалить из избранного');
        }
    };

    const toggleItem = async (id: string) => {
        const exists = favouriteItems.some(i => i.id === id);
        if (exists) {
            await removeItem(id);
        } else {
            await addItemFavourite(id);
        }
    };

    const isFavourite = (id: string) => favouriteItems.some(i => i.id === id);

    // --- МАССОВЫЙ ВЫБОР И УДАЛЕНИЕ ---

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (favouriteItems.length > 0 && selectedIds.length === favouriteItems.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(favouriteItems.map(item => item.id));
        }
    };

    // Массовое удаление через Promise.all (так как на бэке нет эндпоинта массового удаления)
    const removeSelected = async () => {
        try {
            setLoading(true);
            // Запускаем параллельно запросы на удаление всех выбранных id
            await Promise.all(selectedIds.map(id => favouritesApi.remove(id)));
            
            // После успешного удаления всех, делаем один чистый запрос за актуальным списком
            const freshItems = await favouritesApi.list();
            setFavouriteItems(freshItems);
            setSelectedIds([]); // Очищаем чекбоксы
        } catch (err) {
            console.error("Ошибка при массовом удалении:", err);
        } finally {
            setLoading(false);
        }
    };

    const clearSelection = () => {
        setSelectedIds([]);
    };

    const value: FavouritesContextValue = {
        favouriteItems,
        setFavouriteItems,
        addItemFavourite,
        removeItem,
        toggleItem,
        isFavourite,
        loading,
        selectedIds,
        toggleSelect,
        toggleSelectAll,
        removeSelected,
        clearSelection
    };

    return (
        <FavouritesContext.Provider value={value}>
            {children}
        </FavouritesContext.Provider>
    );
};

export const useFavourites = () => {
    const context = useContext(FavouritesContext);
    if (!context) {
        throw new Error('useFavourites must be used within a FavouritesProvider');
    }
    return context;
};