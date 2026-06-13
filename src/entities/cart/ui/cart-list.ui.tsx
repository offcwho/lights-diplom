'use client'

import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, Link, Minus, Plus, Trash2, Check } from "lucide-react"
import { useState } from "react"
import { useCart } from "../module/cart.context";
import { PageItem, PageStagger } from "@/components/Animations";

// Тип id товара — поправь под свой (если id строго string или number, оставь только нужный)
type ItemId = string | number;

// Чекбокс в стиле проекта
const Checkbox = ({ checked, indeterminate = false }: { checked: boolean; indeterminate?: boolean }) => (
    <span
        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 flex-shrink-0
            ${checked || indeterminate
                ? "bg-black border-black"
                : "bg-white border-black/20 hover:border-black/50"}`}
    >
        {checked && <Check size={12} className="text-white" strokeWidth={3} />}
        {!checked && indeterminate && <Minus size={12} className="text-white" strokeWidth={3} />}
    </span>
)

export const CartListUi = () => {
    const { items, updateQuantity, removeItem } = useCart();

    // Множество id выбранных товаров
    const [selected, setSelected] = useState<Set<ItemId>>(new Set());

    const allSelected = items.length > 0 && selected.size === items.length;
    const someSelected = selected.size > 0 && !allSelected;

    const toggleItem = (id: ItemId) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const toggleAll = () => {
        setSelected(allSelected ? new Set() : new Set(items.map((i) => i.id)));
    };

    const removeSelected = () => {
        selected.forEach((id) => removeItem(String(id)));
        setSelected(new Set());
    };

    return (
        <div className="lg:col-span-7">
            {/* Панель управления: выбрать всё + массовое удаление */}
            {items.length > 0 && (
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={toggleAll}
                        className="flex items-center gap-3 group"
                    >
                        <Checkbox checked={allSelected} indeterminate={someSelected} />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 group-hover:text-zinc-900 transition-colors">
                            {allSelected ? "Снять выделение" : "Выбрать всё"}
                        </span>
                    </button>

                    <AnimatePresence>
                        {selected.size > 0 && (
                            <motion.button
                                key="bulk-delete"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                                onClick={removeSelected}
                                className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-red-500 hover:text-white hover:bg-red-500 border border-red-500/40 hover:border-red-500 px-3 py-1.5 rounded-xl transition-colors"
                            >
                                <Trash2 size={12} />
                                <span>Удалить ({selected.size})</span>
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            )}

            <PageStagger className="space-y-2">
                <AnimatePresence mode="popLayout">
                    {items.map((item) => {
                        const isSelected = selected.has(item.id);

                        return (
                            <PageItem
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -60, scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between py-6 border-b border-black/5 gap-6 backdrop-blur-sm px-4 rounded-2xl transition-all duration-200
                                    ${isSelected ? "bg-white/70 ring-2 ring-black/80" : "bg-white/30 ring-2 ring-transparent"}`}
                            >
                                {/* Чекбокс + инфо и превью */}
                                <div className="flex items-center space-x-4 sm:space-x-6 flex-1">
                                    {/* Чекбокс выбора товара */}
                                    <button
                                        onClick={() => toggleItem(item.id)}
                                        className="flex-shrink-0"
                                        aria-label="Выбрать товар"
                                    >
                                        <Checkbox checked={isSelected} />
                                    </button>

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
                                    {/* Счетчик количества */}
                                    <div className="flex items-center border border-black/10 rounded-xl p-1">
                                        <button
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:bg-black transition-colors rounded-lg hover:text-zinc-100"
                                        >
                                            <Minus size={12} />
                                        </button>
                                        <span className="w-8 text-center text-xs font-mono font-black select-none">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-zinc-100 transition-colors rounded-lg hover:bg-black"
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
                        )
                    })}
                </AnimatePresence>
            </PageStagger>

            {/* Если корзина пуста */}
            {items.length === 0 && (
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
            )}
        </div>
    )
}