// resources/js/components/ui/reveal.tsx
// Animations d'apparition partagées (montage ou scroll), sans flou.

import { motion, useInView, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useRef } from 'react';
import { cn, easings } from '@/lib/utils';

const SCROLL_VIEWPORT = { once: true, margin: '0px 0px -12% 0px' } as const;

interface RevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    y?: number;
    as?: 'div' | 'section' | 'article' | 'li';
}

/**
 * Fondu + montée légère quand l'élément entre dans l'écran.
 */
export function Reveal({
    children,
    className,
    delay = 0,
    y = 28,
    as = 'div',
}: RevealProps) {
    const prefersReducedMotion = useReducedMotion();
    const Component = motion[as];

    return (
        <Component
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={SCROLL_VIEWPORT}
            transition={{ duration: 0.8, delay, ease: easings.smooth }}
            className={className}
        >
            {children}
        </Component>
    );
}

/**
 * Révèle une ligne de texte derrière un masque, au montage ou au scroll.
 */
export function MaskedLine({
    children,
    delay = 0,
    className,
    onScroll = false,
}: {
    children: ReactNode;
    delay?: number;
    className?: string;
    onScroll?: boolean;
}) {
    const prefersReducedMotion = useReducedMotion();
    const maskRef = useRef<HTMLSpanElement>(null);
    // On observe le masque (toujours visible), pas le texte qui démarre caché dessous :
    // sinon le navigateur peut considérer le texte comme jamais visible.
    const isMaskInView = useInView(maskRef, SCROLL_VIEWPORT);
    const hidden = prefersReducedMotion
        ? { opacity: 0 }
        : { y: '110%', rotate: 2 };
    const shown = prefersReducedMotion ? { opacity: 1 } : { y: 0, rotate: 0 };
    const isShown = !onScroll || isMaskInView;

    return (
        <span ref={maskRef} className="block overflow-hidden pb-[0.1em]">
            <motion.span
                className={className ?? 'block'}
                initial={hidden}
                animate={isShown ? shown : hidden}
                transition={{ duration: 0.95, delay, ease: easings.expo }}
                style={{ transformOrigin: '0% 100%' }}
            >
                {children}
            </motion.span>
        </span>
    );
}

/**
 * Trait horizontal qui se dessine de gauche à droite au scroll.
 */
export function DrawLine({ className }: { className?: string }) {
    const wrapperRef = useRef<HTMLSpanElement>(null);
    const isInView = useInView(wrapperRef, SCROLL_VIEWPORT);

    return (
        <span ref={wrapperRef} aria-hidden className={cn('block h-px', className)}>
            <motion.span
                className="block h-full w-full origin-left bg-slate-200"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isInView ? 1 : 0 }}
                transition={{ duration: 1.2, ease: easings.expo }}
            />
        </span>
    );
}

/**
 * Fait monter chaque lettre d'un texte, mot par mot, au montage.
 */
export function SplitChars({
    text,
    delay = 0,
    stagger = 0.035,
    className,
}: {
    text: string;
    delay?: number;
    stagger?: number;
    className?: string;
}) {
    const prefersReducedMotion = useReducedMotion();
    let charIndex = 0;

    return (
        <span className={cn('block', className)} aria-label={text}>
            {text.split(' ').map((word, wordIndex) => (
                <span
                    key={`${word}-${wordIndex}`}
                    aria-hidden
                    className="mr-[0.22em] inline-flex overflow-hidden pb-[0.1em] last:mr-0"
                >
                    {word.split('').map((char) => {
                        const currentIndex = charIndex++;

                        return (
                            <motion.span
                                key={currentIndex}
                                className="inline-block"
                                initial={
                                    prefersReducedMotion
                                        ? { opacity: 0 }
                                        : { y: '115%', rotate: 6 }
                                }
                                animate={
                                    prefersReducedMotion
                                        ? { opacity: 1 }
                                        : { y: 0, rotate: 0 }
                                }
                                transition={{
                                    duration: 0.9,
                                    delay: delay + currentIndex * stagger,
                                    ease: easings.expo,
                                }}
                                style={{ transformOrigin: '0% 100%' }}
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

/**
 * Fait monter chaque mot d'un texte derrière un masque, au montage.
 * Plus adapté que SplitChars aux titres longs (phrases).
 */
export function SplitWords({
    text,
    delay = 0,
    stagger = 0.045,
    className,
}: {
    text: string;
    delay?: number;
    stagger?: number;
    className?: string;
}) {
    const prefersReducedMotion = useReducedMotion();
    const words = text.split(' ');

    return (
        <span className={cn('block', className)} aria-label={text}>
            {words.map((word, index) => (
                <span
                    key={`${word}-${index}`}
                    aria-hidden
                    className="mr-[0.24em] inline-flex overflow-hidden pb-[0.12em] align-top last:mr-0"
                >
                    <motion.span
                        className="inline-block"
                        initial={prefersReducedMotion ? { opacity: 0 } : { y: '110%' }}
                        animate={prefersReducedMotion ? { opacity: 1 } : { y: 0 }}
                        transition={{
                            duration: 0.8,
                            delay: delay + index * stagger,
                            ease: easings.expo,
                        }}
                    >
                        {word}
                    </motion.span>
                </span>
            ))}
        </span>
    );
}
