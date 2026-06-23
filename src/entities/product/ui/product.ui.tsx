'use client'

import { useEffect, useState } from 'react';
import { characteristicsApi, productsApi, reviewsApi } from '@/lib/api';
import Link from 'next/link';
import { Package, Tag, Layers, ArrowLeft, Star } from 'lucide-react';
import { ProductGalleryUi } from './product-gallery.ui';
import { ProductActionsUi } from './product-actions.ui';
import { ProductTabsUi } from './product-tabs.ui';
import { ProductRelatedUi } from './product-related.ui';
import type { Characteristic, Product, Review } from '@/lib/types';

const colorLabels: Record<string, string> = {
    white_ivory: 'Белый / Слоновая кость',
    architectural_grey: 'Архитектурный серый',
    carbon_black: 'Карбон чёрный',
    olive_green: 'Оливковый',
};

const Stars = ({ rating }: { rating: number }) => (
    <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
            <Star
                key={i}
                size={13}
                fill={i <= Math.round(rating) ? 'currentColor' : 'none'}
                className={i <= Math.round(rating) ? 'text-amber-400' : 'text-zinc-200'}
            />
        ))}
    </div>
);

function plural(n: number) {
    if (n % 10 === 1 && n % 100 !== 11) return 'отзыв';
    if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'отзыва';
    return 'отзывов';
}

interface Props {
    slug: string;
}

