// resources/js/Pages/Formations/Index.tsx
import { Head, Link }              from '@inertiajs/react';
import { useState, useMemo }       from 'react';
import { motion }                  from 'framer-motion';
import MainLayout                  from '@/layouts/MainLayout';
import { AnimatedGridPattern }     from '@/components/ui/animated-grid-pattern';
import { cn, easings }             from '@/lib/utils';
import type { FormationsIndexProps, Formation } from '@/types';

// ─────────────────────────────────────────────────────────────────────────────
// COULEURS catégories
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; icon: string }> = {
    'Laravel': { bg: 'bg-red-50',    text: 'text-red-600',    border: 'border-red-100',    icon: '🔴' },
    'Flutter': { bg: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-100',   icon: '🔵' },
    'Python':  { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-100', icon: '🐍' },
    'Java':    { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', icon: '☕' },
};
const defaultCat = { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-100', icon: '📚' };

const LEVEL_COLORS: Record<string, string> = {
    'débutant':      'bg-green-50  text-green-700  border-green-100',
    'intermédiaire': 'bg-amber-50  text-amber-700  border-amber-100',
    'avancé':        'bg-red-50    text-red-700    border-red-100',
};

// ─────────────────────────────────────────────────────────────────────────────
// FORMATION CARD
// ─────────────────────────────────────────────────────────────────────────────
function FormationCard({ formation, index }: { formation: Formation; index: number }) {
    const cat = CATEGORY_COLORS[formation.category] ?? defaultCat;

    return (
        <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease: easings.smooth, delay: index * 0.08 }}
        >
            <Link href={`/formations/${formation.slug}`} className="group block h-full">
                <div className={cn(
                    'h-full flex flex-col rounded-2xl overflow-hidden',
                    'bg-surface-card border border-slate-200/70',
                    'shadow-sm hover:shadow-xl hover:shadow-teal-900/8',
                    'transition-all duration-300 hover:-translate-y-1',
                )}>

                    {/* ── Image / Cover ─────────────────────────────────── */}
                    <div className="relative aspect-[16/9] bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden flex-shrink-0">
                        <img
                            src={formation.cover_image_url}
                            alt={formation.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                        {/* Catégorie badge */}
                        <div className={cn(
                            'absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border',
                            'bg-white/90 backdrop-blur-sm text-ink-primary border-white/60',
                        )}>
                            <span>{cat.icon}</span>
                            {formation.category}
                        </div>

                        {/* Prix badge */}
                        <div className={cn(
                            'absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold',
                            formation.is_free
                                ? 'bg-teal-600 text-white'
                                : 'bg-white/90 backdrop-blur-sm text-ink-primary border border-white/60',
                        )}>
                            {formation.price_formatted}
                        </div>

                        {/* Métriques overlay bas */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3">
                            <span className="flex items-center gap-1 text-xs text-white/90 font-medium">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {formation.duration_formatted}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-white/90 font-medium">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                {formation.lessons_count} leçons
                            </span>
                        </div>
                    </div>

                    {/* ── Contenu ───────────────────────────────────────── */}
                    <div className="flex flex-col flex-1 p-5 space-y-3">

                        {/* Niveau */}
                        <span className={cn(
                            'self-start text-xs font-medium px-2.5 py-0.5 rounded-full border',
                            LEVEL_COLORS[formation.level],
                        )}>
                            {formation.level.charAt(0).toUpperCase() + formation.level.slice(1)}
                        </span>

                        {/* Titre */}
                        <h2 className="font-display font-bold text-lg text-ink-primary leading-snug group-hover:text-teal-600 transition-colors duration-200">
                            {formation.title}
                        </h2>

                        {/* Extrait */}
                        <p className="text-sm text-ink-muted leading-relaxed flex-1 line-clamp-3">
                            {formation.excerpt}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <span className="text-sm font-semibold text-teal-600 flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                                Voir la formation
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                            {formation.featured && (
                                <span className="text-xs font-medium text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                                    ⭐ Populaire
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.article>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function Index({ formations, categories }: FormationsIndexProps) {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const filtered = useMemo(() => {
        if (!activeCategory) return formations;
        return formations.filter(f => f.category === activeCategory);
    }, [formations, activeCategory]);

    const featured = formations.find(f => f.featured);

    return (
        <MainLayout>
            <Head title="Formations — Sergio Junior Chebeu" />

            {/* ── Header ───────────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-surface-card border-b border-slate-200/60">
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
                <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="container-main py-14 sm:py-20 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: easings.smooth }}
                        className="max-w-2xl"
                    >
                        <p className="text-xs font-medium text-ink-muted uppercase tracking-[0.2em] mb-5">
                            Apprendre · Pratiquer · Maîtriser
                        </p>
                        <h1 className="text-4xl sm:text-5xl font-display font-bold text-ink-primary tracking-tight leading-tight mb-4">
                            Mes <span className="gradient-text">formations</span>
                        </h1>
                        <p className="text-lg text-ink-secondary leading-relaxed mb-6">
                            Des formations pratiques sur Laravel, Flutter, Firebase, Python et Java —
                            conçues pour passer de zéro à opérationnel rapidement.
                        </p>

                        {/* Stats rapides */}
                        <div className="flex flex-wrap items-center gap-6">
                            {[
                                { label: 'formations', value: formations.length },
                                { label: 'heures de contenu', value: formations.reduce((a, f) => a + (f.lessons_count || 0), 0) + '+' },
                                { label: 'technologies', value: categories.length },
                            ].map(stat => (
                                <div key={stat.label} className="flex items-baseline gap-1.5">
                                    <span className="text-xl font-bold font-display text-teal-600">{stat.value}</span>
                                    <span className="text-sm text-ink-muted">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Filtres catégories ────────────────────────────────────── */}
            <section className="sticky top-16 z-30 bg-surface/90 backdrop-blur-md border-b border-slate-200/60">
                <div className="container-main py-3">
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
                        <button
                            onClick={() => setActiveCategory(null)}
                            className={cn(
                                'flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border',
                                activeCategory === null
                                    ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                                    : 'bg-surface-card text-ink-muted border-slate-200 hover:border-teal-300 hover:text-teal-600',
                            )}
                        >
                            Toutes
                        </button>

                        {categories.map(cat => {
                            const c = CATEGORY_COLORS[cat] ?? defaultCat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
                                    className={cn(
                                        'flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border',
                                        activeCategory === cat
                                            ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                                            : 'bg-surface-card text-ink-muted border-slate-200 hover:border-teal-300 hover:text-teal-600',
                                    )}
                                >
                                    <span>{c.icon}</span>
                                    {cat}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Grille formations ─────────────────────────────────────── */}
            <section className="container-main py-12 sm:py-16">
                {filtered.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-ink-muted font-medium">Aucune formation dans cette catégorie</p>
                        <button
                            onClick={() => setActiveCategory(null)}
                            className="mt-3 text-sm text-teal-600 hover:underline"
                        >
                            Voir toutes les formations
                        </button>
                    </div>
                ) : (
                    <motion.div
                        key={activeCategory}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6"
                    >
                        {filtered.map((formation, i) => (
                            <FormationCard key={formation.id} formation={formation} index={i} />
                        ))}
                    </motion.div>
                )}
            </section>

        </MainLayout>
    );
}
