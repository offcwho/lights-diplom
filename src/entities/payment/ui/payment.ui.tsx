'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ordersApi } from '@/lib/api';
import type { Order } from '@/lib/types';
import { ArrowLeft, CheckCircle2, CreditCard, Loader2, Lock, Shield } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

/* ─── Card masks ─── */
function applyCardMask(raw: string) {
    const digits = raw.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
}

function applyExpiryMask(raw: string) {
    const digits = raw.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return digits.slice(0, 2) + '/' + digits.slice(2);
}

/* ─── Visual card ─── */
function CardVisual({ number, name, expiry, cvv, flipped }: {
    number: string; name: string; expiry: string; cvv: string; flipped: boolean;
}) {
    const displayNumber = number.padEnd(19, ' ').replace(/\d/g, (d, i) =>
        i < 14 ? (number[i] ?? '•') : (number[i] ?? '•')
    );
    const chunks = (number || '•••• •••• •••• ••••').padEnd(19, '•').match(/.{1,5}/g) ?? [];
    const formattedNumber = number
        ? number.padEnd(19, ' ').split(' ').map((g, i) =>
            i < 2 ? g.replace(/\d/g, '•') : g
          ).join(' ')
        : '•••• •••• •••• ••••';

    return (
        <div className="relative w-full max-w-[340px] mx-auto" style={{ perspective: '1000px', height: 200 }}>
            <motion.div
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                style={{ transformStyle: 'preserve-3d', width: '100%', height: '100%', position: 'relative' }}
            >
                {/* Front */}
                <div
                    className="absolute inset-0 rounded-3xl p-6 flex flex-col justify-between overflow-hidden"
                    style={{ backfaceVisibility: 'hidden', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
                >
                    <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.4) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(100,150,255,0.3) 0%, transparent 50%)'
                    }} />
                    <div className="relative flex justify-between items-start">
                        <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-300 to-amber-500 opacity-90" />
                        <CreditCard size={22} className="text-white/30" />
                    </div>
                    <div className="relative space-y-3">
                        <p className="text-white font-mono text-lg tracking-[0.2em] font-bold">
                            {number
                                ? number.split(' ').map((g, i) => i < 2 ? g.replace(/\d/g, '•') : g).join(' ').padEnd(19, '•')
                                : '•••• •••• •••• ••••'}
                        </p>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-white/40 text-[8px] uppercase tracking-widest mb-0.5">Владелец</p>
                                <p className="text-white font-bold text-sm uppercase tracking-wider truncate max-w-[180px]">
                                    {name || 'ВАШЕ ИМЯ'}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-white/40 text-[8px] uppercase tracking-widest mb-0.5">Срок</p>
                                <p className="text-white font-bold text-sm font-mono">
                                    {expiry || 'MM/YY'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back */}
                <div
                    className="absolute inset-0 rounded-3xl overflow-hidden flex flex-col justify-center"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
                >
                    <div className="w-full h-10 bg-black/60 mt-4" />
                    <div className="px-6 mt-4 space-y-2">
                        <p className="text-white/40 text-[8px] uppercase tracking-widest text-right">CVV</p>
                        <div className="bg-white/90 rounded-lg h-10 flex items-center justify-end px-4">
                            <p className="font-mono font-bold text-zinc-800 tracking-widest text-base">
                                {cvv ? cvv.replace(/./g, '•') : '•••'}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

/* ─── Input field ─── */
function PayField({ label, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">{label}</label>
            <input
                {...props}
                className={`w-full border-2 rounded-2xl px-4 py-3.5 text-sm font-bold outline-none transition-all bg-white font-mono tracking-wider placeholder:text-zinc-300 placeholder:font-normal focus:border-zinc-900 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.06)] ${error ? 'border-red-300' : 'border-zinc-200'}`}
            />
            {error && <p className="text-[10px] text-red-500 font-bold">{error}</p>}
        </div>
    );
}

