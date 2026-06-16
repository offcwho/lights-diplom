import { CartProvider } from "@/entities/cart/module/cart.context";
import { CatalogProvider } from "@/entities/catalog/module/catalog.context";
import { FavoritesProvider } from "@/entities/favorites";
import { AuthProvider } from "@/hooks/AuthContext";
import { HeaderHeightProvider } from "@/hooks/useHeaderHeight";
import { StuckProvider } from "@/hooks/useStack";

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <AuthProvider>
            <HeaderHeightProvider>
                <StuckProvider>
                    <CatalogProvider>
                        <FavoritesProvider>
                            <CartProvider>
                                {children}
                            </CartProvider>
                        </FavoritesProvider>
                    </CatalogProvider>
                </StuckProvider>
            </HeaderHeightProvider>
        </AuthProvider>
    )
};