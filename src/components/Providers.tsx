import { CartProvider } from "@/entities/cart/module/cart.context";
import { CatalogProvider } from "@/entities/catalog/module/catalog.context";
import { FavouritesProvider } from "@/entities/favorites";
import { AuthProvider } from "@/hooks/AuthContext";
import { HeaderHeightProvider } from "@/hooks/useHeaderHeight";
import { StuckProvider } from "@/hooks/useStack";
import { Toaster } from "sonner";

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <AuthProvider>
            <FavouritesProvider>
                <HeaderHeightProvider>
                    <StuckProvider>
                        <CatalogProvider>
                            <FavouritesProvider>
                                <CartProvider>
                                    {children}
                                    <Toaster richColors position="bottom-right" />
                                </CartProvider>
                            </FavouritesProvider>
                        </CatalogProvider>
                    </StuckProvider>
                </HeaderHeightProvider>
            </FavouritesProvider>
        </AuthProvider>
    )
};