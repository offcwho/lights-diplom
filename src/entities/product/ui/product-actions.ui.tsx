'use client';

import { Heart, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '@/entities/cart/module/cart.context';
import { useFavourites } from '@/entities/favorites';
import { motion } from 'framer-motion';

interface Props {
    productId: string;
    inStock: boolean;
}

export const ProductActionsUi: React.FC<Props> = ({ productId, inStock }) => {
    const { addItem, items } = useCart();
    const { toggleItem, favouriteItems } = useFavourites();

    const cartItem = items.find(i => i.id === productId);
    const isFav = favouriteItems.some(item => item.id === productId);

    return (
        <div className="flex gap-3">
            <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => addItem(productId)}
                disabled={!inStock}
                className={`flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl text-xs font-black tracking-widest uppercase transition-all ${
                    !inStock
                        ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                        : cartItem
                        ? 'bg-zinc-900 text-white hover:bg-black'
                        : 'bg-[#111111] text-white hover:bg-zinc-800'
                }`}
            >
                {cartItem ? <Check size={15} /> : <ShoppingBag size={15} />}
                {!inStock ? 'Нет в наличии' : cartItem ? `В корзине · ${cartItem.quantity}` : 'В корзину'}
            </motion.button>

            <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => toggleItem(productId)}
                aria-label="В избранное"
                className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-200 ${
                    isFav
                        ? 'border-black bg-black text-white'
                        : 'border-black/10 bg-white text-zinc-400 hover:border-black hover:text-black'
                }`}
            >
                <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
            </motion.button>
        </div>
    );
};