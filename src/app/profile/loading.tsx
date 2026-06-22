/* Профиль */
export default function Loading() {
    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8">

            {/* Profile header */}
            <div className="bg-white rounded-3xl border border-black/5 p-6 flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-zinc-100 animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="h-5 w-40 bg-zinc-100 animate-pulse rounded-lg" />
                    <div className="h-3 w-56 bg-zinc-100 animate-pulse rounded-full" />
                </div>
                <div className="h-10 w-24 bg-zinc-100 animate-pulse rounded-xl hidden sm:block" />
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-9 w-28 bg-zinc-100 animate-pulse rounded-xl shrink-0" style={{ animationDelay: `${i * 60}ms` }} />
                ))}
            </div>

            {/* Tab content */}
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white rounded-3xl border border-black/5 p-5 flex items-center justify-between gap-4" style={{ animationDelay: `${i * 80}ms` }}>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-zinc-100 animate-pulse shrink-0" />
                            <div className="space-y-2">
                                <div className="h-3 w-32 bg-zinc-100 animate-pulse rounded-full" />
                                <div className="h-2.5 w-20 bg-zinc-100 animate-pulse rounded-full" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <div className="h-6 w-16 bg-zinc-100 animate-pulse rounded-full" />
                            <div className="h-6 w-14 bg-zinc-100 animate-pulse rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
