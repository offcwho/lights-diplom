'use client'

import { AnimatePresence, motion } from "framer-motion"
import { useFavourites } from "../module/favorites.context"
import { Check, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/entities/cart/module/cart.context";

export const FavouritesPanelUi = () => {
    const { favouriteItems, toggleSelectAll, selectedIds, removeSelected, removeItem } = useFavourites()
    const { addItem } = useCart()

    const isAllSelected = favouriteItems.length > 0 && selectedIds.length === favouriteItems.length;

    return (
        <AnimatePresence>
            {favouriteItems.length > 0 && (
                <div className="bg-white rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.03)]">

                    {/* Чекбокс "Выбрать все" */}
                    <div className="flex xs:w-full md:w-auto justify-between gap-6">
                        <button
                            onClick={toggleSelectAll}
                            className="flex items-center gap-3 py-2 hover:bg-neutral-50 rounded-xl transition-colors w-full sm:w-auto"
                        >
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${isAllSelected
                                ? 'bg-neutral-950 border-transparent text-white'
                                : 'border-neutral-300 bg-neutral-50'
                                }`}>
                                {isAllSelected && <Check size={14} strokeWidth={3} />}
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                                {isAllSelected ? 'Снять выделение' : 'Выбрать все'}
                            </span>
                        </button>
                        <AnimatePresence>
                            {selectedIds.length > 0 && (
                                <button
                                    onClick={removeSelected}
                                    className="p-3 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-colors"
                                    title="Удалить выбранные"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Контекстные кнопки (Появляются плавно, когда выбран хотя бы 1 товар) */}
                    <AnimatePresence>
                        {selectedIds.length > 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 5 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 5 }}
                                className="flex items-center xs:flex-col md:flex-row gap-3 w-full sm:w-auto justify-end"
                            >
                                <div className="flex w-full justify-between items-center gap-6">
                                    <h4 className="text-xs font-mono font-bold text-neutral-400 mr-2 h-fit w-full">
                                        Выбрано: {selectedIds.length}
                                    </h4>

                                    <button
                                        onClick={() => selectedIds.map((id) => {
                                            addItem(id)
                                            removeItem(id)
                                        })}
                                        className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs uppercase tracking-widest font-extrabold bg-neutral-950 text-white hover:bg-neutral-900 shadow-[0_8px_20px_-4px_rgba(146,195,72,0.3)] transition-all active:scale-95"
                                    >
                                        <ShoppingBag size={14} className="stroke-[2.5]" />
                                        <span className="w-full">В корзину</span>
                                    </button>

                                    {/* Удалить выбранные */}


                                </div>
                                {/* Добавить выбранные в корзину */}
                            </motion.div>
                        ) : (
                            <span className="hidden sm:block text-xs font-semibold text-neutral-300 pr-4 uppercase tracking-wider">
                                Выберите товары для массовых действий
                            </span>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </AnimatePresence>
    )
}