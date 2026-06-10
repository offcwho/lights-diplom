'use client'

import { Toggle } from "@/components/Toggle";
import { useState } from "react";

export const ProfileSettingsTab = () => {
    const [notifyOrders, setNotifyOrders] = useState(true);
    const [notifyPromo, setNotifyPromo] = useState(false);

    return (
        <>
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-zinc-700">
                Настройки
            </h2>

            {/* Данные профиля */}
            <div className="bg-[#F5F4F1] rounded-3xl p-4 sm:p-6 border border-black/5 space-y-4">
                <h3 className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-400">
                    Профиль
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="block">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5 block">Имя</span>
                        <input
                            type="text"
                            defaultValue="Александр Б."
                            className="w-full bg-white border border-black/10 rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-black/30 transition-colors"
                        />
                    </label>
                    <label className="block">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5 block">Email</span>
                        <input
                            type="email"
                            defaultValue="alex@luxf.design"
                            className="w-full bg-white border border-black/10 rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-black/30 transition-colors"
                        />
                    </label>
                </div>
                <button className="bg-black text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 active:scale-[0.98] transition-all">
                    Сохранить
                </button>
            </div>

            {/* Уведомления */}
            <div className="bg-[#F5F4F1] rounded-3xl p-4 sm:p-6 border border-black/5 space-y-1">
                <h3 className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-400 mb-3">
                    Уведомления
                </h3>
                <Toggle
                    label="Статус заказов"
                    description="Email о смене статуса доставки"
                    checked={notifyOrders}
                    onChange={setNotifyOrders}
                />
                <Toggle
                    label="Акции и новинки"
                    description="Редкие письма о новых коллекциях"
                    checked={notifyPromo}
                    onChange={setNotifyPromo}
                />
            </div>

            {/* Безопасность */}
            <div className="bg-[#F5F4F1] rounded-3xl p-4 sm:p-6 border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h3 className="text-xs font-bold">Пароль</h3>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Последнее изменение: 3 месяца назад</p>
                </div>
                <button className="shrink-0 bg-white border border-black/10 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-zinc-900 hover:text-white transition-all">
                    Изменить
                </button>
            </div>
        </>
    );
};