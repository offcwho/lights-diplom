'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const HeaderHeightContext = createContext<HeightContextValue | undefined>(undefined);

type HeightContextValue = {
    headerHeight: number;
    mobileNavHeight: number;
};

export const HeaderHeightProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [headerHeight, setHeaderHeight] = useState(0);
    const [mobileNavHeight, setMobileNavHeight] = useState(0);
    const pathname = usePathname();

    useEffect(() => {
        const header = document.getElementById('header');
        if (!header) return;

        const update = () => setHeaderHeight(header.offsetHeight);

        update();

        document.fonts?.ready.then(update);

        const observer = new ResizeObserver(update);
        observer.observe(header);

        return () => observer.disconnect();
    }, [pathname]);

    useEffect(() => {
        const mobileNav = document.getElementById('mobilenav');
        if (!mobileNav) return;

        const update = () => setMobileNavHeight(mobileNav.offsetHeight);

        update();

        document.fonts?.ready.then(update);

        const observer = new ResizeObserver(update);
        observer.observe(mobileNav);

        return () => observer.disconnect();
    }, [pathname]);

    const value = {
        headerHeight,
        mobileNavHeight
    };

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