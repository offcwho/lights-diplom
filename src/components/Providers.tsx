import { CartProvider } from "@/entities/cart/module/cart.context";
import { FavoritesProvider } from "@/entities/favorites";
import { AuthProvider } from "@/hooks/AuthContext";
import { HeaderHeightProvider } from "@/hooks/useHeaderHeight";
import { StuckProvider } from "@/hooks/useStack";

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <AuthProvider>
            <HeaderHeightProvider>
                <StuckProvider>
                    <FavoritesProvider>
                        <CartProvider>
                            {children}
                        </CartProvider>
                    </FavoritesProvider>
                </StuckProvider>
            </HeaderHeightProvider>
        </AuthProvider>
    )
};