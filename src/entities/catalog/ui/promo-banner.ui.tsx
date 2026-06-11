import { motion } from "framer-motion";

export const PromoBannerUi = () => (
    <div className="relative bg-white rounded-3xl border border-black/5 overflow-hidden
                    flex items-center min-h-[170px] lg:min-h-[260px]
                    shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        <div className="relative z-10 p-6 sm:p-8 lg:p-12 space-y-2.5 lg:space-y-4 max-w-[58%]">
            <h2 className="text-lg sm:text-2xl lg:text-4xl font-black tracking-tight leading-tight">
                Новая коллекция
            </h2>
            <p className="text-[11px] lg:text-sm text-zinc-500 font-medium leading-relaxed">
                Скидка 50% на первый заказ
            </p>
            <motion.button
                whileTap={{ scale: 0.96 }}
                className="bg-[#111111] text-white text-[10px] lg:text-xs font-bold
                           px-5 py-2.5 lg:px-7 lg:py-3 rounded-xl hover:bg-zinc-800 transition-colors"
            >
                Смотреть
            </motion.button>
        </div>
        <img
            src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=600"
            alt=""
            className="absolute right-0 top-0 h-full w-[48%] object-cover
                       [mask-image:linear-gradient(to_left,black_70%,transparent)]"
        />
    </div>
);