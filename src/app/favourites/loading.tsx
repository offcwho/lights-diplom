/* Избранное */
export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-8">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-3 w-20 bg-zinc-100 animate-pulse rounded-full" />
                    <div className="h-8 w-40 bg-zinc-100 animate-pulse rounded-xl" />
                </div>
                <div className="h-9 w-28 bg-zinc-100 animate-pulse rounded-xl" />
            </div>

            {/* Products grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-7 lg:gap-x-6 lg:gap-y-10">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white rounded-[28px] border border-black/5 aspect-3/4 p-4 flex flex-col">
                        <div className="flex-1 rounded-[20px] bg-zinc-100 animate-pulse" style={{ animationDelay: `${i * 50}ms` }} />
                        <div className="mt-4 pt-4 border-t border-black/5 space-y-2">
                            <div className="h-3 bg-zinc-100 animate-pulse rounded-full w-3/4" style={{ animationDelay: `${i * 50}ms` }} />
                            <div className="h-4 bg-zinc-100 animate-pulse rounded-full w-1/2" style={{ animationDelay: `${i * 50}ms` }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
