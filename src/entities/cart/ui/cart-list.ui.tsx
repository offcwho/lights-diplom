'use client'

import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, Link, Minus, Plus, Trash2 } from "lucide-react"
import { useCart } from "../module/cart.context";
import { PageItem, PageStagger } from "@/components/Animations";

export const CartListUi = () => {
    const { items, updateQuantity, removeItem } = useCart();

    return (
        <div className="lg:col-span-7">
            <PageStagger className="space-y-2">
                <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                        <PageItem
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -60, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-6 border-b border-black/5 gap-6 bg-white/40 backdrop-blur-sm px-4 rounded-2xl"
                        >
                            {/* Инфо и превью */}
                            <div className="flex items-center space-x-6 flex-1">
                                <div className="w-20 h-24 bg-zinc-100 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                                        {item.category}
                                    </span>
                                    <h3 className="text-sm font-black uppercase tracking-tight text-zinc-900">
                                        {item.name}
                                    </h3>
                                    <p className="text-xs text-zinc-500 font-medium">
                                        {item.specs}
                                    </p>
                                </div>
                            </div>

                            {/* Интерактивный блок управления */}
                            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-8 md:gap-12">
                                {/* Счетчик количества (Стиль как на скрине, но чище) */}
                                <div className="flex items-center border border-black/10 rounded-xl bg-white p-1">
                                    <button
                                        onClick={() => updateQuantity(item.id, -1)}
                                        className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-black transition-colors rounded-lg hover:bg-zinc-100"
                                    >
                                        <Minus size={12} />
                                    </button>
                                    <span className="w-8 text-center text-xs font-mono font-black select-none">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => updateQuantity(item.id, 1)}
                                        className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-black transition-colors rounded-lg hover:bg-zinc-100"
                                    >
                                        <Plus size={12} />
                                    </button>
                                </div>

                                {/* Цена */}
                                <div className="text-right min-w-[70px]">
                                    <span className="text-xs font-mono font-black text-zinc-900">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </span>
                                </div>

                                {/* Кнопка удаления */}
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-zinc-300 hover:text-red-500 transition-colors p-1"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </PageItem>
                    ))}

                </AnimatePresence>
            </PageStagger>
            {/* Если корзина пуста */}
            {
                items.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-16 text-center space-y-4"
                    >
                        <p className="text-sm font-bold uppercase tracking-wider text-zinc-400">Корзина пуста</p>
                        <Link href="/catalog" className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-zinc-600 hover:border-zinc-600 transition-colors">
                            <ArrowLeft size={12} /> <span>В каталог</span>
                        </Link>
                    </motion.div>
                )
            }
        </div >
    )
}