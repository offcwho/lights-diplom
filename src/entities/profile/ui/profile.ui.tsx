import { LayoutDashboard, LogOut, Package } from "lucide-react"

export const ProfileUi = () => {
    return (
        <div className="max-w-5xl mx-auto px-6 py-12 animate-fadeIn">
            <h1 className="text-4xl font-black tracking-tight uppercase mb-8">Личный кабинет</h1>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Левое меню профиля */}
                <div className="md:col-span-4 bg-[#F5F4F1] rounded-3xl p-6 space-y-2 h-fit">
                    <div className="flex items-center space-x-3 pb-4 mb-4 border-b border-black/10">
                        <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">A</div>
                        <div>
                            <h3 className="text-sm font-bold">Александр Б.</h3>
                            <p className="text-[10px] text-zinc-500">alex@luxf.design</p>
                        </div>
                    </div>
                    <button className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl bg-black text-white text-xs font-semibold">
                        <Package size={16} /> <span>История заказов</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-zinc-600 hover:bg-black/5 text-xs font-semibold text-left">
                        <LayoutDashboard size={16} /> <span>Адреса доставки</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-red-700 hover:bg-red-50 text-xs font-semibold text-left">
                        <LogOut size={16} /> <span>Выйти</span>
                    </button>
                </div>

                {/* Правая часть: Активные заказы */}
                <div className="md:col-span-8 space-y-4">
                    <h2 className="text-lg font-bold uppercase tracking-wider text-zinc-700">История заказов</h2>
                    <div className="bg-[#F5F4F1] rounded-3xl p-6 border border-black/5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div>
                            <div className="flex items-center space-x-3">
                                <span className="text-xs font-bold">ЗАКАЗ #2051E</span>
                                <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-semibold">Доставлен</span>
                            </div>
                            <p className="text-xs text-zinc-500 mt-1">1x Jasper Vintage Cement Pendant Lamp</p>
                        </div>
                        <div className="text-right sm:text-right">
                            <span className="text-sm font-bold block">650.00$</span>
                            <button className="text-xs text-zinc-500 underline mt-0.5 hover:text-black">Детали</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}