export const ProductUi = ({ slug }: Props) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [related, setRelated] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(false);

        (async () => {
            try {
                const p = await productsApi.getBySlug(slug);
                if (cancelled) return;
                setProduct(p);
                productsApi.incrementPopularity(p.id).catch(() => {});

                const [reviewsData, relatedPage, chars] = await Promise.all([
                    reviewsApi.list(p.id).catch(() => [] as Review[]),
                    productsApi.list({ limit: 5 }).catch(() => ({ items: [] as Product[] })),
                    characteristicsApi.list().catch(() => [] as Characteristic[]),
                ]);
                if (!cancelled) setCharacteristics(chars);
                if (cancelled) return;
                setReviews(reviewsData);
                setRelated(relatedPage.items.filter(r => r.id !== p.id).slice(0, 4));
            } catch {
                if (!cancelled) setError(true);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => { cancelled = true; };
    }, [slug]);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-14">
                    <div className="lg:col-span-6 aspect-square rounded-3xl bg-white animate-pulse" />
                    <div className="lg:col-span-6 space-y-5 pt-4">
                        <div className="h-4 w-24 bg-white rounded-full animate-pulse" />
                        <div className="h-10 w-3/4 bg-white rounded-2xl animate-pulse" />
                        <div className="h-8 w-32 bg-white rounded-2xl animate-pulse" />
                        <div className="h-px bg-black/5" />
                        <div className="space-y-2">
                            <div className="h-3 bg-white rounded animate-pulse" />
                            <div className="h-3 bg-white rounded animate-pulse w-5/6" />
                            <div className="h-3 bg-white rounded animate-pulse w-4/6" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">404</p>
                    <h1 className="text-2xl font-black uppercase tracking-tight">Товар не найден</h1>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors"
                    >
                        <ArrowLeft size={12} />
                        В каталог
                    </Link>
                </div>
            </div>
        );
    }

    const hasDiscount = product.isOnSale && product.discountPercent > 0;
    const finalPrice = hasDiscount
        ? product.price * (1 - product.discountPercent / 100)
        : product.price;

    const avgRating = reviews.length > 0
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : 0;

    const charById = new Map(characteristics.map(c => [c.id, c.name]));
    const n = (id: string) => charById.get(id) ?? id;
    const join = (ids: string[]) => ids.map(n).join(', ');

    const s = product.spec;
    const specRows: { label: string; value: string }[] = s ? [
        s.styles.length        && { label: 'Стиль',                 value: join(s.styles) },
        s.rooms.length         && { label: 'Тип комнаты',           value: join(s.rooms) },
        s.shapes.length        && { label: 'Форма',                 value: join(s.shapes) },
        s.mountingType         && { label: 'Тип крепления',         value: n(s.mountingType) },
        s.lampType             && { label: 'Тип лампы',             value: n(s.lampType) },
        s.lampCount != null    && { label: 'Количество ламп',       value: String(s.lampCount) },
        s.powerW    != null    && { label: 'Мощность',              value: `${s.powerW} Вт` },
        s.lumens    != null    && { label: 'Световой поток',        value: `${s.lumens} лм` },
        s.colorTemps.length    && { label: 'Цветовая температура',  value: join(s.colorTemps) },
        s.frameMaterial        && { label: 'Материал корпуса',      value: n(s.frameMaterial) },
        s.frameColor           && { label: 'Цвет корпуса',          value: n(s.frameColor) },
        s.shadeMaterials.length && { label: 'Материал плафона',     value: join(s.shadeMaterials) },
        s.shadeColors.length   && { label: 'Цвет плафона',          value: join(s.shadeColors) },
        s.maxAreaM2 != null    && { label: 'Площадь освещения',     value: `до ${s.maxAreaM2} м²` },
        s.weightKg  != null    && { label: 'Вес',                   value: `${s.weightKg} кг` },
        s.model                && { label: 'Модель',                value: s.model },
    ].filter(Boolean) as { label: string; value: string }[] : [];

    const attributeSpecs = product.attributes
        ? product.attributes.map(a => ({ label: a.name, value: a.value }))
        : [];

    const specs: { label: string; value: string; highlight?: 'green' | 'red' }[] = [
        product.category && { label: 'Категория', value: product.category.name },
        product.material && { label: 'Материал', value: product.material },
        product.color && { label: 'Цвет', value: colorLabels[product.color] ?? product.color },
        ...attributeSpecs,
        ...specRows,
        {
            label: 'Наличие',
            value: product.stock > 0 ? `${product.stock} шт. в наличии` : 'Нет в наличии',
            highlight: product.stock > 0 ? 'green' : 'red',
        },
        { label: 'Артикул', value: product.slug.toUpperCase() },
    ].filter(Boolean) as { label: string; value: string; highlight?: 'green' | 'red' }[];

    return (
        <div className="min-h-screen">

            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-6 pt-8 pb-6">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors group"
                >
                    <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
                    Каталог
                    {product.category && (
                        <>
                            <span className="text-zinc-300">/</span>
                            <span className="text-zinc-500">{product.category.name}</span>
                        </>
                    )}
                    <span className="text-zinc-300">/</span>
                    <span className="text-zinc-700">{product.name}</span>
                </Link>
            </div>

            {/* HERO — 2-column */}
            <div className="max-w-7xl mx-auto px-6 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

                    {/* LEFT: sticky gallery */}
                    <div className="lg:col-span-6 lg:sticky lg:top-8">
                        <ProductGalleryUi images={product.images} name={product.name} />
                    </div>

                    {/* RIGHT: product info */}
                    <div className="lg:col-span-6 space-y-7">

                        {/* Badges row */}
                        <div className="flex flex-wrap gap-2">
                            {product.category && (
                                <span className="text-[9px] font-black tracking-[0.25em] uppercase text-zinc-500 bg-white border border-black/8 px-3 py-1.5 rounded-full">
                                    {product.category.name}
                                </span>
                            )}
                            {hasDiscount && (
                                <span className="text-[9px] font-black tracking-widest uppercase text-white bg-[#111111] px-3 py-1.5 rounded-full">
                                    −{product.discountPercent}% SALE
                                </span>
                            )}
                            {product.stock > 0 && product.stock <= 5 && (
                                <span className="text-[9px] font-black tracking-widest uppercase text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
                                    Осталось {product.stock} шт.
                                </span>
                            )}
                        </div>

                        {/* Name */}
                        <div className="space-y-3">
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-[0.93]">
                                {product.name}
                            </h1>
                            {reviews.length > 0 && (
                                <div className="flex items-center gap-3">
                                    <Stars rating={avgRating} />
                                    <span className="text-xs text-zinc-400 font-bold">
                                        {avgRating.toFixed(1)} · {reviews.length} {plural(reviews.length)}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-4">
                            <span className="text-3xl font-black tracking-tight">{finalPrice.toFixed(0)} ₽</span>
                            {hasDiscount && (
                                <span className="text-lg text-zinc-400 line-through font-medium">
                                    {product.price.toFixed(0)} ₽
                                </span>
                            )}
                        </div>

                        <div className="border-t border-black/8" />

                        {product.description && (
                            <p className="text-sm text-zinc-600 leading-relaxed line-clamp-4">
                                {product.description}
                            </p>
                        )}

                        {/* Attribute chips */}
                        <div className="flex flex-wrap gap-2">
                            {product.material && (
                                <div className="flex items-center gap-2 bg-white border border-black/8 rounded-full px-4 py-2 text-xs font-bold text-zinc-700">
                                    <Package size={12} className="text-zinc-400 shrink-0" />
                                    {product.material}
                                </div>
                            )}
                            {product.color && (
                                <div className="flex items-center gap-2 bg-white border border-black/8 rounded-full px-4 py-2 text-xs font-bold text-zinc-700">
                                    <Tag size={12} className="text-zinc-400 shrink-0" />
                                    {colorLabels[product.color] ?? product.color}
                                </div>
                            )}
                            {product.category && (
                                <div className="flex items-center gap-2 bg-white border border-black/8 rounded-full px-4 py-2 text-xs font-bold text-zinc-700">
                                    <Layers size={12} className="text-zinc-400 shrink-0" />
                                    {product.category.name}
                                </div>
                            )}
                        </div>

                        {/* Add to cart + favorites */}
                        <ProductActionsUi productId={product.id} inStock={product.stock > 0} />

                        {/* Specs table */}
                        <div className="bg-white rounded-3xl border border-black/5 overflow-hidden">
                            <div className="px-6 py-4 border-b border-black/5">
                                <h3 className="text-[9px] uppercase font-black tracking-[0.3em] text-zinc-400">
                                    Характеристики
                                </h3>
                            </div>
                            <div className="divide-y divide-black/5 text-xs">
                                {specs.map(({ label, value, highlight }) => (
                                    <div key={label} className="flex justify-between items-center px-6 py-3.5 gap-4">
                                        <span className="text-zinc-400 shrink-0">{label}</span>
                                        <span className={`font-bold text-right ${
                                            highlight === 'green' ? 'text-green-700' :
                                            highlight === 'red' ? 'text-red-500' : ''
                                        }`}>
                                            {value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* TABS — Description / Reviews */}
            <div className="max-w-7xl mx-auto px-6">
                <ProductTabsUi description={product.description} reviews={reviews} />
            </div>

            {/* RELATED PRODUCTS */}
            <div className="max-w-7xl mx-auto px-6">
                <ProductRelatedUi products={related} />
            </div>

        </div>
    );
};
