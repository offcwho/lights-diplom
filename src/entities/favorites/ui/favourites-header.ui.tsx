'use client'

import { useFavourites } from "../module/favorites.context"

export const FavouritesHeaderUi = () => {
    const { favouriteItems } = useFavourites();

    return (
        <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-[0.35em] text-zinc-400">
                Личный кабинет
            </p>
            <div className="flex items-end justify-between">
                <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-tight leading-none">
                    Избранное
                </h1>
                {favouriteItems.length > 0 && (
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                        {favouriteItems.length} {favouriteItems.length === 1 ? 'товар' : favouriteItems.length < 5 ? 'товара' : 'товаров'}
                    </span>
                )}
            </div>
        </div>
    )
}
