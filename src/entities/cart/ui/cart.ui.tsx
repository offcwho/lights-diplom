'use client'

import { Container } from "@/components/Container"
import { CartHeader, CartList, CartTotals } from ".."
import { useHeaderHeight } from "@/hooks/useHeaderHeight";
import { useEffect } from "react";
import { PageItem, PageStagger } from "@/components/Animations";

export const CartUi = () => {
    const { mobileNavHeight } = useHeaderHeight();

    useEffect(() => {
        const mainContent = document.getElementById('main-content');
        const section = document.querySelector('section');
        if (section) {
            section.style.paddingBottom = '0';
        }

    }, [mobileNavHeight]);

    return (
        <Container className="space-y-5!">
            <div className="bg-[#F4F3F0] text-zinc-900 px-4 md:px-12 lg:py-20 xs:py-10 font-sans selection:bg-black selection:text-white rounded-2xl">
                <div className="max-w-7xl mx-auto space-y-12">
                    <CartHeader />
                    <PageStagger className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                        <PageItem className="lg:col-span-7">
                            <CartList />
                        </PageItem>
                        <PageItem className="lg:col-span-5">
                            <CartTotals className="lg:block xs:hidden" />
                        </PageItem>
                    </PageStagger>
                </div>
            </div>
        </Container>
    )
}