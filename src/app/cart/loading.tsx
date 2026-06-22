/* Корзина */
export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">

            {/* Header */}
            <div className="mb-10 space-y-2">
                <div className="h-3 w-16 bg-zinc-100 animate-pulse rounded-full" />
                <div className="h-8 w-32 bg-zinc-100 animate-pulse rounded-xl" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                {/* Cart items */}
                <div className="lg:col-span-7 space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4 bg-white rounded-3xl border border-black/5 p-4" style={{ animationDelay: `${i * 80}ms` }}>
                            <div className="w-20 h-20 rounded-2xl bg-zinc-100 animate-pulse shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 w-3/4 bg-zinc-100 animate-pulse rounded-full" />
                                <div className="h-3 w-1/3 bg-zinc-100 animate-pulse rounded-full" />
                                <div className="h-3 w-1/4 bg-zinc-100 animate-pulse rounded-full" />
                            </div>
                            <div className="space-y-2 shrink-0">
                                <div className="h-8 w-24 bg-zinc-100 animate-pulse rounded-xl" />
                                <div className="h-4 w-16 bg-zinc-100 animate-pulse rounded-full mx-auto" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Totals */}
                <div className="lg:col-span-5 bg-white rounded-3xl border border-black/5 p-6 lg:p-8 space-y-6">
                    <div className="h-4 w-32 bg-zinc-100 animate-pulse rounded-full" />
                    <div className="space-y-4 pb-6 border-b border-black/5">
                        <div className="flex justify-between">
                            <div className="h-3 w-16 bg-zinc-100 animate-pulse rounded-full" />
                            <div className="h-3 w-20 bg-zinc-100 animate-pulse rounded-full" />
                        </div>
                        <div className="flex justify-between">
                            <div className="h-3 w-20 bg-zinc-100 animate-pulse rounded-full" />
                            <div className="h-3 w-12 bg-zinc-100 animate-pulse rounded-full" />
                        </div>
                    </div>
                    <div className="flex justify-between items-baseline">
                        <div className="h-4 w-20 bg-zinc-100 animate-pulse rounded-full" />
                        <div className="h-6 w-28 bg-zinc-100 animate-pulse rounded-lg" />
                    </div>
                    <div className="h-10 w-full bg-zinc-100 animate-pulse rounded-xl" />
                    <div className="h-14 w-full bg-zinc-900/10 animate-pulse rounded-2xl" />
                </div>
            </div>
        </div>
    );
}
