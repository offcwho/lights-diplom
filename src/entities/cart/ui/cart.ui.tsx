'use client'

import { Container } from "@/components/Container"
import { CartProvider, useCart } from "../module/cart.context"
import { CartHeader, CartList, CartTotals } from ".."
import { useHeaderHeight } from "@/hooks/useHeaderHeight";
import { useEffect } from "react";

export const CartUi = () => {
    const { mobileNavHeight } = useHeaderHeight();
    const { total } = useCart();

    useEffect(() => {
        const mainContent = document.getElementById('main-content');
        const section = document.querySelector('section');
        if (section) {
            section.style.paddingBottom = '0';
        }
        if (mainContent) {
            mainContent.style.paddingBottom = '0';
        }
    }, [mobileNavHeight]);

    return (
        <Container className="space-y-5! h-screen">
            <div className="bg-[#F4F3F0] text-zinc-900 px-4 md:px-12 lg:py-20 xs:py-10 font-sans selection:bg-black selection:text-white rounded-2xl">
                <div className="max-w-7xl mx-auto space-y-12">
                    <CartHeader />
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                        <CartList />
                        <CartTotals className="lg:block xs:hidden" />
                    </div>
                </div>
            </div>
            <CartTotals className="lg:hidden xs:block bottom-0"
                style={{ paddingBottom: mobileNavHeight + 10 + 'px', bottom: '12px' }}
            />
        </Container>
    )
}