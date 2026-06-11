import { CartProvider } from "@/entities/cart/module/cart.context";
import { HeaderHeightProvider } from "@/hooks/useHeaderHeight";
import { StuckProvider } from "@/hooks/useStack";

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <HeaderHeightProvider>
            <StuckProvider>
                <CartProvider>
                    {children}
                </CartProvider>
            </StuckProvider>
        </HeaderHeightProvider>
    )
};