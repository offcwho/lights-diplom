// components/SplashWrapper.tsx
'use client';

import { useState, useEffect } from 'react';
import SplashScreen from './SplashScreen';

export default function SplashWrapper({ children }: { children: React.ReactNode }) {
    const [isVisible, setIsVisible] = useState(true);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        const isAppLoaded = sessionStorage.getItem('luxf_light_loaded');

        if (isAppLoaded) {
            setIsVisible(false);
        } else {
            const fadeTimer = setTimeout(() => {
                setIsFading(true);
                sessionStorage.setItem('luxf_light_loaded', 'true');
            }, 2000);

            const unmountTimer = setTimeout(() => {
                setIsVisible(false);
            }, 2500);

            return () => {
                clearTimeout(fadeTimer);
                clearTimeout(unmountTimer);
            };
        }
    }, []);

    if (!isVisible) {
        return <>{children}</>;
    }

    return (
        <>
            <div
                className={`fixed inset-0 z-99999 bg-white flex items-center justify-center transition-opacity duration-500 ease-in-out ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
                <SplashScreen />
            </div>
        </>
    );
}