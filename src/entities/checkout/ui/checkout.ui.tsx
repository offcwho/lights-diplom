'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, CreditCard, Landmark, MapPin, Plus } from 'lucide-react';
import { BankCardUi } from './bankcard.ui';
import { useAuth } from '@/hooks/AuthContext';

type PaymentMethod = 'sbp' | 'card';

export const CheckoutUi = () => {
    const { user } = useAuth();

    // Имитация списка адресов (если в user.addresses пусто)
    const savedAddresses = [
        { id: '1', title: 'Дом', city: 'Москва', street: 'ул. Ленина, д. 12, кв. 45' },
        { id: '2', title: 'Офис', city: 'Москва', street: 'Пресненская наб., д. 6, стр. 2' },
    ];

    // Состояния формы
    const [selectedAddressId, setSelectedAddressId] = useState(savedAddresses[0]?.id || '');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        email: user?.email || '',
    });

    const [cardData, setCardData] = useState({
        number: '',
        expiry: '',
        cvc: '',
        holder: '',
    });
    const [focusedField, setFocusedField] = useState('');

    const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Ограничения на длину полей ввода для чистоты UI
        if (name === 'number' && value.length > 16) return;
        if (name === 'expiry' && value.length > 4) return;
        if (name === 'cvc' && value.length > 3) return;

        setCardData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitOrder = (e: React.FormEvent) => {
        e.preventDefault();
        const orderPayload = {
            contactInfo: formData,
            addressId: selectedAddressId,
            paymentMethod,
            ...(paymentMethod === 'card' && { cardDigits: cardData.number.slice(-4) })
        };
        console.log('Отправка заказа на NestJS:', orderPayload);
        // Здесь вызов вашего API (ordersApi.create)
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 lg:py-24">
            <h1 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-zinc-900 mb-12">
                Оформление заказа
            </h1>

            <form onSubmit={handleSubmitOrder} className="space-y-12">

                {/* СЕКЦИЯ 1: КОНТАКТНЫЕ ДАННЫЕ */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-zinc-100 pb-3">
                        <span className="font-mono text-xs text-zinc-400">01 /</span>
                        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Контактные данные</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">ФИО Получателя</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                                className="w-full bg-zinc-50 border border-zinc-200 focus:border-black rounded-xl px-4 py-3 text-xs font-medium outline-none transition-colors"
                                placeholder="Иванов Иван Иванович"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">Телефон</label>
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                                className="w-full bg-zinc-50 border border-zinc-200 focus:border-black rounded-xl px-4 py-3 text-xs font-medium outline-none transition-colors"
                                placeholder="+7 (999) 000-00-00"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">Email для чека</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                                className="w-full bg-zinc-50 border border-zinc-200 focus:border-black rounded-xl px-4 py-3 text-xs font-medium outline-none transition-colors"
                                placeholder="example@light.ru"
                            />
                        </div>
                    </div>
                </section>

                {/* СЕКЦИЯ 2: ВЫБОР АДРЕСА */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-zinc-100 pb-3">
                        <span className="font-mono text-xs text-zinc-400">02 /</span>
                        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Адрес доставки</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {savedAddresses.map((addr) => {
                            const isSelected = selectedAddressId === addr.id;
                            return (
                                <div
                                    key={addr.id}
                                    onClick={() => setSelectedAddressId(addr.id)}
                                    className={`relative cursor-pointer p-4 rounded-xl border transition-all flex flex-col justify-between h-32 select-none ${isSelected
                                            ? 'border-black bg-white shadow-md'
                                            : 'border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50'
                                        }`}
                                >
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded">
                                                {addr.title}
                                            </span>
                                            {isSelected && (
                                                <motion.div layoutId="activeCheck">
                                                    <Check size={14} className="text-black" />
                                                </motion.div>
                                            )}
                                        </div>
                                        <p className="text-xs font-bold text-zinc-800">{addr.city}</p>
                                        <p className="text-[11px] text-zinc-500 line-clamp-2 mt-1 leading-relaxed">{addr.street}</p>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Кнопка добавления нового адреса */}
                        <button
                            type="button"
                            className="p-4 rounded-xl border border-dashed border-zinc-300 hover:border-zinc-400 transition-colors flex flex-col items-center justify-center gap-2 h-32 text-zinc-400 hover:text-zinc-600"
                        >
                            <Plus size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Добавить адрес</span>
                        </button>
                    </div>
                </section>

                {/* СЕКЦИЯ 3: ТИП ОПЛАТЫ */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-zinc-100 pb-3">
                        <span className="font-mono text-xs text-zinc-400">03 /</span>
                        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Способ оплаты</h2>
                    </div>

                    {/* Кастомный переключатель табов */}
                    <div className="flex gap-2 bg-zinc-100 p-1 rounded-xl max-w-xs">
                        <button
                            type="button"
                            onClick={() => setPaymentMethod('card')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all relative ${paymentMethod === 'card' ? 'text-black font-extrabold' : 'text-zinc-400'}`}
                        >
                            {paymentMethod === 'card' && (
                                <motion.div layoutId="activeTabBg" className="absolute inset-0 bg-white rounded-lg shadow-sm z-0" />
                            )}
                            <span className="relative z-10 flex items-center gap-1.5">
                                <CreditCard size={14} /> Карта
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setPaymentMethod('sbp')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all relative ${paymentMethod === 'sbp' ? 'text-black font-extrabold' : 'text-zinc-400'}`}
                        >
                            {paymentMethod === 'sbp' && (
                                <motion.div layoutId="activeTabBg" className="absolute inset-0 bg-white rounded-lg shadow-sm z-0" />
                            )}
                            <span className="relative z-10 flex items-center gap-1.5">
                                <Landmark size={14} /> СБП
                            </span>
                        </button>
                    </div>

                    {/* Динамическая зона контента оплаты */}
                    <div className="bg-zinc-50 border border-zinc-200/60 rounded-2xl p-6">
                        <AnimatePresence mode="wait">
                            {paymentMethod === 'card' ? (
                                <motion.div
                                    key="card-form"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex flex-col lg:flex-row gap-8 items-center"
                                >
                                    {/* UI Компонент карты слева */}
                                    <BankCardUi data={cardData} focusedField={focusedField} />

                                    {/* Поля ввода справа */}
                                    <div className="flex-1 w-full grid grid-cols-2 gap-4">
                                        <div className="col-span-2 space-y-1.5">
                                            <label className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">Номер карты</label>
                                            <input
                                                type="text"
                                                name="number"
                                                placeholder="0000 0000 0000 0000"
                                                value={cardData.number}
                                                onChange={handleCardChange}
                                                onFocus={() => setFocusedField('number')}
                                                onBlur={() => setFocusedField('')}
                                                className="w-full bg-white border border-zinc-200 focus:border-black rounded-xl px-4 py-3 text-xs font-mono outline-none transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">Срок действия</label>
                                            <input
                                                type="text"
                                                name="expiry"
                                                placeholder="MM/YY"
                                                value={cardData.expiry}
                                                onChange={handleCardChange}
                                                onFocus={() => setFocusedField('expiry')}
                                                onBlur={() => setFocusedField('')}
                                                className="w-full bg-white border border-zinc-200 focus:border-black rounded-xl px-4 py-3 text-xs font-mono outline-none transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">CVC код</label>
                                            <input
                                                type="password"
                                                name="cvc"
                                                placeholder="•••"
                                                value={cardData.cvc}
                                                onChange={handleCardChange}
                                                onFocus={() => setFocusedField('cvc')}
                                                onBlur={() => setFocusedField('')}
                                                className="w-full bg-white border border-zinc-200 focus:border-black rounded-xl px-4 py-3 text-xs font-mono outline-none transition-colors"
                                            />
                                        </div>
                                        <div className="col-span-2 space-y-1.5">
                                            <label className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">Имя владельца</label>
                                            <input
                                                type="text"
                                                name="holder"
                                                placeholder="IVAN IVANOV"
                                                value={cardData.holder}
                                                onChange={handleCardChange}
                                                onFocus={() => setFocusedField('holder')}
                                                onBlur={() => setFocusedField('')}
                                                className="w-full bg-white border border-zinc-200 focus:border-black rounded-xl px-4 py-3 text-xs font-mono uppercase outline-none transition-colors"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="sbp-form"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-center py-6 max-w-sm mx-auto space-y-4"
                                >
                                    {/* Заглушка под будущий QR/Инструкцию СБП */}
                                    <div className="w-24 h-24 bg-white border-2 border-dashed border-zinc-200 rounded-xl mx-auto flex items-center justify-center text-zinc-300">
                                        <Landmark size={32} className="text-zinc-400" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold uppercase tracking-wider text-zinc-800">Система Быстрых Платежей</p>
                                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                                            После нажатия кнопки оплаты откроется окно с QR-кодом для мгновенного подтверждения через приложение вашего банка.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </section>

                {/* ФИНАЛЬНАЯ КНОПКА (если не используется липкий сайдбар) */}
                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full sm:w-auto bg-black text-white px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-900 transition-colors shadow-lg"
                    >
                        Подтвердить и оплатить
                    </button>
                </div>
            </form>
        </div>
    );
};