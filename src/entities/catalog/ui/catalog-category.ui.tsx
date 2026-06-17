import React from "react";
import { Armchair, Lamp, Sofa, LayoutGrid, HelpCircle } from "lucide-react";
import { springSmooth } from "@/lib/motion";
import { useCatalog } from "../module/catalog.context";
import { motion } from "framer-motion";

// Карта иконок: связываем id из базы данных с визуальными компонентами
const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
    all: LayoutGrid,
    chairs: Armchair,
    armchairs: Sofa,
    lighting: Lamp,
    // Добавь сюда другие возможные id с бэкенда, например:
    // tables: Table,
    // beds: Bed
};

export const CategoryRowUi = () => {
    // Достаем categories из контекста (теперь они уже перемешаны правильно)
    const { selectedCategory, setSelectedCategory, countByCategory, categories, loading } = useCatalog();

    // Пока данные грузятся, можно вернуть заглушку или скелетон
    if (loading) return <div className="h-20 animate-pulse bg-white/50 rounded-3xl" />;

    return (
        <div className="gap-3 overflow-x-auto -mx-4 px-4
                        lg:grid lg:grid-cols-4 xs:grid-cols-2 grid lg:gap-4 lg:overflow-visible lg:mx-0 lg:px-0
                        scrollbar-none [&::-webkit-scrollbar]:hidden">
            {categories?.map(cat => {
                // Берем иконку из карты по id, либо ставим дефолтную HelpCircle
                const Icon = ICON_MAP[cat.id] || HelpCircle;
                const isActive = selectedCategory === cat.id;

                return (
                    <motion.button
                        key={cat.id}
                        whileTap={{ scale: 0.97 }}
                        whileHover={{ y: -2 }}
                        transition={springSmooth}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`
                            shrink-0 transition-all duration-300 border rounded-3xl
                            /* мобилка: вертикальный квадратик */
                            flex flex-col items-center gap-2 py-4
                            /* десктоп: горизонтальная карточка во всю ячейку */
                            lg:w-auto lg:flex-row lg:items-center lg:gap-4 lg:px-5 lg:py-4 w-full
                            ${isActive
                                ? 'bg-neutral-950 text-white border-transparent shadow-[0_15px_30px_-5px_rgba(0,0,0,0.2)]'
                                : 'bg-white text-zinc-700 border-black/5 hover:border-black/20 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.04)]'}
                        `}
                    >
                        {/* Иконка в тонированной плитке Soft UI */}
                        <span className={`flex items-center justify-center rounded-2xl transition-colors duration-300
                                          w-10 h-10 shrink-0
                                          ${isActive ? 'bg-white/10' : 'bg-[#F4F3F8]'}`}>
                            <Icon size={18} />
                        </span>

                        <span className="flex flex-col items-center lg:items-start min-w-0">
                            <span className="text-xs font-bold tracking-tight truncate capitalize">
                                {cat.name.toLowerCase()}
                            </span>
                            {/* Счётчик */}
                            <span className={`hidden lg:block text-[10px] font-medium mt-0.5
                                              ${isActive ? 'text-white/50' : 'text-zinc-400'}`}>
                                {countByCategory(cat.id)} поз.
                            </span>
                        </span>
                    </motion.button>
                );
            })}
        </div>
    );
};