'use client'

import { createContext, useContext, useState } from "react";
import { INITIAL_ITEMS } from "./cart.data";

type CartContextValue = {
    items: typeof INITIAL_ITEMS;
    setItems: (v: typeof INITIAL_ITEMS) => void;
    coupon: string;
    setCoupon: (v: string) => void;
    updateQuantity: (id: string, delta: number) => void;
    removeItem: (id: string) => void;
    subtotal: number;
    total: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [items, setItems] = useState(INITIAL_ITEMS);
    const [coupon, setCoupon] = useState('');

    const updateQuantity = (id: string, delta: number) => {
        setItems(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : item;
            }
            return item;
        }));
    };

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 0 : 0;
    const total = subtotal + shipping;

    const value: CartContextValue = {
        items,
        setItems,
        coupon,
        setCoupon,
        updateQuantity,
        removeItem,
        subtotal,
        total
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
