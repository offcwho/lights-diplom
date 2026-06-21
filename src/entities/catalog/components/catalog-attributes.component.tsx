'use client'

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useCatalog } from "../module/catalog.context";
import { TightSpring } from "../module/catalog.animations";

const VISIBLE_LIMIT = 6;
const SCROLL_AFTER = 8;

export const CatalogAttributesComponent = () => {
    const { products, selectedAttrs, toggleAttr } = useCatalog();
    const [expanded, setExpanded] = useState(false);

    const allAttrs = useMemo(() => {
        const seen = new Set<string>();
        const result: { key: string; name: string; value: string }[] = [];
        for (const product of products) {
            for (const attr of product.attributes) {
                const key = `${attr.name}:${attr.value}`;
                if (!seen.has(key)) {
                    seen.add(key);
                    result.push({ key, name: attr.name, value: attr.value });
                }
            }
        }
        return result;
    }, [products]);

    if (allAttrs.length === 0) return null;

    const visible = expanded ? allAttrs : allAttrs.slice(0, VISIBLE_LIMIT);
    const hasMore = allAttrs.length > VISIBLE_LIMIT;
    const useScroll = expanded && allAttrs.length > SCROLL_AFTER;

    return (
        <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Характеристики</h4>

            <div
                className={`space-y-1 transition-all ${useScroll ? 'overflow-y-auto max-h-[13.5rem] pr-1' : ''}`}
            >
                {visible.map((attr) => {
                    const isChecked = selectedAttrs.includes(attr.key);
                    return (
                        <button
                            key={attr.key}
                            onClick={() => toggleAttr(attr.key)}
                            className="flex items-center gap-3 w-full text-left group py-1.5 select-none outline-none"
                        >
                            <div className={`w-4 h-4 rounded-md border-[1.5px] flex items-center justify-center shrink-0 transition-all ${
                                isChecked ? 'bg-[#111111] border-transparent' : 'border-zinc-300 group-hover:border-zinc-500'
                            }`}>
                                <motion.div
                                    initial={false}
                                    animate={{ scale: isChecked ? 1 : 0, opacity: isChecked ? 1 : 0 }}
                                    transition={TightSpring}
                                >
                                    <Check size={9} strokeWidth={3} className="text-white" />
                                </motion.div>
                            </div>
                            <span className="text-xs font-bold text-zinc-500 group-hover:text-black transition-colors leading-tight">
                                <span className="text-zinc-400">{attr.name}:</span>{' '}{attr.value}
                            </span>
                        </button>
                    );
                })}
            </div>

            {hasMore && (
                <button
                    type="button"
                    onClick={() => setExpanded((p) => !p)}
                    className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors"
                >
                    {expanded ? 'Скрыть' : `Показать ещё ${allAttrs.length - VISIBLE_LIMIT}`}
                </button>
            )}
        </div>
    );
};