/* ─── Main ─── */
export const PaymentUi = ({ orderId }: { orderId: string }) => {
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [loadingOrder, setLoadingOrder] = useState(true);
    const [done, setDone] = useState(false);
    const [paying, setPaying] = useState(false);

    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [cvvFocused, setCvvFocused] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        ordersApi.getOne(orderId)
            .then(o => {
                if (o.status !== 'new') {
                    router.replace(`/order/detail/${orderId}`);
                } else {
                    setOrder(o);
                }
            })
            .catch(() => router.replace('/profile'))
            .finally(() => setLoadingOrder(false));
    }, [orderId]);

    const validate = () => {
        const e: Record<string, string> = {};
        const digits = cardNumber.replace(/\D/g, '');
        if (digits.length !== 16) e.cardNumber = 'Введите 16 цифр номера карты';
        if (!cardName.trim() || cardName.trim().split(/\s+/).length < 2) e.cardName = 'Введите имя и фамилию как на карте';
        const expiryDigits = expiry.replace(/\D/g, '');
        if (expiryDigits.length !== 4) e.expiry = 'Введите срок действия (MM/YY)';
        else {
            const month = parseInt(expiryDigits.slice(0, 2));
            if (month < 1 || month > 12) e.expiry = 'Неверный месяц';
        }
        if (cvv.length < 3) e.cvv = 'Введите CVV (3 цифры)';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handlePay = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validate() || !order) return;
        setPaying(true);
        try {
            await ordersApi.pay(order.id);
            setDone(true);
            setTimeout(() => router.push(`/order/detail/${order.id}`), 2000);
        } catch {
            toast.error('Ошибка оплаты. Проверьте данные карты.');
        } finally {
            setPaying(false);
        }
    };

    if (loadingOrder) {
        return (
            <div className="max-w-lg mx-auto px-6 py-16 space-y-4">
                {[...Array(4)].map((_, i) => <div key={i} className="h-14 rounded-2xl bg-white animate-pulse" />)}
            </div>
        );
    }

    if (done) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-5"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                        className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto"
                    >
                        <CheckCircle2 size={36} className="text-green-600" />
                    </motion.div>
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tight">Оплачено!</h2>
                        <p className="text-sm text-zinc-400 mt-1">Перенаправляем на страницу заказа…</p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto px-6 py-10 space-y-8">

            <Link
                href={`/order/detail/${orderId}`}
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors group"
            >
                <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
                Назад к заказу
            </Link>

            <div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-1">Оплата</p>
                <h1 className="text-3xl font-black uppercase tracking-tight leading-none">
                    {order ? `${order.total.toLocaleString('ru-RU')} ₽` : '—'}
                </h1>
                {order && (
                    <p className="text-xs text-zinc-400 mt-1">
                        Заказ #{order.id.slice(-6).toUpperCase()}
                    </p>
                )}
            </div>

            {/* Card visual */}
            <CardVisual
                number={cardNumber}
                name={cardName.toUpperCase()}
                expiry={expiry}
                cvv={cvv}
                flipped={cvvFocused}
            />

            {/* Form */}
            <form onSubmit={handlePay} className="space-y-4">
                <PayField
                    label="Номер карты"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={e => setCardNumber(applyCardMask(e.target.value))}
                    error={errors.cardNumber}
                    inputMode="numeric"
                    maxLength={19}
                />
                <PayField
                    label="Имя на карте"
                    placeholder="IVAN IVANOV"
                    value={cardName}
                    onChange={e => setCardName(e.target.value.replace(/[^a-zA-Z\s]/g, '').toUpperCase())}
                    error={errors.cardName}
                    autoComplete="cc-name"
                />
                <div className="grid grid-cols-2 gap-4">
                    <PayField
                        label="Срок действия"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={e => setExpiry(applyExpiryMask(e.target.value))}
                        error={errors.expiry}
                        inputMode="numeric"
                        maxLength={5}
                    />
                    <PayField
                        label="CVV"
                        placeholder="•••"
                        type="password"
                        value={cvv}
                        onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        onFocus={() => setCvvFocused(true)}
                        onBlur={() => setCvvFocused(false)}
                        error={errors.cvv}
                        inputMode="numeric"
                        maxLength={3}
                        autoComplete="cc-csc"
                    />
                </div>

                <button
                    type="submit"
                    disabled={paying}
                    className="w-full flex items-center justify-center gap-3 bg-[#111111] text-white py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors disabled:opacity-60 mt-2"
                >
                    {paying
                        ? <><Loader2 size={16} className="animate-spin" /> Обработка…</>
                        : <><Lock size={15} /> Оплатить {order?.total.toLocaleString('ru-RU')} ₽</>
                    }
                </button>
            </form>

            <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-400">
                <Shield size={12} />
                Данные защищены шифрованием SSL
            </div>
        </div>
    );
};
