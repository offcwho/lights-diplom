'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface CardData {
    number: string;
    expiry: string;
    cvc: string;
    holder: string;
}

export const BankCardUi = ({ data, focusedField }: { data: CardData; focusedField: string }) => {
    // Форматирование номера карты по 4 символа
    const formatCardNumber = (num: string) => {
        const padded = num.padEnd(16, '•');
        return `${padded.slice(0, 4)} ${padded.slice(4, 8)} ${padded.slice(8, 12)} ${padded.slice(12, 16)}`;
    };

    return (
        <div className="w-full max-w-90 aspect-[1.586/1] relative perspective-1000 mx-auto lg:mx-0">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-full bg-zinc-900 text-white rounded-2xl p-6 flex flex-col justify-between shadow-2xl overflow-hidden relative border border-zinc-800"
            >
                {/* Декоративный премиальный элемент (чип/логотип) */}
                <div className="flex justify-between items-start">
                    <div className="w-10 h-7 bg-zinc-800/80 rounded-md border border-zinc-700/50 backdrop-blur-sm" />
                    <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase">
                        Premium Pay
                    </span>
                </div>

                {/* Номер карты */}
                <div className="my-2">
                    <div className={`font-mono text-lg tracking-widest transition-colors duration-300 ${focusedField === 'number' ? 'text-white' : 'text-zinc-400'}`}>
                        {formatCardNumber(data.number)}
                    </div>
                </div>

                {/* Нижняя часть: Владелец и Срок действия */}
                <div className="flex justify-between items-end">
                    <div className="space-y-1 flex-1 pr-4">
                        <span className="text-[8px] uppercase tracking-widest text-zinc-600 block">Владелец карты</span>
                        <div className={`font-mono text-xs uppercase tracking-wider truncate transition-colors duration-300 ${focusedField === 'holder' ? 'text-white' : 'text-zinc-400'}`}>
                            {data.holder || 'YOUR NAME'}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="space-y-1 text-right">
                            <span className="text-[8px] uppercase tracking-widest text-zinc-600 block">Срок</span>
                            <div className={`font-mono text-xs transition-colors duration-300 ${focusedField === 'expiry' ? 'text-white' : 'text-zinc-400'}`}>
                                {data.expiry ? `${data.expiry.slice(0, 2)}/${data.expiry.slice(2, 4)}` : 'MM/YY'}
                            </div>
                        </div>
                        <div className="space-y-1 text-right">
                            <span className="text-[8px] uppercase tracking-widest text-zinc-600 block">CVC</span>
                            <div className={`font-mono text-xs transition-colors duration-300 ${focusedField === 'cvc' ? 'text-white' : 'text-zinc-400'}`}>
                                {data.cvc ? '•••' : '•••'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Абстрактный градиент на фоне для премиального свечения */}
                <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-zinc-800 rounded-full blur-3xl opacity-40 pointer-events-none" />
            </motion.div>
        </div>
    );
};