// components/SplashWrapper.tsx
'use client';

import { useState, useEffect } from 'react';
import SplashScreen from './SplashScreen';

export default function SplashWrapper({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const isAppLoaded = sessionStorage.getItem('luxf_light_loaded');

        if (isAppLoaded) {
            setIsLoading(false);
        } else {
            const timer = setTimeout(() => {
                sessionStorage.setItem('luxf_light_loaded', 'true');
                setIsLoading(false);
            }, 2200);

            return () => clearTimeout(timer);
        }
    }, []);

    if (isLoading) {
        return <SplashScreen />;
    }
    return <>{children}</>;
}