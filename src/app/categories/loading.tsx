/* Коллекции/категории */
export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-8">

            {/* Header */}
            <div className="space-y-2">
                <div className="h-3 w-16 bg-zinc-100 animate-pulse rounded-full" />
                <div className="h-9 w-48 bg-zinc-100 animate-pulse rounded-xl" />
                <div className="h-3 w-36 bg-zinc-100 animate-pulse rounded-full" />
            </div>

            {/* Category cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-3xl border border-black/5 overflow-hidden aspect-4/3"
                        style={{ animationDelay: `${i * 70}ms` }}
                    >
                        <div className="w-full h-3/4 bg-zinc-100 animate-pulse" />
                        <div className="p-4 space-y-2">
                            <div className="h-4 w-2/3 bg-zinc-100 animate-pulse rounded-lg" />
                            <div className="h-3 w-1/3 bg-zinc-100 animate-pulse rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
