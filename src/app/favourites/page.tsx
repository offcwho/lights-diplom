'use client'

import { GuardedPage } from "@/components/GuardedPage";
import { Favourites } from "@/entities/favorites";

export default function FavouritesPage() {
    return (
        <GuardedPage>
            <Favourites />
        </GuardedPage>
    );
}
