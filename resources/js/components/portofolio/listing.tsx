// resources/js/components/portofolio/listing.tsx
// Briques communes aux pages de liste (blog, projets, formations) :
// hero, rangée de filtres, grille stable au filtrage, encart d'appel à l'action.

import { Link } from '@inertiajs/react';
import NumberFlow from '@number-flow/react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { HeroBackdrop } from '@/components/ui/hero-backdrop';
import { MaskedLine, Reveal, SplitChars } from '@/components/ui/reveal';
import { cn, easings } from '@/lib/utils';

const LAYOUT_SPRING = { type: 'spring', stiffness: 260, damping: 32, mass: 0.8 } as const;

function useFadeIn() {
    const prefersReducedMotion = useReducedMotion();

    return (delay: number) => ({
        initial: { opacity: 0, y: prefersReducedMotion ? 0 : 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, delay, ease: easings.smooth },
    });
}

// ─── Hero ────────────────────────────────────────────────────────────────────
export function ListingHero({
    eyebrow,
    title,
    accent,
    intro,
    count,
    unit,
    filterLabel,
}: {
    eyebrow: string;
    title: string;
    accent: string;
    intro: string;
    count: number;
    unit: [singular: string, plural: string];
    filterLabel: string | null;
}) {
    const fadeIn = useFadeIn();

    return (
        <HeroBackdrop>
            <div className="container-main pt-[110px] pb-14 sm:pt-[130px] sm:pb-20">
                <motion.p {...fadeIn(0)} className="mb-8 font-mono text-[12px] text-slate-500">
                    {eyebrow}
                </motion.p>
                <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <h1 className="font-display text-[52px] leading-[0.96] font-bold tracking-[-0.045em] text-[#1a1916] sm:text-7xl lg:text-[88px]">
                            <SplitChars text={title} delay={0.1} />
                            <SplitChars text={accent} delay={0.35} className="text-teal-600" />
                        </h1>
                        <motion.p {...fadeIn(0.6)} className="mt-7 max-w-md text-[19px] leading-[1.6] text-slate-600">
                            {intro}
                        </motion.p>
                    </div>

                    <motion.div {...fadeIn(0.7)} className="flex items-baseline gap-3">
                        <span className="font-display text-[72px] leading-none font-bold tracking-[-0.04em] text-[#1a1916] tabular-nums sm:text-[96px]">
                            <NumberFlow value={count} />
                        </span>
                        <span className="flex flex-col pb-2 font-mono text-[12px] text-slate-500">
                            {count > 1 ? unit[1] : unit[0]}
                            <AnimatePresence mode="popLayout">
                                {filterLabel && (
                                    <motion.span
                                        key={filterLabel}
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -6 }}
                                        className="text-teal-600"
                                    >
                                        {filterLabel}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </span>
                    </motion.div>
                </div>
            </div>
        </HeroBackdrop>
    );
}

// ─── Filtres ─────────────────────────────────────────────────────────────────
export interface FilterOption {
    value: string;
    label: string;
    count: number;
}

function FilterPill({
    groupId,
    label,
    count,
    isActive,
    onClick,
}: {
    groupId: string;
    label: string;
    count: number;
    isActive: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={isActive}
            className={cn(
                'relative inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-4 font-display text-[13px] font-semibold transition-colors duration-300 active:scale-[0.97]',
                isActive ? 'text-white' : 'text-slate-600 hover:text-slate-900',
            )}
        >
            {isActive && (
                <motion.span
                    layoutId={`${groupId}-active`}
                    className="absolute inset-0 rounded-full bg-slate-900"
                    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                />
            )}
            <span className="relative">{label}</span>
            <span
                className={cn(
                    'relative font-mono text-[11px] tabular-nums transition-colors',
                    isActive ? 'text-white/60' : 'text-slate-400',
                )}
            >
                {count}
            </span>
        </button>
    );
}

/**
 * Une rangée de filtres sur une seule ligne (défilement horizontal sur mobile).
 */
