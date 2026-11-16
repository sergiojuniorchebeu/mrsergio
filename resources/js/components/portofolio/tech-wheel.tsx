// resources/js/components/portofolio/tech-wheel.tsx
// Section épinglée : les technos tournent sur un tambour 3D au fil du scroll.

import {
    useMotionValueEvent,
    motion,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
} from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { useLayoutEffect, useRef, useState } from 'react';
import {
    EVENODD_TECH_LOGOS,
    TECH_LOGO_PATHS,
} from '@/components/portofolio/tech-logos';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTranslation } from '@/lib/i18n';

const SCROLL_VH_PER_ITEM = 30;
const SCROLL_VH_PER_ITEM_MOBILE = 15;
const TICK_VIBRATION_MS = 8;

/**
 * Petite vibration « cran de sélecteur » (Android uniquement : iOS ne l'expose pas au web).
 */
function vibrateTick(): void {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(TICK_VIBRATION_MS);
    }
}
/** Distance (px) entre le haut de l'écran et le bloc épinglé : sous la barre de navigation. */
const PIN_TOP_PX = 96;
const ROW_HEIGHT_EM = 1.08;
const DEGREES_PER_ROW = 24;

function WheelItem({
    label,
    index,
    position,
}: {
    label: string;
    index: number;
    position: MotionValue<number>;
}) {
    const y = useTransform(position, (p) => `${(index - p) * ROW_HEIGHT_EM}em`);
    const rotateX = useTransform(
        position,
        (p) => (p - index) * DEGREES_PER_ROW,
    );
    const opacity = useTransform(position, (p) =>
        Math.max(0, 1 - Math.abs(p - index) * 0.38),
    );
    const color = useTransform(position, (p) =>
        Math.abs(p - index) < 0.5
            ? 'var(--color-teal-600)'
            : 'var(--color-ink-primary)',
    );

    return (
        <motion.span
            style={{ y, rotateX, opacity, color }}
            className="absolute inset-x-0 top-1/2 -mt-[0.54em] block h-[1.08em] origin-center leading-[1.08em] whitespace-nowrap [backface-visibility:hidden]"
        >
            {label}
        </motion.span>
    );
}

/**
 * Logo géant de la techno au centre de la roue, en fond : il pivote et se fond
 * dans le suivant à mesure que la roue tourne.
 */
function TechLogo({
    name,
    index,
    position,
}: {
    name: string;
    index: number;
    position: MotionValue<number>;
}) {
    const paths = TECH_LOGO_PATHS[name];
    const opacity = useTransform(
        position,
        (p) => Math.max(0, 1 - Math.abs(p - index) * 1.6) * 0.036,
    );
    const scale = useTransform(
        position,
        (p) => 1 - Math.min(Math.abs(p - index), 1) * 0.25,
    );
    const rotate = useTransform(position, (p) => (index - p) * 35);

    if (!paths) {
        return null;
    }

    return (
        <motion.svg
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ opacity, scale, rotate }}
            className="absolute aspect-square h-[60%] max-h-[320px] text-teal-700"
        >
            {paths.map((path) => (
                <path
                    key={path}
                    d={path}
                    fillRule={
                        EVENODD_TECH_LOGOS.has(name) ? 'evenodd' : undefined
                    }
                />
            ))}
        </motion.svg>
    );
}

export function TechWheel({ items }: { items: string[] }) {
    const spacerRef = useRef<HTMLDivElement>(null);
    const pinnedRef = useRef<HTMLDivElement>(null);
    const [pinnedHeight, setPinnedHeight] = useState(480);

    useLayoutEffect(() => {
        const element = pinnedRef.current;

        if (!element) {
            return;
        }

        const observer = new ResizeObserver(([entry]) =>
            setPinnedHeight(entry.contentRect.height),
        );
        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    const pinLine = PIN_TOP_PX + pinnedHeight;
    const prefersReducedMotion = useReducedMotion();
    const { l } = useTranslation();
    const { scrollYProgress } = useScroll({
        target: spacerRef,
        offset: [`0 ${pinLine}px`, `1 ${pinLine}px`],
    });
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 160,
        damping: 30,
        mass: 0.4,
    });
    const position = useTransform(
        smoothProgress,
        [0, 1],
        [0, items.length - 1],
    );
    const counter = useTransform(position, (p) =>
        String(Math.round(p) + 1).padStart(2, '0'),
    );

    const isMobile = useIsMobile();
    const scrollPerItem = isMobile
        ? SCROLL_VH_PER_ITEM_MOBILE
        : SCROLL_VH_PER_ITEM;

    useMotionValueEvent(counter, 'change', () => {
        if (isMobile && !prefersReducedMotion) {
            vibrateTick();
        }
    });
    const barScale = useTransform(
        smoothProgress,
        [0, 1],
        [1 / items.length, 1],
    );
    const total = String(items.length).padStart(2, '0');

    if (prefersReducedMotion) {
        return (
            <section className="bg-white py-20">
                <div className="container-main">
                    <p className="mb-4 font-mono text-[11px] text-slate-400">
                        {l('Au quotidien', 'Day to day')}
                    </p>
                    <p className="font-display text-3xl font-bold tracking-tight text-slate-900">
                        {items.join(' · ')}
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section
            aria-label={l('Technologies utilisées', 'Technologies I use')}
            className="relative bg-white pt-6 sm:pt-8"
        >
            <div
                ref={pinnedRef}
                className="sticky isolate overflow-hidden py-4"
                style={{ top: PIN_TOP_PX }}
            >
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 right-0 -z-10 flex w-full items-center justify-center lg:w-[62%]"
                >
                    {items.map((item, index) => (
                        <TechLogo
                            key={item}
                            name={item}
                            index={index}
                            position={position}
                        />
                    ))}
                </div>
                <div className="container-main grid w-full items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
                    <div className="flex flex-col gap-6">
                        <p className="font-mono text-[11px] text-slate-400">
                            {l('Au quotidien', 'Day to day')}
                        </p>
                        <p className="max-w-sm font-display text-2xl leading-snug font-bold tracking-tight text-slate-900 sm:text-3xl">
                            {l(
                                'Les outils avec lesquels je construis, chaque jour.',
                                'The tools I build with, every day.',
                            )}
                        </p>
                        <div className="flex items-center gap-4 font-mono text-[13px] text-slate-500">
                            <span className="tabular-nums">
                                <motion.span className="text-slate-900">
                                    {counter}
                                </motion.span>{' '}
                                / {total}
                            </span>
                            <span className="relative h-px w-24 overflow-hidden bg-slate-200">
                                <motion.span
                                    style={{ scaleX: barScale }}
                                    className="absolute inset-0 origin-left bg-teal-600"
                                />
                            </span>
                        </div>
                    </div>

                    <div
                        aria-hidden
                        className="relative h-[4.4em] font-display text-[44px] font-bold tracking-[-0.04em] [perspective:900px] sm:text-7xl lg:text-[96px]"
                    >
                        <div className="absolute inset-x-0 top-1/2 h-[1.2em] -translate-y-1/2 border-y border-slate-200" />
                        <div className="absolute inset-0 [transform-style:preserve-3d]">
                            {items.map((item, index) => (
                                <WheelItem
                                    key={item}
                                    label={item}
                                    index={index}
                                    position={position}
                                />
                            ))}
                        </div>
                    </div>

                    <ul className="sr-only">
                        {items.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>
            <div
                ref={spacerRef}
                aria-hidden
                style={{ height: `${items.length * scrollPerItem}vh` }}
            />
        </section>
    );
}
