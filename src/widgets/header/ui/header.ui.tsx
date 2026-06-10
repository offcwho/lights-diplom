import { Heart, LayoutGrid, ShoppingBag, ShoppingCart, User } from "lucide-react"
import { Navigation } from ".."
import Link from "next/link"
import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CartTotals } from "@/entities/cart";
import { useCart } from "@/entities/cart/module/cart.context";

export const HeaderUi = () => {
    const page = 'profile';
    const favorites = [
        {
            'qwe': 'qwe'
        }
    ]

    const cart = [
        {
            'qwe': 'qwe',
            quantity: 2
        }
    ]
    return (
        <header className="fixed top-0 inset-x-0 z-9999 backdrop-blur-xl max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between border-b border-black/5 rounded-b-4xl" id="header" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
            <Link
                href={'/'}
                className="text-2xl font-black tracking-tighter cursor-pointer select-none xs:text-center xs:w-full md:w-auto"
            >
                luxf.light
            </Link>

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
                        cart.length > 0 && <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                            {cart.reduce((acc, i) => acc + i.quantity, 0)}
                        </span>
                    }
                </Link>
                <Link href={'/profile'} className={`p-2 rounded-full transition-colors ${page === 'profile' ? 'bg-black text-white' : 'hover:bg-black/5'}`}>
                    <User size={20} />
                </Link>
            </div>
        </header>
    )
}


export const MobileNavigationUi = () => {
    const pathname = usePathname();
    const { total } = useCart();

    const links = [
        { name: "Catalog", link: "/catalog", icon: LayoutGrid },
        { name: "Favourites", link: "/favourites", icon: Heart },
        { name: "Cart", link: "/cart", icon: ShoppingCart },
        { name: "Profile", link: "/profile", icon: User },
    ];

    console.log('pathname', pathname);

    const showTotalsAttached = pathname === "/cart" && total > 0;
    return (
        // Превращаем в изящный парящий док с мягкой тенью вместо скучной полоски на весь экран
        <nav className="md:hidden fixed bottom-3 inset-x-4 z-50" id="mobilenav">
            <AnimatePresence>
                {pathname === "/cart" && (
                    <CartTotals className="lg:hidden xs:block bottom-0 rounded-b-none border-b border-b-black/5 bg-white/30! backdrop-blur-xl!" />
                )}
            </AnimatePresence>
            <motion.div
                id="mobiledock"
                initial={false}
                animate={{
                    borderTopLeftRadius: showTotalsAttached ? 0 : 24,
                    borderTopRightRadius: showTotalsAttached ? 0 : 24,
                    borderBottomLeftRadius: 24,
                    borderBottomRightRadius: 24,
                }}
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                className={`grid grid-cols-4 backdrop-blur-xl bg-white/80 border border-black/5 p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.06)] ${showTotalsAttached ? 'border-t-0' : ''}`}

            >
                {links.map((item) => {
                    const isActive = pathname === item.link;
                    const Icon = item.icon;

                    return (
                        <Link key={item.link} href={item.link} className="relative select-none outline-none">
                            <motion.div
                                whileTap={{ scale: 0.93 }} // Эффект упругого продавливания кнопки пальцем
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="relative flex flex-col items-center justify-center py-2.5 h-full rounded-[18px] cursor-pointer"
                            >
                                {/* Скользящая капсула: теперь она занимает 100% пространства ячейки (минус inset). 
                                Это гарантирует идеальную центровку на любых экранах без хардкода пикселей.
                            */}
                                {isActive && (
                                    <motion.span
                                        layoutId="active-nav-pill"
                                        className="absolute inset-0 bg-black rounded-[18px] z-0"
                                        transition={{
                                            type: "spring",
                                            stiffness: 380,
                                            damping: 30, // Тягучая, дорогая инерция без лишнего дребезга
                                        }}
                                    />
                                )}

                                {/* Контейнер для контента: гарантирует, что элементы не будут прыгать во время анимации */}
                                <div className="relative z-10 flex flex-col items-center justify-center space-y-0.5">
                                    <motion.div
                                        animate={{
                                            y: isActive ? -1 : 0, // Тонкий архитектурный подъем вверх
                                            scale: isActive ? 1.05 : 1,
                                            color: isActive ? "#ffffff" : "#111111",
                                        }}
                                        transition={{ type: "spring", stiffness: 400, damping: 28 }}
                                    >
                                        <Icon
                                            size={18}
                                            strokeWidth={isActive ? 2.2 : 2}
                                            fill={isActive && item.name === "Favourites" ? "currentColor" : "none"}
                                        />
                                    </motion.div>

                                    {/* Вместо жесткого AnimatePresence, ломающего сетку, мы используем контролируемый сдвиг.
                                    Текст всегда занимает свое место, но плавно проявляется и приподнимается.
                                */}
                                    <motion.span
                                        initial={false}
                                        animate={{
                                            opacity: isActive ? 1 : 0,
                                            height: isActive ? "auto" : 0,
                                            marginTop: isActive ? 4 : 0,
                                            scale: isActive ? 1 : 0.9,
                                            color: isActive ? "#ffffff" : "#111111",
                                        }}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        className="block overflow-hidden text-[9px] font-bold uppercase tracking-wider font-sans"
                                        style={{ pointerEvents: "none" }}
                                    >
                                        {item.name}
                                    </motion.span>
                                </div>
                            </motion.div>
                        </Link>
                    );
                })}
            </motion.div>
        </nav>
    );
};


/*
md:hidden fixed inset-x-0 bottom-0 z-50 justify-around border-t border-black/10 bg-white px-2 py-3 grid grid-cols-4 */