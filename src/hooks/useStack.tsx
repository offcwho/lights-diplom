'use client';

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useHeaderHeight } from "@/hooks/useHeaderHeight";

type StuckContextValue = {
    isStuck: boolean;
    registerSentinel: (el: HTMLElement | null) => void;
};

const StuckContext = createContext<StuckContextValue | undefined>(undefined);

export const StuckProvider = ({ children }: { children: ReactNode }) => {
    const { headerHeight } = useHeaderHeight();
    const [sentinel, setSentinel] = useState<HTMLElement | null>(null);
    const [isStuck, setIsStuck] = useState(false);

    // сентинел сам сообщает о себе (ref-callback)
    const registerSentinel = useCallback((el: HTMLElement | null) => {
        setSentinel(el);
    }, []);

    useEffect(() => {
        // сентинела нет (другая страница) — состояния прилипания нет
        if (!sentinel) {
            setIsStuck(false);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                // страховка: игнорируем рапорты по элементу, выпавшему из DOM
                if (!entry.target.isConnected) return;
                setIsStuck(!entry.isIntersecting);
            },
            {
                rootMargin: `-${headerHeight + 1}px 0px 0px 0px`,
                threshold: 0,
            }
        );

        observer.observe(sentinel);
        return () => {
            observer.disconnect();
            setIsStuck(false); // 👈 явный сброс при уходе сентинела
        };
    }, [sentinel, headerHeight]);

    return (
        <StuckContext.Provider value={{ isStuck, registerSentinel }}>
            {children}
        </StuckContext.Provider>
    );
};

export const useStuck = () => {
    const ctx = useContext(StuckContext);
    if (ctx === undefined) {
        throw new Error("useStuck должен использоваться внутри <StuckProvider>");
    }
    return ctx;
};

// Сентинел: регистрируется при маунте, снимается при размонтировании
export const StuckSentinel = () => {
    const { registerSentinel } = useStuck();
    return <div ref={registerSentinel} className="h-px -mb-px" aria-hidden />;
};