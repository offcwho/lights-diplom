'use client'

import { Container } from "@/components/Container"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.05,
        },
    },
} as const;

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 70,
            damping: 18,
            mass: 0.8
        },
    },
} as const;

const imageVariants = {
    hidden: { opacity: 0, scale: 1.05 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 40,
            damping: 20,
            delay: 0.2,
        },
    },
} as const;

export const HeroUi = () => {
    return (
        <Container className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 items-center">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }} // Срабатывает 1 раз, при прокрутке на 20%
                className="lg:col-span-7 space-y-6 flex-col flex items-start"
            >
                <motion.span
                    variants={itemVariants}
                    className="text-xs uppercase font-bold tracking-[0.3em] text-zinc-500 block select-none"
                >
                    Архитектурная мастерская света
                </motion.span>

                <motion.h1
                    variants={itemVariants}
                    className="text-5xl md:text-8xl font-black tracking-tight leading-none uppercase"
                >
                    ТИШИНА <br />И ФОРМА.
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="text-zinc-600 max-w-xl text-sm md:text-base leading-relaxed"
                >
                    Мы создаем не просто светильники, а инструменты управления пространством. luxf.light — это симбиоз
                    честных, грубых материалов и точной оптики. Рождено на стыке брутализма и минимализма.
                </motion.p>

                <motion.div variants={itemVariants} className="pt-4">
                    <Link href="/catalog" className="bg-black text-white px-8 py-4 rounded-full text-xs font-bold tracking-widest hover:bg-zinc-800 transition-all flex items-center space-x-3 group">
                        <span>ИССЛЕДОВАТЬ КОЛЛЕКЦИИ</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </motion.div>

            {/* БЛОК С КАРТИНКОЙ */}
            <div className="lg:col-span-5">
                <motion.div
                    variants={imageVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    className="w-full aspect-4/5 rounded-4xl md:rounded-[2.5rem] overflow-hidden shadow-sm bg-zinc-100"
                >
                    <img
                        src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800"
                        alt="Brand Aesthetics"
                        className="w-full h-full object-cover"
                    />
                </motion.div>
            </div>
        </Container>
    )
}