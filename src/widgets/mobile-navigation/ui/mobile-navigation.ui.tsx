import { Glass } from "@/components/Glass";
import { CartTotals } from "@/entities/cart";
import { useCart } from "@/entities/cart/module/cart.context";
import { useAuth } from "@/hooks/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, LayoutGrid, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const MobileNavigationUi = () => {
    const { user } = useAuth();
    const pathname = usePathname();
    const { total } = useCart();

    console.log(`user: ${user}`)

    const links = [
        { name: "Каталог", link: "/", icon: LayoutGrid, auth: null },
        { name: "Избранное", link: "/favourites", icon: Heart, auth: true },
        { name: "Корзина", link: "/cart", icon: ShoppingCart, auth: true },
        { name: "Профиль", link: "/profile", icon: User, auth: true },
        { name: "Войти", link: "/sign-in", icon: User, auth: false }
    ];

    const showTotalsAttached = pathname === "/cart" && total > 0;
    return (
        <nav className="md:hidden fixed bottom-3 inset-x-4 z-50" id="mobilenav">
            <AnimatePresence>
                {pathname === "/cart" && (
                    <div className="px-4">
                        <CartTotals className="lg:hidden xs:block bottom-0 rounded-b-none border-b border-b-black/5 bg-white/30! backdrop-blur-xl!" />
                    </div>
                )}
            </AnimatePresence>
            <Glass
                className="bg-black rounded-[18px] h-full"
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
                    className={`grid ${user ? 'grid-cols-4' : 'grid-cols-2'}  p-1.5 ${showTotalsAttached ? 'border-t-0' : ''}`}
                >
                    {
                        links.map((item) => {
                            const isActive = pathname === item.link;
                            const Icon = item.icon;
                            if (user) {
                                if (item.auth === true || item.auth === null)
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
                            } else {
                                if (item.auth === false || item.auth === null)
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
                            }

                        })
                    }
                </motion.div>
            </Glass>
        </nav>
    );
};