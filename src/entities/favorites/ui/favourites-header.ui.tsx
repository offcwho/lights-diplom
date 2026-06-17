'use client'

import { ArrowLeft } from "lucide-react"
import { useFavourites } from "../module/favorites.context"
import { useRouter } from "next/navigation";

export const FavouritesHeaderUi = () => {
    const { favouriteItems } = useFavourites();
    const router = useRouter();

    return (
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-neutral-700 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.03)] hover:scale-105 active:scale-95 transition-all"
                >
                    <ArrowLeft size={18} strokeWidth={2.5} />
                </button>
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900">Избранное</h1>
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mt-0.5">
                        {favouriteItems.length} предметов всего
                    </p>
                </div>
            </div>
        </div>
    )
}