'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Loader2, MapPin, Package, Phone, Plus, User } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/AuthContext';
import { useCart } from '@/entities/cart/module/cart.context';
import { addressesApi, ordersApi } from '@/lib/api';
import type { Address } from '@/lib/types';
import { toast } from 'sonner';

function Field({
    label, icon, error, ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; icon: React.ReactNode; error?: string }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">{label}</label>
            <div className={`flex items-center gap-3 bg-white border rounded-2xl px-4 py-3.5 transition-all focus-within:border-black/40 focus-within:shadow-[0_0_0_3px_rgba(0,0,0,0.04)] ${error ? 'border-red-300' : 'border-black/8'}`}>
                <span className="text-zinc-300 shrink-0">{icon}</span>
                <input {...props} className="flex-1 text-sm font-medium outline-none bg-transparent placeholder:text-zinc-300 text-zinc-800" />
            </div>
            {error && <p className="text-[10px] text-red-500 font-bold">{error}</p>}
        </div>
    );
}

function formatAddress(a: Address) {
    return [a.city, a.street, `д. ${a.house}`, a.apartment ? `кв. ${a.apartment}` : '', a.zipCode].filter(Boolean).join(', ');
}

function applyPhoneMask(raw: string): string {
    let digits = raw.replace(/\D/g, '');
    if (!digits) return '';
    if (digits.startsWith('8')) digits = '7' + digits.slice(1);
    if (!digits.startsWith('7')) digits = '7' + digits;
    digits = digits.slice(0, 11);
    const local = digits.slice(1);
    let result = '+7';
    if (local.length === 0) return result;
    result += ' (' + local.slice(0, 3);
    if (local.length <= 3) return result;
    result += ') ' + local.slice(3, 6);
    if (local.length <= 6) return result;
    result += '-' + local.slice(6, 8);
    if (local.length <= 8) return result;
    result += '-' + local.slice(8, 10);
    return result;
}

