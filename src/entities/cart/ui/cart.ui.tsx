'use client'

import { Container } from "@/components/Container"
import { CartHeader, CartList, CartTotals } from ".."
import { useHeaderHeight } from "@/hooks/useHeaderHeight";
import { useEffect } from "react";
import { PageItem, PageStagger } from "@/components/Animations";
import { useCart } from "../module/cart.context";

export const CartUi = () => {
    const { mobileNavHeight } = useHeaderHeight();
    const { setItems } = useCart();

    useEffect(() => {
        const mainContent = document.getElementById('main-content');
        const section = document.querySelector('section');
        if (section) {
            section.style.paddingBottom = '0';
        }

    }, [mobileNavHeight]);

    return (
        <Container className="space-y-5!">
            <div className="text-zinc-900 md:px-12 font-sans selection:bg-black selection:text-white rounded-2xl">
                <PageStagger className="max-w-7xl mx-auto md:space-y-12 xs:space-y-4">
                    <PageItem>
                        <CartHeader />
                    </PageItem>
                    <PageItem className="grid grid-cols-1 lg:grid-cols-12 xs:gap-0 md:gap-16 items-start">
                        <PageItem className="lg:col-span-7">
                            <CartList />
                        </PageItem>
                        <PageItem className="lg:col-span-5">
                            <CartTotals className="lg:block xs:hidden" />
                        </PageItem>
                    </PageItem>
                </PageStagger>
            </div>
        </Container>
    )
}