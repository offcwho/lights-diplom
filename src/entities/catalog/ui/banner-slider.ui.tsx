'use client';

import { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { bannersApi } from '@/lib/api';
import type { Banner } from '@/lib/types';

const INTERVAL_MS = 6000;

const slide = {
    enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -50 : 50, opacity: 0 }),
};

const imgSlide = {
    enter: (dir: number) => ({ x: dir > 0 ? 30 : -30, opacity: 0 }),
    center: { x: 0, opacity: 0.28 },
    exit: (dir: number) => ({ x: dir > 0 ? -30 : 30, opacity: 0 }),
};

const TRANSITION = { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const };

export const BannerSliderUi = () => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [active, setActive] = useState(0);
    const [dir, setDir] = useState(1);
    const [loading, setLoading] = useState(true);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        bannersApi.list()
            .then(data => setBanners(data.filter(b => b.isActive).sort((a, b) => a.order - b.order)))
            .catch(() => setBanners([]))
            .finally(() => setLoading(false));
    }, []);

    /* Автопрокрутка — перезапускается при смене слайда или паузе */
    useEffect(() => {
        if (banners.length <= 1 || paused) return;
        const id = setInterval(() => {
            setDir(1);
            setActive(i => (i + 1) % banners.length);
        }, INTERVAL_MS);
        return () => clearInterval(id);
    }, [active, paused, banners.length]);

    const goTo = (index: number) => {
        setDir(index > active ? 1 : -1);
        setActive(index);
    };

    const handlePrev = () => {
        setDir(-1);
        setActive(i => (i - 1 + banners.length) % banners.length);
    };

    const handleNext = () => {
        setDir(1);
        setActive(i => (i + 1) % banners.length);
    };

    if (loading) {
        return <div className="animate-pulse bg-zinc-200 rounded-3xl min-h-50 lg:min-h-75" />;
    }

    if (banners.length === 0) return null;

    const banner = banners[active];

    return (
        <div
            className="relative bg-[#111111] rounded-3xl overflow-hidden min-h-50 lg:min-h-75 flex items-center"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* Background image */}
            <AnimatePresence custom={dir} initial={false}>
                <motion.img
                    key={`img-${active}`}
                    custom={dir}
                    variants={imgSlide}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={TRANSITION}
                    src={banner.imageUrl}
                    alt=""
                    className="absolute right-0 top-0 h-full w-[60%] object-cover select-none pointer-events-none"
                    style={{ maskImage: 'linear-gradient(to left, black 30%, transparent 80%)' }}
                />
            </AnimatePresence>

            {/* Gradient */}
            <div className="absolute inset-0 bg-linear-to-r from-[#111111] via-[#111111]/90 to-transparent pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 p-7 sm:p-10 lg:p-14 w-full">
                <AnimatePresence custom={dir} mode="wait">
                    <motion.div
                        key={`content-${active}`}
                        custom={dir}
                        variants={slide}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={TRANSITION}
                        className="space-y-4 lg:space-y-5 max-w-[65%]"
                    >
                        <div className="flex items-center gap-3 flex-wrap">
                            {banner.subtitle && (
                                <span className="text-[9px] font-black tracking-[0.35em] uppercase text-white/35">
                                    {banner.subtitle}
                                </span>
                            )}
                            <span className="hidden lg:inline-flex items-center gap-1.5 bg-white/8 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                                <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Доступно сейчас</span>
                            </span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white tracking-tight leading-[0.9]">
                            {banner.title}
                        </h2>

                        {banner.description && (
                            <p className="hidden sm:block text-xs text-white/45 font-medium leading-relaxed max-w-xs">
                                {banner.description}
                            </p>
                        )}

                        {banner.action && (
                            <Link
                                href={banner.action}
                                className="inline-flex items-center gap-2.5 bg-white text-[#111111] text-[10px] lg:text-xs font-black
                                           px-5 py-2.5 lg:px-7 lg:py-3.5 rounded-xl hover:bg-zinc-100 transition-colors uppercase tracking-widest"
                            >
                                {banner.buttonLabel ?? 'Смотреть'}
                                <ArrowRight size={12} />
                            </Link>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                {banners.length > 1 && (
                    <div className="absolute bottom-5 right-5 lg:bottom-8 lg:right-8 flex items-center gap-3">
                        {/* Dots */}
                        <div className="flex items-center gap-1.5">
                            {banners.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goTo(i)}
                                    aria-label={`Слайд ${i + 1}`}
                                    className={`rounded-full transition-all duration-300 ${
                                        i === active
                                            ? 'w-5 h-1.5 bg-white'
                                            : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
                                    }`}
                                />
                            ))}
                        </div>

                        {/* Arrows */}
                        <div className="flex gap-1">
                            <button
                                onClick={handlePrev}
                                aria-label="Предыдущий"
                                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-colors active:scale-95"
                            >
                                <ChevronLeft size={15} />
                            </button>
                            <button
                                onClick={handleNext}
                                aria-label="Следующий"
                                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-colors active:scale-95"
                            >
                                <ChevronRight size={15} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
