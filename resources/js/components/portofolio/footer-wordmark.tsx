// resources/js/components/portofolio/footer-wordmark.tsx
// « MR SERGIO » géant dont les lettres montent au fil du scroll.

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';

const WORDMARK = 'MR SERGIO';
const REVEAL_DISTANCE_PX = 520;

function distanceToPageBottom(scrollTop: number): number {
    if (typeof window === 'undefined') {
        return 0;
    }

    return document.documentElement.scrollHeight - (scrollTop + window.innerHeight);
}

function Letter({
    letter,
    index,
    total,
    progress,
}: {
    letter: string;
    index: number;
    total: number;
    progress: MotionValue<number>;
}) {
    const prefersReducedMotion = useReducedMotion();
    const start = (index / total) * 0.5;
    const y = useTransform(progress, [start, start + 0.5], prefersReducedMotion ? ['0%', '0%'] : ['105%', '0%']);
    const rotate = useTransform(progress, [start, start + 0.5], prefersReducedMotion ? [0, 0] : [8, 0]);

    if (letter === ' ') {
        return <span className="inline-block w-[0.22em]" />;
    }

    return (
        <motion.span
            style={{ y, rotate }}
            className="inline-block origin-bottom-left text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.22)] sm:[-webkit-text-stroke:1.5px_rgba(255,255,255,0.22)]"
        >
            {letter}
        </motion.span>
    );
}

export function FooterWordmark() {
    const { scrollY } = useScroll();
    const progress = useTransform(scrollY, (scrollTop) =>
        Math.min(1, Math.max(0, 1 - distanceToPageBottom(scrollTop) / REVEAL_DISTANCE_PX)),
    );
    const letters = WORDMARK.split('');

    return (
        <div aria-hidden className="pointer-events-none overflow-hidden pt-[0.06em] select-none">
            <p
                className="flex justify-center font-display leading-[0.78] font-extrabold tracking-[-0.06em] whitespace-nowrap"
                style={{ fontSize: 'clamp(64px, 18.5vw, 280px)' }}
            >
                {letters.map((letter, index) => (
                    <Letter key={index} letter={letter} index={index} total={letters.length} progress={progress} />
                ))}
            </p>
        </div>
    );
}
