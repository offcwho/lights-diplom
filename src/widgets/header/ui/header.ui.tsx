'use client'

import { Bell, Heart, Search, ShoppingBag, Sliders, User, X } from "lucide-react"
import { Navigation } from ".."
import Link from "next/link"
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/entities/cart/module/cart.context";
import { useStuck } from "@/hooks/useStack";
import { springSmooth } from "@/lib/motion";
import { Glass } from "@/components/Glass";
import { useAuth } from "@/hooks/AuthContext";
import Image from "next/image";

import AppIcon from "@/../public/icons/logo-full.svg";
import { useCatalog } from "@/entities/catalog/module/catalog.context";

export const HeaderUi = () => {
    const { user } = useAuth();
    const { items } = useCart();
    const { isStuck } = useStuck();
    const pathname = usePathname();
    const { searchQuery, setSearchQuery, isOpenFilters, setIsOpenFilters } = useCatalog()

    const page = 'profile';
    const favorites = [{ qwe: 'qwe' }];

    const cartCount = items.reduce((acc, i) => acc + i.quantity, 0);
    const isActive = (href: string) => pathname === href;

    return (
        <header className="fixed top-0 z-9999 w-full" id="header">
            <Glass
                className="max-w-7xl w-full mx-auto px-4 py-4 md:px-6 md:py-6 rounded-b-4xl"
                dispersion={0.5}
                strength={10}
                edge={100}
                radius={10}
            >
                {/* ===================== DESKTOP ===================== */}
                <div className="hidden md:flex justify-between items-center">
                    <Link
                        href={'/'}
                        className={`text-2xl font-black tracking-tighter cursor-pointer select-none ${!user && 'mx-auto'}`}
                    >
                        <Image src={AppIcon} width={160} alt="Логотип компании" />
                    </Link>

                    {/*<Navigation /> */}

                    <div className="items-center space-x-2 hidden sm:flex">
                        <Link
                            href={'/favourites'}
                            className={`p-2 rounded-full transition-colors relative ${isActive('/favourites') ? 'bg-black text-white' : 'hover:bg-black/5'}`}
                        >
                            <Heart size={20} fill={favorites.length > 0 ? "currentColor" : "none"} />
                            {favorites.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-amber-700 rounded-full" />}
                        </Link>
                        <Link
                            href={'/cart'}
                            className={`p-2 rounded-full transition-colors relative ${isActive('/cart') ? 'bg-black text-white' : 'hover:bg-black/5'}`}
                        >
                            <ShoppingBag size={20} />
                            {items.length > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        {user && <Announcment className="md:relative" />}
                        <Link
                            href={user ? '/profile' : '/sign-in'}
                            className={`p-2 rounded-full transition-colors ${isActive('/profile') ? 'bg-black text-white' : 'hover:bg-black/5'}`}
                        >
                            <User size={20} />
                        </Link>
                    </div>
                </div>

                {/* ===================== MOBILE ===================== */}
                <div className="md:hidden">
                    {/* Row 1 — приветствие / лого + действия */}
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={springSmooth}
                        className="flex items-center gap-3"
                    >
                        {user && (
                            <Link href={'/profile'} className="relative shrink-0 active:scale-95 transition-transform">
                                <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-sm shadow-amber-500/30">
                                    {user.avatarUrl ? (
                                        <Image
                                            src={user.avatarUrl}
                                            alt={`Аватар пользователя: ${user.name}`}
                                        />
                                    ) : (
                                        <User size={20} />
                                    )}
                                </div>
                                {/* {user && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-amber-500 ring-2 ring-white" />} */}
                            </Link>
                        )}

                        <div className="min-w-0 flex-1 leading-tight">
                            {user ? (
                                <>
                                    <p className="text-[15px] font-bold tracking-tight truncate">
                                        Привет, {user.name ?? 'друг'} 👋
                                    </p>
                                    <p className="text-[11px] text-black/45 truncate">Что подберём сегодня?</p>
                                </>
                            ) : (
                                <Link href="/" className="inline-block select-none w-full">
                                    <Image src={AppIcon} width={120} alt="Логотип компании" className="mx-auto" />
                                </Link>
                            )}
                        </div>
                        {user &&
                            <div className="flex items-center gap-2 shrink-0">
                                <Link
                                    href={'/favourites'}
                                    className="relative w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center shrink-0 active:scale-95 transition"
                                >
                                    <Heart size={19} fill={favorites.length > 0 ? 'currentColor' : 'none'} />
                                    {favorites.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-600 rounded-full" />}
                                </Link>
                                <Announcment />
                            </div>
                        }
                    </motion.div>

                    {/* Row 2 — поиск + избранное + фильтр (появляется при скролле) */}
                    {pathname === '/' && (
                        <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ ...springSmooth, delay: 0.05 }}
                            className="mt-3 flex items-center gap-2"
                        >
                            <div
                                className="flex-1 flex items-center gap-2.5 h-12 px-4 rounded-2xl bg-black/5 focus-within:bg-black/10 focus-within:ring-2 focus-within:ring-black/10 transition-colors"
                            >
                                <Search size={18} className="text-black/50 shrink-0" />
                                <input
                                    type="search"
                                    enterKeyHint="search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Поиск светильников…"
                                    className="w-full bg-transparent text-sm text-black placeholder:text-black/40 outline-none [&::-webkit-search-cancel-button]:appearance-none"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        aria-label="Очистить"
                                        className="shrink-0 text-black/40 active:scale-90 transition"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>

                            <AnimatePresence>
                                <motion.button
                                    key="filters-btn"
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: 48, opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    whileTap={{ scale: 0.9, }}
                                    transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                                    onClick={() => setIsOpenFilters(!isOpenFilters)}
                                    className="h-12 rounded-2xl border border-black/80 flex items-center justify-center shrink-0 overflow-hidden active:scale-95"
                                >
                                    <Sliders size={18} />
                                </motion.button>
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </Glass>
        </header>
    )
}

const Announcment = ({ className }: { className?: string }) => {
    return (
        <button className={`${className ?? ''} relative w-11 h-11 md:w-12 md:h-12 flex items-center justify-center bg-black rounded-2xl text-white/90 active:scale-95 transition`}>
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-black" />
        </button>
    )
}