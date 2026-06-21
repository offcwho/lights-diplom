'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FALLBACK = 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1000&auto=format&fit=crop';

interface Props {
    images: string[];
    name: string;
}

export const ProductGalleryUi: React.FC<Props> = ({ images, name }) => {
    const list = images.length > 0 ? images : [FALLBACK];
    const [active, setActive] = useState(0);

    const prev = () => setActive(i => (i - 1 + list.length) % list.length);
    const next = () => setActive(i => (i + 1) % list.length);

    return (
        <div className="space-y-4">
            {/* Main image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-zinc-100">
                <img
                    key={active}
                    src={list[active]}
                    alt={name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Thumbnail strip — arrows on sides like reference */}
            <div className="flex items-center gap-3">
                <button
                    onClick={prev}
                    className="w-9 h-9 rounded-xl border-2 border-black/8 bg-white flex items-center justify-center shrink-0 hover:border-black transition-colors"
                >
                    <ChevronLeft size={15} />
                </button>

                <div className="flex gap-2 overflow-hidden flex-1">
                    {list.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setActive(i)}
                            className={`shrink-0 w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                                active === i
                                    ? 'border-black opacity-100'
                                    : 'border-transparent opacity-35 hover:opacity-65'
                            }`}
                        >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>

                <button
                    onClick={next}
                    className="w-9 h-9 rounded-xl border-2 border-black/8 bg-white flex items-center justify-center shrink-0 hover:border-black transition-colors"
                >
                    <ChevronRight size={15} />
                </button>
            </div>
        </div>
    );
};
