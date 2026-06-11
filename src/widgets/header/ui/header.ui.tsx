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


export const HeaderUi = () => {
    const { items } = useCart();
    const { isStuck } = useStuck();
    const pathname = usePathname();

    const page = 'profile';
    const favorites = [
        {
            'qwe': 'qwe'
        }
    ]

    console.log(isStuck)

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
                        className="text-2xl font-black tracking-tighter cursor-pointer select-none xs:text-center md:w-auto"
                    >
                        luxf.light
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
                            <Announcment />
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
                        <Announcment className="xs:hidden md:relative" />
                        <Link href={'/profile'} className={`p-2 rounded-full transition-colors ${page === 'profile' ? 'bg-black text-white' : 'hover:bg-black/5'}`}>
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

export const MobileNavigationUi = () => {
    const pathname = usePathname();
    const { total } = useCart();

    const links = [
        { name: "Catalog", link: "/catalog", icon: LayoutGrid },
        { name: "Favourites", link: "/favourites", icon: Heart },
        { name: "Cart", link: "/cart", icon: ShoppingCart },
        { name: "Profile", link: "/profile", icon: User },
    ];

    const showTotalsAttached = pathname === "/cart" && total > 0;
    return (
        // Превращаем в изящный парящий док с мягкой тенью вместо скучной полоски на весь экран
        <nav className="md:hidden fixed bottom-3 inset-x-4 z-50" id="mobilenav">
            <AnimatePresence>
                {pathname === "/cart" && (
                    <CartTotals className="lg:hidden xs:block bottom-0 rounded-b-none border-b border-b-black/5 bg-white/30! backdrop-blur-xl!" />
                )}
            </AnimatePresence>
            <Glass
                className="bg-black rounded-[18px] h-full"
                strength={30}
                edge={10}
                dispersion={0.5}
            >
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
                    className={`grid grid-cols-4  p-1.5 ${showTotalsAttached ? 'border-t-0' : ''}`}
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
                                        <motion.div
                                            layoutId="active-nav-pill"
                                            className="absolute inset-0  z-0"
                                            transition={{
                                                type: "spring",
                                                stiffness: 380,
                                                damping: 30, // Тягучая, дорогая инерция без лишнего дребезга
                                            }}
                                        >
                                            <Glass
                                                className="bg-black rounded-[18px] h-full"
                                                strength={30}
                                                edge={10}
                                                dispersion={0.5}
                                            >
                                                <div className="h-full"></div>
                                            </Glass>
                                        </motion.div>
                                    )}

                                    {/* Контейнер для контента: гарантирует, что элементы не будут прыгать во время анимации */}
                                    <div className="relative z-10 flex flex-col items-center justify-center space-y-0.5">
                                        <motion.div
                                            animate={{
                                                y: isActive ? -1 : 0, // Тонкий архитектурный подъем вверх
                                                scale: isActive ? 1.05 : 1,
                                                color: isActive ? "#111111" : "#111111",
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
                                                color: isActive ? "#000" : "#111111",
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
            </Glass>
        </nav>
    );
};


/*
md:hidden fixed inset-x-0 bottom-0 z-50 justify-around border-t border-black/10 bg-white px-2 py-3 grid grid-cols-4 */