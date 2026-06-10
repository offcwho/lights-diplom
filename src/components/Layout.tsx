'use client'

import { Footer } from "@/widgets/footer";
import { Header, MobileNavigation } from "@/widgets/header";
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
                className="h-full overflow-y-auto flex flex-col justify-between gap-12"
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
        </body>
    )
}