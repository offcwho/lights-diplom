'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Lamp, Armchair, Sofa, LayoutGrid, HelpCircle, Package } from 'lucide-react';
import type { Category } from '@/lib/types';

/* ── Background images (lighting / interior mood) ── */
const BG_IMAGES = [
    'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop',
];

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    all: LayoutGrid,
    chairs: Armchair,
    armchairs: Sofa,
    lighting: Lamp,
    pendant: Lamp,
    floor: Package,
};

function getIcon(cat: Category) {
    return ICON_MAP[cat.id] ?? ICON_MAP[cat.slug] ?? HelpCircle;
}

/* ── Stagger animation ── */
const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
};
const cardVariant = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 26 } },
} as const;

interface Props {
    categories: Category[];
    totalProducts: number;
}

export const CategoriesPageUi = ({ categories, totalProducts }: Props) => {
    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-6 pt-8 pb-24">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-12">
                    <Link href="/" className="hover:text-black transition-colors">Главная</Link>
                    <span>/</span>
                    <Link href="/catalog" className="hover:text-black transition-colors">Каталог</Link>
                    <span>/</span>
                    <span className="text-black">Коллекции</span>
                </nav>

                {/* Hero */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.38em] text-zinc-400 mb-4">
                            Весь ассортимент
                        </p>
                        <h1 className="text-6xl lg:text-8xl font-black uppercase tracking-tight leading-[0.88]">
                            Кол&shy;лек&shy;ции
                        </h1>
                    </div>

                    {/* Stats + description */}
                    <div className="flex flex-col items-start lg:items-end gap-3">
                        <div className="flex items-center gap-4">
                            <div className="text-center">
                                <div className="text-3xl font-black tracking-tight">{categories.length}</div>
                                <div className="text-[9px] font-black uppercase tracking-widest text-zinc-400">категорий</div>
                            </div>
                            <div className="w-px h-10 bg-black/10" />
                            <div className="text-center">
                                <div className="text-3xl font-black tracking-tight">{totalProducts}</div>
                                <div className="text-[9px] font-black uppercase tracking-widest text-zinc-400">позиций</div>
                            </div>
                        </div>
                        <p className="hidden lg:block text-xs text-zinc-400 font-medium max-w-56 text-right leading-relaxed">
                            Освещение для любого пространства — от минимализма до арт-деко
                        </p>
                    </div>
                </div>

                {/* Category grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5"
                >
                    {categories.map((cat, i) => {
                        const Icon = getIcon(cat);
                        const bgImg = BG_IMAGES[i % BG_IMAGES.length];
                        /* First card spans 2 columns on mobile */
                        const isHero = i === 0;

                        return (
                            <motion.div
                                key={cat.id}
                                variants={cardVariant}
                                className={isHero ? 'col-span-2 lg:col-span-1' : ''}
                            >
                                <Link
                                    href="/catalog"
                                    className="group relative flex flex-col overflow-hidden rounded-3xl bg-zinc-900 cursor-pointer select-none"
                                    style={{ aspectRatio: isHero ? '16/9' : '4/5' }}
                                >
                                    {/* BG image */}
                                    <img
                                        src={bgImg}
                                        alt={cat.name}
                                        className="absolute inset-0 w-full h-full object-cover opacity-55 group-hover:opacity-70 group-hover:scale-105 transition-all duration-500"
                                    />

                                    {/* Gradient overlay — dark at bottom */}
                                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/10" />

                                    {/* Top: icon badge */}
                                    <div className="relative z-10 p-5">
                                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
                                            <Icon size={18} className="text-white" />
                                        </span>
                                    </div>

                                    {/* Bottom: name + count + arrow */}
                                    <div className="relative z-10 mt-auto p-5 flex items-end justify-between gap-3">
                                        <div>
                                            {cat.productCount !== undefined && (
                                                <span className="text-[9px] font-black uppercase tracking-widest text-white/45 block mb-1.5">
                                                    {cat.productCount} поз.
                                                </span>
                                            )}
                                            <h2 className="text-lg lg:text-xl font-black uppercase tracking-tight text-white leading-tight">
                                                {cat.name}
                                            </h2>
                                        </div>

                                        {/* Arrow — appears on hover */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -6 }}
                                            whileHover={{ opacity: 1, x: 0 }}
                                            className="shrink-0 w-10 h-10 rounded-2xl bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-0 transition-all duration-300"
                                        >
                                            <ArrowRight size={16} className="text-black" />
                                        </motion.div>
                                    </div>

                                    {/* "Смотреть" label on hover */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
                                        <span className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full">
                                            Смотреть
                                        </span>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Bottom CTA */}
                {categories.length === 0 && (
                    <div className="text-center py-24 space-y-4">
                        <p className="text-sm font-black uppercase tracking-widest text-zinc-300">
                            Категории не найдены
                        </p>
                        <Link
                            href="/catalog"
                            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-black text-white px-6 py-3 rounded-xl hover:bg-zinc-800 transition-colors"
                        >
                            Перейти в каталог
                            <ArrowRight size={12} />
                        </Link>
                    </div>
                )}

                {/* Footer link */}
                {categories.length > 0 && (
                    <div className="mt-16 flex items-center justify-center">
                        <Link
                            href="/catalog"
                            className="group inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors"
                        >
                            Смотреть все товары
                            <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center group-hover:bg-black group-hover:border-black group-hover:text-white transition-all">
                                <ArrowRight size={13} />
                            </span>
                        </Link>
                    </div>
                )}

            </div>
        </div>
    );
};
