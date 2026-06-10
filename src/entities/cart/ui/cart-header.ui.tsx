'use client'

import { useCart } from "../module/cart.context";

export const CartHeaderUi = () => {
    const { items } = useCart();

    return (
        <div className="border-b border-black/10 pb-6 flex justify-between items-baseline">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase">
                Ваша корзина
            </h1>
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
                [{items.length} позиции]
            </span>
        </div>
    )
}