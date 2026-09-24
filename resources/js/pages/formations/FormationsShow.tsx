// resources/js/Pages/Formations/Show.tsx
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern';
import MainLayout from '@/layouts/MainLayout';
import { cn, easings } from '@/lib/utils';
import type { FormationShowProps } from '@/types';

const LEVEL_COLORS: Record<string, string> = {
    débutant: 'bg-green-50  text-green-700  border-green-100',
    intermédiaire: 'bg-amber-50  text-amber-700  border-amber-100',
    avancé: 'bg-red-50    text-red-700    border-red-100',
};

export default function Show({ formation, related }: FormationShowProps) {
    const [values, setValues] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    function submitEnrollment(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setProcessing(true);
        router.post(`/formations/${formation.slug}/enroll`, values, {
            onError: (formErrors) =>
                setErrors(formErrors as Record<string, string>),
            onFinish: () => setProcessing(false),
        });
    }

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
                                        label: 'Durée',
                                        value: formation.duration_formatted,
                                    },
                                    {
                                        label: 'Leçons',
                                        value: `${formation.lessons_count}`,
                                    },
                                    {
                                        label: 'Langue',
                                        value: formation.language ?? 'Français',
                                    },
                                ].map((m) => (
                                    <div key={m.label} className="text-center">
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
                                        href={
                                            formation.cta_url || '#inscription'
                                        }
                                        target={
                                            formation.cta_url
                                                ? '_blank'
                                                : undefined
                                        }
                                        rel={
                                            formation.cta_url
                                                ? 'noreferrer'
                                                : undefined
                                        }
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

            {(formation.target_audience ||
                formation.prerequisites ||
                (formation.outcomes?.length ?? 0) > 0) && (
                <section className="container-main grid gap-6 py-12 sm:grid-cols-3 sm:py-16">
                    {formation.target_audience && (
                        <div className="border-t border-slate-200 pt-4">
                            <p className="text-xs font-semibold tracking-[0.16em] text-teal-600 uppercase">
                                Pour qui
                            </p>
                            <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
                                {formation.target_audience}
                            </p>
                        </div>
                    )}
                    {formation.prerequisites && (
                        <div className="border-t border-slate-200 pt-4">
                            <p className="text-xs font-semibold tracking-[0.16em] text-teal-600 uppercase">
                                Prérequis
                            </p>
                            <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
                                {formation.prerequisites}
                            </p>
                        </div>
                    )}
                    {(formation.outcomes?.length ?? 0) > 0 && (
                        <div className="border-t border-slate-200 pt-4">
                            <p className="text-xs font-semibold tracking-[0.16em] text-teal-600 uppercase">
                                À la fin
                            </p>
                            <ul className="mt-3 space-y-2 text-sm text-ink-secondary">
                                {formation.outcomes?.map((outcome) => (
                                    <li key={outcome} className="flex gap-2">
                                        <span className="text-teal-600">+</span>
                                        {outcome}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </section>
            )}

            <section
                id="inscription"
                className="border-y border-slate-200/60 bg-surface-card"
            >
                <div className="container-main grid gap-10 py-12 sm:py-16 lg:grid-cols-[0.8fr_1.2fr]">
                    <div>
                        <p className="text-xs font-semibold tracking-[0.2em] text-teal-600 uppercase">
                            Inscription
                        </p>
                        <h2 className="mt-3 font-display text-3xl font-bold text-ink-primary">
                            Intéressé par cette formation ?
                        </h2>
                        <p className="mt-4 max-w-md leading-relaxed text-ink-secondary">
                            Laisse tes coordonnées. Je te recontacte pour
                            répondre à tes questions et te préciser les
                            prochaines étapes.
                        </p>
                    </div>
                    <form
                        onSubmit={submitEnrollment}
                        className="grid gap-4 rounded-2xl border border-slate-200/70 bg-surface-raised p-6 shadow-sm sm:grid-cols-2"
                    >
                        {[
                            ['name', 'Nom complet', 'Ton nom'],
                            ['email', 'Email', 'ton@email.com'],
                            ['phone', 'Téléphone', 'Optionnel'],
                        ].map(([key, label, placeholder]) => (
                            <label
                                key={key}
                                className={
                                    key === 'phone' ? 'sm:col-span-2' : ''
                                }
                            >
                                <span className="mb-1.5 block text-xs font-semibold text-ink-secondary">
                                    {label}
                                </span>
                                <input
                                    type={key === 'email' ? 'email' : 'text'}
                                    value={values[key as keyof typeof values]}
                                    onChange={(event) =>
                                        setValues({
                                            ...values,
                                            [key]: event.target.value,
                                        })
                                    }
                                    placeholder={placeholder}
                                    className="w-full rounded-md border border-slate-200 bg-white px-3.5 py-3 text-sm text-ink-primary transition outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10"
                                />
                                {errors[key] && (
                                    <span className="mt-1 block text-xs text-red-500">
                                        {errors[key]}
                                    </span>
                                )}
                            </label>
                        ))}
                        <label className="sm:col-span-2">
                            <span className="mb-1.5 block text-xs font-semibold text-ink-secondary">
                                Message
                            </span>
                            <textarea
                                value={values.message}
                                onChange={(event) =>
                                    setValues({
                                        ...values,
                                        message: event.target.value,
                                    })
                                }
                                rows={4}
                                placeholder="Une question ou un besoin particulier ?"
                                className="w-full resize-none rounded-md border border-slate-200 bg-white px-3.5 py-3 text-sm text-ink-primary transition outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10"
                            />
                        </label>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
                        >
                            {processing
                                ? 'Envoi en cours...'
                                : formation.cta_label ||
                                  'Demander cette formation'}
                        </button>
                    </form>
                </div>
            </section>

            {/* ── Autres formations ─────────────────────────────────────── */}
            {related.length > 0 && (
                <section className="relative overflow-hidden border-t border-[#e2e0da] bg-white py-14 sm:py-20">
                    <AnimatedGridPattern
                        numSquares={24}
                        maxOpacity={0.03}
                        duration={4.5}
                        repeatDelay={0.8}
                        className={cn(
                            'absolute inset-0 h-full w-full text-teal-600/60',
                            '[mask-image:radial-gradient(900px_circle_at_50%_0%,white,transparent)]',
                        )}
                    />
                    <div className="container-main relative z-10">
                        <div className="mb-10 flex items-center gap-4">
                            <div className="h-px w-12 bg-[#1aa389]" />
                            <span className="text-[10px] font-bold tracking-[0.25em] text-[#aaa69e] uppercase">
                                À découvrir ensuite
                            </span>
                            <div className="h-px flex-1 bg-[#e2e0da]" />
                        </div>

                        <div className="grid grid-cols-1 gap-px bg-[#e2e0da] sm:grid-cols-2 lg:grid-cols-3">
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
                                        href={'/formations/' + f.slug}
                                        className="group flex h-full flex-col overflow-hidden bg-[#fafaf8] transition-colors duration-300 hover:bg-white"
                                    >
                                        <div className="relative aspect-[16/9] overflow-hidden bg-[#f0efec]">
                                            <img
                                                src={f.cover_image_url}
                                                alt={f.title}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                                                onError={(event) => {
                                                    (
                                                        event.target as HTMLImageElement
                                                    ).style.display = 'none';
                                                }}
                                            />
                                        </div>
                                        <div className="flex flex-1 flex-col gap-2.5 p-5">
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="inline-block w-fit border border-[#d8eee8] bg-[#f0faf7] px-2 py-0.5 text-[10px] font-bold tracking-[0.12em] text-[#138770] uppercase">
                                                    {f.category}
                                                </span>
                                                <span className="text-[11px] font-medium text-[#aaa69e]">
                                                    {f.level}
                                                </span>
                                            </div>
                                            <p className="text-[15px] leading-snug font-bold tracking-[-0.01em] text-[#1a1916] transition-colors group-hover:text-[#138770]">
                                                {f.title}
                                            </p>
                                            {f.excerpt && (
                                                <p className="line-clamp-2 text-[12px] leading-relaxed text-[#8a8479]">
                                                    {f.excerpt}
                                                </p>
                                            )}
                                            <div className="mt-auto flex items-center justify-between border-t border-[#e2e0da] pt-3">
                                                <span className="text-[11px] text-[#aaa69e]">
                                                    {f.duration_formatted} ·{' '}
                                                    {f.lessons_count} leçons
                                                </span>
                                                <span className="text-[11px] font-bold text-[#138770]">
                                                    {f.price_formatted}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                        <div className="mt-12 text-center">
                            <Link
                                href="/formations"
                                className="group inline-flex items-center gap-3 border border-[#1a1916] bg-transparent px-8 py-3.5 text-[12px] font-bold tracking-[0.12em] text-[#1a1916] uppercase transition-all duration-300 hover:bg-[#1a1916] hover:text-white"
                            >
                                Voir toutes les formations
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                >
                                    <path
                                        d="M3 8h10M9 4l4 4-4 4"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </section>
            )}
        </MainLayout>
    );
}
