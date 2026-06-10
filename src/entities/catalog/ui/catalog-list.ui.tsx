"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, ArrowRight, } from "lucide-react";
import { useCatalog } from "../module/catalog.context";
import Link from "next/link";
import { PageItem, PageStagger } from "@/components/Animations";

export const CatalogListUi = ({ className }: { className?: string }) => {
    const { filteredProducts, resetFilters } = useCatalog();
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    return (
        <div className={`${className} text-[#111111] font-sans antialiased selection:bg-black selection:text-white`}>
            <PageStagger className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 relative">
                {filteredProducts.map((product) => {
                    const isHovered = hoveredId === product.id;

                    return (
                        <PageItem
                            key={product.id}
                            className="relative z-10"
                            onMouseEnter={() => setHoveredId(Number(product.id))}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            <div className="bg-white p-4 rounded-[28px] border border-black/2 shadow-[0_4px_20px_rgba(0,0,0,0.01)] transition-all duration-300 flex flex-col justify-between aspect-3/4">
                                <div className="w-full aspect-4/4 rounded-[20px] overflow-hidden bg-[#F4F3F0] relative flex items-center justify-center p-6">
                                    <img
                                        src={product.img}
                                        alt={product.name}
                                        className="max-h-full max-w-full object-contain mix-blend-multiply"
                                    />
                                    <span className="absolute top-3 left-3 text-[9px] font-black tracking-widest bg-[#F4F3F0] border border-black/5 px-2.5 py-0.5 rounded-full uppercase text-zinc-500">
                                        {product.category}
                                    </span>
                                </div>

                                <div className="pt-4 pb-1 border-t border-black/5 mt-4 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xs font-black tracking-tight uppercase">{product.name}</h3>
                                        <p className="text-[10px] text-zinc-400 font-bold uppercase mt-0.5">From ${product.price}</p>
                                    </div>
                                    <button className="w-8 h-8 rounded-full bg-[#F4F3F0] hover:bg-black hover:text-white flex items-center justify-center transition-colors">
                                        <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                            <AnimatePresence>
                                {isHovered && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.96, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.96, y: 10 }}
                                        transition={{ type: "spring", stiffness: 350, damping: 26 }}
                                        className="absolute -inset-4 p-4 bg-white rounded-4xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] z-50 flex flex-col justify-between border border-black/4 pointer-events-auto cursor-default"
                                    >
                                        <div className="w-full aspect-16/11 rounded-[22px] overflow-hidden bg-zinc-900 relative">
                                            <img
                                                src={product.lifestyleImg}
                                                alt="Lifestyle View"
                                                className="w-full h-full object-cover grayscale-10 contrast-[1.05]"
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                                            <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-zinc-800 shadow-sm hover:scale-105 active:scale-95 transition-transform">
                                                <Heart size={13} />
                                            </button>
                                        </div>

                                        <div className="space-y-3 py-4 grow flex flex-col justify-center">
                                            <div className="flex justify-between items-baseline">
                                                <h2 className="text-sm font-black uppercase tracking-tight">{product.name}</h2>
                                                <span className="text-sm font-mono font-bold">${product.price}.00</span>
                                            </div>
                                            <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
                                                {product.desc}
                                            </p>
                                            <div className="bg-[#F4F3F0] p-2.5 rounded-xl text-[10px] font-bold text-zinc-600 uppercase tracking-wide">
                                                <span className="text-zinc-400 block text-[9px] mb-0.5">Материал</span>
                                                {product.material}
                                            </div>
                                        </div>

                                        <button className="w-full bg-[#111111] text-white py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-[0.98] flex items-center justify-center space-x-2">
                                            <ShoppingBag size={14} />
                                            <span>Добавить в корзину</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </PageItem>
                    );
                })}
            </PageStagger>
            {filteredProducts.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="col-span-full py-20 text-center space-y-3"
                >
                    <p className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                        Ничего не найдено
                    </p>
                    <button
                        onClick={resetFilters}
                        className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-zinc-600 hover:border-zinc-600 transition-colors"
                    >
                        Сбросить фильтры
                    </button>
                </motion.div>
            )}
        </div>
    );
}