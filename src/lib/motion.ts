import { Variants, Transition } from "framer-motion";

// Единая пружина проекта — мягкая, без дребезга
export const springSmooth: Transition = {
    type: 'spring',
    stiffness: 170,   // было 320 — ниже жёсткость, движение «тягучее»
    damping: 26,      // гасим колебания почти полностью
    mass: 1,
};

// Совсем нежная — для крупных блоков и страниц
export const springSoft: Transition = {
    type: 'spring',
    stiffness: 120,
    damping: 22,
};

// Появление блока: лёгкий подъём + проявление
export const fadeUp: Variants = {
    hidden: { opacity: 0, y: 16 },          // было 24 — короче путь, спокойнее
    visible: {
        opacity: 1,
        y: 0,
        transition: springSoft,
    },
};

// Каскад: неторопливый, с ощутимой паузой
export const staggerContainer: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,   // было 0.08 — волна читается глазом
            delayChildren: 0.15,
        },
    },
};

export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};