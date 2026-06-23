'use client'

import { GuardedPage } from "@/components/GuardedPage";
import { Cart } from '@/entities/cart';

export default function CartPage() {
    return (
        <GuardedPage>
            <Cart />
        </GuardedPage>
    );
}
