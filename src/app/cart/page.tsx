import { Cart, CartProvider } from '@/entities/cart';

export default function CartPage() { 
    return (
        <CartProvider>
            <Cart />
        </CartProvider>
    ) 
}