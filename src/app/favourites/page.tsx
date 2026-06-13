'use client'

import { AnimatePresence, motion } from "framer-motion"
import { Heart, ShoppingBag, Trash2, Check, ArrowLeft, Link } from "lucide-react"
import { useState } from "react"
import { PageItem, PageStagger } from "@/components/Animations";
import { useCart } from "@/entities/cart/module/cart.context";
import { useFavorites } from "@/entities/favorites";
import { useHeaderHeight } from "@/hooks/useHeaderHeight";
import { Container } from "@/components/Container";

type ItemId = string | number;

// Чекбокс-оверлей для карточки (розовый акцент)
const CardCheckbox = ({ checked }: { checked: boolean }) => (
    <span
        className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-200 flex-shrink-0 backdrop-blur-md
            ${checked
                ? "bg-rose-500 border-rose-500 shadow-lg shadow-rose-500/30"
                : "bg-white/70 border-black/10 hover:border-rose-400"}`}
    >
        {checked && <Check size={13} className="text-white" strokeWidth={3} />}
    </span>
)

export default function FavouritesPage() {
    const { items, removeItem } = useFavorites();
    const { addItem } = useCart(); // если у тебя другой метод — поменяй вызов ниже
    const { mobileNavHeight } = useHeaderHeight();

    const [selected, setSelected] = useState<Set<ItemId>>(new Set());

    const allSelected = items.length > 0 && selected.size === items.length;

    const toggleItem = (id: ItemId) => {
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
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

    const moveSelectedToCart = () => {
        items
            .filter((i) => selected.has(i.id))
            .forEach((i) => {
                addItem(i);     // подгони под свою сигнатуру addItem
                removeItem(i.id);
            });
        setSelected(new Set());
    };

    return (
        <div className="w-full">
            <Container>
                {/* Заголовок секции */}
                <div className="flex items-end justify-between mb-8 px-1">
                    <div className="flex items-center gap-3">
                        <Heart size={20} className="text-rose-500 fill-rose-500" />
                        <h2 className="text-lg font-black uppercase tracking-tight text-zinc-900">
                            Избранное
                        </h2>
                        <span className="text-[10px] font-mono font-bold text-zinc-400 mb-1">
                            ({items.length})
                        </span>
                    </div>

                    {items.length > 0 && (
                        <button
                            onClick={toggleAll}
                            className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 hover:text-rose-500 transition-colors"
                        >
                            {allSelected ? "Снять всё" : "Выбрать всё"}
                        </button>
                    )}
                </div>

                {/* Плавающая панель массовых действий */}
                <AnimatePresence>
                    {selected.size > 0 && (
                        <motion.div
                            key="bulk-bar"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            className="fixed left-4 right-4 sm:left-1/2 sm:right-auto bottom-0 sm:-translate-x-1/2 sm:w-auto z-50 flex items-center justify-between sm:justify-center gap-2 bg-zinc-900 text-white px-3 py-2 rounded-2xl shadow-2xl shadow-black/30"
                    
                        >
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-1 sm:px-2 text-zinc-400 whitespace-nowrap">
                                Выбрано: {selected.size}
                            </span>

                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                    onClick={moveSelectedToCart}
                                    className="flex items-center justify-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-white text-zinc-900 hover:bg-rose-500 hover:text-white px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap"
                                >
                                    <ShoppingBag size={12} />
                                    <span>В корзину</span>
                                </button>
                                <button
                                    onClick={removeSelected}
                                    aria-label="Удалить выбранное"
                                    className="flex items-center justify-center text-rose-400 hover:text-white hover:bg-rose-500 p-1.5 rounded-xl transition-colors flex-shrink-0"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Сетка карточек */}
                <PageStagger className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    <AnimatePresence mode="popLayout">
                        {items.map((item) => {
                            const isSelected = selected.has(item.id);

                            return (
                                <PageItem
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.85, y: 20 }}
                                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                    onClick={() => toggleItem(item.id)}
                                    className={`group relative cursor-pointer rounded-3xl overflow-hidden border transition-all duration-200
                                    ${isSelected
                                            ? "border-rose-500 ring-2 ring-rose-500/30 bg-rose-50/40"
                                            : "border-black/5 bg-white/40 hover:border-black/10 backdrop-blur-sm"}`}
                                >
                                    {/* Чекбокс-оверлей */}
                                    <div className="absolute top-3 left-3 z-10">
                                        <CardCheckbox checked={isSelected} />
                                    </div>

                                    {/* Быстрое удаление (по ховеру) */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeItem(item.id);
                                        }}
                                        className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-md text-zinc-400 hover:text-rose-500 hover:bg-white opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Heart size={14} className="fill-rose-500 text-rose-500" />
                                    </button>

                                    {/* Картинка */}
                                    <div className="aspect-[3/4] bg-zinc-100 overflow-hidden">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>

                                    {/* Инфо */}
                                    <div className="p-4 space-y-1">
                                        <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                                            {item.category}
                                        </span>
                                        <h3 className="text-sm font-black uppercase tracking-tight text-zinc-900 truncate">
                                            {item.name}
                                        </h3>
                                        <div className="flex items-center justify-between pt-1">
                                            <span className="text-xs font-mono font-black text-zinc-900">
                                                ${item.price.toFixed(2)}
                                            </span>
                                            <span className="text-[10px] text-zinc-400 font-medium truncate max-w-[60%]">
                                                {item.specs}
                                            </span>
                                        </div>
                                    </div>
                                </PageItem>
                            )
                        })}
                    </AnimatePresence>
                </PageStagger>

                {/* Пусто */}
                {items.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-24 text-center space-y-4"
                    >
                        <Heart size={32} className="mx-auto text-zinc-200" />
                        <p className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                            В избранном пусто
                        </p>
                        <Link href="/catalog" className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-widest border-b-2 border-rose-500 text-rose-500 pb-1 hover:text-rose-600 hover:border-rose-600 transition-colors">
                            <ArrowLeft size={12} /> <span>В каталог</span>
                        </Link>
                    </motion.div>
                )}
            </Container>
        </div>
    )
}