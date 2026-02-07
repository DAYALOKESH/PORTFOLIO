'use client';

import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';

// Smooth spring config for buttery animations
const smoothSpring = { stiffness: 100, damping: 30, restDelta: 0.001 };

interface ScrollRevealProps {
    children: ReactNode;
    className?: string;
    direction?: 'up' | 'down' | 'left' | 'right';
    delay?: number;
    duration?: number;
    distance?: number;
    once?: boolean;
}

// Advanced scroll reveal with direction support
export function ScrollReveal({
    children,
    className,
    direction = 'up',
    delay = 0,
    duration = 0.8,
    distance = 60,
    once = false,
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once, margin: '-100px' });

    const directions = {
        up: { y: distance, x: 0 },
        down: { y: -distance, x: 0 },
        left: { x: distance, y: 0 },
        right: { x: -distance, y: 0 },
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, ...directions[direction] }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...directions[direction] }}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.4, 0.25, 1],
            }}
        >
            {children}
        </motion.div>
    );
}

interface ParallaxProps {
    children: ReactNode;
    className?: string;
    speed?: number; // Negative = slower, Positive = faster
    offset?: number;
}

// Parallax scrolling effect
export function Parallax({ children, className, speed = 0.5, offset = 0 }: ParallaxProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    const y = useTransform(scrollYProgress, [0, 1], [offset - 100 * speed, offset + 100 * speed]);
    const smoothY = useSpring(y, smoothSpring);

    return (
        <motion.div ref={ref} className={className} style={{ y: smoothY }}>
            {children}
        </motion.div>
    );
}

interface TextRevealProps {
    children: string;
    className?: string;
    delay?: number;
    staggerDelay?: number;
}

// Character-by-character text reveal
export function TextReveal({ children, className, delay = 0, staggerDelay = 0.03 }: TextRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: false, margin: '-50px' });

    const words = children.split(' ');

    return (
        <span ref={ref} className={className}>
            {words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block mr-[0.25em]">
                    {word.split('').map((char, charIndex) => {
                        const totalIndex = words.slice(0, wordIndex).join('').length + charIndex;
                        return (
                            <motion.span
                                key={charIndex}
                                className="inline-block"
                                initial={{ opacity: 0, y: 20, rotateX: 90 }}
                                animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 20, rotateX: 90 }}
                                transition={{
                                    duration: 0.4,
                                    delay: delay + totalIndex * staggerDelay,
                                    ease: [0.25, 0.4, 0.25, 1],
                                }}
                            >
                                {char}
                            </motion.span>
                        );
                    })}
                </span>
            ))}
        </span>
    );
}

interface StaggerContainerProps {
    children: ReactNode;
    className?: string;
    staggerDelay?: number;
    once?: boolean;
}

// Stagger children animations
export function StaggerContainer({ children, className, staggerDelay = 0.1, once = false }: StaggerContainerProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once, margin: '-50px' });

    return (
        <motion.div
            ref={ref}
            className={className}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
            }}
        >
            {children}
        </motion.div>
    );
}

// Stagger item (use inside StaggerContainer)
export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <motion.div
            className={className}
            variants={{
                hidden: { opacity: 0, y: 40, scale: 0.95 },
                visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                        duration: 0.6,
                        ease: [0.25, 0.4, 0.25, 1],
                    },
                },
            }}
        >
            {children}
        </motion.div>
    );
}

interface ScaleOnScrollProps {
    children: ReactNode;
    className?: string;
}

// Scale up/down based on scroll position
export function ScaleOnScroll({ children, className }: ScaleOnScrollProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'center center'],
    });

    const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
    const smoothScale = useSpring(scale, smoothSpring);
    const smoothOpacity = useSpring(opacity, smoothSpring);

    return (
        <motion.div
            ref={ref}
            className={className}
            style={{ scale: smoothScale, opacity: smoothOpacity }}
        >
            {children}
        </motion.div>
    );
}

interface RotateOnScrollProps {
    children: ReactNode;
    className?: string;
    maxRotate?: number;
}

// Rotate based on scroll
export function RotateOnScroll({ children, className, maxRotate = 10 }: RotateOnScrollProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    const rotate = useTransform(scrollYProgress, [0, 1], [-maxRotate, maxRotate]);
    const smoothRotate = useSpring(rotate, smoothSpring);

    return (
        <motion.div ref={ref} className={className} style={{ rotateZ: smoothRotate }}>
            {children}
        </motion.div>
    );
}

interface SlideInProps {
    children: ReactNode;
    className?: string;
    direction?: 'left' | 'right';
    distance?: number;
}

// Horizontal slide with scroll progress
export function SlideIn({ children, className, direction = 'left', distance = 100 }: SlideInProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'center center'],
    });

    const x = useTransform(
        scrollYProgress,
        [0, 1],
        direction === 'left' ? [-distance, 0] : [distance, 0]
    );
    const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
    const smoothX = useSpring(x, smoothSpring);
    const smoothOpacity = useSpring(opacity, smoothSpring);

    return (
        <motion.div ref={ref} className={className} style={{ x: smoothX, opacity: smoothOpacity }}>
            {children}
        </motion.div>
    );
}

interface BlurRevealProps {
    children: ReactNode;
    className?: string;
}

// Blur to clear reveal
export function BlurReveal({ children, className }: BlurRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'center center'],
    });

    const blur = useTransform(scrollYProgress, [0, 1], [10, 0]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
    const y = useTransform(scrollYProgress, [0, 1], [50, 0]);

    const smoothBlur = useSpring(blur, smoothSpring);
    const smoothOpacity = useSpring(opacity, smoothSpring);
    const smoothY = useSpring(y, smoothSpring);

    return (
        <motion.div
            ref={ref}
            className={className}
            style={{
                filter: useTransform(smoothBlur, (v) => `blur(${v}px)`),
                opacity: smoothOpacity,
                y: smoothY,
            }}
        >
            {children}
        </motion.div>
    );
}

interface MaskRevealProps {
    children: ReactNode;
    className?: string;
}

// Clip-path mask reveal
export function MaskReveal({ children, className }: MaskRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: false, margin: '-100px' });

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
            animate={isInView ? { clipPath: 'inset(0% 0% 0% 0%)' } : { clipPath: 'inset(100% 0% 0% 0%)' }}
            transition={{ duration: 1, ease: [0.77, 0, 0.175, 1] }}
        >
            {children}
        </motion.div>
    );
}