export function FilterRow({
    id,
    label,
    allLabel = 'Tous',
    allCount,
    options,
    value,
    onChange,
}: {
    id: string;
    label?: string;
    allLabel?: string;
    allCount: number;
    options: FilterOption[];
    value: string | null;
    onChange: (value: string | null) => void;
}) {
    return (
        <div className="flex items-center gap-3">
            {label && <span className="w-14 shrink-0 font-mono text-[11px] text-slate-400">{label}</span>}
            <div className="-mr-5 flex min-w-0 flex-1 items-center gap-1 overflow-x-auto pr-5 [scrollbar-width:none] sm:mr-0 sm:pr-0 [&::-webkit-scrollbar]:hidden">
                <LayoutGroup id={id}>
                    <FilterPill
                        groupId={id}
                        label={allLabel}
                        count={allCount}
                        isActive={value === null}
                        onClick={() => onChange(null)}
                    />
                    {options.map((option) => (
                        <FilterPill
                            key={option.value}
                            groupId={id}
                            label={option.label}
                            count={option.count}
                            isActive={value === option.value}
                            onClick={() => onChange(value === option.value ? null : option.value)}
                        />
                    ))}
                </LayoutGroup>
            </div>
        </div>
    );
}

/**
 * Bandeau qui accueille une ou plusieurs rangées de filtres.
 */
export function FilterBar({ children, onReset }: { children: ReactNode; onReset?: () => void }) {
    const fadeIn = useFadeIn();

    return (
        <div className="border-y border-slate-200/80 bg-white">
            <motion.div {...fadeIn(0.8)} className="container-main flex flex-col gap-2 py-3">
                {children}
                <AnimatePresence initial={false}>
                    {onReset && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: easings.smooth }}
                            className="overflow-hidden"
                        >
                            <button
                                type="button"
                                onClick={onReset}
                                className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'text-slate-500' })}
                            >
                                Effacer les filtres
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

// ─── Grille stable ───────────────────────────────────────────────────────────
/**
 * Grille dont les éléments glissent à leur nouvelle place au filtrage :
 * ceux qui partent s'effacent, ceux qui arrivent apparaissent.
 */
export function FilterGrid({ id, children, className }: { id: string; children: ReactNode; className?: string }) {
    return (
        <LayoutGroup id={id}>
            <div className={cn('relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3', className)}>
                <AnimatePresence mode="popLayout" initial={false}>
                    {children}
                </AnimatePresence>
            </div>
        </LayoutGroup>
    );
}

export function FilterGridItem({ children, className }: { children: ReactNode; className?: string }) {
    const prefersReducedMotion = useReducedMotion();

    return (
        <motion.div
            layout={!prefersReducedMotion}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.22 } }}
            transition={{ layout: LAYOUT_SPRING, duration: 0.35, ease: easings.smooth }}
            className={cn('h-full', className)}
        >
            {children}
        </motion.div>
    );
}

export function EmptyResults({ message, onReset }: { message: string; onReset?: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-200 px-6 py-20 text-center"
        >
            <p className="text-[17px] text-slate-500">{message}</p>
            {onReset && (
                <button type="button" onClick={onReset} className={buttonVariants({ variant: 'outline' })}>
                    Effacer les filtres
                </button>
            )}
        </motion.div>
    );
}

// ─── Appel à l'action ────────────────────────────────────────────────────────
export function ListingCta({
    title,
    text,
    href,
    label,
}: {
    title: string;
    text: string;
    href: string;
    label: string;
}) {
    return (
        <Reveal className="mt-20">
            <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-slate-200 bg-white p-8 sm:flex-row sm:items-center">
                <div>
                    <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">
                        <MaskedLine onScroll>{title}</MaskedLine>
                    </h2>
                    <p className="mt-2 text-[16px] text-slate-600">{text}</p>
                </div>
                <Link href={href} className={buttonVariants({ variant: 'outline', className: 'shrink-0' })}>
                    {label}
                </Link>
            </div>
        </Reveal>
    );
}
