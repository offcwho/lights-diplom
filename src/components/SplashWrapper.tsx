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
            // Если это повторный переход — никакого сплэша, показываем сайт сразу
            setIsVisible(false);
        } else {
            // 1. Даем нашей SVG-вспышке полностью отыграть (2 секунды)
            const fadeTimer = setTimeout(() => {
                setIsFading(true); // Включаем fade-out эффект (opacity: 0)
                sessionStorage.setItem('luxf_light_loaded', 'true');
            }, 2000);

            // 2. Ждем еще 500мс, пока завершится анимация растворения, и полностью удаляем сплэш
            const unmountTimer = setTimeout(() => {
                setIsVisible(false);
            }, 2500); // 2000мс заставка + 500мс плавный переход

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
            <div className="w-full h-full">
                {children}
            </div>
        </>
    );
}