// resources/js/components/ui/scroll-text-reveal.tsx
// Texte dont chaque mot s'allume au fil du scroll.

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

interface ScrollTextRevealProps {
    text: string;
    highlight?: string[];
    className?: string;
}

function Word({
    children,
    progress,
    range,
    isHighlighted,
}: {
    children: string;
    progress: MotionValue<number>;
    range: [number, number];
    isHighlighted: boolean;
}) {
    const opacity = useTransform(progress, range, [0.12, 1]);
    const y = useTransform(progress, range, [6, 0]);

    return (
        <motion.span
            style={{ opacity, y }}
            className={cn('mr-[0.25em] inline-block', isHighlighted && 'text-teal-600')}
        >
            {children}
        </motion.span>
    );
}

export function ScrollTextReveal({ text, highlight = [], className }: ScrollTextRevealProps) {
    const ref = useRef<HTMLParagraphElement>(null);
    const prefersReducedMotion = useReducedMotion();
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start 0.85', 'end 0.45'],
    });
    const words = text.split(' ');

    if (prefersReducedMotion) {
        return (
            <p ref={ref} className={className}>
                {text}
            </p>
        );
    }

    return (
        <p ref={ref} className={cn('flex flex-wrap', className)}>
            {words.map((word, i) => {
                const start = i / words.length;
                const cleanWord = word.replace(/[.,;:!?]/g, '');

                return (
                    <Word
                        key={`${word}-${i}`}
                        progress={scrollYProgress}
                        range={[start, start + 1 / words.length]}
                        isHighlighted={highlight.includes(cleanWord)}
                    >
                        {word}
                    </Word>
                );
            })}
        </p>
    );
}
