'use client'

import { useEffect, useState } from 'react';
import { ordersApi } from '@/lib/api';
import type { Order, OrderStatus } from '@/lib/types';
import Link from 'next/link';
import { ArrowLeft, Box, CheckCircle2, Clock, CreditCard, Loader2, Package, Truck, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_MAP: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
    new: { label: 'Ожидает оплаты', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: <Clock size={15} /> },
    paid: { label: 'Оплачен', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: <CheckCircle2 size={15} /> },
    shipped: { label: 'Сборка', color: 'text-violet-600 bg-violet-50 border-violet-200', icon: <Box size={15} /> },
    sent: { label: 'Отправлен', color: 'text-violet-600 bg-violet-50 border-violet-200', icon: <Truck size={15} /> },
    completed: { label: 'Доставлен', color: 'text-green-700 bg-green-50 border-green-200', icon: <CheckCircle2 size={15} /> },
    cancelled: { label: 'Отменён', color: 'text-red-500 bg-red-50 border-red-200', icon: <XCircle size={15} /> },
};

const STEPS: OrderStatus[] = ['new', 'paid', 'shipped', 'sent', 'completed'];

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('ru-RU', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
}

const STEP_LABELS = ['Создан', 'Оплачен', 'Cборка', 'Отправлен', 'Доставлен'];

function ProgressBar({ status }: { status: string }) {
    if (status === 'cancelled') return null;
    const idx = STEPS.indexOf(status as OrderStatus);
    // Если бэкенд вернул неизвестный статус — показываем первый шаг как активный
    const current = idx === -1 ? 0 : idx;
    const lineWidth = current === 0 ? 0 : `calc((100% - 24px) * ${current / (STEPS.length - 1)})`;

    return (
        <div className="space-y-1">
            <div className="relative flex justify-between">
                {/* Фоновая линия */}
                <div className="absolute top-3 left-3 right-3 h-px bg-zinc-200" />
                {/* Прогресс-линия */}
                <div
                    className="absolute top-3 left-3 h-px bg-[#111111] transition-all duration-500"
                    style={{ width: lineWidth }}
                />

                {STEPS.map((step, i) => {
                    const done = i <= current;
                    return (
                        <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${done ? 'bg-[#111111] border-[#111111]' : 'bg-white border-zinc-200'
                                }`}>
                                {done && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-wide text-center leading-tight ${done ? 'text-zinc-800' : 'text-zinc-300'
                                }`}>
                                {STEP_LABELS[i]}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export const OrderDetailUi = ({ orderId }: { orderId: string }) => {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [paying, setPaying] = useState(false);

    const handlePay = async () => {
        if (!order) return;
        setPaying(true);
        try {
            const updated = await ordersApi.pay(order.id);
            setOrder(updated);
            toast.success('Оплата прошла успешно!');
        } catch {
            toast.error('Не удалось провести оплату. Попробуйте ещё раз.');
        } finally {
            setPaying(false);
        }
    };

    useEffect(() => {
        ordersApi.getOne(orderId)
            .then(setOrder)
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [orderId]);

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

    return (
        <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">

            {/* Back */}
            <Link
                href="/profile"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors group"
            >
                <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
                Назад в профиль
            </Link>

            {/* Title */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-1">Заказ</p>
                    <h1 className="text-2xl font-black uppercase tracking-tight">
                        #{order.id.slice(-6).toUpperCase()}
                    </h1>
                    <p className="text-xs text-zinc-400 mt-1">{formatDate(order.createdAt)}</p>
                </div>
                <span className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl border ${color}`}>
                    {icon} {label}
                </span>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-3xl border border-black/5 px-6 py-5">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-5">Статус доставки</p>
                <ProgressBar status={String(order.status)} />
                {order.status === 'cancelled' && (
                    <p className="text-sm text-red-500 font-bold">Этот заказ был отменён</p>
                )}
            </div>

            {/* Pay button */}
            {order.status === 'new' && (
                <div className="bg-amber-50 border border-amber-200 rounded-3xl px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <p className="text-xs font-black uppercase tracking-wide text-amber-800">Ожидает оплаты</p>
                        <p className="text-[10px] text-amber-600 mt-0.5">Заказ будет подтверждён после оплаты</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                        <button
                            onClick={handlePay}
                            disabled={paying}
                            className="inline-flex items-center gap-2 bg-[#111111] text-white text-[10px] font-black uppercase tracking-widest px-5 py-3 rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-60"
                        >
                            {paying ? <Loader2 size={13} className="animate-spin" /> : <CreditCard size={13} />}
                            {paying ? 'Обработка…' : `Оплатить ${order.total.toLocaleString('ru-RU')} ₽`}
                        </button>
                    </div>
                </div>
            )}

            {/* Items */}
            <div className="bg-white rounded-3xl border border-black/5 overflow-hidden">
                <div className="px-5 py-4 border-b border-black/5">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Товары</p>
                </div>
                <div className="divide-y divide-black/5">
                    {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between px-5 py-4 gap-4">
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
                    ))}
                </div>
                <div className="flex items-center justify-between px-5 py-4 bg-zinc-50 border-t border-black/5">
                    <span className="text-xs font-bold text-zinc-500">Итого</span>
                    <span className="text-lg font-black">{order.total.toLocaleString('ru-RU')} ₽</span>
                </div>
            </div>

            {/* Delivery info */}
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
