/* Оформление заказа */
export default function Loading() {
    return (
        <div className="max-w-5xl mx-auto px-6 py-10 lg:py-16">

            {/* Back link */}
            <div className="h-3 w-36 bg-zinc-100 animate-pulse rounded-full mb-10" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

                {/* Form */}
                <div className="lg:col-span-7 space-y-10">
                    <div className="space-y-1">
                        <div className="h-2 w-24 bg-zinc-100 animate-pulse rounded-full" />
                        <div className="h-8 w-40 bg-zinc-100 animate-pulse rounded-xl" />
                    </div>

                    {/* Contacts section */}
                    <div className="space-y-4">
                        <div className="h-3 w-32 bg-zinc-100 animate-pulse rounded-full pb-3 border-b border-black/5" />
                        <div className="h-14 w-full bg-white border border-black/8 animate-pulse rounded-2xl" />
                        <div className="h-14 w-full bg-white border border-black/8 animate-pulse rounded-2xl" />
                    </div>

                    {/* Address section */}
                    <div className="space-y-4">
                        <div className="h-3 w-40 bg-zinc-100 animate-pulse rounded-full" />
                        <div className="grid grid-cols-2 gap-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-20 bg-white border border-black/8 animate-pulse rounded-2xl" />
                            ))}
                        </div>
                    </div>

                    <div className="h-14 w-full bg-zinc-900/10 animate-pulse rounded-2xl" />
                </div>

                {/* Summary */}
                <div className="lg:col-span-5 space-y-4">
                    <div className="h-3 w-20 bg-zinc-100 animate-pulse rounded-full" />
                    <div className="bg-white rounded-3xl border border-black/5 overflow-hidden">
                        <div className="divide-y divide-black/5">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center gap-3 px-5 py-4">
                                    <div className="w-12 h-12 rounded-2xl bg-zinc-100 animate-pulse shrink-0" />
                                    <div className="flex-1 space-y-1.5">
                                        <div className="h-3 w-3/4 bg-zinc-100 animate-pulse rounded-full" />
                                        <div className="h-2.5 w-1/4 bg-zinc-100 animate-pulse rounded-full" />
                                    </div>
                                    <div className="h-4 w-16 bg-zinc-100 animate-pulse rounded-full shrink-0" />
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-black/5 px-5 py-4 space-y-2.5 bg-zinc-50/60">
                            <div className="flex justify-between">
                                <div className="h-3 w-20 bg-zinc-100 animate-pulse rounded-full" />
                                <div className="h-3 w-16 bg-zinc-100 animate-pulse rounded-full" />
                            </div>
                            <div className="flex justify-between pt-2 border-t border-black/5">
                                <div className="h-4 w-12 bg-zinc-100 animate-pulse rounded-full" />
                                <div className="h-6 w-24 bg-zinc-100 animate-pulse rounded-lg" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
