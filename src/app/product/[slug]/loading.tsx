/* Страница товара */
export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16 space-y-16">

            {/* Breadcrumb */}
            <div className="h-3 w-48 bg-zinc-100 animate-pulse rounded-full" />

            {/* Product main block */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

                {/* Image gallery */}
                <div className="space-y-3">
                    <div className="w-full aspect-square rounded-3xl bg-zinc-100 animate-pulse" />
                    <div className="grid grid-cols-4 gap-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-square rounded-2xl bg-zinc-100 animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
                        ))}
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-6">
                    <div className="space-y-3">
                        <div className="h-3 w-20 bg-zinc-100 animate-pulse rounded-full" />
                        <div className="h-8 w-3/4 bg-zinc-100 animate-pulse rounded-xl" />
                        <div className="h-6 w-28 bg-zinc-100 animate-pulse rounded-lg" />
                    </div>

                    <div className="h-px bg-zinc-100" />

                    {/* Specs */}
                    <div className="space-y-2">
                        <div className="h-3 w-24 bg-zinc-100 animate-pulse rounded-full" />
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex justify-between py-2.5 border-b border-zinc-50">
                                <div className="h-3 w-24 bg-zinc-100 animate-pulse rounded-full" />
                                <div className="h-3 w-32 bg-zinc-100 animate-pulse rounded-full" />
                            </div>
                        ))}
                    </div>

                    {/* Buttons */}
                    <div className="space-y-3 pt-2">
                        <div className="h-14 w-full bg-zinc-100 animate-pulse rounded-2xl" />
                        <div className="h-14 w-full bg-zinc-100 animate-pulse rounded-2xl" />
                    </div>
                </div>
            </div>

            {/* Related products */}
            <div className="space-y-6">
                <div className="h-5 w-48 bg-zinc-100 animate-pulse rounded-lg" />
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-[28px] border border-black/5 aspect-3/4 p-4 flex flex-col">
                            <div className="flex-1 rounded-[20px] bg-zinc-100 animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
                            <div className="mt-4 pt-4 border-t border-black/5 space-y-2">
                                <div className="h-3 bg-zinc-100 animate-pulse rounded-full w-3/4" />
                                <div className="h-4 bg-zinc-100 animate-pulse rounded-full w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
