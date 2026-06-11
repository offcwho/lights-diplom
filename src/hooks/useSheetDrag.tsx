'use client'

import { useEffect, useRef } from "react";
import { useMotionValue, useTransform, animate, MotionValue } from "framer-motion";

interface UseSheetDragProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    maxPullUp?: number;
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
    maxPullUp = -100
}: UseSheetDragProps): UseSheetDragReturn => {
    const y = useMotionValue(0);
    const rootRef = useRef<HTMLDivElement>(null);

    const isOpenRef = useRef(isOpen);
    isOpenRef.current = isOpen;

    // Сдвиг всей плашки (работает только при движении вниз: y > 0)
    const transformY = useTransform(y, (value) => (value > 0 ? value : 0));

    // Увеличение нижнего паддинга (работает только при движении вверх: y < 0)
    const paddingBottom = useTransform(y, (value) => {
        return value < 0 ? `calc(var(--sheet-pb) + ${Math.abs(value)}px)` : `var(--sheet-pb)`;
    });

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
            if (window.innerWidth >= 1024) return; // Только для мобильных устройств

            const delta = e.touches[0].clientY - startY;

            if (mode === undefined && Math.abs(delta) > 8) {
                if (isOpenRef.current) {
                    mode = (delta > 0 && el.scrollTop <= 1) ? 'drag' : 'scroll';
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

            if (isOpenRef.current) {
                if (deltaY > 50 || (deltaY > 15 && velocity > 0.4)) {
                    setIsOpen(false);
                }
                animate(y, 0, { type: 'spring', stiffness: 300, damping: 30 });
            } else {
                if (deltaY < -40 || (deltaY < -15 && velocity < -0.4)) {
                    setIsOpen(true);
                }
                animate(y, 0, { type: 'spring', stiffness: 400, damping: 28 });
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
    }, [y, maxPullUp, setIsOpen]);

    return { rootRef, y, transformY, paddingBottom };
};