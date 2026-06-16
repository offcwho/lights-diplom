// components/SplashScreen.tsx
'use client';

import Image from "next/image";
import icon from "../../public/icons/animated-icon.svg";

export default function SplashScreen() {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 99999, // Поверх всех модалок и шапок
        }}>
            {/* Наш анимированный SVG 512x512 */}
            <Image
                src={icon}
                alt="Animated Icons"
            />
        </div>
    );
}