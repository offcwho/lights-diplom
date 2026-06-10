'use client';

import { createContext, useContext, useEffect, useState } from "react";

const HeaderHeightContext = createContext<number | undefined>(undefined);

export const HeaderHeightProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
        const header = document.querySelector('header');

        const handleResize = () => {
            if (header) {
                setHeaderHeight(header.offsetHeight);
            }
        };

        handleResize(); // измеряем сразу при монтировании

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <HeaderHeightContext.Provider value={headerHeight}>
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