export const ProfileOrdersTab = () => {
    return (
        <>
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-zinc-700">
                История заказов
            </h2>
            <div className="bg-[#F5F4F1] rounded-3xl p-4 sm:p-6 border border-black/5 flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-4">
                <div className="min-w-0">
                    <div className="flex items-center flex-wrap gap-2">
                        <span className="text-xs font-bold">ЗАКАЗ #2051E</span>
                        <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-semibold">Доставлен</span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2">1x Jasper Vintage Cement Pendant Lamp</p>
                </div>
                <div className="flex items-center justify-between sm:block sm:text-right border-t sm:border-t-0 border-black/5 pt-3 sm:pt-0 shrink-0">
                    <span className="text-sm font-bold block">650.00$</span>
                    <button className="text-xs text-zinc-500 underline sm:mt-0.5 hover:text-black">Детали</button>
                </div>
            </div>
        </>
    )
}