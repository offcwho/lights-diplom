'use client'

import { useEffect, useState } from 'react';
import { ordersApi, reviewsApi } from '@/lib/api';
import type { Order, OrderItem, OrderStatus, Review } from '@/lib/types';
import Link from 'next/link';
import { ArrowLeft, Box, CheckCircle2, Clock, CreditCard, Loader2, Package, Star, Truck, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/AuthContext';

const STATUS_MAP: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
    new: { label: 'Ожидает оплаты', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: <Clock size={15} /> },
    paid: { label: 'Оплачен', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: <CheckCircle2 size={15} /> },
    shipped: { label: 'Сборка', color: 'text-violet-600 bg-violet-50 border-violet-200', icon: <Box size={15} /> },
    sent: { label: 'Отправлен', color: 'text-violet-600 bg-violet-50 border-violet-200', icon: <Truck size={15} /> },
    completed: { label: 'Доставлен', color: 'text-green-700 bg-green-50 border-green-200', icon: <CheckCircle2 size={15} /> },
    cancelled: { label: 'Отменён', color: 'text-red-500 bg-red-50 border-red-200', icon: <XCircle size={15} /> },
};

const STEPS: OrderStatus[] = ['new', 'paid', 'shipped', 'sent', 'completed'];
const STEP_LABELS = ['Создан', 'Оплачен', 'Cборка', 'Отправлен', 'Доставлен'];

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('ru-RU', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
}

function ProgressBar({ status }: { status: string }) {
    if (status === 'cancelled') return null;
    const idx = STEPS.indexOf(status as OrderStatus);
    const current = idx === -1 ? 0 : idx;
    const lineWidth = current === 0 ? 0 : `calc((100% - 24px) * ${current / (STEPS.length - 1)})`;

    return (
        <div className="relative flex justify-between">
            <div className="absolute top-3 left-3 right-3 h-px bg-zinc-200" />
            <div className="absolute top-3 left-3 h-px bg-[#111111] transition-all duration-500" style={{ width: lineWidth }} />
            {STEPS.map((step, i) => {
                const done = i <= current;
                return (
                    <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${done ? 'bg-[#111111] border-[#111111]' : 'bg-white border-zinc-200'}`}>
                            {done && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-wide text-center leading-tight ${done ? 'text-zinc-800' : 'text-zinc-300'}`}>
                            {STEP_LABELS[i]}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

/* ---------- Star picker ---------- */
function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    const [hovered, setHovered] = useState(0);
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(i => {
                const filled = i <= (hovered || value);
                return (
                    <button
                        key={i}
                        type="button"
                        onMouseEnter={() => setHovered(i)}
                        onMouseLeave={() => setHovered(0)}
                        onClick={() => onChange(i)}
                        className="transition-transform hover:scale-110"
                    >
                        <Star size={20} fill={filled ? 'currentColor' : 'none'} className={filled ? 'text-amber-400' : 'text-zinc-300'} />
                    </button>
                );
            })}
        </div>
    );
}

/* ---------- Review form ---------- */
function ReviewForm({ item, onDone }: { item: OrderItem; onDone: (review: Review) => void }) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        if (!item.productId) return;
        if (rating === 0) { toast.error('Поставьте оценку'); return; }
        if (!comment.trim()) { toast.error('Напишите отзыв'); return; }
        setLoading(true);
        try {
            const review = await reviewsApi.create({ productId: item.productId, rating, body: comment.trim() });
            toast.success('Отзыв оставлен, спасибо!');
            onDone(review);
        } catch (e: unknown) {
            const status = (e as { response?: { status?: number } })?.response?.status;
            if (status === 409) {
                toast.error('Вы уже оставляли отзыв на этот товар');
            } else {
                toast.error('Не удалось отправить отзыв');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-3 border-t border-black/5 pt-3 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Ваш отзыв</p>
            <StarPicker value={rating} onChange={setRating} />
            <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Напишите о товаре..."
                rows={3}
                className="w-full rounded-xl border border-black/10 bg-zinc-50 px-3 py-2 text-xs font-medium outline-none focus:border-black/30 resize-none transition-colors"
            />
            <button
                onClick={submit}
                disabled={loading}
                className="inline-flex items-center gap-2 bg-[#111111] text-white text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
                {loading && <Loader2 size={12} className="animate-spin" />}
                Отправить
            </button>
        </div>
    );
}

/* ---------- Single order item row ---------- */
function OrderItemRow({
    item,
    canReview,
    existingReview,
}: {
    item: OrderItem;
    canReview: boolean;
    existingReview: Review | null | undefined;
}) {
    const [myReview, setMyReview] = useState<Review | null>(existingReview ?? null);

    useEffect(() => {
        setMyReview(existingReview ?? null);
    }, [existingReview]);

    return (
        <div className="px-5 py-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-zinc-100 flex items-center justify-center shrink-0">
                        <Package size={16} className="text-zinc-400" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-bold text-zinc-800 truncate">{item.name}</p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">{item.quantity} шт. × {item.price.toLocaleString('ru-RU')} ₽</p>
                    </div>
                </div>
                <span className="text-sm font-black shrink-0">
                    {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                </span>
            </div>

            {canReview && item.productId && (
                myReview ? (
                    <div className="mt-3 border-t border-black/5 pt-3 space-y-1">
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star key={i} size={14} fill={i <= myReview.rating ? 'currentColor' : 'none'} className={i <= myReview.rating ? 'text-amber-400' : 'text-zinc-200'} />
                            ))}
                            <span className="text-[10px] font-bold text-green-600 uppercase tracking-wide ml-1">Отзыв оставлен</span>
                        </div>
                        <p className="text-[11px] text-zinc-500">{myReview.body}</p>
                    </div>
                ) : (
                    <ReviewForm item={item} onDone={r => setMyReview(r)} />
                )
            )}
        </div>
    );
}

