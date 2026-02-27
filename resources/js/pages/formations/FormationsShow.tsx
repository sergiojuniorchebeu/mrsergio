// resources/js/Pages/Formations/Show.tsx
import { Head, Link }              from '@inertiajs/react';
import { motion }                  from 'framer-motion';
import ReactMarkdown               from 'react-markdown';
import MainLayout                  from '@/layouts/MainLayout';
import { cn, easings }             from '@/lib/utils';
import type { FormationShowProps } from '@/types';

const LEVEL_COLORS: Record<string, string> = {
    'débutant':      'bg-green-50  text-green-700  border-green-100',
    'intermédiaire': 'bg-amber-50  text-amber-700  border-amber-100',
    'avancé':        'bg-red-50    text-red-700    border-red-100',
};

const CATEGORY_ICONS: Record<string, string> = {
    'Laravel': '🔴', 'Flutter': '🔵', 'Python': '🐍', 'Java': '☕',
};

export default function Show({ formation, related }: FormationShowProps) {
    return (
        <MainLayout>
            <Head title={`${formation.title} — Formations`} />

            {/* ── Hero ─────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-surface-card border-b border-slate-200/60">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="container-main py-12 sm:py-16 relative z-10">

                    {/* Retour */}
                    <motion.div
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, ease: easings.smooth }}
                    >
                        <Link
                            href="/formations"
                            className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-teal-600 transition-colors mb-8 group"
                        >
                            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                            </svg>
                            Retour aux formations
                        </Link>
                    </motion.div>

                    <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-start">

                        {/* ── Colonne texte (3/5) ───────────────────────── */}
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: easings.smooth, delay: 0.1 }}
                            className="lg:col-span-3 space-y-5"
                        >
                            {/* Catégorie + niveau */}
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="flex items-center gap-1.5 text-sm font-semibold text-ink-secondary">
                                    <span>{CATEGORY_ICONS[formation.category] ?? '📚'}</span>
                                    {formation.category}
                                </span>
                                <span className="text-ink-subtle">·</span>
                                <span className={cn(
                                    'text-xs font-medium px-2.5 py-1 rounded-full border',
                                    LEVEL_COLORS[formation.level],
                                )}>
                                    {formation.level.charAt(0).toUpperCase() + formation.level.slice(1)}
                                </span>
                            </div>

                            {/* Titre */}
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-ink-primary tracking-tight leading-tight">
                                {formation.title}
                            </h1>

                            {/* Extrait */}
                            <p className="text-lg text-ink-secondary leading-relaxed">
                                {formation.excerpt}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                                {formation.tags.map(tag => (
                                    <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-lg border bg-slate-50 text-slate-600 border-slate-200">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Métriques */}
                            <div className="grid grid-cols-3 gap-4 py-5 border-y border-slate-100">
                                {[
                                    { icon: '⏱', label: 'Durée', value: formation.duration_formatted },
                                    { icon: '📚', label: 'Leçons', value: `${formation.lessons_count}` },
                                    { icon: '🌍', label: 'Langue', value: formation.language ?? 'Français' },
                                ].map(m => (
                                    <div key={m.label} className="text-center">
                                        <div className="text-xl mb-1">{m.icon}</div>
                                        <div className="text-sm font-bold text-ink-primary">{m.value}</div>
                                        <div className="text-xs text-ink-muted">{m.label}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* ── Colonne CTA (2/5) — sticky ────────────────── */}
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: easings.smooth, delay: 0.2 }}
                            className="lg:col-span-2"
                        >
                            <div className="rounded-2xl border border-slate-200/70 bg-surface-raised shadow-xl shadow-slate-200/50 overflow-hidden sticky top-24">

                                {/* Image */}
                                <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
                                    <img
                                        src={formation.cover_image_url}
                                        alt={formation.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                    />
                                </div>

                                {/* Prix + CTA */}
                                <div className="p-6 space-y-5">
                                    <div className="flex items-baseline gap-2">
                                        <span className={cn(
                                            'text-3xl font-display font-bold',
                                            formation.is_free ? 'text-teal-600' : 'text-ink-primary',
                                        )}>
                                            {formation.price_formatted}
                                        </span>
                                        {formation.is_free && (
                                            <span className="text-sm text-ink-muted">accès complet</span>
                                        )}
                                    </div>

                                    {/* Bouton principal */}
                                    <a
                                        href="#"
                                        className="flex items-center justify-center gap-2 w-full bg-teal-600 text-white px-6 py-3.5 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors duration-200 shadow-sm shadow-teal-500/20"
                                    >
                                        {formation.is_free ? (
                                            <>
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Commencer gratuitement
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                Accéder à la formation
                                            </>
                                        )}
                                    </a>

                                    {/* Garanties */}
                                    <ul className="space-y-2">
                                        {[
                                            'Accès à vie au contenu',
                                            'Exercices pratiques inclus',
                                            `${formation.lessons_count} leçons vidéo`,
                                            `${formation.duration_formatted} de contenu`,
                                        ].map(item => (
                                            <li key={item} className="flex items-center gap-2 text-xs text-ink-muted">
                                                <svg className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                </svg>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Contenu / Programme ───────────────────────────────────── */}
            {formation.content && (
                <section className="container-main py-12 sm:py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: easings.smooth, delay: 0.3 }}
                        className="max-w-3xl"
                    >
                        <h2 className="text-2xl font-display font-bold text-ink-primary mb-8 pb-4 border-b border-slate-100">
                            Programme de la formation
                        </h2>
                        <div className="prose prose-slate prose-headings:font-display prose-headings:text-ink-primary prose-a:text-teal-600 prose-strong:text-ink-primary prose-li:text-ink-secondary max-w-none">
                            <ReactMarkdown>{formation.content}</ReactMarkdown>
                        </div>
                    </motion.div>
                </section>
            )}

            {/* ── Formations similaires ─────────────────────────────────── */}
            {related.length > 0 && (
                <section className="border-t border-slate-200/60 bg-surface-card">
                    <div className="container-main py-12 sm:py-16">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-px flex-1 bg-slate-200" />
                            <p className="text-xs font-medium text-ink-muted uppercase tracking-[0.2em] whitespace-nowrap">
                                Formations similaires
                            </p>
                            <div className="h-px flex-1 bg-slate-200" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {related.map((f, i) => (
                                <motion.div
                                    key={f.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.45, ease: easings.smooth, delay: i * 0.08 }}
                                >
                                    <Link
                                        href={`/formations/${f.slug}`}
                                        className="group flex flex-col gap-3 p-5 rounded-2xl bg-surface-raised border border-slate-200/70 hover:border-teal-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold text-ink-secondary flex items-center gap-1">
                                                <span>{CATEGORY_ICONS[f.category] ?? '📚'}</span>
                                                {f.category}
                                            </span>
                                            <span className={cn(
                                                'text-xs font-medium px-2 py-0.5 rounded-full border',
                                                LEVEL_COLORS[f.level],
                                            )}>
                                                {f.level}
                                            </span>
                                        </div>
                                        <p className="text-sm font-semibold text-ink-primary leading-snug group-hover:text-teal-600 transition-colors">
                                            {f.title}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-ink-muted">{f.duration_formatted} · {f.lessons_count} leçons</span>
                                            <span className={cn(
                                                'text-xs font-bold',
                                                f.is_free ? 'text-teal-600' : 'text-ink-primary',
                                            )}>
                                                {f.price_formatted}
                                            </span>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

        </MainLayout>
    );
}
