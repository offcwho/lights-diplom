/* Страница регистрации */
export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-sm space-y-6">
                <div className="space-y-2">
                    <div className="h-3 w-24 bg-zinc-100 animate-pulse rounded-full" />
                    <div className="h-8 w-44 bg-zinc-100 animate-pulse rounded-xl" />
                    <div className="h-3 w-40 bg-zinc-100 animate-pulse rounded-full" />
                </div>
                <div className="space-y-3.5">
                    <div className="h-13 w-full bg-zinc-100 animate-pulse rounded-2xl" />
                    <div className="h-13 w-full bg-zinc-100 animate-pulse rounded-2xl" />
                    <div className="h-13 w-full bg-zinc-100 animate-pulse rounded-2xl" />
                    <div className="h-13 w-full bg-zinc-900/10 animate-pulse rounded-2xl" />
                </div>
            </div>
        </div>
    );
}
