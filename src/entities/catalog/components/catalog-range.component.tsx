'use client'

import { motion } from "framer-motion"
import { useCatalog } from "../module/catalog.context"

export const CatalogRangeComponent = () => {
    const { maxPrice, setMaxPrice } = useCatalog();

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-baseline">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Цена</h4>

                {/* Мягкое дыхание цифр при изменении значения */}
                <motion.span
                    animate={{ scale: [1.03, 1] }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="text-xs font-black font-mono bg-zinc-100 px-2 py-0.5 rounded-md text-zinc-900 select-none"
                >
                    ${maxPrice}
                </motion.span>
            </div>

            {/* Контейнер интерактивной зоны */}
            <div className="relative pt-2 pb-2 group">

                {/* БАЗОВЫЙ ТРЕК */}
                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-0.75 bg-zinc-200 rounded-full" />

                {/* АКТИВНЫЙ ТРЕК: Плавная упругая линия */}
                <motion.div
                    className="absolute top-1/2 -translate-y-1/2 left-0 h-0.75 bg-black rounded-full origin-left"
                    animate={{ width: `${((maxPrice - 600) / (1500 - 600)) * 100}%` }}
                    transition={{
                        type: "spring",
                        stiffness: 280, // Высокая скорость сборки пружины
                        damping: 26,    // Плавное затухание без лишней тряски
                        mass: 0.4       // Облегченный вес элемента — залог отсутствия лагов
                    }}
                />

                {/* КАСТОМНЫЙ ТОЧКА-ТХАМБ (Thumb): Кинетический кружок */}
                <motion.div
                    className="absolute top-1/2 w-4 h-4 bg-black rounded-full shadow-[0_3px_8px_rgba(0,0,0,0.15)] flex items-center justify-center z-10 pointer-events-none"
                    style={{ y: "-50%", x: "-50%" }}
                    animate={{ left: `${((maxPrice - 600) / (1500 - 600)) * 100}%` }}
                    transition={{
                        type: "spring",
                        stiffness: 280,
                        damping: 26,
                        mass: 0.4
                    }}

                    // Интерактивные микровзрывы при взаимодействии
                    whileHover={{ scale: 1.2 }}
                    whileTap={{
                        scale: 0.85,
                        boxShadow: "0px 1px 3px rgba(0,0,0,0.3)"
                    }}
                >
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </motion.div>

                {/* НАСТОЯЩИЙ ИНПУТ */}
                <input
                    type="range"
                    min="600"
                    max="1500"
                    step="50"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
            </div>

            <div className="flex justify-between text-[9px] text-zinc-400 font-mono font-bold tracking-wider select-none">
                <span>MIN / $600</span>
                <span>MAX / $1500</span>
            </div>
        </div>
    )
}