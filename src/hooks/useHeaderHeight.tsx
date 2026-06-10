'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type HeightContextValue = {
    headerHeight: number;
    mobileNavHeight: number; // весь блок навигации: док + панель (для паддинга контента)
    dockHeight: number;      // только док с иконками (для maxHeight панели)
};

const HeaderHeightContext = createContext<HeightContextValue | undefined>(undefined);

export const HeaderHeightProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [headerHeight, setHeaderHeight] = useState(0);
    const [mobileNavHeight, setMobileNavHeight] = useState(0);
    const [dockHeight, setDockHeight] = useState(0);
    const pathname = usePathname();

    useEffect(() => {
        let cancelled = false;

        const update = () => {
            if (cancelled) return;
            const header = document.getElementById('header');
            const nav = document.getElementById('mobilenav');
            const dock = document.getElementById('mobiledock');

            if (header) {
                const h = Math.round(header.offsetHeight);
                setHeaderHeight(prev => Math.abs(prev - h) > 1 ? h : prev);
            }
            if (nav) {
                const n = Math.round(nav.offsetHeight);
                setMobileNavHeight(prev => Math.abs(prev - n) > 1 ? n : prev);
            }
            if (dock) {
                const d = Math.round(dock.offsetHeight);
                setDockHeight(prev => Math.abs(prev - d) > 1 ? d : prev);
            }
        };

        update();
        document.fonts?.ready.then(() => { if (!cancelled) update(); });

        // 👇 вот объявление, которого не хватало
        const observer = new ResizeObserver(update);

        [
            document.getElementById('header'),
            document.getElementById('mobilenav'),
            document.getElementById('mobiledock'),
        ].forEach(el => {
            if (el) observer.observe(el);
        });

        return () => {
            cancelled = true;
            observer.disconnect(); // отключает наблюдение со всех элементов разом
        };
    }, [pathname]);

    const value = { headerHeight, mobileNavHeight, dockHeight };

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