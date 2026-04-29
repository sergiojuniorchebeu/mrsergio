// resources/js/Pages/Formations/Show.tsx
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import MainLayout from '@/layouts/MainLayout';
import { cn, easings } from '@/lib/utils';
import type { FormationShowProps } from '@/types';

const LEVEL_COLORS: Record<string, string> = {
    débutant: 'bg-green-50  text-green-700  border-green-100',
    intermédiaire: 'bg-amber-50  text-amber-700  border-amber-100',
    avancé: 'bg-red-50    text-red-700    border-red-100',
};

const CATEGORY_ICONS: Record<string, string> = {
    Laravel: '🔴',
    Flutter: '🔵',
    Python: '🐍',
    Java: '☕',
};

export default function Show({ formation, related }: FormationShowProps) {
    return (
        <MainLayout>
            <Head title={`${formation.title} — Formations`} />

            {/* ── Hero ─────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden border-b border-slate-200/60 bg-surface-card">
                <div className="pointer-events-none absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-teal-500/5 blur-3xl" />

                <div className="container-main relative z-10 py-12 sm:py-16">
                    {/* Retour */}
                    <motion.div
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, ease: easings.smooth }}
                    >
                        <Link
                            href="/formations"
                            className="group mb-8 inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-teal-600"
                        >
                            <svg
                                className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16l-4-4m0 0l4-4m-4 4h18"
                                />
                            </svg>
                            Retour aux formations
                        </Link>
                    </motion.div>

                    <div className="grid items-start gap-10 lg:grid-cols-5 lg:gap-16">
                        {/* ── Colonne texte (3/5) ───────────────────────── */}
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.6,
                                ease: easings.smooth,
                                delay: 0.1,
                            }}
                            className="space-y-5 lg:col-span-3"
                        >
                            {/* Catégorie + niveau */}
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="flex items-center gap-1.5 text-sm font-semibold text-ink-secondary">
                                    <span>
                                        {CATEGORY_ICONS[formation.category] ??
                                            '📚'}
                                    </span>
                                    {formation.category}
                                </span>
                                <span className="text-ink-subtle">·</span>
                                <span
                                    className={cn(
                                        'rounded-full border px-2.5 py-1 text-xs font-medium',
                                        LEVEL_COLORS[formation.level],
                                    )}
                                >
                                    {formation.level.charAt(0).toUpperCase() +
                                        formation.level.slice(1)}
                                </span>
                            </div>

                            {/* Titre */}
                            <h1 className="font-display text-3xl leading-tight font-bold tracking-tight text-ink-primary sm:text-4xl lg:text-5xl">
                                {formation.title}
                            </h1>

                            {/* Extrait */}
                            <p className="text-lg leading-relaxed text-ink-secondary">
                                {formation.excerpt}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                                {formation.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Métriques */}
                            <div className="grid grid-cols-3 gap-4 border-y border-slate-100 py-5">
                                {[
                                    {
                                        icon: '⏱',
                                        label: 'Durée',
                                        value: formation.duration_formatted,
                                    },
                                    {
                                        icon: '📚',
                                        label: 'Leçons',
                                        value: `${formation.lessons_count}`,
                                    },
                                    {
                                        icon: '🌍',
                                        label: 'Langue',
                                        value: formation.language ?? 'Français',
                                    },
                                ].map((m) => (
                                    <div key={m.label} className="text-center">
                                        <div className="mb-1 text-xl">
                                            {m.icon}
                                        </div>
                                        <div className="text-sm font-bold text-ink-primary">
                                            {m.value}
                                        </div>
                                        <div className="text-xs text-ink-muted">
                                            {m.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* ── Colonne CTA (2/5) — sticky ────────────────── */}
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.6,
                                ease: easings.smooth,
                                delay: 0.2,
                            }}
                            className="lg:col-span-2"
                        >
                            <div className="sticky top-24 overflow-hidden rounded-2xl border border-slate-200/70 bg-surface-raised shadow-xl shadow-slate-200/50">
                                {/* Image */}
                                <div className="aspect-video overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
                                    <img
                                        src={formation.cover_image_url}
                                        alt={formation.title}
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            (
                                                e.target as HTMLImageElement
                                            ).style.display = 'none';
                                        }}
                                    />
                                </div>

                                {/* Prix + CTA */}
                                <div className="space-y-5 p-6">
                                    <div className="flex items-baseline gap-2">
                                        <span
                                            className={cn(
                                                'font-display text-3xl font-bold',
                                                formation.is_free
                                                    ? 'text-teal-600'
                                                    : 'text-ink-primary',
                                            )}
                                        >
                                            {formation.price_formatted}
                                        </span>
                                        {formation.is_free && (
                                            <span className="text-sm text-ink-muted">
                                                accès complet
                                            </span>
                                        )}
                                    </div>

                                    {/* Bouton principal */}
                                    <a
                                        href="#"
                                        className="flex w-full items-center justify-center gap-2 rounded-md bg-teal-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm shadow-teal-500/20 transition-colors duration-200 hover:bg-teal-700"
                                    >
                                        {formation.is_free ? (
                                            <>
                                                <svg
                                                    className="h-4 w-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                Commencer gratuitement
                                            </>
                                        ) : (
                                            <>
                                                <svg
                                                    className="h-4 w-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                                    />
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
                                        ].map((item) => (
                                            <li
                                                key={item}
                                                className="flex items-center gap-2 text-xs text-ink-muted"
                                            >
                                                <svg
                                                    className="h-3.5 w-3.5 flex-shrink-0 text-teal-500"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2.5}
                                                        d="M5 13l4 4L19 7"
                                                    />
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
                        transition={{
                            duration: 0.6,
                            ease: easings.smooth,
                            delay: 0.3,
                        }}
                        className="max-w-3xl"
                    >
                        <h2 className="mb-8 border-b border-slate-100 pb-4 font-display text-2xl font-bold text-ink-primary">
                            Programme de la formation
                        </h2>
                        <div className="prose max-w-none prose-slate prose-headings:font-display prose-headings:text-ink-primary prose-a:text-teal-600 prose-strong:text-ink-primary prose-li:text-ink-secondary">
                            <ReactMarkdown>{formation.content}</ReactMarkdown>
                        </div>
                    </motion.div>
                </section>
            )}

            {/* ── Formations similaires ─────────────────────────────────── */}
            {related.length > 0 && (
                <section className="border-t border-slate-200/60 bg-surface-card">
                    <div className="container-main py-12 sm:py-16">
                        <div className="mb-8 flex items-center gap-4">
                            <div className="h-px flex-1 bg-slate-200" />
                            <p className="text-xs font-medium tracking-[0.2em] whitespace-nowrap text-ink-muted uppercase">
                                Formations similaires
                            </p>
                            <div className="h-px flex-1 bg-slate-200" />
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {related.map((f, i) => (
                                <motion.div
                                    key={f.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.45,
                                        ease: easings.smooth,
                                        delay: i * 0.08,
                                    }}
                                >
                                    <Link
                                        href={`/formations/${f.slug}`}
                                        className="group flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-surface-raised p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-1 text-xs font-semibold text-ink-secondary">
                                                <span>
                                                    {CATEGORY_ICONS[
                                                        f.category
                                                    ] ?? '📚'}
                                                </span>
                                                {f.category}
                                            </span>
                                            <span
                                                className={cn(
                                                    'rounded-full border px-2 py-0.5 text-xs font-medium',
                                                    LEVEL_COLORS[f.level],
                                                )}
                                            >
                                                {f.level}
                                            </span>
                                        </div>
                                        <p className="text-sm leading-snug font-semibold text-ink-primary transition-colors group-hover:text-teal-600">
                                            {f.title}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-ink-muted">
                                                {f.duration_formatted} ·{' '}
                                                {f.lessons_count} leçons
                                            </span>
                                            <span
                                                className={cn(
                                                    'text-xs font-bold',
                                                    f.is_free
                                                        ? 'text-teal-600'
                                                        : 'text-ink-primary',
                                                )}
                                            >
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
