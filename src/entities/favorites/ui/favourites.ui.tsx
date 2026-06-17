import { Container } from "@/components/Container"
import { FavouritesHeader, FavouritesList, FavouritesPanel } from ".."

export const FavouritesUi = () => {
    return (
        <Container className="xs:space-y-4">
            <FavouritesHeader />
            <FavouritesPanel />
            <FavouritesList />
        </Container>
    )
}