'use client';

import { useState } from 'react';
import { Star, MessageSquare, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import type { Review } from '@/lib/types';

const Stars = ({ rating, size = 13 }: { rating: number; size?: number }) => (
    <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
            <Star
                key={i}
                size={size}
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
    description?: string | null;
    reviews: Review[];
}

export const ProductTabsUi: React.FC<Props> = ({ description, reviews }) => {
    const [tab, setTab] = useState<'desc' | 'reviews'>('desc');

    const avg = reviews.length > 0
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : 0;

    return (
        <div>
            {/* Tab nav */}
            <div className="flex gap-10 border-b border-black/8">
                {([
                    { key: 'desc', label: 'Описание' },
                    { key: 'reviews', label: `Отзывы (${reviews.length})` },
                ] as const).map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setTab(key)}
                        className={`pb-5 pt-2 text-xs font-black uppercase tracking-widest relative transition-colors ${
                            tab === key ? 'text-black' : 'text-zinc-400 hover:text-zinc-600'
                        }`}
                    >
                        {label}
                        {tab === key && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* Description */}
            {tab === 'desc' && (
                <div className="py-10 max-w-3xl">
                    {description
                        ? <p className="text-sm text-zinc-600 leading-loose">{description}</p>
                        : <p className="text-sm text-zinc-400 italic">Описание товара отсутствует.</p>
                    }
                </div>
            )}

            {/* Reviews */}
            {tab === 'reviews' && (
                <div className="py-10 space-y-8">

                    {/* Rating summary */}
                    {reviews.length > 0 && (
                        <div className="flex flex-wrap items-start gap-8 p-6 bg-white rounded-3xl border border-black/5 w-fit">
                            <div className="text-center space-y-1">
                                <div className="text-5xl font-black tracking-tight">{avg.toFixed(1)}</div>
                                <Stars rating={avg} size={16} />
                                <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wide">
                                    {reviews.length} {plural(reviews.length)}
                                </div>
                            </div>
                            <div className="space-y-2 min-w-36 pt-1">
                                {[5, 4, 3, 2, 1].map(star => {
                                    const count = reviews.filter(r => Math.round(r.rating) === star).length;
                                    const pct = (count / reviews.length) * 100;
                                    return (
                                        <div key={star} className="flex items-center gap-2.5 text-[10px] font-bold">
                                            <span className="text-zinc-400 w-2 text-right">{star}</span>
                                            <div className="h-1.5 w-32 bg-zinc-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-amber-400 rounded-full"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                            <span className="text-zinc-400">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Profile notice */}
                    <div className="flex items-start gap-3 px-5 py-4 bg-zinc-50 border border-black/6 rounded-2xl text-xs text-zinc-500 font-medium">
                        <ShieldCheck size={16} className="text-zinc-300 shrink-0 mt-px" />
                        <span>
                            Оставить отзыв можно в{' '}
                            <Link href="/profile/orders" className="text-black font-bold underline underline-offset-2 hover:opacity-70">
                                личном кабинете
                            </Link>
                            {' '}после получения заказа.
                        </span>
                    </div>

                    {/* Review list */}
                    {reviews.length === 0 ? (
                        <div className="text-center py-16 space-y-3">
                            <MessageSquare size={40} className="text-zinc-200 mx-auto" />
                            <p className="text-sm font-black text-zinc-400">Отзывов пока нет</p>
                            <p className="text-xs text-zinc-300">Будьте первым, кто оценит этот товар</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map(review => (
                                <div key={review.id} className="bg-white rounded-3xl border border-black/5 p-6">
                                    <div className="flex items-start gap-4">
                                        {/* Avatar */}
                                        <div className="w-10 h-10 rounded-full bg-zinc-100 overflow-hidden shrink-0 flex items-center justify-center text-xs font-black text-zinc-500">
                                            {review.user.avatarUrl
                                                ? <img src={review.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                                                : <span>{review.user.name.charAt(0).toUpperCase()}</span>
                                            }
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <span className="text-xs font-black">{review.user.name}</span>
                                                <span className="text-[10px] text-zinc-400 font-medium shrink-0">
                                                    {new Date(review.createdAt).toLocaleDateString('ru-RU', {
                                                        day: 'numeric', month: 'long', year: 'numeric',
                                                    })}
                                                </span>
                                            </div>
                                            <Stars rating={review.rating} size={12} />
                                            <p className="text-sm text-zinc-600 leading-relaxed mt-2">{review.comment}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
