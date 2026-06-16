'use client'

import { Footer } from "@/widgets/footer";
import { Header } from "@/widgets/header";
import { useHeaderHeight } from "@/hooks/useHeaderHeight";
import SplashWrapper from "./SplashWrapper";
import { MobileNavigation } from "@/widgets/mobile-navigation";
import { useEffect } from "react";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    useEffect(() => {
        const lock = async () => {
            try {
                await document.documentElement.requestFullscreen();
                await screen.orientation.lock('portrait');
            } catch { }
        };
        window.addEventListener('pointerdown', lock, { once: true });
        return () => window.removeEventListener('pointerdown', lock);
    }, []);

    const { mobileNavHeight, headerHeight } = useHeaderHeight();

    const calculatePadding = mobileNavHeight + 20 + 'px'

    return (

        <body className="relative h-screen overflow-hidden" id="body">
            <SplashWrapper>
                <Header />
                <div
                    className="h-full overflow-y-auto overflow-x-hidden flex flex-col justify-between gap-12"
                    style={{
                        paddingTop: headerHeight,
                        ['--bottom-pad' as string]: mobileNavHeight + 24 + 'px',
                    }}
                    id="main-content"
                >
                    <main>{children}</main>
                    <Footer />
                </div>

                <MobileNavigation />
            </SplashWrapper>
        </body >

    )
}