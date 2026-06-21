'use client'

import { Container } from "@/components/Container"
import { FavouritesList } from ".."
import { FavouritesHeaderUi } from "./favourites-header.ui"

export const FavouritesUi = () => {
    return (
        <Container className="py-8 lg:py-12 space-y-8">
            <FavouritesHeaderUi />
            <FavouritesList />
        </Container>
    )
}
