// resources/js/Pages/Projects/Index.tsx

import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern';
import { ProjectCard } from '@/components/ui/ProjectCard';
import MainLayout from '@/layouts/MainLayout';
import { cn, easings } from '@/lib/utils';
import type { ProjectsIndexProps, ProjectType } from '@/types';

const headerVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: easings.smooth },
    },
};

const TYPE_LABELS: Record<ProjectType, string> = {
    web: 'Web',
    mobile: 'Mobile',
    desktop: 'Desktop',
    api: 'API',
};

const TYPE_BUTTON_STYLES: Record<ProjectType, string> = {
    web: 'hover:border-emerald-300 hover:text-emerald-700',
    mobile: 'hover:border-blue-300 hover:text-blue-700',
    desktop: 'hover:border-indigo-300 hover:text-indigo-700',
    api: 'hover:border-amber-300 hover:text-amber-700',
};

const TYPE_ACTIVE_STYLES: Record<ProjectType, string> = {
    web: 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-500/20',
    mobile: 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20',
    desktop: 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/20',
    api: 'bg-amber-600 text-white border-amber-600 shadow-sm shadow-amber-500/20',
};

export default function Index({ projects }: ProjectsIndexProps) {
    const [activeTag, setActiveTag] = useState<string | null>(null);
    const [activeType, setActiveType] = useState<ProjectType | null>(null);

    const allTags = useMemo(() => {
        const tagSet = new Set<string>();
        projects.forEach((project) => {
            (project.tags ?? []).forEach((tag) => tagSet.add(tag));
        });
        return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
    }, [projects]);

    const allTypes = useMemo(() => {
        const typeSet = new Set<ProjectType>();
        projects.forEach((project) => {
            if (project.project_type) {
                typeSet.add(project.project_type);
            }
        });
        return Array.from(typeSet);
    }, [projects]);

    const filtered = useMemo(() => {
        return projects.filter((project) => {
            const matchesTag = !activeTag || project.tags.includes(activeTag);
            const matchesType = !activeType || project.project_type === activeType;
            return matchesTag && matchesType;
        });
    }, [projects, activeTag, activeType]);

    const activeFiltersCount = Number(!!activeTag) + Number(!!activeType);

    return (
        <MainLayout>
            <Head title="Projets — Sergio Junior Chebeu" />

            {/* ── Header hero ──────────────────────────────────────────── */}
            <section className="relative overflow-hidden border-b border-slate-200/60 bg-surface-card">
                <AnimatedGridPattern
                    numSquares={20}
                    maxOpacity={0.03}
                    duration={5}
                    repeatDelay={1}
                    className={cn(
                        'absolute inset-0 h-full w-full text-teal-600',
                        '[mask-image:radial-gradient(600px_circle_at_50%_100%,white,transparent)]'
                    )}
                />

                <div className="container-main relative z-10 py-16 sm:py-20">
                    <motion.div
                        variants={headerVariants}
                        initial="hidden"
                        animate="visible"
                        className="max-w-3xl"
                    >
                        <p className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-ink-muted">
                            Portfolio · Projets
                        </p>

                        <h1 className="mb-4 font-display text-4xl font-bold leading-tight tracking-tight text-ink-primary sm:text-5xl">
                            Mes <span className="gradient-text">projets</span>
                        </h1>

                        <p className="text-lg leading-relaxed text-ink-secondary">
                            Une sélection de projets web, mobiles, desktop et API que j’ai conçus et développés —
                            avec une attention particulière à l’expérience utilisateur, à l’architecture
                            et à la qualité technique.
                        </p>

                        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
                            <span className="font-semibold text-teal-600">
                                {filtered.length}
                            </span>
                            <span className="text-ink-muted">
                                projet{filtered.length > 1 ? 's' : ''}
                            </span>

                            {activeFiltersCount > 0 && (
                                <>
                                    <span className="text-slate-300">•</span>
                                    <span className="text-ink-muted">
                                        filtre{activeFiltersCount > 1 ? 's' : ''} actif{activeFiltersCount > 1 ? 's' : ''}
                                    </span>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Filters ──────────────────────────────────────────────── */}
            <section className="sticky top-16 z-30 border-b border-slate-200/60 bg-surface/90 backdrop-blur-md">
                <div className="container-main py-4 space-y-4">
                    {/* Types */}
                    <div>
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                            Types
                        </p>

                        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
                            <button
                                onClick={() => setActiveType(null)}
                                className={cn(
                                    'flex-shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200',
                                    activeType === null
                                        ? 'border-teal-600 bg-teal-600 text-white shadow-sm shadow-teal-500/20'
                                        : 'border-slate-200 bg-surface-card text-ink-muted hover:border-teal-300 hover:text-teal-600'
                                )}
                            >
                                Tous
                            </button>

                            {allTypes.map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setActiveType(type === activeType ? null : type)}
                                    className={cn(
                                        'flex-shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200',
                                        activeType === type
                                            ? TYPE_ACTIVE_STYLES[type]
                                            : cn('bg-surface-card text-ink-muted border-slate-200', TYPE_BUTTON_STYLES[type])
                                    )}
                                >
                                    {TYPE_LABELS[type]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                            Technologies / Tags
                        </p>

                        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
                            <button
                                onClick={() => setActiveTag(null)}
                                className={cn(
                                    'flex-shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200',
                                    activeTag === null
                                        ? 'border-slate-800 bg-slate-800 text-white shadow-sm'
                                        : 'border-slate-200 bg-surface-card text-ink-muted hover:border-teal-300 hover:text-teal-600'
                                )}
                            >
                                Tous les tags
                            </button>

                            {allTags.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                                    className={cn(
                                        'flex-shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200',
                                        activeTag === tag
                                            ? 'border-teal-600 bg-teal-600 text-white shadow-sm shadow-teal-500/20'
                                            : 'border-slate-200 bg-surface-card text-ink-muted hover:border-teal-300 hover:text-teal-600'
                                    )}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Grid ─────────────────────────────────────────────────── */}
            <section className="container-main py-12 sm:py-16">
                {filtered.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-24 text-center"
                    >
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                            <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>

                        <p className="font-medium text-ink-muted">Aucun projet ne correspond à ce filtre</p>

                        <button
                            onClick={() => {
                                setActiveTag(null);
                                setActiveType(null);
                            }}
                            className="mt-3 text-sm text-teal-600 hover:underline"
                        >
                            Réinitialiser les filtres
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key={`${activeType ?? 'all'}-${activeTag ?? 'all'}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
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

                {filtered.length > 0 && (
                    <div className="mt-10 flex justify-center">
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition-colors hover:border-teal-300 hover:text-teal-600"
                        >
                            Discuter d’un projet similaire
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                )}
            </section>
        </MainLayout>
    );
}