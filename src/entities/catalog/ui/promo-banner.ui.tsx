import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const PromoBannerUi = () => (
    <div className="relative bg-[#111111] rounded-3xl overflow-hidden min-h-50 lg:min-h-75 flex items-center">
        {/* Background image — ghosted */}
        <img
            src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=900"
            alt=""
            className="absolute right-0 top-0 h-full w-[60%] object-cover opacity-25 select-none pointer-events-none"
            style={{ maskImage: 'linear-gradient(to left, black 30%, transparent 80%)' }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-[#111111] via-[#111111]/90 to-transparent" />

        {/* Content */}
        <div className="relative z-10 p-7 sm:p-10 lg:p-14 space-y-4 lg:space-y-6 max-w-[70%]">
            <span className="text-[9px] font-black tracking-[0.35em] uppercase text-white/35">
                Новая коллекция · 2025
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white tracking-tight leading-[0.9]">
                Свет,&nbsp;который<br className="hidden sm:block" />
                &nbsp;живёт с вами
            </h2>

            <p className="hidden sm:block text-xs text-white/45 font-medium leading-relaxed max-w-xs">
                Дизайнерские светильники — от минималистичных подвесов до скандинавских торшеров
            </p>

            <motion.div whileTap={{ scale: 0.97 }}>
                <Link
                    href="/catalog"
                    className="inline-flex items-center gap-2.5 bg-white text-[#111111] text-[10px] lg:text-xs font-black
                               px-5 py-2.5 lg:px-7 lg:py-3.5 rounded-xl hover:bg-zinc-100 transition-colors uppercase tracking-widest"
                >
                    Смотреть
                    <ArrowRight size={12} />
                </Link>
            </motion.div>
        </div>

        {/* Bottom-right badge */}
        <div className="absolute bottom-5 right-5 hidden lg:flex items-center gap-1.5 bg-white/8 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest">Доступно сейчас</span>
        </div>
    </div>
);
