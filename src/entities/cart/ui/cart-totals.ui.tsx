'use client'

import { AnimatePresence, motion, useMotionValue, animate } from "framer-motion"
import { ArrowRight, X } from "lucide-react"
import { useCart } from "../module/cart.context";
import { useHeaderHeight } from "@/hooks/useHeaderHeight";
import { useEffect, useRef, useState } from "react";

export const CartTotalsUi = ({ className, style }: { className?: string; style?: React.CSSProperties }) => {
    const { items, coupon, setCoupon, subtotal, total } = useCart();
    const { headerHeight, mobileNavHeight } = useHeaderHeight();
    const [isOpen, setIsOpen] = useState(false);

    const y = useMotionValue(0);
    const rootRef = useRef<HTMLDivElement>(null);
    const isOpenRef = useRef(isOpen);
    isOpenRef.current = isOpen;

    // --- свайп по ЛЮБОЙ точке блока ---
    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;

        let startY = 0;
        let startT = 0;
        let dragging = false;

        const onTouchStart = (e: TouchEvent) => {
            startY = e.touches[0].clientY;
            startT = Date.now();
            dragging = false;
            y.stop();
        };

        const onTouchMove = (e: TouchEvent) => {
            // свайпаем только в раскрытом состоянии и только на мобилке
            if (!isOpenRef.current || window.innerWidth >= 1024) return;

            const delta = e.touches[0].clientY - startY;

            // тянем панель ТОЛЬКО если её внутренний скролл в самом верху и жест идёт вниз
            if (el.scrollTop <= 0 && delta > 0) {
                dragging = true;
                e.preventDefault(); // глушим нативный скролл — поэтому passive: false
                y.set(delta * 0.55);
            } else if (!dragging) {
                // обычный скролл контента — обновляем точку отсчёта,
                // чтобы при возврате к scrollTop=0 панель не прыгала
                startY = e.touches[0].clientY;
                startT = Date.now();
            }
        };

        const onTouchEnd = (e: TouchEvent) => {
            if (!dragging) return;
            dragging = false;

            const deltaY = e.changedTouches[0].clientY - startY;
            const deltaT = Date.now() - startT;
            const velocity = deltaY / Math.max(deltaT, 1);

            if (deltaY > 50 || (deltaY > 15 && velocity > 0.4)) {
                setIsOpen(false);
                animate(y, 0, { type: 'spring', stiffness: 300, damping: 30 });
            } else {
                animate(y, 0, { type: 'spring', stiffness: 400, damping: 28 });
            }
        };

        el.addEventListener('touchstart', onTouchStart, { passive: true });
        el.addEventListener('touchmove', onTouchMove, { passive: false }); // 👈 нужен preventDefault
        el.addEventListener('touchend', onTouchEnd, { passive: true });

        return () => {
            el.removeEventListener('touchstart', onTouchStart);
            el.removeEventListener('touchmove', onTouchMove);
            el.removeEventListener('touchend', onTouchEnd);
        };
    }, [y]);
    // -----------------------------------

    if (items.length === 0) return null;

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
        <motion.div
            ref={rootRef}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className={`lg:col-span-5 bg-white border border-black/5 rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] space-y-6 lg:sticky lg:top-16 ${className}`}
            style={{
                ...style,
                overflowY: 'auto',
                overscrollBehavior: 'contain',
                y,
            }}
        >
            {/* ДЕСКТОП */}
            <div className="hidden lg:block space-y-6">
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
                            className="space-y-6"
                        >
                            {/* ручка остаётся как визуальная подсказка */}
                            <div className="flex justify-center py-4 -mt-4 -mx-6 select-none">
                                <motion.div
                                    className="w-10 h-1 rounded-full bg-zinc-300"
                                    animate={{ y: [0, 3, 0] }}
                                    transition={{ repeat: 2, duration: 0.9, delay: 0.5, ease: 'easeInOut' }}
                                />
                            </div>

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
        </motion.div>
    )
}