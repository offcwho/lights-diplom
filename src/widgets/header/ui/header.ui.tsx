'use client'

import { Bell, Heart, LayoutGrid, ShoppingBag, ShoppingCart, Sliders, User } from "lucide-react"
import { Navigation } from ".."
import Link from "next/link"
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CartTotals } from "@/entities/cart";
import { useCart } from "@/entities/cart/module/cart.context";
import { useStuck } from "@/hooks/useStack";
import { springSmooth } from "@/lib/motion";
import { Glass } from "@/components/Glass";
import { useAuth } from "@/hooks/AuthContext";
import Image from "next/image";

import AppIcon from "@/../public/icons/logo-full.svg";


export const HeaderUi = () => {
    const { user } = useAuth();
    const { items } = useCart();
    const { isStuck } = useStuck();
    const pathname = usePathname();

    const page = 'profile';
    const favorites = [
        {
            'qwe': 'qwe'
        }
    ]

    return (
        <header
            className={`fixed top-0 z-9999 w-full`}
            id="header"
        >
            <Glass
                className="max-w-7xl w-full mx-auto px-6 py-6 rounded-b-4xl"
                dispersion={0.5}
                strength={10}
                edge={100}
                radius={10}
            >
                <div className="flex justify-between items-center">
                    <Link
                        href={'/'}
                        className={`text-2xl font-black tracking-tighter cursor-pointer select-none xs:text-center md:w-auto ${!user && 'mx-auto'}`}
                    >
                        <Image
                            src={AppIcon}
                            width={160}
                            alt="Логотип компании"
                        />
                    </Link>

                    <div className="xs:relative md:hidden flex gap-2">
                        <AnimatePresence>
                            {isStuck && (
                                <motion.div
                                    key="filters-btn"
                                    initial={{ width: 0 }}
                                    animate={{ width: 48 }}
                                    exit={{ width: 0 }}
                                    transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                                    className="relative shrink-0"
                                >
                                    <motion.button
                                        initial={{ x: 56, scale: 0.9 }}
                                        animate={{ x: 0, scale: 1 }}
                                        exit={{ x: 56, scale: 0.9 }}
                                        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                                        className="absolute top-0 right-0 w-12 h-12 flex items-center justify-center
                               bg-white rounded-2xl text-black border-2 border-black/80 z-0"
                                    >
                                        <Sliders size={20} />
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Колокольчик ОБЯЗАТЕЛЬНО выше по z — он и прячет кнопку */}
                        <div className="relative z-10">
                            {user && <Announcment className="xs:relative md:hidden" />}
                        </div>
                    </div>

                    <Navigation />

                    <div className="items-center space-x-2 xs:hidden sm:flex">
                        <Link
                            href={'/favourites'}
                            className={`p-2 rounded-full transition-colors relative ${page === 'profile' ? 'bg-black text-white' : 'hover:bg-black/5'}`}
                        >
                            <Heart size={20} fill={favorites.length > 0 ? "currentColor" : "none"} />
                            {
                                favorites.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-amber-700 rounded-full"></span>
                            }
                        </Link>
                        <Link
                            href={'/cart'}
                            className={`p-2 rounded-full transition-colors relative ${page === 'profile' ? 'bg-black text-white' : 'hover:bg-black/5'}`}
                        >
                            <ShoppingBag size={20} />
                            {
                                items.length > 0 && <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                    {items.reduce((acc, i) => acc + i.quantity, 0)}
                                </span>
                            }
                        </Link>
                        {user && <Announcment className="xs:hidden md:relative" />}
                        <Link
                            href={
                                user ? '/profile' : '/sign-in'
                            }
                            className={`p-2 rounded-full transition-colors ${page === 'profile' ? 'bg-black text-white' : 'hover:bg-black/5'}`}
                        >
                            <User size={20} />
                        </Link>
                    </div>
                </div>
            </Glass>
        </header >
    )
}

const Announcment = ({ className }: { className?: string }) => {
    return (
        <button className={`${className} w-12 h-12 flex items-center justify-center bg-black rounded-2xl text-white/90`}>
            <Bell size={20} />
        </button>
    )
}

/*
md:hidden fixed inset-x-0 bottom-0 z-50 justify-around border-t border-black/10 bg-white px-2 py-3 grid grid-cols-4 */