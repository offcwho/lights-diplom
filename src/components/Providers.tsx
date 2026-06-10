import { CartProvider } from "@/entities/cart/module/cart.context";
import { HeaderHeightProvider } from "@/hooks/useHeaderHeight";

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <HeaderHeightProvider>
            <CartProvider>
                {children}
            </CartProvider>
        </HeaderHeightProvider>
    )
};