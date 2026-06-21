'use client';

import type { Product } from '@/lib/types';
import { useCart } from '@/entities/cart/module/cart.context';
import { useFavourites } from '@/entities/favorites';
import Link from 'next/link';
import { ShoppingBag, Heart, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const FALLBACK = 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600&auto=format&fit=crop';

export const ProductRelatedUi = ({ products }: { products: Product[] }) => {
    const { addItem, items } = useCart();
    const { toggleItem, favouriteItems } = useFavourites();

    if (products.length === 0) return null;

    return (
        <section className="py-16 border-t border-black/8">
            <div className="mb-8">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-1">Смотрите также</p>
                <h2 className="text-3xl font-black uppercase tracking-tight">Похожие товары</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.map(p => {
                    const cartItem = items.find(i => i.id === p.id);
                    const isFav = favouriteItems.some(i => i.id === p.id);
                    const img = p.images[0] ?? FALLBACK;
                    const hasDiscount = p.isOnSale && p.discountPercent > 0;
                    const price = hasDiscount ? p.price * (1 - p.discountPercent / 100) : p.price;

                    return (
                        <div
                            key={p.id}
                            className="group bg-white rounded-3xl border border-black/5 overflow-hidden flex flex-col"
                        >
                            <Link href={`/product/${p.slug || p.id}`} className="block relative overflow-hidden aspect-square bg-zinc-100">
                                <img
                                    src={img}
                                    alt={p.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {hasDiscount && (
                                    <span className="absolute top-3 left-3 text-[9px] font-black tracking-widest text-white bg-black px-2.5 py-1 rounded-full uppercase">
                                        −{p.discountPercent}%
                                    </span>
                                )}
                                <motion.button
                                    whileTap={{ scale: 0.85 }}
                                    onClick={e => { e.preventDefault(); toggleItem(p.id); }}
                                    aria-label="В избранное"
                                    className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${isFav ? 'text-black' : 'text-zinc-400'}`}
                                >
                                    <Heart size={13} fill={isFav ? 'currentColor' : 'none'} />
                                </motion.button>
                            </Link>

                            <div className="p-4 flex flex-col gap-3 flex-1">
                                <Link href={`/product/${p.slug || p.id}`} className="block flex-1">
                                    {p.category && (
                                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                                            {p.category.name}
                                        </span>
                                    )}
                                    <h3 className="text-xs font-black uppercase tracking-tight truncate mt-0.5">{p.name}</h3>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <span className="text-sm font-black">${price.toFixed(0)}.00</span>
                                        {hasDiscount && (
                                            <span className="text-xs text-zinc-400 line-through">${p.price.toFixed(0)}.00</span>
                                        )}
                                    </div>
                                </Link>

                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => addItem(p.id)}
                                    className={`w-full py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors ${
                                        cartItem
                                            ? 'bg-zinc-900 text-white'
                                            : 'bg-zinc-100 text-zinc-600 hover:bg-black hover:text-white'
                                    }`}
                                >
                                    {cartItem ? <Check size={11} /> : <ShoppingBag size={11} />}
                                    {cartItem ? 'В корзине' : 'В корзину'}
                                </motion.button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
