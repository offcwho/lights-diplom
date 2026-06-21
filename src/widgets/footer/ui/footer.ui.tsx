'use client'

import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import AppIcon from '@/../public/icons/logo-full.svg';
import { Container } from '@/components/Container';

const NAV = [
    {
        title: 'Каталог',
        links: [
            { label: 'Все товары', href: '/catalog' },
            { label: 'Подвесные светильники', href: '/catalog' },
            { label: 'Напольные торшеры', href: '/catalog' },
            { label: 'Настенные бра', href: '/catalog' },
            { label: 'Настольные лампы', href: '/catalog' },
        ],
    },
    {
        title: 'Покупателям',
        links: [
            { label: 'Как сделать заказ', href: '#' },
            { label: 'Доставка и оплата', href: '#' },
            { label: 'Возврат и обмен', href: '#' },
            { label: 'Гарантия', href: '#' },
            { label: 'Вопросы и ответы', href: '#' },
        ],
    },
    {
        title: 'Компания',
        links: [
            { label: 'О нас', href: '#' },
            { label: 'Шоурум', href: '#' },
            { label: 'Сотрудничество', href: '#' },
            { label: 'Вакансии', href: '#' },
            { label: 'Контакты', href: '#' },
        ],
    },
];

export const FooterUi = () => {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) { setSent(true); setEmail(''); }
    };

    return (
        <footer className="lg:block xs:hidden">
            <Container className='pb-0!'>
                <div className="bg-[#111111] text-[#e3e3e3] rounded-t-[40px] px-6 md:px-10 lg:px-16 pt-14 pb-8 max-w-full">

                    {/* Top row — лого + рассылка */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 pb-12 border-b border-white/8 mb-12">

                        {/* Brand */}
                        <div className="space-y-4 max-w-xs">
                            <Image src={AppIcon} width={140} alt="Свет.Ру" className="brightness-0 invert" />
                            <p className="text-xs text-zinc-500 leading-relaxed">
                                Дизайнерские светильники ручной работы для жилых и коммерческих пространств. Доставка по всей России.
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
                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">
                                    Рассылка
                                </p>
                                <h3 className="text-xl font-black tracking-tight leading-tight">
                                    Будьте в&nbsp;курсе новинок
                                </h3>
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

                    {/* Nav columns */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pb-12 border-b border-white/8 mb-8">
                        {NAV.map(col => (
                            <div key={col.title} className="space-y-4">
                                <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">
                                    {col.title}
                                </h4>
                                <ul className="space-y-2.5">
                                    {col.links.map(link => (
                                        <li key={link.label}>
                                            <Link
                                                href={link.href}
                                                className="text-xs text-zinc-400 hover:text-white transition-colors"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
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
    );
};
