'use client'

import { AnimatePresence, motion } from "framer-motion";
import { useFavourites } from "../module/favorites.context";
import { springSmooth } from "@/lib/motion";
import { Heart, LayoutGrid, ShoppingCart, Trash2, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/entities/cart/module/cart.context";
import Link from "next/link";

export const FavouritesListUi = () => {
    const { favouriteItems, selectedIds, toggleSelect, toggleSelectAll, removeItem, removeSelected, loading } = useFavourites();
    const { addItem } = useCart();

    const isAllSelected = favouriteItems.length > 0 && selectedIds.length === favouriteItems.length;

    const handleAddToCart = (id: string) => {
        addItem(id);
        removeItem(id);
    };

    const handleAddSelectedToCart = () => {
        selectedIds.forEach(id => {
            addItem(id);
            removeItem(id);
        });
    };

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-white/60 rounded-3xl aspect-[3/4]" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <AnimatePresence>
                {favouriteItems.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={springSmooth}
                        className="flex items-center justify-between bg-white rounded-2xl px-5 py-3.5 border border-black/5"
                    >
                        {/* Select all */}
                        <button
                            onClick={toggleSelectAll}
                            className="flex items-center gap-2.5 group"
                        >
                            <div className={`w-4 h-4 rounded-md border-[1.5px] flex items-center justify-center transition-all ${
                                isAllSelected
                                    ? 'bg-[#111111] border-transparent'
                                    : 'border-zinc-300 group-hover:border-zinc-500'
                            }`}>
                                {isAllSelected && <Check size={9} strokeWidth={3} className="text-white" />}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-black transition-colors">
                                {isAllSelected ? 'Снять всё' : 'Выбрать все'}
                            </span>
                        </button>

                        {/* Bulk actions */}
                        <AnimatePresence>
                            {selectedIds.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={springSmooth}
                                    className="flex items-center gap-2"
                                >
                                    <span className="text-[10px] font-bold text-zinc-400 mr-1">
                                        {selectedIds.length} выбрано
                                    </span>
                                    <button
                                        onClick={handleAddSelectedToCart}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-[#111111] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition-colors"
                                    >
                                        <ShoppingBag size={12} />
                                        В корзину
                                    </button>
                                    <button
                                        onClick={removeSelected}
                                        className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-colors"
                                        aria-label="Удалить выбранные"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {favouriteItems.length > 0 ? (
                    <motion.div
                        layout
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
                    >
                        {favouriteItems.map((product) => {
                            const isChecked = selectedIds.includes(product.id);

                            return (
                                <motion.div
                                    layout
                                    key={product.id}
                                    initial={{ opacity: 0, scale: 0.97 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={springSmooth}
                                    className={`group bg-white rounded-3xl overflow-hidden border transition-all duration-300 ${
                                        isChecked ? 'border-[#111111]/20 shadow-[0_8px_30px_rgba(0,0,0,0.08)]' : 'border-black/5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]'
                                    }`}
                                >
                                    {/* Image */}
                                    <Link href={`/product/${product.slug || product.id}`} className="block">
                                        <div className="relative aspect-square bg-zinc-50 overflow-hidden">
                                            <img
                                                src={product.images?.[0]}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />

                                            {/* Checkbox overlay */}
                                            <button
                                                onClick={(e) => { e.preventDefault(); toggleSelect(product.id); }}
                                                className={`absolute top-3 left-3 w-7 h-7 rounded-xl flex items-center justify-center transition-all shadow-sm ${
                                                    isChecked
                                                        ? 'bg-[#111111] opacity-100'
                                                        : 'bg-white opacity-0 group-hover:opacity-100'
                                                }`}
                                            >
                                                <Check size={11} strokeWidth={3} className={isChecked ? 'text-white' : 'text-zinc-400'} />
                                            </button>

                                            {/* Remove button */}
                                            <button
                                                onClick={(e) => { e.preventDefault(); removeItem(product.id); }}
                                                className="absolute top-3 right-3 w-7 h-7 rounded-xl bg-white flex items-center justify-center text-red-400 hover:text-red-600 shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                                            >
                                                <Heart size={13} fill="currentColor" strokeWidth={0} />
                                            </button>

                                            {/* Sale badge */}
                                            {product.isOnSale && (
                                                <span className="absolute bottom-3 left-3 bg-[#111111] text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg">
                                                    -{product.discountPercent}%
                                                </span>
                                            )}
                                        </div>
                                    </Link>

                                    {/* Info */}
                                    <div className="p-4 space-y-3">
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">
                                                {product.category?.name}
                                            </p>
                                            <Link href={`/product/${product.slug || product.id}`}>
                                                <h4 className="text-sm font-bold tracking-tight text-zinc-900 line-clamp-2 leading-snug hover:text-zinc-600 transition-colors">
                                                    {product.name}
                                                </h4>
                                            </Link>
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t border-black/5">
                                            <span className="text-base font-black text-zinc-900 font-mono">
                                                {Number(product.price).toLocaleString('ru-RU')} ₽
                                            </span>
                                            <button
                                                onClick={() => handleAddToCart(product.id)}
                                                className="w-8 h-8 rounded-xl bg-[#111111] text-white flex items-center justify-center hover:bg-zinc-700 transition-colors active:scale-95"
                                                aria-label="В корзину"
                                            >
                                                <ShoppingCart size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                ) : (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={springSmooth}
                        className="flex flex-col items-center justify-center py-28 text-center"
                    >
                        <div className="w-16 h-16 rounded-3xl bg-white border border-black/5 flex items-center justify-center mb-6 shadow-sm">
                            <Heart size={22} className="text-zinc-300" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-lg font-black uppercase tracking-tight text-zinc-800 mb-1">
                            Пока пусто
                        </h3>
                        <p className="text-xs text-zinc-400 font-medium mb-8 max-w-xs">
                            Добавляйте понравившиеся товары, чтобы не потерять их
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2.5 bg-[#111111] text-white text-[10px] font-black uppercase tracking-widest px-6 py-3.5 rounded-xl hover:bg-zinc-800 transition-colors"
                        >
                            <LayoutGrid size={13} />
                            В каталог
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
