import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

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
    const saleEndsAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const [h, m, s] = useCountdown(saleEndsAt);

    return (
        <div className="flex items-center gap-4 mb-6 px-5 py-3.5 bg-[#111111] rounded-2xl text-white">
            <div className="flex items-center gap-2 shrink-0">
                <Zap size={14} className="text-amber-400 fill-amber-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Flash Sale</span>
            </div>

            <div className="flex-1 h-px bg-white/10" />

            <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] text-white/40 font-medium">До конца:</span>
                <div className="flex items-center gap-1">
                    {[h, m, s].map((v, i) => (
                        <span key={i} className="flex items-center gap-1">
                            <span className="bg-white/10 text-white text-[11px] font-mono font-black
                                             w-8 h-7 rounded-lg flex items-center justify-center tabular-nums tracking-tight">
                                {v}
                            </span>
                            {i < 2 && <span className="text-white/30 text-xs font-bold">:</span>}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};
