'use client'

import Link from 'next/link';
import { Mail, Phone, MapPin, MessageCircle, ArrowRight, X, Loader2 } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import AppIcon from '@/../public/icons/logo-full.svg';
import { Container } from '@/components/Container';
import { supportApi } from '@/lib/api';
import { useAuth } from '@/hooks/AuthContext';
import { toast } from 'sonner';

function SupportModal({ onClose }: { onClose: () => void }) {
    const { user } = useAuth();
    const [name, setName] = useState(user?.name ?? '');
    const [email, setEmail] = useState(user?.email ?? '');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const submit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            await supportApi.create({
                name: name.trim(),
                email: email.trim(),
                subject: subject.trim() || undefined,
                message: message.trim(),
            });
            setSent(true);
        } catch {
            toast.error('Не удалось отправить обращение. Попробуйте позже.');
        } finally {
            setLoading(false);
        }
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
                            Обращение отправлено — ответим в течение часа
                        </div>
                    ) : (
                        <form onSubmit={submit} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Ваше имя"
                                    required
                                    className="border border-black/10 rounded-xl px-3.5 py-2.5 text-xs font-medium outline-none focus:border-black/30 transition-colors"
                                />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="E-mail"
                                    required
                                    className="border border-black/10 rounded-xl px-3.5 py-2.5 text-xs font-medium outline-none focus:border-black/30 transition-colors"
                                />
                            </div>
                            <input
                                type="text"
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                                placeholder="Тема (необязательно)"
                                className="w-full border border-black/10 rounded-xl px-3.5 py-2.5 text-xs font-medium outline-none focus:border-black/30 transition-colors"
                            />
                            <textarea
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder="Опишите вопрос..."
                                rows={3}
                                required
                                className="w-full border border-black/10 rounded-xl px-3.5 py-2.5 text-xs font-medium outline-none focus:border-black/30 resize-none transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-[#111111] text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors disabled:opacity-60"
                            >
                                {loading && <Loader2 size={13} className="animate-spin" />}
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
    const [supportOpen, setSupportOpen] = useState(false);

    return (
        <>
            {supportOpen && <SupportModal onClose={() => setSupportOpen(false)} />}

            <footer className="lg:block xs:hidden">
                <Container className='pb-0!'>
                    <div className="bg-[#111111] text-[#e3e3e3] rounded-t-[40px] px-6 md:px-10 lg:px-16 pt-14 pb-8 max-w-full">

                        {/* Main row: Brand | Nav | Support */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-white/8 mb-8">

                            {/* Brand */}
                            <div className="lg:col-span-4 space-y-4">
                                <Image src={AppIcon} width={140} alt="Свет.Ру" className="brightness-0 invert" />
                                <p className="text-xs text-zinc-500 leading-relaxed max-w-xs">
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

                            {/* Nav */}
                            <div className="lg:col-span-4 grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">Каталог</h4>
                                    <ul className="space-y-2.5">
                                        <li><Link href="/" className="text-xs text-zinc-400 hover:text-white transition-colors">Все товары</Link></li>
                                        <li><Link href="/cart" className="text-xs text-zinc-400 hover:text-white transition-colors">Корзина</Link></li>
                                        <li><Link href="/favourites" className="text-xs text-zinc-400 hover:text-white transition-colors">Избранное</Link></li>
                                    </ul>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">Аккаунт</h4>
                                    <ul className="space-y-2.5">
                                        <li><Link href="/profile" className="text-xs text-zinc-400 hover:text-white transition-colors">Профиль</Link></li>
                                        <li><Link href="/profile" className="text-xs text-zinc-400 hover:text-white transition-colors">Мои заказы</Link></li>
                                    </ul>
                                </div>
                            </div>

                            {/* Support block */}
                            <div className="lg:col-span-4">
                                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4 h-full flex flex-col justify-between">
                                    <div className="space-y-2">
                                        <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                                            <MessageCircle size={18} className="text-white" />
                                        </div>
                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">Помощь</p>
                                        <h3 className="text-lg font-black tracking-tight leading-tight">Нужна&nbsp;помощь?</h3>
                                        <p className="text-xs text-zinc-500 leading-relaxed">
                                            Ответим на любые вопросы о товарах, доставке и оплате.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setSupportOpen(true)}
                                        className="group flex items-center justify-between w-full bg-white text-black px-5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-zinc-100 transition-colors"
                                    >
                                        <span>Написать нам</span>
                                        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                </div>
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
