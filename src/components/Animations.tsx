'use client'

import { motion, HTMLMotionProps } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";

// Страница/секция: включает каскад для всех PageItem внутри
export const PageStagger = ({ children, className, ...rest }: HTMLMotionProps<'div'>) => (
    <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className={className}
        {...rest}
    >
        {children}
    </motion.div>
);

// Элемент каскада: появляется со сдвигом, в свой черёд
export const PageItem = ({ children, className, ...rest }: HTMLMotionProps<'div'>) => (
    <motion.div variants={fadeUp} className={className} {...rest}>
        {children}
    </motion.div>
);