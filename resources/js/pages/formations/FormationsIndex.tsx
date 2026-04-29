// resources/js/pages/formations/FormationsIndex.tsx

import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern';
import { FormationCard } from '@/components/ui/FormationCard';
import MainLayout from '@/layouts/MainLayout';
import { cn } from '@/lib/utils';
import type { FormationsIndexProps } from '@/types';

type Level = 'débutant' | 'intermédiaire' | 'avancé';

const LEVEL_ORDER: Level[] = ['débutant', 'intermédiaire', 'avancé'];
const LEVEL_LABELS: Record<Level, string> = {
    débutant: 'Débutant',
    intermédiaire: 'Intermédiaire',
    avancé: 'Avancé',
};

// ─── Chip ─────────────────────────────────────────────────────────────────────
function Chip({
    active,
    onClick,
    children,
    count,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
    count?: number;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition-all duration-200',
                'focus-visible:ring-2 focus-visible:ring-teal-500/40 focus-visible:outline-none',
                active
                    ? 'border-teal-600 bg-teal-600 text-white shadow-sm shadow-teal-500/20'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-teal-200 hover:bg-teal-50/60 hover:text-teal-700',
            )}
        >
            {children}
            {count !== undefined && (
                <span
                    className={cn(
                        'flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold',
                        active
                            ? 'bg-white/25 text-white'
                            : 'bg-slate-100 text-slate-500',
                    )}
                >
                    {count}
                </span>
            )}
        </button>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FormationsIndex({
    formations,
    categories,
}: FormationsIndexProps) {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [activeLevel, setActiveLevel] = useState<Level | null>(null);

    // Levels present in the data
    const availableLevels = useMemo(() => {
        const s = new Set<Level>();
        formations.forEach((f) => {
            if (f.level) s.add(f.level as Level);
        });
        return LEVEL_ORDER.filter((l) => s.has(l));
    }, [formations]);

    // Counts
    const countForCategory = (cat: string) =>
        formations.filter((f) => {
            const lvl = !activeLevel || f.level === activeLevel;
            return lvl && f.category === cat;
        }).length;

    const countForLevel = (lvl: Level) =>
        formations.filter((f) => {
            const cat = !activeCategory || f.category === activeCategory;
            return cat && f.level === lvl;
        }).length;

    // Filter
    const filtered = useMemo(
        () =>
            formations.filter((f) => {
                const matchCat =
                    !activeCategory || f.category === activeCategory;
                const matchLvl = !activeLevel || f.level === activeLevel;
                return matchCat && matchLvl;
            }),
        [formations, activeCategory, activeLevel],
    );

    const hasFilters = !!(activeCategory || activeLevel);

    // Stats
    const totalLessons = formations.reduce(
        (acc, f) => acc + (f.lessons_count || 0),
        0,
    );
    const totalStudents = formations.reduce(
        (acc, f) => acc + (f.students_count || 0),
        0,
    );

    return (
        <MainLayout>
            <Head title="Formations — Sergio Junior Chebeu" />

            {/* ── Hero ─────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-[#fafaf8] pt-[88px] pb-14">
                <AnimatedGridPattern
                    numSquares={20}
                    maxOpacity={0.045}
                    duration={5}
                    repeatDelay={1.4}
                    width={36}
                    height={36}
                    className={cn(
                        'absolute inset-0 h-full w-full',
                        'fill-transparent stroke-teal-500/[0.10] text-teal-500',
                        '[mask-image:radial-gradient(ellipse_80%_70%_at_50%_42%,black_18%,rgba(0,0,0,0.65)_52%,transparent_88%)]',
                    )}
                />

                {/* Gradient mesh — cohérent avec la section formations de la home */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full"
                    style={{
                        background:
                            'radial-gradient(circle, rgba(26,163,137,0.08) 0%, transparent 70%)',
                    }}
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute -right-20 -bottom-20 h-[500px] w-[500px] rounded-full"
                    style={{
                        background:
                            'radial-gradient(circle, rgba(248,194,62,0.07) 0%, transparent 70%)',
                    }}
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 right-1/3 h-[320px] w-[320px] -translate-y-1/2 rounded-full"
                    style={{
                        background:
                            'radial-gradient(circle, rgba(26,163,137,0.04) 0%, transparent 70%)',
                    }}
                />

                {/* Watermark */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none"
                >
                    <span
                        className="font-display leading-none font-extrabold tracking-[-0.04em] whitespace-nowrap text-slate-900/[0.025] uppercase"
                        style={{ fontSize: 'clamp(48px, 10vw, 140px)' }}
                    >
                        Formations
                    </span>
                </div>

                <div className="container-main relative z-10">
                    {/* Breadcrumb */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                        className="mb-8 flex items-center gap-2 text-[12px] font-medium text-slate-400"
                    >
                        <Link
                            href="/"
                            className="transition-colors hover:text-teal-600"
                        >
                            Accueil
                        </Link>
                        <svg
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                        <span className="text-slate-600">Formations</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.6,
                            delay: 0.05,
                            ease: [0.23, 1, 0.32, 1],
                        }}
                        className="max-w-2xl"
                    >
                        {/* Badge */}
                        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-200/70 bg-teal-50 px-4 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-teal-700 uppercase">
                            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                            Apprendre · Pratiquer · Maîtriser
                        </span>

                        {/* Title */}
                        <h1 className="mt-5 font-display text-4xl leading-[1.1] font-bold tracking-[-0.02em] text-[#1a1916] sm:text-5xl lg:text-[52px]">
                            Mes{' '}
                            <span className="text-teal-600">formations</span>
                        </h1>

                        {/* Description */}
                        <p className="mt-5 max-w-lg text-[17px] leading-[1.75] text-slate-600">
                            Des formations pratiques sur Laravel, Flutter,
                            Firebase, Python et Java — conçues pour passer de
                            zéro à opérationnel rapidement.
                        </p>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mt-8 flex flex-wrap items-center gap-6"
                        >
                            {[
                                {
                                    value: filtered.length,
                                    label: hasFilters
                                        ? 'filtrées'
                                        : 'formations',
                                },
                                { value: `${totalLessons}+`, label: 'leçons' },
                                {
                                    value: categories.length,
                                    label: 'technologies',
                                },
                                ...(totalStudents > 0
                                    ? [
                                          {
                                              value: `${totalStudents}+`,
                                              label: 'apprenants',
                                          },
                                      ]
                                    : []),
                            ].map((s, i) => (
                                <div
                                    key={i}
                                    className="flex items-baseline gap-1.5"
                                >
                                    <span className="font-display text-2xl font-bold text-[#1a1916]">
                                        {s.value}
                                    </span>
                                    <span className="text-[13px] font-medium text-slate-400">
                                        {s.label}
                                    </span>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ── Filters — scrolle avec la page ───────────────────────── */}
            <div className="border-y border-slate-100 bg-white">
                <div className="container-main py-5">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.5,
                            delay: 0.15,
                            ease: [0.23, 1, 0.32, 1],
                        }}
                        className="space-y-4"
                    >
                        {/* Catégories */}
                        {categories.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="mr-1 shrink-0 text-[11px] font-bold tracking-[0.18em] text-slate-400 uppercase">
                                    Catégorie
                                </span>
                                <Chip
                                    active={activeCategory === null}
                                    onClick={() => setActiveCategory(null)}
                                >
                                    Toutes
                                </Chip>
                                {categories.map((cat) => (
                                    <Chip
                                        key={cat}
                                        active={activeCategory === cat}
                                        onClick={() =>
                                            setActiveCategory(
                                                activeCategory === cat
                                                    ? null
                                                    : cat,
                                            )
                                        }
                                        count={countForCategory(cat)}
                                    >
                                        {cat}
                                    </Chip>
                                ))}
                            </div>
                        )}

                        {/* Niveaux */}
                        {availableLevels.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="mr-1 shrink-0 text-[11px] font-bold tracking-[0.18em] text-slate-400 uppercase">
                                    Niveau
                                </span>
                                <Chip
                                    active={activeLevel === null}
                                    onClick={() => setActiveLevel(null)}
                                >
                                    Tous
                                </Chip>
                                {availableLevels.map((lvl) => (
                                    <Chip
                                        key={lvl}
                                        active={activeLevel === lvl}
                                        onClick={() =>
                                            setActiveLevel(
                                                activeLevel === lvl
                                                    ? null
                                                    : lvl,
                                            )
                                        }
                                        count={countForLevel(lvl)}
                                    >
                                        {LEVEL_LABELS[lvl]}
                                    </Chip>
                                ))}
                            </div>
                        )}

                        {/* Clear */}
                        {hasFilters && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={() => {
                                    setActiveCategory(null);
                                    setActiveLevel(null);
                                }}
                                className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-slate-400 transition-colors hover:text-red-500"
                            >
                                <svg
                                    className="h-3.5 w-3.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                                Effacer les filtres
                            </motion.button>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* ── Grid ─────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-[#fafaf8] py-14 sm:py-18">
                {/* Blobs discrets en fond */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full"
                    style={{
                        background:
                            'radial-gradient(circle, rgba(26,163,137,0.05) 0%, transparent 70%)',
                    }}
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute top-1/4 right-0 h-[350px] w-[350px] rounded-full"
                    style={{
                        background:
                            'radial-gradient(circle, rgba(248,194,62,0.05) 0%, transparent 70%)',
                    }}
                />

                <div className="container-main relative z-10">
                    <AnimatePresence mode="wait">
                        {filtered.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="py-24 text-center"
                            >
                                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-300">
                                    <svg
                                        className="h-8 w-8"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                        />
                                    </svg>
                                </div>
                                <p className="text-[15px] font-semibold text-slate-500">
                                    Aucune formation pour ce filtre
                                </p>
                                <button
                                    onClick={() => {
                                        setActiveCategory(null);
                                        setActiveLevel(null);
                                    }}
                                    className="mt-3 text-[13px] font-semibold text-teal-600 hover:underline"
                                >
                                    Voir toutes les formations
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={`${activeCategory ?? 'all'}-${activeLevel ?? 'all'}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
                            >
                                {filtered.map((formation, i) => (
                                    <FormationCard
                                        key={formation.id}
                                        formation={formation}
                                        index={i}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* CTA bas de page */}
                    {filtered.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="mt-16 flex flex-col items-center gap-4 text-center"
                        >
                            <p className="text-[14px] font-medium text-slate-400">
                                Tu veux une formation sur un sujet spécifique ?
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 rounded-md bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
                            >
                                Suggérer un sujet
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                                    />
                                </svg>
                            </Link>
                        </motion.div>
                    )}
                </div>
            </section>
        </MainLayout>
    );
}
