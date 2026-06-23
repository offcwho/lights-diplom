import { ArrowRight, Heart, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Product, useCatalog } from "../module/catalog.context";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/entities/cart/module/cart.context";
import Link from "next/link";
import { useFavourites } from "@/entities/favorites";

export const ProductCardUi = ({ product }: { product: Product }) => {
    const { favorites, toggleFavorite } = useCatalog();
    const { addItem, items } = useCart();
    const [isHovered, setIsHovered] = useState(false);
    const { toggleItem, favouriteItems } = useFavourites();
    const isFav = favouriteItems.some(item => item.id === product.id);

    const cartItem = items.find((item) => item.id === product.id);
    return (
        <article
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* БАЗОВАЯ КАРТОЧКА */}
            <div className="bg-white p-4 rounded-[28px] border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]
                            flex flex-col justify-between aspect-3/4">
                <div className="w-full aspect-square rounded-[20px] overflow-hidden bg-[#F4F3F0] relative
                                flex items-center justify-center p-6">
                    {/* Мобильная ссылка на товар — под кнопками */}
                    <Link
                        href={`/product/${product.slug || product.id}`}
                        className="lg:hidden absolute inset-0 z-1"
                        aria-label={product.name}
                    />
                    <img
                        src={product.lifestyleImg}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain mix-blend-multiply"
                    />
                    <span className="absolute top-3 left-3 text-[9px] font-black tracking-widest bg-[#F4F3F0]
                                     border border-black/5 px-2.5 py-0.5 rounded-full uppercase text-zinc-500">
                        {product.category.name}
                    </span>

                    {product.stock > 0 && product.stock < 4 && (
                        <span className="absolute bottom-3 left-3 text-[9px] font-black tracking-widest
                                         bg-amber-50 border border-amber-200 text-amber-700
                                         px-2.5 py-0.5 rounded-full uppercase">
                            Осталось {product.stock} шт.
                        </span>
                    )}

                    {/* Избранное — на базовой карточке, для мобилки */}
                    <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => toggleItem(String(product.id))}
                        aria-label="В избранное"
                        className="lg:hidden absolute top-3 right-3 z-2 w-8 h-8 rounded-full bg-white
                                   flex items-center justify-center shadow-sm"
                    >
                        <Heart size={13} className={isFav ? 'text-red-500' : 'text-zinc-400'}
                            fill={isFav ? 'currentColor' : 'none'} />
                    </motion.button>
                </div>

                <div className="pt-4 pb-1 border-t border-black/5 mt-4 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                        <h3 className="text-xs font-black tracking-tight uppercase truncate">{product.name}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-sm font-black tracking-tight">
                                {Number(product.price).toLocaleString('ru-RU')} ₽
                            </span>
                            {cartItem && (
                                <span className="text-[9px] font-black uppercase tracking-wider text-green-600">
                                    · {cartItem.quantity} в корзине
                                </span>
                            )}
                        </div>
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => addItem(product.id)}
                        aria-label={cartItem ? `В корзине: ${cartItem.quantity} шт. Добавить ещё` : 'В корзину'}
                        className={`relative shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${cartItem ? 'bg-black text-white' : 'bg-[#F4F3F0] hover:bg-black hover:text-white'
                            }`}
                    >
                        {cartItem
                            ? <span className="text-[11px] font-bold leading-none"><Plus size={14} /></span>
                            : <ArrowRight size={14} />}
                    </motion.button>
                </div>
            </div>

            {/* ХОВЕР-РАЗВОРОТ — только десктоп */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 10 }}
                        transition={{ type: "spring", stiffness: 350, damping: 26 }}
                        className="hidden lg:flex absolute -inset-4 p-4 bg-white rounded-4xl
                                   shadow-[0_20px_50px_rgba(0,0,0,0.12)] z-50 flex-col justify-between
                                   border border-black/5 cursor-default"
                    >
                        <div className="w-full aspect-16/11 rounded-[22px] overflow-hidden bg-zinc-900 relative">
                            <img
                                src={product.images[0]}
                                alt=""
                                className="w-full h-full object-cover contrast-[1.05]"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => toggleItem(String(product.id))}
                                aria-label="В избранное"
                                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md
                                           flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
                            >
                                <Heart size={13} className={isFav ? 'text-red-500' : 'text-zinc-800'}
                                    fill={isFav ? 'currentColor' : 'none'} />
                            </motion.button>
                        </div>

                        <Link
                            href={`/product/${product.slug || product.id}`}
                            className="space-y-3 py-4 grow flex flex-col justify-center">
                            <div className="flex justify-between items-baseline gap-2">
                                <h2 className="text-sm font-black uppercase tracking-tight truncate">{product.name}</h2>
                                <span className="text-sm font-mono font-bold shrink-0">{Number(product.price).toLocaleString('ru-RU')} ₽</span>
                            </div>
                            <p className="text-[11px] text-zinc-500 leading-relaxed font-medium line-clamp-3">
                                {product.desc}
                            </p>
                            <div className="bg-[#F4F3F0] p-2.5 rounded-xl text-[10px] font-bold text-zinc-600 uppercase tracking-wide">
                                <span className="text-zinc-400 block text-[9px] mb-0.5">Материал</span>
                                {product.material}
                            </div>
                        </Link>

                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => addItem(product.id)}
                            className="w-full bg-[#111111] text-white py-3.5 rounded-2xl text-xs font-bold uppercase
                                       tracking-widest hover:bg-zinc-800 transition-colors
                                       flex items-center justify-center gap-2"
                        >
                            <ShoppingBag size={14} />
                            <span>
                                {cartItem ? `Уже в корзине ${cartItem.quantity}` : 'Добавить в корзину'}
                            </span>
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </article>
    );
};