import { CartProvider } from "@/entities/cart/module/cart.context";
import { FavoritesProvider } from "@/entities/favorites";
import { HeaderHeightProvider } from "@/hooks/useHeaderHeight";
import { StuckProvider } from "@/hooks/useStack";

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <HeaderHeightProvider>
            <StuckProvider>
                <FavoritesProvider>
                    <CartProvider>
                        {children}
                    </CartProvider>
                </FavoritesProvider>
            </StuckProvider>
        </HeaderHeightProvider>
    )
};