'use client'

import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCatalog } from "../module/catalog.context";
import { springSmooth } from "@/lib/motion";

export const CatalogSearchUi = ({ className }: { className?: string }) => {
    const { searchQuery, setSearchQuery } = useCatalog();

    return (
        <div className="relative flex-1 min-w-0">
            <Search
                size={14}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
            />
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск светильников..."
                className="w-full bg-transparent pl-10 pr-9 py-3.5 text-xs font-medium outline-none
                                   placeholder:text-zinc-400 placeholder:uppercase placeholder:tracking-wider placeholder:text-[10px]"
            />
            <AnimatePresence>
                {searchQuery.length > 0 && (
                    <motion.button
                        type="button"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        whileTap={{ scale: 0.85 }}
                        transition={springSmooth}
                        onClick={() => setSearchQuery('')}
                        aria-label="Очистить поиск"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-zinc-400 hover:text-black hover:bg-black/5 transition-colors"
                    >
                        <X size={12} />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};