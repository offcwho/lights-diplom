'use client'

import { AnimatePresence, motion } from "framer-motion";
import { useFavourites } from "../module/favorites.context";
import { springSmooth } from "@/lib/motion";
import { Check, Heart, LayoutGrid, Plus } from "lucide-react";
import { useCart } from "@/entities/cart/module/cart.context";

export const FavouritesListUi = () => {
    const { favouriteItems, selectedIds, toggleSelect, removeItem } = useFavourites()
    const { addItem } = useCart();

    const handleAddToCart = (id: string) => {
        addItem(id);
        removeItem(id);
    }
    return (
        <main className="w-full pt-2">
            <AnimatePresence mode="wait">
                {favouriteItems.length > 0 ? (
                    <motion.div layout className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {favouriteItems.map((product) => {
                            const isChecked = selectedIds.includes(product.id);

                            return (
                                <motion.div
                                    layout
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                    transition={springSmooth}
                                    className={`bg-white rounded-3xl sm:rounded-4xl md:rounded-[36px] p-3 sm:p-4 md:p-5 flex flex-col justify-between shadow-[0_20px_40px_-15px_rgba(0,0,0,0.04)] border-2 transition-all duration-300 hover:shadow-[0_30px_50px_-10px_rgba(0,0,0,0.07)] hover:-translate-y-1.5 ${isChecked ? 'border-neutral-950/20' : 'border-transparent'}`}
                                >
                                    {/* Подложка под фото */}
                                    <div className="relative aspect-[1.1] bg-[#F4F3F8] rounded-2xl sm:rounded-[26px] flex items-center justify-center overflow-hidden p-4 sm:p-6">

                                        {/* Чекбокс выбора */}
                                        <button
                                            onClick={() => toggleSelect(product.id)}
                                            className={`absolute top-3 left-3 sm:top-4 sm:left-4 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-md transition-all active:scale-90 z-10 ${isChecked ? 'bg-neutral-950 text-white' : 'bg-white text-neutral-400 hover:text-neutral-900'}`}
                                        >
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isChecked ? 'border-transparent' : 'border-neutral-300'}`}>
                                                {isChecked && <Check size={10} strokeWidth={3} />}
                                            </div>
                                        </button>

                                        {/* Сердечко — удалить */}
                                        <button
                                            onClick={() => removeItem(product.id)}
                                            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white flex items-center justify-center text-red-500 shadow-md hover:scale-110 active:scale-90 transition-all"
                                        >
                                            <Heart size={15} fill="currentColor" strokeWidth={0} />
                                        </button>

                                        <div className="text-neutral-300 font-bold text-[10px] sm:text-xs tracking-widest text-center uppercase">
                                            [ Изображение ]
                                        </div>
                                    </div>

                                    {/* Инфо */}
                                    <div className="mt-3 sm:mt-4 px-1 sm:px-2 space-y-1">
                                        <p className="text-[10px] sm:text-[11px] font-extrabold text-neutral-300 uppercase tracking-widest truncate">
                                            {product.category.name}
                                        </p>
                                        <h4 className="text-base md:text-lg font-bold tracking-tight text-neutral-900 capitalize line-clamp-2 leading-snug">
                                            {product.name.toLowerCase()}
                                        </h4>
                                    </div>

                                    {/* Низ карточки: на мобиле — столбик, на sm+ — в ряд */}
                                    <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-neutral-100 px-1 sm:px-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <span className="text-lg sm:text-xl font-bold text-neutral-900 font-mono">
                                            ${product.price}
                                        </span>

                                        <button
                                            onClick={() => handleAddToCart(product.id)}
                                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-3 sm:py-3.5 rounded-full text-[11px] uppercase tracking-widest font-extrabold bg-[#92C348] text-white hover:bg-[#82B13F] shadow-[0_8px_25px_-5px_rgba(146,195,72,0.45)] transition-all active:scale-95"
                                        >
                                            <Plus size={14} strokeWidth={3} className="shrink-0" />
                                            <span>В корзину</span>
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                ) : (
                    /* Пустое состояние */
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[36px] py-24 text-center flex flex-col items-center justify-center p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.04)]"
                    >
                        <div className="w-16 h-16 bg-[#F4F3F8] text-neutral-300 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                            <Heart size={28} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold text-neutral-900 tracking-tight">В избранном пусто</h3>
                        <button className="mt-6 flex items-center gap-3 px-6 py-4 bg-neutral-950 text-white text-xs font-extrabold uppercase tracking-widest rounded-2xl shadow-lg">
                            <LayoutGrid size={14} />
                            <span>В каталог товаров</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    )
}