'use client'

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/AuthContext';
import { ordersApi } from '@/lib/api';
import type { Order, OrderStatus } from '@/lib/types';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, Package, ShoppingBag } from 'lucide-react';

const STATUS_MAP: Record<OrderStatus, { label: string; color: string }> = {
    new: { label: 'Ожидает оплаты', color: 'bg-amber-100 text-amber-700' },
    paid: { label: 'Оплачен', color: 'bg-blue-100 text-blue-700' },
    sent: { label: 'Отправлен', color: 'bg-blue-100 text-blue-700' },
    shipped: { label: 'В доставке', color: 'bg-violet-100 text-violet-700' },
    completed: { label: 'Доставлен', color: 'bg-green-100 text-green-700' },
    cancelled: { label: 'Отменён', color: 'bg-red-100 text-red-500' },
};

const DONE: OrderStatus[] = ['completed', 'cancelled'];

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

/* ── Collapsed card (completed / cancelled) ─────────────────────── */
function DoneCard({ order }: { order: Order }) {
    const { label, color } = STATUS_MAP[order.status] ?? { label: order.status, color: 'bg-zinc-100 text-zinc-500' };
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between gap-4 bg-white/60 border border-black/5 rounded-2xl px-5 py-3.5"
        >
            <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
                    <Package size={14} className="text-zinc-400" />
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-wide text-zinc-800 truncate">
                        Заказ #{order.id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">{formatDate(order.createdAt)} · {order.total.toLocaleString('ru-RU')} ₽</p>
                </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${color}`}>
                    {label}
                </span>
                <Link
                    href={`/order/detail/${order.id}`}
                    className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors"
                >
                    Детали <ChevronRight size={11} />
                </Link>
            </div>
        </motion.div>
    );
}

/* ── Active card (pending / paid / shipped) ─────────────────────── */
function ActiveCard({ order }: { order: Order }) {
    const { label, color } = STATUS_MAP[order.status] ?? { label: order.status, color: 'bg-zinc-100 text-zinc-500' };
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-black/5 rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)]"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-[#111111] flex items-center justify-center shrink-0">
                        <ShoppingBag size={14} className="text-white" />
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase tracking-wide">
                            Заказ #{order.id.slice(-6).toUpperCase()}
                        </p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">{formatDate(order.createdAt)}</p>
                    </div>
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${color}`}>
                    {label}
                </span>
            </div>

            {/* Items */}
            <div className="px-5 py-3 divide-y divide-black/5">
                {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2.5 gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0 text-[10px] font-black text-zinc-400">
                                ×{item.quantity}
                            </div>
                            <span className="text-xs font-bold text-zinc-700 truncate">{item.name}</span>
                        </div>
                        <span className="text-xs font-black shrink-0">{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-4 bg-zinc-50/80 border-t border-black/5">
                <div>
                    {order.shippingAddress && (
                        <p className="text-[10px] text-zinc-400 max-w-50 truncate">
                            📍 {order.shippingAddress}
                        </p>
                    )}
                    <p className="text-sm font-black mt-0.5">
                        Итого: {order.total.toLocaleString('ru-RU')} ₽
                    </p>
                </div>
                <Link
                    href={`/order/detail/${order.id}`}
                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-[#111111] text-white px-4 py-2.5 rounded-xl hover:bg-zinc-800 transition-colors"
                >
                    Детали <ChevronRight size={11} />
                </Link>
            </div>
        </motion.div>
    );
}

/* ── Main tab ───────────────────────────────────────────────────── */
export const ProfileOrdersTab = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        ordersApi.list()
            .then(setOrders)
            .catch(() => setOrders([]))
            .finally(() => setLoading(false));
    }, [user]);

    const active = orders.filter((o) => !DONE.includes(o.status));
    const done = orders.filter((o) => DONE.includes(o.status));

    if (loading) {
        return (
            <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 rounded-2xl bg-white/60 animate-pulse" />
                ))}
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-14 h-14 rounded-3xl bg-white border border-black/5 flex items-center justify-center mb-5 shadow-sm">
                    <ShoppingBag size={20} className="text-zinc-300" strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-tight text-zinc-800 mb-1">Заказов пока нет</h3>
                <p className="text-xs text-zinc-400 mb-6">Ваши заказы будут отображаться здесь</p>
                <Link
                    href="/"
                    className="text-[10px] font-black uppercase tracking-widest bg-[#111111] text-white px-5 py-3 rounded-xl hover:bg-zinc-800 transition-colors"
                >
                    В каталог
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-base font-black uppercase tracking-wider text-zinc-800">
                История заказов
            </h2>

            {active.length > 0 && (
                <div className="space-y-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Активные</p>
                    <AnimatePresence>
                        {active.map((o) => <ActiveCard key={o.id} order={o} />)}
                    </AnimatePresence>
                </div>
            )}

            {done.length > 0 && (
                <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Завершённые</p>
                    <AnimatePresence>
                        {done.map((o) => <DoneCard key={o.id} order={o} />)}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};
