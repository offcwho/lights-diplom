/* Каталог (главная страница) */
export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 space-y-10 lg:space-y-6">

            {/* Banner skeleton */}
            <div className="w-full h-44 sm:h-64 lg:h-80 rounded-3xl bg-zinc-100 animate-pulse" />

            {/* Categories skeleton */}
            <div className="space-y-4">
                <div className="flex items-end justify-between">
                    <div className="space-y-1.5">
                        <div className="h-2 w-16 bg-zinc-100 animate-pulse rounded-full" />
                        <div className="h-5 w-32 bg-zinc-100 animate-pulse rounded-lg" />
                    </div>
                </div>
                <div className="flex gap-3 overflow-hidden">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-20 w-24 rounded-2xl bg-zinc-100 animate-pulse shrink-0" />
                    ))}
                </div>
            </div>

            {/* Toolbar skeleton (desktop) */}
            <div className="hidden md:block h-12 rounded-2xl bg-zinc-100 animate-pulse" />

            {/* Grid: filters + products */}
            <div className="grid grid-cols-1 lg:grid-cols-14 gap-8 items-start">
                {/* Filter sidebar */}
                <div className="hidden lg:block lg:col-span-4 h-[480px] rounded-3xl bg-zinc-100 animate-pulse" />

                {/* Products */}
                <div className="lg:col-span-10 grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-7 lg:gap-x-6 lg:gap-y-10">
                    {[...Array(9)].map((_, i) => (
                        <div key={i} className="bg-white rounded-[28px] border border-black/5 aspect-3/4 p-4 flex flex-col">
                            <div className="flex-1 rounded-[20px] bg-zinc-100 animate-pulse" style={{ animationDelay: `${i * 60}ms` }} />
                            <div className="mt-4 pt-4 border-t border-black/5 space-y-2">
                                <div className="h-3 bg-zinc-100 animate-pulse rounded-full w-3/4" style={{ animationDelay: `${i * 60}ms` }} />
                                <div className="h-4 bg-zinc-100 animate-pulse rounded-full w-1/2" style={{ animationDelay: `${i * 60}ms` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
