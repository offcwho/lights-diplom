'use client'

import { createContext, useContext, useState } from "react";
import { INITIAL_FAVORITES, FavoriteItem } from "./favorites.data";

type FavoritesContextValue = {
    items: FavoriteItem[];
    setItems: (v: FavoriteItem[]) => void;
    addItem: (item: FavoriteItem) => void;
    removeItem: (id: string) => void;
    toggleItem: (item: FavoriteItem) => void;
    isFavorite: (id: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
    const [items, setItems] = useState<FavoriteItem[]>(INITIAL_FAVORITES);

    const addItem = (item: FavoriteItem) => {
        setItems(prev => (prev.some(i => i.id === item.id) ? prev : [...prev, item]));
    };

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    // Удобно для иконки-сердечка на карточке товара в каталоге
    const toggleItem = (item: FavoriteItem) => {
        setItems(prev =>
            prev.some(i => i.id === item.id)
                ? prev.filter(i => i.id !== item.id)
                : [...prev, item]
        );
    };

    const isFavorite = (id: string) => items.some(i => i.id === id);

    const value: FavoritesContextValue = {
        items,
        setItems,
        addItem,
        removeItem,
        toggleItem,
        isFavorite,
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};