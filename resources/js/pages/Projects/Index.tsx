import { Head }                  from '@inertiajs/react';
import { useState, useMemo }     from 'react';
import { motion }                from 'framer-motion';
import MainLayout                from '@/layouts/MainLayout';
import { ProjectCard }           from '@/components/ui/ProjectCard';
import { AnimatedGridPattern }   from '@/components/ui/animated-grid-pattern';
import { cn, easings }           from '@/lib/utils';
import type { ProjectsIndexProps } from '@/types';

// ─────────────────────────────────────────────────────────────────────────────
// VARIANTS
// ─────────────────────────────────────────────────────────────────────────────
const headerVariants = {
    hidden:  { opacity: 0, y: 24 },
    visible: {
        opacity: 1, y: 0,
        transition: { duration: 0.7, ease: easings.smooth },
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────────────────────
export default function Index({ projects }: ProjectsIndexProps) {

    const [activeTag, setActiveTag] = useState<string | null>(null);

    // Extraire tous les tags uniques de tous les projets
    // Flutter équivalent : Set<String> pour éviter les doublons
    const allTags = useMemo(() => {
        const tagSet = new Set<string>();
        projects.forEach(p => p.tags.forEach(t => tagSet.add(t)));
        return Array.from(tagSet).sort();
    }, [projects]);

    // Filtrer les projets selon le tag actif
    // Flutter équivalent : projects.where((p) => p.tags.contains(activeTag))
    const filtered = useMemo(() => {
        if (!activeTag) return projects;
        return projects.filter(p => p.tags.includes(activeTag));
    }, [projects, activeTag]);

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
                        'absolute inset-0 w-full h-full text-teal-600',
                        '[mask-image:radial-gradient(600px_circle_at_50%_100%,white,transparent)]',
                    )}
                />

                <div className="container-main relative z-10 py-16 sm:py-20">
                    <motion.div
                        variants={headerVariants}
                        initial="hidden"
                        animate="visible"
                        className="max-w-2xl"
                    >
                        {/* Breadcrumb */}
                        <p className="text-xs font-medium text-ink-muted uppercase tracking-[0.2em] mb-6">
                            Portfolio · Projets
                        </p>

                        <h1 className="text-4xl sm:text-5xl font-display font-bold text-ink-primary tracking-tight leading-tight mb-4">
                            Mes{' '}
                            <span className="gradient-text">projets</span>
                        </h1>

                        <p className="text-lg text-ink-secondary leading-relaxed">
                            Une sélection de projets que j'ai conçus et développés —
                            du backend Laravel aux apps Flutter, en passant par les interfaces React.
                        </p>

                        {/* Compteur */}
                        <div className="mt-6 flex items-center gap-2">
                            <span className="text-sm font-semibold text-teal-600">
                                {filtered.length}
                            </span>
                            <span className="text-sm text-ink-muted">
                                projet{filtered.length > 1 ? 's' : ''}
                                {activeTag ? ` · ${activeTag}` : ' au total'}
                            </span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Filtres par tag ───────────────────────────────────────── */}
            <section className="sticky top-16 z-30 bg-surface/90 backdrop-blur-md border-b border-slate-200/60">
                <div className="container-main py-3">
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">

                        {/* Filtre "Tous" */}
                        <button
                            onClick={() => setActiveTag(null)}
                            className={cn(
                                'flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border',
                                activeTag === null
                                    ? 'bg-teal-600 text-white border-teal-600 shadow-sm shadow-teal-500/20'
                                    : 'bg-surface-card text-ink-muted border-slate-200 hover:border-teal-300 hover:text-teal-600',
                            )}
                        >
                            Tous
                        </button>

                        {/* Filtres par tag */}
                        {allTags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                                className={cn(
                                    'flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border',
                                    activeTag === tag
                                        ? 'bg-teal-600 text-white border-teal-600 shadow-sm shadow-teal-500/20'
                                        : 'bg-surface-card text-ink-muted border-slate-200 hover:border-teal-300 hover:text-teal-600',
                                )}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Grille de projets ─────────────────────────────────────── */}
            <section className="container-main py-12 sm:py-16">

                {filtered.length === 0 ? (
                    /* État vide */
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-24"
                    >
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-ink-muted font-medium">Aucun projet avec ce tag</p>
                        <button
                            onClick={() => setActiveTag(null)}
                            className="mt-3 text-sm text-teal-600 hover:underline"
                        >
                            Voir tous les projets
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key={activeTag}           // re-anime quand le filtre change
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
            </section>

        </MainLayout>
    );
}