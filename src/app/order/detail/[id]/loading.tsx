/* Детали заказа */
export default function Loading() {
    return (
        <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">

            {/* Back */}
            <div className="h-3 w-36 bg-zinc-100 animate-pulse rounded-full" />

            {/* Title */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-2">
                    <div className="h-2 w-12 bg-zinc-100 animate-pulse rounded-full" />
                    <div className="h-8 w-36 bg-zinc-100 animate-pulse rounded-xl" />
                    <div className="h-3 w-40 bg-zinc-100 animate-pulse rounded-full" />
                </div>
                <div className="h-9 w-28 bg-zinc-100 animate-pulse rounded-xl" />
            </div>

            {/* Progress bar card */}
            <div className="bg-white rounded-3xl border border-black/5 px-6 py-5 space-y-5">
                <div className="h-2 w-28 bg-zinc-100 animate-pulse rounded-full" />
                <div className="flex justify-between items-end">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-zinc-100 animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
                            <div className="h-2 w-10 bg-zinc-100 animate-pulse rounded-full" style={{ animationDelay: `${i * 80}ms` }} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-3xl border border-black/5 overflow-hidden">
                <div className="px-5 py-4 border-b border-black/5">
                    <div className="h-2 w-12 bg-zinc-100 animate-pulse rounded-full" />
                </div>
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between px-5 py-4 gap-4 border-b border-black/5 last:border-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-zinc-100 animate-pulse shrink-0" />
                            <div className="space-y-1.5">
                                <div className="h-3 w-32 bg-zinc-100 animate-pulse rounded-full" />
                                <div className="h-2.5 w-20 bg-zinc-100 animate-pulse rounded-full" />
                            </div>
                        </div>
                        <div className="h-4 w-20 bg-zinc-100 animate-pulse rounded-full" />
                    </div>
                ))}
                <div className="flex items-center justify-between px-5 py-4 bg-zinc-50 border-t border-black/5">
                    <div className="h-3 w-12 bg-zinc-100 animate-pulse rounded-full" />
                    <div className="h-6 w-24 bg-zinc-100 animate-pulse rounded-lg" />
                </div>
            </div>

            {/* Delivery info */}
            <div className="bg-white rounded-3xl border border-black/5 overflow-hidden">
                <div className="px-5 py-4 border-b border-black/5">
                    <div className="h-2 w-16 bg-zinc-100 animate-pulse rounded-full" />
                </div>
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center px-5 py-3.5 border-b border-black/5 last:border-0">
                        <div className="h-3 w-16 bg-zinc-100 animate-pulse rounded-full" />
                        <div className="h-3 w-40 bg-zinc-100 animate-pulse rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}
