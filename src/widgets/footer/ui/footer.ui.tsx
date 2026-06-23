'use client'

import Link from 'next/link';
import { Mail, Phone, MapPin, X, MessageCircle, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import AppIcon from '@/../public/icons/logo-full.svg';
import { Container } from '@/components/Container';

function SupportModal({ onClose }: { onClose: () => void }) {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (name.trim() && message.trim()) setSent(true);
    };

    return (
        <div
            className="fixed inset-0 z-9999 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="w-full max-w-md bg-white rounded-3xl p-6 space-y-5 shadow-2xl">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-0.5">Помощь</p>
                        <h2 className="text-lg font-black uppercase tracking-tight">Поддержка</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>

                <div className="space-y-2 text-xs text-zinc-500">
                    <a href="tel:+78001234567" className="flex items-center gap-2.5 hover:text-black transition-colors group">
                        <span className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors shrink-0">
                            <Phone size={13} />
                        </span>
                        8 800 123-45-67 — бесплатно по России
                    </a>
                    <a href="mailto:hello@svet.ru" className="flex items-center gap-2.5 hover:text-black transition-colors group">
                        <span className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors shrink-0">
                            <Mail size={13} />
                        </span>
                        hello@svet.ru
                    </a>
                </div>

                <div className="border-t border-black/5 pt-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-3">Написать нам</p>
                    {sent ? (
                        <div className="flex items-center gap-2 text-sm font-bold text-green-600 py-4">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            Сообщение отправлено — ответим в течение часа
                        </div>
                    ) : (
                        <form onSubmit={submit} className="space-y-3">
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Ваше имя"
                                required
                                className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-black/30 transition-colors"
                            />
                            <textarea
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder="Опишите вопрос..."
                                rows={3}
                                required
                                className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-black/30 resize-none transition-colors"
                            />
                            <button
                                type="submit"
                                className="w-full bg-[#111111] text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors"
                            >
                                Отправить
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export const FooterUi = () => {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [supportOpen, setSupportOpen] = useState(false);

    const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (email.trim()) { setSent(true); setEmail(''); }
    };

    return (
        <>
            {supportOpen && <SupportModal onClose={() => setSupportOpen(false)} />}

            <footer className="lg:block xs:hidden">
                <Container className='pb-0!'>
                    <div className="bg-[#111111] text-[#e3e3e3] rounded-t-[40px] px-6 md:px-10 lg:px-16 pt-14 pb-8 max-w-full">

                        {/* Top row */}
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 pb-12 border-b border-white/8 mb-12">

                            {/* Brand */}
                            <div className="space-y-4 max-w-xs">
                                <Image src={AppIcon} width={140} alt="Свет.Ру" className="brightness-0 invert" />
                                <p className="text-xs text-zinc-500 leading-relaxed">
                                    Дизайнерские светильники для жилых и коммерческих пространств. Доставка по всей России.
                                </p>
                                <div className="space-y-2 text-xs text-zinc-500">
                                    <a href="tel:+78001234567" className="flex items-center gap-2 hover:text-white transition-colors group">
                                        <Phone size={13} className="text-zinc-600 group-hover:text-white transition-colors" />
                                        8 800 123-45-67
                                    </a>
                                    <a href="mailto:hello@svet.ru" className="flex items-center gap-2 hover:text-white transition-colors group">
                                        <Mail size={13} className="text-zinc-600 group-hover:text-white transition-colors" />
                                        hello@svet.ru
                                    </a>
                                    <p className="flex items-center gap-2">
                                        <MapPin size={13} className="text-zinc-600 shrink-0" />
                                        Москва, ул. Дизайнерская, 12
                                    </p>
                                </div>
                            </div>

                            {/* Newsletter */}
                            <div className="max-w-sm w-full space-y-4">
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">Рассылка</p>
                                    <h3 className="text-xl font-black tracking-tight leading-tight">Будьте в&nbsp;курсе новинок</h3>
                                </div>
                                <p className="text-xs text-zinc-500 leading-relaxed">
                                    Новые коллекции, скидки и вдохновляющие интерьеры — раз в две недели, без спама.
                                </p>
                                {sent ? (
                                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                        Вы подписаны — спасибо!
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubscribe} className="flex items-center gap-0 bg-white/6 border border-white/10 rounded-2xl overflow-hidden pr-1.5 focus-within:border-white/25 transition-colors">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="Ваш e-mail"
                                            required
                                            className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-600 px-4 py-3.5 outline-none"
                                        />
                                        <button
                                            type="submit"
                                            className="shrink-0 w-9 h-9 bg-white rounded-xl flex items-center justify-center text-black hover:bg-zinc-100 transition-colors active:scale-95"
                                            aria-label="Подписаться"
                                        >
                                            <ArrowRight size={15} />
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>

                        {/* Nav */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pb-12 border-b border-white/8 mb-8">
                            <div className="space-y-4">
                                <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">Каталог</h4>
                                <ul className="space-y-2.5">
                                    <li><Link href="/" className="text-xs text-zinc-400 hover:text-white transition-colors">Все товары</Link></li>
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">Аккаунт</h4>
                                <ul className="space-y-2.5">
                                    <li><Link href="/profile" className="text-xs text-zinc-400 hover:text-white transition-colors">Профиль</Link></li>
                                    <li><Link href="/profile/orders" className="text-xs text-zinc-400 hover:text-white transition-colors">Мои заказы</Link></li>
                                    <li><Link href="/favourites" className="text-xs text-zinc-400 hover:text-white transition-colors">Избранное</Link></li>
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">Помощь</h4>
                                <ul className="space-y-2.5">
                                    <li>
                                        <button
                                            onClick={() => setSupportOpen(true)}
                                            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
                                        >
                                            <MessageCircle size={12} />
                                            Поддержка
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Bottom bar */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[10px] text-zinc-600">
                            <p>© 2026 Свет.Ру. Все права защищены.</p>
                            <div className="flex gap-5">
                                <a href="#" className="hover:text-zinc-400 transition-colors">Политика конфиденциальности</a>
                                <a href="#" className="hover:text-zinc-400 transition-colors">Пользовательское соглашение</a>
                            </div>
                        </div>

                    </div>
                </Container>
            </footer>
        </>
    );
};
