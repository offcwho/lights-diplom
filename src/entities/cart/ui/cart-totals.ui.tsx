'use client'

import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, X } from "lucide-react"
import { useCart } from "../module/cart.context";
import { useHeaderHeight } from "@/hooks/useHeaderHeight";
import { useState } from "react";
import { useSheetDrag } from "@/hooks/useSheetDrag"; // Путь к вашему хуку

export const CartTotalsUi = ({ className, style }: { className?: string; style?: React.CSSProperties }) => {
    const { items, coupon, setCoupon, subtotal, total } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    const { headerHeight, dockHeight } = useHeaderHeight();

    const { rootRef, transformY, paddingBottom } = useSheetDrag({
        isOpen,
        setIsOpen,
        maxPullUp: -100
    });

    if (items.length === 0) return null;

    const totalsContent = (
        <>
            <div className="flex justify-between items-center">
                <h2 className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-zinc-400">
                    Сумма корзины
                </h2>
                {/* debug
                <button onClick={() => setIsOpen(false)} className="lg:hidden">
                    <X size={16} />
                </button>
                */}
            </div>

            <div className="space-y-4 border-b border-black/5 pb-6 text-xs font-medium">
                <div className="flex justify-between">
                    <span className="text-zinc-500 uppercase tracking-wider">Итого</span>
                    <span className="font-mono font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-baseline">
                    <span className="text-zinc-500 uppercase tracking-wider">Доставка</span>
                    <span className="font-mono text-[10px] text-zinc-400 font-bold uppercase tracking-widest bg-zinc-100 px-2 py-0.5 rounded-md">Free</span>
                </div>
            </div>

            <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold uppercase tracking-wider">Общая цена</span>
                <motion.span
                    key={total}
                    initial={{ scale: 0.96, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-xl font-mono font-black tracking-tight"
                >
                    ${total.toFixed(2)}
                </motion.span>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-stretch gap-2 max-w-sm">
                <input
                    type="text"
                    placeholder="Введите промокод"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="bg-transparent border border-black/10 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider outline-none focus:border-black/30 transition-colors placeholder:text-zinc-400 flex-1"
                />
                <button className="bg-white hover:bg-zinc-900 hover:text-white text-black border border-black/10 rounded-xl px-6 py-2.5 text-xs font-mono font-bold uppercase tracking-widest transition-all">
                    Применить
                </button>
            </div>

            <div className="pt-2">
                <button className="w-full bg-black text-white py-4 px-6 rounded-2xl text-xs font-bold tracking-widest hover:bg-zinc-900 active:scale-[0.99] transition-all flex items-center justify-between group">
                    <span className="uppercase">Перейти к оплате</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </>
    );

    return (
        <motion.div
            ref={rootRef}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className={`cart-sheet lg:col-span-5 pb-0 border border-black/5 rounded-3xl pt-6  md:pt-8 [--sheet-pb:1.5rem] md:[--sheet-pb:2rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] xs:space-y-6 sm:space-y-0 lg:sticky lg:top-16 ${className}`}
            style={{
                ...style,
                ['--sheet-offset' as string]: `${headerHeight + dockHeight + 36}px`,
                overscrollBehavior: 'contain',
                y: transformY,
                paddingBottom,
            }}
        >
            {/* ДЕСКТОП */}
            <div className="hidden lg:block space-y-6 px-6 md:px-8">
                {totalsContent}
            </div>

            {/* МОБИЛКА */}
            <div className="lg:hidden overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                    {isOpen ? (
                        <motion.div
                            key="open"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className=""
                        >
                            <div className="flex justify-center py-4 -mt-4 -mx-6 mb-3 select-none">
                                <motion.div
                                    className="w-10 h-1 rounded-full bg-zinc-400"
                                    animate={{ y: [0, 3, 0] }}
                                    transition={{ repeat: 2, duration: 0.9, delay: 0.5, ease: 'easeInOut' }}
                                />
                            </div>

                            <div className="space-y-6 max-h-100 overflow-y-auto px-6 md:px-8 pb-0">
                                {totalsContent}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="collapsed"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="flex items-center justify-center"
                        >
                            <motion.div
                                className="w-10 h-1 rounded-full bg-zinc-400 my-1"
                                animate={{ y: [0, 3, 0] }}
                                transition={{ repeat: 2, duration: 0.9, delay: 0.5, ease: 'easeInOut' }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}