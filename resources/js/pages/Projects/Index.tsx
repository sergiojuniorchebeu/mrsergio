// resources/js/pages/Projects/Index.tsx

import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';
import { HexagonPattern } from '@/components/ui/hexagon-pattern';
import { ProjectCard } from '@/components/ui/ProjectCard';
import MainLayout from '@/layouts/MainLayout';
import { cn } from '@/lib/utils';
import type { ProjectsIndexProps, ProjectType } from '@/types';

// ─── Labels ───────────────────────────────────────────────────────────────────
const TYPE_LABELS: Record<ProjectType, string> = {
    web: 'Web',
    mobile: 'Mobile',
    desktop: 'Desktop',
    api: 'API',
};

// ─── Filter Chip ──────────────────────────────────────────────────────────────
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
export default function Index({ projects }: ProjectsIndexProps) {
    const [activeTag, setActiveTag] = useState<string | null>(null);
    const [activeType, setActiveType] = useState<ProjectType | null>(null);

    // Derive all types + tags
    const allTypes = useMemo(() => {
        const s = new Set<ProjectType>();
        projects.forEach((p) => {
            if (p.project_type) s.add(p.project_type);
        });
        return Array.from(s);
    }, [projects]);

    const allTags = useMemo(() => {
        const s = new Set<string>();
        projects.forEach((p) => (p.tags ?? []).forEach((t) => s.add(t)));
        return Array.from(s).sort((a, b) => a.localeCompare(b));
    }, [projects]);

    // Count per type/tag (using only the other active filter as context)
    const countForType = (type: ProjectType) =>
        projects.filter((p) => {
            const matchTag = !activeTag || p.tags.includes(activeTag);
            return matchTag && p.project_type === type;
        }).length;

    const countForTag = (tag: string) =>
        projects.filter((p) => {
            const matchType = !activeType || p.project_type === activeType;
            return matchType && p.tags.includes(tag);
        }).length;

    // Filtered results
    const filtered = useMemo(
        () =>
            projects.filter((p) => {
                const matchTag = !activeTag || p.tags.includes(activeTag);
                const matchType = !activeType || p.project_type === activeType;
                return matchTag && matchType;
            }),
        [projects, activeTag, activeType],
    );

    const hasFilters = !!(activeTag || activeType);

    return (
        <MainLayout>
            <Head title="Projets — Sergio Junior Chebeu" />

            {/* ── Hero ─────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-white pt-[88px] pb-14 sm:pb-18">
                {/* HexagonPattern — même style que la section projets de la home */}
                <HexagonPattern
                    radius={28}
                    gap={4}
                    className={cn(
                        'absolute inset-0 h-full w-full fill-transparent stroke-teal-600/[0.06]',
                        '[mask-image:radial-gradient(ellipse_85%_90%_at_50%_50%,white_30%,transparent_100%)]',
                    )}
                />

                {/* Watermark ultra-subtil */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none"
                >
                    <span
                        className="font-display leading-none font-extrabold tracking-[-0.04em] whitespace-nowrap text-slate-900/[0.028] uppercase"
                        style={{ fontSize: 'clamp(56px, 11vw, 150px)' }}
                    >
                        Projets
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
                        <span className="text-slate-600">Projets</span>
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
                        {/* Label */}
                        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-200/70 bg-teal-50 px-4 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-teal-700 uppercase">
                            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                            Portfolio
                        </span>

                        {/* Title */}
                        <h1 className="mt-5 font-display text-4xl leading-[1.1] font-bold tracking-[-0.02em] text-[#1a1916] sm:text-5xl lg:text-[52px]">
                            Mes <span className="text-teal-600">projets</span>
                        </h1>

                        {/* Description */}
                        <p className="mt-5 max-w-lg text-[17px] leading-[1.75] text-slate-600">
                            Projets web, mobiles, desktop et API — conçus avec
                            une attention particulière à l'architecture et à
                            l'expérience utilisateur.
                        </p>

                        {/* Count */}
                        <motion.div
                            className="mt-7 flex items-center gap-3"
                            animate={{ opacity: 1 }}
                        >
                            <span className="font-display text-3xl font-bold tracking-tight text-[#1a1916]">
                                {filtered.length}
                            </span>
                            <span className="text-[14px] font-medium text-slate-400">
                                projet{filtered.length !== 1 ? 's' : ''}
                                {hasFilters && (
                                    <span className="ml-1 text-teal-600">
                                        filtrés
                                    </span>
                                )}
                                {!hasFilters && (
                                    <span className="ml-1">au total</span>
                                )}
                            </span>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ── Filters — scrolle avec la page ────────────────────────── */}
            <div className="border-y border-slate-100 bg-[#fafaf8]">
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
                        {/* Row types */}
                        {allTypes.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="mr-1 shrink-0 text-[11px] font-bold tracking-[0.18em] text-slate-400 uppercase">
                                    Type
                                </span>
                                <Chip
                                    active={activeType === null}
                                    onClick={() => setActiveType(null)}
                                >
                                    Tous
                                </Chip>
                                {allTypes.map((type) => (
                                    <Chip
                                        key={type}
                                        active={activeType === type}
                                        onClick={() =>
                                            setActiveType(
                                                activeType === type
                                                    ? null
                                                    : type,
                                            )
                                        }
                                        count={countForType(type)}
                                    >
                                        {TYPE_LABELS[type]}
                                    </Chip>
                                ))}
                            </div>
                        )}

                        {/* Row tags */}
                        {allTags.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="mr-1 shrink-0 text-[11px] font-bold tracking-[0.18em] text-slate-400 uppercase">
                                    Stack
                                </span>
                                <Chip
                                    active={activeTag === null}
                                    onClick={() => setActiveTag(null)}
                                >
                                    Tous
                                </Chip>
                                {allTags.map((tag) => (
                                    <Chip
                                        key={tag}
                                        active={activeTag === tag}
                                        onClick={() =>
                                            setActiveTag(
                                                activeTag === tag ? null : tag,
                                            )
                                        }
                                        count={countForTag(tag)}
                                    >
                                        {tag}
                                    </Chip>
                                ))}
                            </div>
                        )}

                        {/* Clear filters */}
                        {hasFilters && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                onClick={() => {
                                    setActiveTag(null);
                                    setActiveType(null);
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
            <section className="bg-white py-14 sm:py-18">
                <div className="container-main">
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
                                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-[15px] font-semibold text-slate-500">
                                    Aucun projet pour ce filtre
                                </p>
                                <button
                                    onClick={() => {
                                        setActiveTag(null);
                                        setActiveType(null);
                                    }}
                                    className="mt-3 text-[13px] font-semibold text-teal-600 hover:underline"
                                >
                                    Réinitialiser
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={`${activeType ?? 'all'}-${activeTag ?? 'all'}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
                            >
                                {filtered.map((project, i) => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                        index={i}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Bottom CTA */}
                    {filtered.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="mt-16 flex flex-col items-center gap-4 text-center"
                        >
                            <p className="text-[14px] font-medium text-slate-400">
                                Un projet similaire en tête ?
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 rounded-md bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
                            >
                                Discutons-en
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
