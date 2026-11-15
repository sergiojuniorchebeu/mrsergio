// resources/js/components/ui/section-backdrop.tsx
// Motifs de fond discrets (sans dégradé de couleur) avec léger parallaxe au scroll.
// Sur mobile, le mouvement est réduit (environ un tiers) pour rester léger.
// Le parent doit être `relative isolate` et `overflow-clip` (compatible sticky).

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export type BackdropPattern = 'grid' | 'lines' | 'plus' | 'rings';

const PLUS_TILE =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='44'%3E%3Cpath d='M22 17v10M17 22h10' stroke='%23cac7be' stroke-width='1.2' stroke-linecap='round'/%3E%3C/svg%3E\")";

const TILE_PATTERNS: Record<Exclude<BackdropPattern, 'rings'>, { image: string; size: string }> = {
    grid: {
        image: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
        size: '56px 56px',
    },
    lines: {
        image: 'linear-gradient(to bottom, currentColor 1px, transparent 1px)',
        size: '100% 44px',
    },
    plus: {
        image: PLUS_TILE,
        size: '44px 44px',
    },
};

const EDGE_MASK = '[mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]';

function Rings() {
    return (
        <svg
            className="absolute top-1/2 right-[-18%] aspect-square h-[150%] -translate-y-1/2 text-slate-200 sm:right-[-8%]"
            viewBox="0 0 800 800"
            fill="none"
        >
            {Array.from({ length: 9 }, (_, i) => (
                <circle key={i} cx="400" cy="400" r={60 + i * 42} stroke="currentColor" strokeWidth="1" />
            ))}
            <circle cx="400" cy="400" r="4" className="fill-teal-500" />
        </svg>
    );
}

export function SectionBackdrop({
    pattern,
    className,
    withMargin = false,
}: {
    pattern: BackdropPattern;
    className?: string;
    /** Ajoute une marge verticale façon cahier (motif « lines »). */
    withMargin?: boolean;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();
    const isMobile = useIsMobile();
    const isStatic = Boolean(prefersReducedMotion);
    const travel = isStatic ? 0 : isMobile ? 28 : 80;
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });
    const y = useTransform(scrollYProgress, [0, 1], [-travel, travel]);
    const rotate = useTransform(scrollYProgress, [0, 1], isStatic ? [0, 0] : [-12, 12]);

    return (
        <div ref={ref} aria-hidden className={cn('pointer-events-none absolute inset-0 -z-10', EDGE_MASK, className)}>
            {pattern === 'rings' ? (
                <motion.div style={{ y, rotate }} className="absolute inset-0">
                    <Rings />
                </motion.div>
            ) : (
                <motion.div
                    style={{
                        y,
                        backgroundImage: TILE_PATTERNS[pattern].image,
                        backgroundSize: TILE_PATTERNS[pattern].size,
                    }}
                    className="absolute inset-x-0 -top-24 -bottom-24 text-slate-200/70"
                />
            )}

            {withMargin && <div className="absolute inset-y-0 left-[6%] w-px bg-teal-500/25 sm:left-[8%]" />}
        </div>
    );
}
