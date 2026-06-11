import { useEffect, useState } from "react";

const useCountdown = (target: Date) => {
    const [left, setLeft] = useState(() => Math.max(0, target.getTime() - Date.now()));
    useEffect(() => {
        const t = setInterval(() => setLeft(Math.max(0, target.getTime() - Date.now())), 1000);
        return () => clearInterval(t);
    }, [target]);
    const h = Math.floor(left / 3600000);
    const m = Math.floor((left % 3600000) / 60000);
    const s = Math.floor((left % 60000) / 1000);
    const pad = (n: number) => String(n).padStart(2, '0');
    return [pad(h), pad(m), pad(s)];
};

export const FlashSaleUi = () => {
    // конец акции через 24 часа от текущего момента
    const saleEndsAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const [h, m, s] = useCountdown(saleEndsAt); // дата конца акции
    return (
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black tracking-tight">Распродажа</h2>
            <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-zinc-400 font-medium mr-1">До конца:</span>
                {[h, m, s].map((v, i) => (
                    <span key={i} className="flex items-center gap-1.5">
                        <span className="bg-[#111111] text-white text-[10px] font-mono font-bold
                                         w-7 h-6 rounded-md flex items-center justify-center tabular-nums">
                            {v}
                        </span>
                        {i < 2 && <span className="text-zinc-300 text-xs font-bold">:</span>}
                    </span>
                ))}
            </div>
        </div>
    );
};