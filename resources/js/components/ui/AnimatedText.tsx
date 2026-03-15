// resources/js/components/ui/AnimatedText.tsx
"use client";

import { motion, useInView } from 'framer-motion';
import { useRef }             from 'react';
import { cn }                 from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// SHARED EASING
// ─────────────────────────────────────────────────────────────────────────────
const EASE_SMOOTH: [number, number, number, number] = [0.23, 1, 0.32, 1];

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATED TEXT — words appear one by one with stagger
// ─────────────────────────────────────────────────────────────────────────────
interface AnimatedTextProps {
    text: string;
    className?: string;
    delay?: number;
    /** Stagger delay between each word (ms converted internally) */
    stagger?: number;
    /** Trigger animation only when element is in view */
    startOnView?: boolean;
    /** Split by character instead of word */
    byCharacter?: boolean;
}

export function AnimatedText({
    text,
    className,
    delay = 0,
    stagger = 0.08,
    startOnView = false,
    byCharacter = false,
}: AnimatedTextProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref as React.RefObject<Element>, {
        once: true,
        amount: 0.3,
    });

    const shouldAnimate = startOnView ? isInView : true;
    const chunks = byCharacter ? text.split('') : text.split(' ');

    return (
        <span ref={ref} className={cn('inline-flex flex-wrap', className)}>
            {chunks.map((chunk, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                    animate={shouldAnimate
                        ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                        : {}
                    }
                    transition={{
                        duration: 0.55,
                        delay: delay + i * stagger,
                        ease: EASE_SMOOTH,
                    }}
                    className={cn(
                        'inline-block',
                        byCharacter ? '' : 'mr-[0.25em]',
                    )}
                >
                    {byCharacter && chunk === ' ' ? '\u00A0' : chunk}
                </motion.span>
            ))}
        </span>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// REVEAL TEXT — clip-based vertical reveal (premium slide-up)
// ─────────────────────────────────────────────────────────────────────────────
interface RevealTextProps {
    text: string;
    className?: string;
    delay?: number;
    /** Duration of the reveal in seconds */
    duration?: number;
    /** Trigger animation only when element is in view */
    startOnView?: boolean;
}

export function RevealText({
    text,
    className,
    delay = 0,
    duration = 0.7,
    startOnView = false,
}: RevealTextProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref as React.RefObject<Element>, {
        once: true,
        amount: 0.3,
    });

    const shouldAnimate = startOnView ? isInView : true;

    return (
        <div ref={ref} className="overflow-hidden">
            <motion.div
                initial={{ y: '110%', opacity: 0.3 }}
                animate={shouldAnimate ? { y: '0%', opacity: 1 } : {}}
                transition={{ duration, delay, ease: EASE_SMOOTH }}
                className={className}
            >
                {text}
            </motion.div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// SPLIT REVEAL — each line slides up independently
// Use for multi-line headings where each line reveals with delay
// ─────────────────────────────────────────────────────────────────────────────
interface SplitRevealProps {
    lines: string[];
    className?: string;
    lineClassName?: string;
    delay?: number;
    stagger?: number;
    startOnView?: boolean;
}

export function SplitReveal({
    lines,
    className,
    lineClassName,
    delay = 0,
    stagger = 0.12,
    startOnView = true,
}: SplitRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref as React.RefObject<Element>, {
        once: true,
        amount: 0.2,
    });

    const shouldAnimate = startOnView ? isInView : true;

    return (
        <div ref={ref} className={className}>
            {lines.map((line, i) => (
                <div key={i} className="overflow-hidden">
                    <motion.div
                        initial={{ y: '110%', opacity: 0 }}
                        animate={shouldAnimate
                            ? { y: '0%', opacity: 1 }
                            : {}
                        }
                        transition={{
                            duration: 0.7,
                            delay: delay + i * stagger,
                            ease: EASE_SMOOTH,
                        }}
                        className={lineClassName}
                    >
                        {line}
                    </motion.div>
                </div>
            ))}
        </div>
    );
}