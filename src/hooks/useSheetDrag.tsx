'use client'

import { useEffect, useRef } from "react";
import { useMotionValue, useTransform, animate, MotionValue } from "framer-motion";

interface UseSheetDragProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    maxPullUp?: number;
    variant?: 'collapse' | 'dismiss';
}

interface UseSheetDragReturn {
    rootRef: React.RefObject<HTMLDivElement | null>;
    y: MotionValue<number>;
    transformY: MotionValue<number>;
    paddingBottom: MotionValue<string>;
}

export const useSheetDrag = ({ 
    isOpen, 
    setIsOpen, 
    maxPullUp = -100,
    variant = 'collapse'
}: UseSheetDragProps): UseSheetDragReturn => {
    const y = useMotionValue(0);
    const rootRef = useRef<HTMLDivElement>(null);
    
    const isOpenRef = useRef(isOpen);
    isOpenRef.current = isOpen;
    const setIsOpenRef = useRef(setIsOpen);
    setIsOpenRef.current = setIsOpen;

    const transformY = useTransform(y, (value) => (value > 0 ? value : 0));
    const paddingBottom = useTransform(y, (value) => {
        return value < 0 ? `calc(var(--sheet-pb) + ${Math.abs(value)}px)` : `var(--sheet-pb)`;
    });

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                y.set(0);
            } else if (variant === 'dismiss' && !isOpen) {
                y.set(window.innerHeight || 1000);
            }
        };
        
        handleResize();
        window.addEventListener('resize', handleResize);

        if (window.innerWidth < 1024 && variant === 'dismiss') {
            if (isOpen) {
                animate(y, 0, { type: 'spring', stiffness: 320, damping: 30 });
            } else {
                animate(y, window.innerHeight || 1000, { type: 'spring', stiffness: 300, damping: 35 });
            }
        }

        return () => window.removeEventListener('resize', handleResize);
    }, [isOpen, variant, y]);

    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;

        let startY = 0;
        let startT = 0;
        let mode: 'drag' | 'scroll' | undefined;

        const onTouchStart = (e: TouchEvent) => {
            startY = e.touches[0].clientY;
            startT = Date.now();
            mode = undefined;
            y.stop();
        };

        const onTouchMove = (e: TouchEvent) => {
            if (window.innerWidth >= 1024) return;
            if (variant === 'dismiss' && !isOpenRef.current) return;

            const delta = e.touches[0].clientY - startY;

            if (mode === undefined && Math.abs(delta) > 8) {
                if (isOpenRef.current) {
                    // 1. Проверяем, проскроллен ли какой-нибудь внутренний элемент вниз
                    let isAtTop = true;
                    let target = e.target as HTMLElement | null;
                    
                    while (target && target !== el) {
                        if (target.scrollTop > 0) {
                            isAtTop = false;
                            break;
                        }
                        target = target.parentElement;
                    }

                    // 2. Драг всей шторки срабатывает ТОЛЬКО если контент на самом верху (isAtTop) 
                    //    И пользователь уверенно тянет шторку вниз (delta > 0)
                    if (delta > 0 && isAtTop) {
                        mode = 'drag';
                    } else {
                        mode = 'scroll'; // Иначе отдаем управление нативному скроллу контента
                    }
                } else {
                    mode = delta < 0 ? 'drag' : 'scroll';
                }
            }

            if (mode === 'drag') {
                e.preventDefault();
                if (isOpenRef.current) {
                    y.set(Math.max(delta, 0) * 0.55); 
                } else {
                    y.set(Math.max(delta, maxPullUp)); 
                }
            }
        };

        const onTouchEnd = (e: TouchEvent) => {
            if (mode !== 'drag') { mode = undefined; return; }
            mode = undefined;

            const deltaY = e.changedTouches[0].clientY - startY;
            const deltaT = Date.now() - startT;
            const velocity = deltaY / Math.max(deltaT, 1);

            if (variant === 'dismiss') {
                if (deltaY > 50 || (deltaY > 15 && velocity > 0.4)) {
                    animate(y, window.innerHeight || 1000, { 
                        type: 'spring', 
                        stiffness: 300, 
                        damping: 30,
                        onComplete: () => setIsOpenRef.current(false)
                    });
                } else {
                    animate(y, 0, { type: 'spring', stiffness: 400, damping: 28 });
                }
            } else {
                if (isOpenRef.current) {
                    if (deltaY > 50 || (deltaY > 15 && velocity > 0.4)) {
                        setIsOpenRef.current(false);
                    }
                    animate(y, 0, { type: 'spring', stiffness: 300, damping: 30 });
                } else {
                    if (deltaY < -40 || (deltaY < -15 && velocity < -0.4)) {
                        setIsOpenRef.current(true);
                    }
                    animate(y, 0, { type: 'spring', stiffness: 400, damping: 28 });
                }
            }
        };

        el.addEventListener('touchstart', onTouchStart, { passive: true });
        el.addEventListener('touchmove', onTouchMove, { passive: false });
        el.addEventListener('touchend', onTouchEnd, { passive: true });

        return () => {
            el.removeEventListener('touchstart', onTouchStart);
            el.removeEventListener('touchmove', onTouchMove);
            el.removeEventListener('touchend', onTouchEnd);
        };
    }, [y, maxPullUp, variant]);

    return { rootRef, y, transformY, paddingBottom };
};