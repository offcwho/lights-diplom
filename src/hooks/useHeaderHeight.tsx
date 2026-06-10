'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type HeightContextValue = {
    headerHeight: number;
    mobileNavHeight: number;
};

const HeaderHeightContext = createContext<HeightContextValue | undefined>(undefined);

export const HeaderHeightProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [headerHeight, setHeaderHeight] = useState(0);
    const [mobileNavHeight, setMobileNavHeight] = useState(0);
    const pathname = usePathname();

    useEffect(() => {
        let cancelled = false;

        const measure = () => {
            if (cancelled) return;
            const header = document.getElementById('header');
            const nav = document.getElementById('mobilenav');
            // ставим высоту только если элемент реально есть и не оторван
            if (header) setHeaderHeight(header.offsetHeight);
            if (nav) setMobileNavHeight(nav.offsetHeight);
        };

        measure();
        document.fonts?.ready.then(() => { if (!cancelled) measure(); });

        const observers: ResizeObserver[] = [];
        [document.getElementById('header'), document.getElementById('mobilenav')].forEach(el => {
            if (!el) return;
            const ro = new ResizeObserver(measure);
            ro.observe(el);
            observers.push(ro);
        });

        return () => {
            cancelled = true; // 👈 глушит асинхронный .then после ухода со страницы
            observers.forEach(o => o.disconnect());
        };
    }, [pathname]);

    const value: HeightContextValue = { headerHeight, mobileNavHeight };

    return (
        <HeaderHeightContext.Provider value={value}>
            {children}
        </HeaderHeightContext.Provider>
    );
};

export const useHeaderHeight = () => {
    const context = useContext(HeaderHeightContext);
    if (context === undefined) {
        throw new Error("useHeaderHeight must be used within a HeaderHeightProvider");
    }
    return context;
};