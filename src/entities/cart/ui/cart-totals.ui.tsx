'use client'

import { AnimatePresence, motion, PanInfo } from "framer-motion"
import { ArrowRight, X } from "lucide-react"
import { useCart } from "../module/cart.context";
import { useHeaderHeight } from "@/hooks/useHeaderHeight";
import { useState } from "react";

export const CartTotalsUi = ({ className, style }: { className?: string; style?: React.CSSProperties }) => {
    const { items, coupon, setCoupon, subtotal, total } = useCart();
    const { headerHeight, mobileNavHeight } = useHeaderHeight();
    const [isOpen, setIsOpen] = useState(false);

    if (items.length === 0) return null;

    // закрываем, если утянули вниз дальше 100px ИЛИ свайпнули быстро
    const handleDragEnd = (_: unknown, info: PanInfo) => {
        if (info.offset.y > 60 || info.velocity.y > 300) {
            setIsOpen(false);
        }
    };

    const totalsContent = (
        <>
            <div className="flex justify-between items-center">
                <h2 className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-zinc-400">
                    Cart Totals
                </h2>
                <button onClick={() => setIsOpen(false)} className="lg:hidden">
                    <X size={16} />
                </button>
            </div>

            <div className="space-y-4 border-b border-black/5 pb-6 text-xs font-medium">
                <div className="flex justify-between">
                    <span className="text-zinc-500 uppercase tracking-wider">Subtotal</span>
                    <span className="font-mono font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-baseline">
                    <span className="text-zinc-500 uppercase tracking-wider">Shipping</span>
                    <span className="font-mono text-[10px] text-zinc-400 font-bold uppercase tracking-widest bg-zinc-100 px-2 py-0.5 rounded-md">Free</span>
                </div>
            </div>

            <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold uppercase tracking-wider">Total</span>
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
                    placeholder="Enter coupon code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="bg-transparent border border-black/10 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider outline-none focus:border-black/30 transition-colors placeholder:text-zinc-400 flex-1"
                />
                <button className="bg-white hover:bg-zinc-900 hover:text-white text-black border border-black/10 rounded-xl px-6 py-2.5 text-xs font-mono font-bold uppercase tracking-widest transition-all">
                    Apply
                </button>
            </div>

            <div className="pt-2">
                <button className="w-full bg-black text-white py-4 px-6 rounded-2xl text-xs font-bold tracking-widest hover:bg-zinc-900 active:scale-[0.99] transition-all flex items-center justify-between group">
                    <span className="uppercase">Proceed to Checkout</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </>
    );

    return (
        <div
            className={`lg:col-span-5 bg-white border border-black/5 rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] space-y-6 sticky xs:bottom-0 lg:top-16 ${className}`}
            style={{
                ...style,
                maxHeight: `calc(100dvh - ${headerHeight + mobileNavHeight + 24}px)`,
                overflowY: 'auto',
            }}
        >
            {/* ДЕСКТОП — полные тоталы всегда видны */}
            <div className="hidden lg:block space-y-6">
                {totalsContent}
            </div>

            {/* МОБИЛКА — аккордеон + свайп вниз для закрытия */}
            <div className="lg:hidden overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                    {isOpen ? (
                        <motion.div
                            key="open"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="space-y-6"
                        >
                            {/* РУЧКА — только она ловит свайп */}
                            <motion.div
                                drag="y"
                                dragConstraints={{ top: 0, bottom: 0 }}
                                dragElastic={{ top: 0, bottom: 0.6 }}
                                onDragEnd={handleDragEnd}
                                className="flex justify-center py-3 -mt-4 -mx-6 cursor-grab active:cursor-grabbing"
                                style={{ touchAction: 'none' }} // 👈 ключевое: браузер не заберёт жест под скролл
                            >
                                <div className="w-10 h-1 rounded-full bg-zinc-300" />
                            </motion.div>

                            {totalsContent}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="collapsed"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                            <p className="text-lg font-bold font-mono mb-4">Общая стоимость: ${total.toFixed(2)}</p>
                            <button
                                onClick={() => setIsOpen(true)}
                                className="w-full bg-black text-white py-4 px-6 rounded-2xl text-xs font-bold tracking-widest hover:bg-zinc-900 active:scale-[0.99] transition-all flex items-center justify-between group"
                            >
                                <span className="uppercase">Подробнее</span>
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}