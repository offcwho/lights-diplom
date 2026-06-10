'use client'

import { Footer } from "@/widgets/footer";
import { Header, MobileNavigation } from "@/widgets/header";
import { useEffect, useState } from "react";
import { Providers } from "./Providers";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [mobileNavHeight, setMobileNavHeight] = useState(0);
    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
        const header = document.getElementById('mobilenav');
        if (header) {
            setMobileNavHeight(header.offsetHeight);
        }

        const handleResize = () => {
            if (header) {
                setMobileNavHeight(header.offsetHeight);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const header = document.querySelector('header');
        if (header) {
            setHeaderHeight(header.offsetHeight);
        }

        const handleResize = () => {
            if (header) {
                setHeaderHeight(header.offsetHeight);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <Providers>
            <body className="grid grid-rows-[auto_1fr_auto] h-screen overflow-hidden">
                <Header />
                <div className="overflow-y-auto min-h-screen" style={{ paddingBottom: mobileNavHeight, paddingTop: headerHeight }}>
                    <MobileNavigation />
                    <main className="min-h-screen">
                        {children}
                    </main>
                    <Footer />
                </div>
            </body>
        </Providers>
    )
}