/* ---------- Main component ---------- */
export const OrderDetailUi = ({ orderId }: { orderId: string }) => {
    const { user } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    // productId → user's existing review (or null if not reviewed)
    const [reviewMap, setReviewMap] = useState<Record<string, Review | null>>({});
    const [reviewsLoading, setReviewsLoading] = useState(false);

    useEffect(() => {
        ordersApi.getOne(orderId)
            .then(setOrder)
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [orderId]);

    // Load reviews for all products once order is completed
    useEffect(() => {
        if (!order || order.status !== 'completed' || !user) return;
        const productIds = order.items.map(i => i.productId).filter(Boolean) as string[];
        if (!productIds.length) return;

        setReviewsLoading(true);
        Promise.all(
            productIds.map(pid =>
                reviewsApi.list(pid)
                    .then(rs => [pid, rs.find(r => r.userId === user.id) ?? null] as const)
                    .catch(() => [pid, null] as const)
            )
        ).then(pairs => {
            const map: Record<string, Review | null> = {};
            for (const [pid, review] of pairs) map[pid] = review;
            setReviewMap(map);
        }).finally(() => setReviewsLoading(false));
    }, [order, user]);

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto px-6 py-12 space-y-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-16 rounded-2xl bg-white animate-pulse" />
                ))}
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center">
                <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Ошибка</p>
                    <h1 className="text-2xl font-black uppercase">Заказ не найден</h1>
                    <Link href="/profile" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">
                        <ArrowLeft size={12} /> В профиль
                    </Link>
                </div>
            </div>
        );
    }

    const { label, color, icon } = STATUS_MAP[order.status] ?? { label: order.status, color: 'text-zinc-600 bg-zinc-100 border-zinc-200', icon: <Package size={15} /> };
    const canReview = order.status === 'completed';

    return (
        <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">

            <Link
                href="/profile"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors group"
            >
                <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
                Назад в профиль
            </Link>

            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-1">Заказ</p>
                    <h1 className="text-2xl font-black uppercase tracking-tight">#{order.id.slice(-6).toUpperCase()}</h1>
                    <p className="text-xs text-zinc-400 mt-1">{formatDate(order.createdAt)}</p>
                </div>
                <span className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl border ${color}`}>
                    {icon} {label}
                </span>
            </div>

            <div className="bg-white rounded-3xl border border-black/5 px-6 py-5">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-5">Статус доставки</p>
                <ProgressBar status={String(order.status)} />
                {order.status === 'cancelled' && (
                    <p className="text-sm text-red-500 font-bold mt-4">Этот заказ был отменён</p>
                )}
            </div>

            {order.status === 'new' && (
                <div className="bg-amber-50 border border-amber-200 rounded-3xl px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <p className="text-xs font-black uppercase tracking-wide text-amber-800">Ожидает оплаты</p>
                        <p className="text-[10px] text-amber-600 mt-0.5">Заказ будет подтверждён после оплаты</p>
                    </div>
                    <Link
                        href={`/order/payment/${order.id}`}
                        className="inline-flex items-center gap-2 bg-[#111111] text-white text-[10px] font-black uppercase tracking-widest px-5 py-3 rounded-xl hover:bg-zinc-800 transition-colors"
                    >
                        <CreditCard size={13} />
                        Оплатить {order.total.toLocaleString('ru-RU')} ₽
                    </Link>
                </div>
            )}

            <div className="bg-white rounded-3xl border border-black/5 overflow-hidden">
                <div className="px-5 py-4 border-b border-black/5 flex items-center justify-between">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Товары</p>
                    {canReview && (
                        <p className="text-[9px] font-bold uppercase tracking-wide text-green-600">
                            {reviewsLoading ? 'Загрузка...' : 'Оставьте отзыв на каждый товар'}
                        </p>
                    )}
                </div>
                <div className="divide-y divide-black/5">
                    {order.items.map((item) => (
                        <OrderItemRow
                            key={item.id}
                            item={item}
                            canReview={canReview && !reviewsLoading}
                            existingReview={item.productId ? reviewMap[item.productId] : null}
                        />
                    ))}
                </div>
                <div className="flex items-center justify-between px-5 py-4 bg-zinc-50 border-t border-black/5">
                    <span className="text-xs font-bold text-zinc-500">Итого</span>
                    <span className="text-lg font-black">{order.total.toLocaleString('ru-RU')} ₽</span>
                </div>
            </div>

            {(order.shippingAddress || order.phone) && (
                <div className="bg-white rounded-3xl border border-black/5 overflow-hidden">
                    <div className="px-5 py-4 border-b border-black/5">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Доставка</p>
                    </div>
                    <div className="divide-y divide-black/5 text-xs">
                        {order.shippingAddress && (
                            <div className="flex justify-between items-start gap-4 px-5 py-3.5">
                                <span className="text-zinc-400 shrink-0">Адрес</span>
                                <span className="font-bold text-right">{order.shippingAddress}</span>
                            </div>
                        )}
                        {order.phone && (
                            <div className="flex justify-between items-center gap-4 px-5 py-3.5">
                                <span className="text-zinc-400 shrink-0">Телефон</span>
                                <span className="font-bold">{order.phone}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
};
