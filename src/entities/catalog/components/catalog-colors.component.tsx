'use client'

import { motion } from "framer-motion";
import { useCatalog } from "../module/catalog.context";
import { PremiumSpring, TightSpring } from "../module/catalog.animations";

const availableColors = [
    { id: "white", name: "White / Ivory", class: "bg-[#F5F5F4] border border-black/10" },
    { id: "grey", name: "Architectural Grey", class: "bg-[#A1A1AA]" },
    { id: "black", name: "Carbon Black", class: "bg-[#111111]" },
    { id: "green", name: "Olive Green", class: "bg-[#606A56]" }
];

export const CatalogColorsComponent = () => {
    const { selectedColors, handleColorToggle } = useCatalog();
    
    return (
        <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Color Palette</h4>
            <div className="space-y-1">
                {availableColors.map((color) => {
                    const isChecked = selectedColors.includes(color.id);
                    return (
                        <button
                            key={color.id}
                            onClick={() => handleColorToggle(color.id)}
                            className="flex items-center space-x-3 w-full text-left text-xs font-bold uppercase group py-1.5 relative select-none outline-none"
                        >
                            <div className="relative w-5 h-5 flex items-center justify-center">
                                {/* Цветной кружок: при активации слегка уменьшается, уступая место рамке */}
                                <motion.div
                                    animate={{
                                        scale: isChecked ? 0.8 : 1,
                                    }}
                                    whileHover={{ scale: isChecked ? 0.85 : 1.1 }}
                                    whileTap={{ scale: 0.75 }}
                                    transition={TightSpring}
                                    className={`w-3.5 h-3.5 rounded-full shadow-sm z-10 cursor-pointer ${color.class}`}
                                />

                                {/* Внешнее кольцо: у каждого кружка оно свое личное, плавно расширяется из центра */}
                                <motion.div
                                    initial={false}
                                    animate={{
                                        scale: isChecked ? 1 : 0.5,
                                        opacity: isChecked ? 1 : 0,
                                    }}
                                    transition={PremiumSpring}
                                    className="absolute inset-0 border border-black rounded-full z-0"
                                />
                            </div>

                            <motion.span
                                animate={{
                                    color: isChecked ? "#111111" : "#71717a",
                                    x: isChecked ? 2 : 0
                                }}
                                className="group-hover:text-black transition-colors"
                            >
                                {color.name}
                            </motion.span>
                        </button>
                    );
                })}
            </div>
        </div>
    )
}