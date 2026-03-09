"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

// =============================================================================
// Animation Wrappers — Framer Motion
// Sử dụng cho page transitions, card effects, stagger children
// =============================================================================

// Fade up khi xuất hiện
const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

// Stagger children
const staggerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};

// Scale on hover
const cardHoverVariants: Variants = {
    rest: { scale: 1 },
    hover: { scale: 1.02, y: -4 },
};

// Slide in from left
const slideInLeftVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
};

/** Fade up khi scroll vào viewport */
export function FadeUp({
    children,
    delay = 0,
    className,
}: {
    children: ReactNode;
    delay?: number;
    className?: string;
}) {
    return (
        <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/** Container cho stagger animation children */
export function StaggerContainer({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            variants={staggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/** Stagger child item — dùng trong StaggerContainer */
export function StaggerItem({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            variants={fadeUpVariants}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/** Card với hover scale effect */
export function HoverCard({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            variants={cardHoverVariants}
            initial="rest"
            whileHover="hover"
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/** Page transition wrapper */
export function PageTransition({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/** Slide in from left */
export function SlideInLeft({
    children,
    delay = 0,
    className,
}: {
    children: ReactNode;
    delay?: number;
    className?: string;
}) {
    return (
        <motion.div
            variants={slideInLeftVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
