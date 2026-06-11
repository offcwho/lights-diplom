import { Armchair, Lamp, Sofa, LayoutGrid, Heart } from "lucide-react";
import { springSmooth } from "@/lib/motion";
import { useCatalog } from "../module/catalog.context";
import { motion } from "framer-motion";

const CATEGORIES = [
    { id: 'all', name: 'Все товары', icon: LayoutGrid },
    { id: 'chairs', name: 'Стулья', icon: Armchair },
    { id: 'armchairs', name: 'Кресла', icon: Sofa },
    { id: 'lighting', name: 'Свет', icon: Lamp },
];

export const CategoryRowUi = () => {
    const { selectedCategory, setSelectedCategory, countByCategory } = useCatalog();

    return (
        <div className="flex gap-3 overflow-x-auto -mx-4 px-4
                        lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:mx-0 lg:px-0
                        [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.id;

                return (
                    <motion.button
                        key={cat.id}
                        whileTap={{ scale: 0.97 }}
                        whileHover={{ y: -2 }}
                        transition={springSmooth}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`
                            shrink-0 transition-colors duration-200 border rounded-2xl
                            /* мобилка: вертикальный квадратик */
                            flex flex-col items-center gap-2 w-20 py-4
                            /* десктоп: горизонтальная карточка во всю ячейку */
                            lg:w-auto lg:flex-row lg:items-center lg:gap-4 lg:px-5 lg:py-4
                            ${isActive
                                ? 'bg-[#111111] text-white border-black shadow-[0_8px_24px_rgba(0,0,0,0.15)]'
                                : 'bg-white text-zinc-700 border-black/5 hover:border-black/20 shadow-[0_2px_12px_rgba(0,0,0,0.03)]'}
                        `}
                    >
                        {/* Иконка: на десктопе — в тонированной плитке */}
                        <span className={`flex items-center justify-center rounded-xl transition-colors duration-200
                                          lg:w-10 lg:h-10 lg:shrink-0
                                          ${isActive ? 'lg:bg-white/15' : 'lg:bg-[#F4F3F0]'}`}>
                            <Icon size={18} />
                        </span>

                        <span className="flex flex-col items-center lg:items-start min-w-0">
                            <span className="text-[9px] lg:text-xs font-bold uppercase lg:normal-case lg:font-semibold tracking-wider lg:tracking-tight truncate">
                                {cat.name}
                            </span>
                            {/* счётчик — только десктоп */}
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