export const CheckoutUi = () => {
    const { user } = useAuth();
    const { items, total, subtotal, clear } = useCart();
    const router = useRouter();

    const [name, setName]   = useState(user?.name  ?? '');
    const [phone, setPhone] = useState(user?.phone ?? '');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);

    // Address
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [addrLoading, setAddrLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [useManual, setUseManual] = useState(false);
    const [manualFields, setManualFields] = useState({ city: '', street: '', house: '', apartment: '', zipCode: '' });
    const setMF = (k: keyof typeof manualFields, v: string) => setManualFields(p => ({ ...p, [k]: v }));
    const [saveAddress, setSaveAddress] = useState(false);

    useEffect(() => {
        addressesApi.list()
            .then(data => {
                setAddresses(data);
                const def = data.find(a => a.isDefault) ?? data[0];
                if (def) setSelectedId(def.id);
                if (data.length === 0) setUseManual(true);
            })
            .catch(() => setUseManual(true))
            .finally(() => setAddrLoading(false));
    }, []);

    const manualAddress = [
        manualFields.city,
        manualFields.street,
        manualFields.house ? `д. ${manualFields.house}` : '',
        manualFields.apartment ? `кв. ${manualFields.apartment}` : '',
        manualFields.zipCode,
    ].filter(Boolean).join(', ');

    const resolvedAddress = useManual
        ? manualAddress
        : addresses.find(a => a.id === selectedId)
            ? formatAddress(addresses.find(a => a.id === selectedId)!)
            : '';

    const validate = () => {
        const e: Record<string, string> = {};
        if (!name.trim())            e.name    = 'Введите ФИО';
        if (!phone.trim())           e.phone   = 'Введите телефон';
        if (!resolvedAddress)        e.address = 'Выберите или введите адрес';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        try {
            const order = await ordersApi.checkout({ shippingAddress: resolvedAddress, phone: phone.trim() });
            if (useManual && saveAddress && manualFields.city && manualFields.street && manualFields.house) {
                try {
                    await addressesApi.create({
                        city: manualFields.city,
                        street: manualFields.street,
                        house: manualFields.house,
                        apartment: manualFields.apartment || undefined,
                        zipCode: manualFields.zipCode || undefined,
                    });
                } catch { /* don't block order success */ }
            }
            await clear();
            toast.success('Заказ успешно оформлен!');
            setDone(true);
            setTimeout(() => router.push(`/order/detail/${order.id}`), 1200);
        } catch {
            toast.error('Не удалось оформить заказ. Попробуйте ещё раз.');
            setErrors({ submit: 'Не удалось оформить заказ. Попробуйте ещё раз.' });
        } finally {
            setSubmitting(false);
        }
    };

    if (done) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4">
                    <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
                        className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto"
                    >
                        <CheckCircle2 size={28} className="text-green-600" />
                    </motion.div>
                    <h2 className="text-xl font-black uppercase tracking-tight">Заказ оформлен!</h2>
                    <p className="text-sm text-zinc-400">Перенаправляем на страницу заказа…</p>
                </motion.div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-center">
                <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Корзина пуста</p>
                    <Link href="/" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-tight hover:opacity-60 transition-opacity">
                        <ArrowLeft size={14} /> В каталог
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-10 lg:py-16">
            <Link href="/cart" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors group mb-10">
                <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
                Назад в корзину
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

                {/* ── LEFT: Form ── */}
                <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-10">
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-1">Оформление заказа</p>
                        <h1 className="text-3xl font-black uppercase tracking-tight leading-none">Доставка</h1>
                    </div>

                    {/* 01 — Contacts */}
                    <section className="space-y-4">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 pb-3 border-b border-black/5">01 / Контакты</p>
                        <Field label="ФИО получателя" icon={<User size={15} />} placeholder="Иванов Иван Иванович"
                            value={name} onChange={e => setName(e.target.value)} error={errors.name} autoComplete="name" />
                        <Field label="Телефон" icon={<Phone size={15} />} placeholder="+7 (999) 000-00-00" type="tel"
                            value={phone} onChange={e => setPhone(applyPhoneMask(e.target.value))} error={errors.phone} autoComplete="tel" inputMode="tel" />
                    </section>

                    {/* 02 — Address */}
                    <section className="space-y-4">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 pb-3 border-b border-black/5">02 / Адрес доставки</p>

                        {addrLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[...Array(2)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-white animate-pulse" />)}
                            </div>
                        ) : (
                            <>
                                {/* Saved addresses */}
                                {addresses.length > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <AnimatePresence>
                                            {addresses.map(a => {
                                                const isSelected = !useManual && selectedId === a.id;
                                                return (
                                                    <motion.button
                                                        key={a.id}
                                                        type="button"
                                                        onClick={() => { setSelectedId(a.id); setUseManual(false); }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className={`relative text-left p-4 rounded-2xl border transition-all ${
                                                            isSelected
                                                                ? 'border-[#111111] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)]'
                                                                : 'border-black/8 bg-white/60 hover:bg-white hover:border-black/20'
                                                        }`}
                                                    >
                                                        <div className="flex items-start justify-between gap-2 mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#111111]' : 'bg-zinc-100'}`}>
                                                                    <MapPin size={11} className={isSelected ? 'text-white' : 'text-zinc-400'} />
                                                                </div>
                                                                <span className="text-[10px] font-black uppercase tracking-wide text-zinc-700">
                                                                    {a.label || a.city}
                                                                </span>
                                                            </div>
                                                            {isSelected && (
                                                                <div className="w-5 h-5 rounded-full bg-[#111111] flex items-center justify-center shrink-0">
                                                                    <Check size={10} strokeWidth={3} className="text-white" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <p className="text-[11px] text-zinc-500 leading-relaxed pl-8">
                                                            {formatAddress(a)}
                                                        </p>
                                                        {a.isDefault && (
                                                            <span className="absolute top-2 right-8 text-[8px] font-black uppercase tracking-widest text-zinc-400">
                                                                основной
                                                            </span>
                                                        )}
                                                    </motion.button>
                                                );
                                            })}
                                        </AnimatePresence>

                                        {/* Manual toggle */}
                                        <button
                                            type="button"
                                            onClick={() => { setUseManual(true); setSelectedId(null); }}
                                            className={`text-left p-4 rounded-2xl border border-dashed transition-all flex items-center gap-3 ${
                                                useManual
                                                    ? 'border-[#111111] bg-white'
                                                    : 'border-zinc-200 hover:border-zinc-400 text-zinc-400 hover:text-zinc-600'
                                            }`}
                                        >
                                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${useManual ? 'bg-[#111111]' : 'bg-zinc-100'}`}>
                                                <Plus size={11} className={useManual ? 'text-white' : 'text-zinc-400'} />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-wide">Другой адрес</span>
                                        </button>
                                    </div>
                                )}

                                {/* Manual input — structured fields */}
                                <AnimatePresence>
                                    {useManual && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="bg-white border border-black/8 rounded-2xl p-4 space-y-3">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="col-span-2 space-y-1.5">
                                                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Город <span className="text-red-400">*</span></label>
                                                        <input
                                                            placeholder="Москва"
                                                            value={manualFields.city}
                                                            onChange={e => setMF('city', e.target.value)}
                                                            className="w-full bg-zinc-50 border border-black/8 rounded-xl px-3.5 py-2.5 text-sm font-medium outline-none focus:border-black/30 transition-colors placeholder:text-zinc-300"
                                                        />
                                                    </div>
                                                    <div className="col-span-2 space-y-1.5">
                                                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Улица <span className="text-red-400">*</span></label>
                                                        <input
                                                            placeholder="ул. Пушкина"
                                                            value={manualFields.street}
                                                            onChange={e => setMF('street', e.target.value)}
                                                            className="w-full bg-zinc-50 border border-black/8 rounded-xl px-3.5 py-2.5 text-sm font-medium outline-none focus:border-black/30 transition-colors placeholder:text-zinc-300"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Дом <span className="text-red-400">*</span></label>
                                                        <input
                                                            placeholder="12А"
                                                            value={manualFields.house}
                                                            onChange={e => setMF('house', e.target.value.replace(/[^0-9а-яёА-ЯЁa-zA-Z/\-]/g, '').slice(0, 10))}
                                                            maxLength={10}
                                                            className="w-full bg-zinc-50 border border-black/8 rounded-xl px-3.5 py-2.5 text-sm font-medium outline-none focus:border-black/30 transition-colors placeholder:text-zinc-300"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Квартира</label>
                                                        <input
                                                            placeholder="45"
                                                            value={manualFields.apartment}
                                                            onChange={e => setMF('apartment', e.target.value.replace(/\D/g, '').slice(0, 5))}
                                                            inputMode="numeric"
                                                            maxLength={5}
                                                            className="w-full bg-zinc-50 border border-black/8 rounded-xl px-3.5 py-2.5 text-sm font-medium outline-none focus:border-black/30 transition-colors placeholder:text-zinc-300"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Индекс</label>
                                                        <input
                                                            placeholder="101000"
                                                            value={manualFields.zipCode}
                                                            onChange={e => setMF('zipCode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                            inputMode="numeric"
                                                            maxLength={6}
                                                            className="w-full bg-zinc-50 border border-black/8 rounded-xl px-3.5 py-2.5 text-sm font-medium outline-none focus:border-black/30 transition-colors placeholder:text-zinc-300"
                                                        />
                                                    </div>
                                                </div>

                                                <label className="flex items-center gap-2.5 cursor-pointer group pt-1">
                                                    <div
                                                        onClick={() => setSaveAddress(v => !v)}
                                                        className={`w-4 h-4 rounded-md border-[1.5px] flex items-center justify-center shrink-0 transition-all ${saveAddress ? 'bg-[#111111] border-transparent' : 'border-zinc-300 group-hover:border-zinc-500'}`}
                                                    >
                                                        {saveAddress && <Check size={9} strokeWidth={3} className="text-white" />}
                                                    </div>
                                                    <span className="text-xs text-zinc-500 group-hover:text-zinc-800 transition-colors">Сохранить этот адрес</span>
                                                </label>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {errors.address && (
                                    <p className="text-[10px] text-red-500 font-bold">{errors.address}</p>
                                )}

                                {addresses.length === 0 && !useManual && (
                                    <p className="text-[10px] text-zinc-400">
                                        Нет сохранённых адресов.{' '}
                                        <Link href="/profile" className="underline hover:text-black transition-colors">
                                            Добавить в профиле
                                        </Link>
                                    </p>
                                )}
                            </>
                        )}
                    </section>

                    <AnimatePresence>
                        {errors.submit && (
                            <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className="text-sm text-red-500 font-bold"
                            >
                                {errors.submit}
                            </motion.p>
                        )}
                    </AnimatePresence>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full flex items-center justify-between bg-[#111111] text-white px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors disabled:opacity-60 group"
                    >
                        <span>{submitting ? 'Оформляем…' : 'Подтвердить заказ'}</span>
                        {submitting
                            ? <Loader2 size={16} className="animate-spin" />
                            : <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                        }
                    </button>
                </form>

                {/* ── RIGHT: Summary ── */}
                <div className="lg:col-span-5 lg:sticky lg:top-10 space-y-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Ваш заказ</p>

                    <div className="bg-white rounded-3xl border border-black/5 overflow-hidden">
                        <div className="divide-y divide-black/5 max-h-72 overflow-y-auto">
                            {items.map(item => (
                                <div key={item.id} className="flex items-center gap-3 px-5 py-4">
                                    <div className="w-12 h-12 rounded-2xl bg-zinc-100 overflow-hidden shrink-0">
                                        {item.images
                                            ? <img src={item.images} alt={item.name} className="w-full h-full object-cover" />
                                            : <div className="w-full h-full flex items-center justify-center"><Package size={16} className="text-zinc-300" /></div>
                                        }
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-zinc-800 truncate">{item.name}</p>
                                        <p className="text-[10px] text-zinc-400 mt-0.5">{item.quantity} шт.</p>
                                    </div>
                                    <span className="text-sm font-black shrink-0">
                                        {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-black/5 px-5 py-4 space-y-2.5 bg-zinc-50/60">
                            <div className="flex justify-between text-xs">
                                <span className="text-zinc-400 font-medium">Товары ({items.length})</span>
                                <span className="font-bold">{subtotal.toLocaleString('ru-RU')} ₽</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-zinc-400 font-medium">Доставка</span>
                                <span className="font-black text-green-600 uppercase tracking-widest text-[10px]">Бесплатно</span>
                            </div>
                            <div className="flex justify-between items-baseline pt-2 border-t border-black/5">
                                <span className="text-xs font-bold uppercase tracking-wide">Итого</span>
                                <span className="text-xl font-black">{total.toLocaleString('ru-RU')} ₽</span>
                            </div>
                        </div>
                    </div>

                    {/* Selected address preview */}
                    <AnimatePresence>
                        {resolvedAddress && (
                            <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex items-start gap-3 bg-white border border-black/5 rounded-2xl px-4 py-3.5"
                            >
                                <MapPin size={13} className="text-zinc-400 mt-0.5 shrink-0" />
                                <p className="text-[11px] text-zinc-500 leading-relaxed">{resolvedAddress}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <p className="text-[9px] text-zinc-400 text-center leading-relaxed">
                        Нажимая «Подтвердить заказ», вы соглашаетесь с условиями доставки и возврата
                    </p>
                </div>
            </div>
        </div>
    );
};
