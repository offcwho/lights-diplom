'use client'

import { Footer } from "@/widgets/footer";
import { Header, MobileNavigation } from "@/widgets/header";
import { useEffect, useState } from "react";
import { Providers } from "./Providers";
import { useHeaderHeight } from "@/hooks/useHeaderHeight";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { mobileNavHeight, headerHeight } = useHeaderHeight();

    const calculatePadding = mobileNavHeight + 20 + 'px'

    return (
        <body className="relative h-screen overflow-hidden">
            <Header />
            <div
                className="h-full overflow-y-auto"
                style={{ paddingTop: headerHeight, paddingBottom: calculatePadding }}
                id="main-content"
            >
                <main>{children}</main>
            </div>

            <MobileNavigation />
        </body>
    )
}