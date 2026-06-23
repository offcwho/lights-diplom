'use client'

import { createContext, useContext, useEffect, useState } from "react";
import { cartApi, authApi } from "@/lib/api";
import type { Cart as ApiCart, Product } from "@/lib/types";
import { useAuth } from "@/hooks/AuthContext";
import { toast } from "sonner";

export type CartItem = {
    id: string;          // id товара (совпадает с product.id из каталога)
    cartItemId: string;  // id строки корзины на бэке — нужен для update/remove
    name: string;
    price: number;
    category: string;
    images: string;
    color: string;
    quantity: number;
};

// ответ API -> твои items
function toCartItems(cart: ApiCart): CartItem[] {
    return cart.items.map((i) => ({
        id: i.productId,
        cartItemId: i.id,
        name: i.product.name,
        category: i.product.category.name,
        price: i.product.price,
        images: i.product.images?.[0],
        color: i.product.color ?? "",
        quantity: i.quantity,
    }));
}

type CartContextValue = {
    items: CartItem[];
    coupon: string;
    setCoupon: (v: string) => void;
    addItem: (id: string | number) => Promise<void>;
    updateQuantity: (id: string, delta: number) => Promise<void>;
    removeItem: (id: string) => Promise<void>;
    clear: () => Promise<void>;
    refresh: () => Promise<void>;
    loading: boolean;
    subtotal: number;
    total: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [coupon, setCoupon] = useState('');
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const refresh = async () => {
        if (!authApi.isAuthenticated()) { setItems([]); return; }
        try {
            const cart = await cartApi.get();
            setItems(toCartItems(cart));
        } catch { /* 401 и т.п. — оставляем пустую корзину */ }
    };

    useEffect(() => {
        refresh().finally(() => setLoading(false));
    }, [user]);

    // Добавить товар (бэк сам делает +1, если уже есть)
    const addItem = async (id: string | number) => {
        if (!authApi.isAuthenticated()) {
            toast.error('Войдите, чтобы добавлять товары в корзину');
            return;
        }
        try {
            const cart = await cartApi.add(String(id), 1);
            setItems(toCartItems(cart));
            toast.success('Товар добавлен в корзину');
        } catch { toast.error('Не удалось добавить товар'); }
    };

    // delta (+1 / -1) переводим в абсолютное количество для бэка
    const updateQuantity = async (id: string, delta: number) => {
        const current = items.find((i) => i.id === id);
        if (!current) return;
        const newQty = current.quantity + delta;
        if (newQty < 1) { await removeItem(id); return; }
        try {
            const cart = await cartApi.updateItem(current.cartItemId, newQty);
            setItems(toCartItems(cart));
        } catch { /* ignore */ }
    };

    const removeItem = async (id: string) => {
        const current = items.find((i) => i.id === id);
        if (!current) return;
        try {
            const cart = await cartApi.removeItem(current.cartItemId);
            setItems(toCartItems(cart));
            toast.success('Товар удалён из корзины');
        } catch { /* ignore */ }
    };

    const clear = async () => {
        try {
            const cart = await cartApi.clear();
            setItems(toCartItems(cart));
        } catch { /* ignore */ }
    };

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = 0;
    const total = subtotal + shipping;

    const value: CartContextValue = {
        items,
        coupon,
        setCoupon,
        addItem,
        updateQuantity,
        removeItem,
        clear,
        refresh,
        loading,
        subtotal,
        total,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};