// resources/js/pages/formations/FormationsShow.tsx
// Détail d'une formation : hero + fiche d'accès collante, programme,
// objectifs, public visé, inscription, autres formations.

import { Head, Link, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FormationDeck } from '@/components/portofolio/formation-deck';
import { markdownComponents } from '@/components/portofolio/markdown';
import {
    EnrollmentTicket,
    SessionPicker,
} from '@/components/portofolio/session-list';
import type { EnrollmentFlash } from '@/components/portofolio/session-list';
import { buttonVariants } from '@/components/ui/button';
import { HeroBackdrop } from '@/components/ui/hero-backdrop';
import {
    DrawLine,
    MaskedLine,
    Reveal,
    SplitWords,
} from '@/components/ui/reveal';
import { SectionBackdrop } from '@/components/ui/section-backdrop';
import MainLayout from '@/layouts/MainLayout';
import { durationLabel, levelLabel, useTranslation } from '@/lib/i18n';
import type { Language } from '@/lib/i18n';
import { cn, easings } from '@/lib/utils';
import type { Formation, FormationShowProps } from '@/types';

type EnrollmentField =
    | 'name'
    | 'email'
    | 'phone'
    | 'message'
    | 'formation_session_id';

const EMPTY_ENROLLMENT: Record<EnrollmentField, string> = {
    name: '',
    email: '',
    phone: '',
    message: '',
    formation_session_id: '',
};

const FIELD_CLASS =
    'w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[16px] text-slate-900 placeholder:text-slate-400 outline-none transition-[border-color,box-shadow] focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10';

const LANGUAGE_NAMES: Record<string, string> = {
    français: 'French',
    francais: 'French',
    anglais: 'English',
};

function formationFacts(
    formation: Formation,
    language: Language,
    l: (french: string, english: string) => string,
): { label: string; value: string }[] {
    const teachingLanguage = formation.language ?? 'Français';

    return [
        {
            label: l('Durée', 'Duration'),
            value: durationLabel(formation.duration_formatted, language) ?? '',
        },
        formation.lessons_count > 0
            ? {
                  label: l('Leçons', 'Lessons'),
                  value: String(formation.lessons_count),
              }
            : null,
        {
            label: l('Niveau', 'Level'),
            value: levelLabel(formation.level, language),
        },
        formation.format ? { label: 'Format', value: formation.format } : null,
        {
            label: l('Langue', 'Language'),
            value:
                language === 'en'
                    ? (LANGUAGE_NAMES[teachingLanguage.toLowerCase()] ??
                      teachingLanguage)
                    : teachingLanguage,
        },
    ].filter(
        (fact): fact is { label: string; value: string } =>
            fact !== null && Boolean(fact.value),
    );
}

function scrollToEnrollment(
    event: React.MouseEvent<HTMLAnchorElement>,
    prefersReducedMotion: boolean,
) {
    event.preventDefault();
    document.getElementById('inscription')?.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
}

// ─── Fiche d'accès (prix + boutons) ──────────────────────────────────────────
function AccessCard({ formation }: { formation: Formation }) {
    const { t, l, language } = useTranslation();
    const prefersReducedMotion = Boolean(useReducedMotion());
    const hasExternalAccess = Boolean(formation.cta_url);
    const primaryLabel = formation.is_free
        ? t('training.start_free')
        : t('training.access');

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_60px_-30px_rgba(26,25,22,0.35)]">
            {formation.cover_image_url && (
                <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                        src={formation.cover_image_url}
                        alt={formation.title}
                        fetchPriority="high"
                        className="h-full w-full object-cover"
                        onError={(event) => {
                            (event.target as HTMLImageElement).style.display =
                                'none';
                        }}
                    />
                </div>
            )}

            <div className="flex flex-col gap-5 p-6">
                <div className="flex items-baseline gap-2">
                    <span
                        className={cn(
                            'font-display text-4xl font-bold tracking-tight',
                            formation.is_free
                                ? 'text-teal-700'
                                : 'text-slate-900',
                        )}
                    >
                        {formation.is_free
                            ? l('Gratuit', 'Free')
                            : formation.price_formatted}
                    </span>
                </div>

                <div className="flex flex-col gap-2">
                    <a
                        href={formation.cta_url || '#inscription'}
                        target={hasExternalAccess ? '_blank' : undefined}
                        rel={hasExternalAccess ? 'noreferrer' : undefined}
                        onClick={
                            hasExternalAccess
                                ? undefined
                                : (event) =>
                                      scrollToEnrollment(
                                          event,
                                          prefersReducedMotion,
                                      )
                        }
                        className={buttonVariants({
                            size: 'lg',
                            className: 'w-full',
                        })}
                    >
                        {primaryLabel}
                    </a>
                    {hasExternalAccess && (
                        <a
                            href="#inscription"
                            onClick={(event) =>
                                scrollToEnrollment(event, prefersReducedMotion)
                            }
                            className={buttonVariants({
                                variant: 'outline',
                                size: 'lg',
                                className: 'w-full',
                            })}
                        >
                            {l('Poser une question', 'Ask a question')}
                        </a>
                    )}
                </div>

                <dl>
                    {formationFacts(formation, language, l).map((fact) => (
                        <div
                            key={fact.label}
                            className="flex items-center justify-between gap-4 border-t border-slate-100 py-2.5 text-[14px]"
                        >
                            <dt className="font-mono text-[11px] tracking-wide text-slate-400 uppercase">
                                {fact.label}
                            </dt>
                            <dd className="font-medium text-slate-800">
                                {fact.value}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </div>
    );
}

// ─── Inscription ─────────────────────────────────────────────────────────────
function EnrollmentForm({ formation }: { formation: Formation }) {
    const { t, l } = useTranslation();
    const { props } = usePage<{
        flash?: {
            enrollment?: EnrollmentFlash;
        };
    }>();
    const sessions = formation.sessions ?? [];
    const [values, setValues] = useState(() => {
        const requestedSession =
            typeof window === 'undefined'
                ? null
                : new URLSearchParams(window.location.search).get('session');
        const isKnownSession = sessions.some(
            (session) => String(session.id) === requestedSession,
        );

        return {
            ...EMPTY_ENROLLMENT,
            formation_session_id: isKnownSession
                ? String(requestedSession)
                : '',
        };
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const update = (field: EnrollmentField, value: string) =>
        setValues((current) => ({ ...current, [field]: value }));

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setProcessing(true);
        router.post(`/formations/${formation.slug}/enroll`, values, {
            preserveScroll: true,
            onSuccess: () => {
                setErrors({});
                setValues(EMPTY_ENROLLMENT);
                setIsSent(true);
            },
            onError: (formErrors) =>
                setErrors(formErrors as Record<string, string>),
            onFinish: () => setProcessing(false),
        });
    };

    const fields: {
        key: Exclude<EnrollmentField, 'message' | 'formation_session_id'>;
        label: string;
        placeholder: string;
        type: string;
    }[] = [
        {
            key: 'name',
            label: t('training.name'),
            placeholder: l('Votre nom', 'Your name'),
            type: 'text',
        },
        {
            key: 'email',
            label: t('training.email'),
            placeholder: 'vous@email.com',
            type: 'email',
        },
        {
            key: 'phone',
            label: t('training.phone'),
            placeholder: t('training.optional'),
            type: 'tel',
        },
    ];

    return (
        <section
            id="inscription"
            className="relative isolate scroll-mt-24 overflow-clip border-t border-slate-200/80 bg-white py-20 sm:py-28"
        >
            <SectionBackdrop pattern="grid" />
            <div className="container-main grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
                <div>
                    <Reveal y={8}>
                        <p className="mb-4 font-mono text-[11px] text-slate-400">
                            {t('training.inscription')}
                        </p>
                    </Reveal>
                    <h2 className="font-display text-4xl leading-[1.05] font-bold tracking-[-0.03em] text-slate-900 sm:text-5xl">
                        <MaskedLine onScroll>
                            {t('training.interested')}
                        </MaskedLine>
                        <MaskedLine onScroll delay={0.08}>
                            <span className="text-teal-600">
                                {t('training.this_training')}
                            </span>
                        </MaskedLine>
                    </h2>
                    <Reveal delay={0.15}>
                        <p className="mt-6 max-w-md text-[18px] leading-relaxed text-slate-600">
                            {t('training.form_intro')}
                        </p>
                    </Reveal>
                </div>

                <Reveal delay={0.1}>
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                        <AnimatePresence mode="wait" initial={false}>
                            {isSent ? (
                                <motion.div
                                    key="sent"
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{
                                        duration: 0.4,
                                        ease: easings.smooth,
                                    }}
                                    className="flex flex-col items-start gap-4 py-6"
                                >
                                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2.5}
                                            aria-hidden
                                        >
                                            <motion.path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M5 13l4 4L19 7"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: 0.15,
                                                    ease: easings.smooth,
                                                }}
                                            />
                                        </svg>
                                    </span>
                                    <p className="font-display text-xl font-bold text-slate-900">
                                        {l('Demande envoyée', 'Request sent')}
                                    </p>
                                    <p className="text-[16px] text-slate-600">
                                        {props.flash?.enrollment?.status ===
                                        'en_attente'
                                            ? t('training.waiting_list')
                                            : t('training.request_sent')}
                                    </p>
                                    {props.flash?.enrollment?.date_label && (
                                        <EnrollmentTicket
                                            enrollment={props.flash.enrollment}
                                            title={formation.title}
                                        />
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setIsSent(false)}
                                        className={buttonVariants({
                                            variant: 'outline',
                                            size: 'sm',
                                        })}
                                    >
                                        {t('training.send_another')}
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="form"
                                    onSubmit={submit}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="grid gap-4 sm:grid-cols-2"
                                >
                                    {sessions.length > 0 && (
                                        <SessionPicker
                                            sessions={sessions}
                                            value={values.formation_session_id}
                                            onChange={(sessionId) =>
                                                update(
                                                    'formation_session_id',
                                                    sessionId,
                                                )
                                            }
                                            error={errors.formation_session_id}
                                        />
                                    )}
                                    {fields.map((field) => (
                                        <label
                                            key={field.key}
                                            className={
                                                field.key === 'phone'
                                                    ? 'sm:col-span-2'
                                                    : ''
                                            }
                                        >
                                            <span className="mb-1.5 block font-display text-[13px] font-semibold text-slate-700">
                                                {field.label}
                                            </span>
                                            <input
                                                type={field.type}
                                                value={values[field.key]}
                                                onChange={(event) =>
                                                    update(
                                                        field.key,
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder={field.placeholder}
                                                aria-invalid={Boolean(
                                                    errors[field.key],
                                                )}
                                                className={cn(
                                                    FIELD_CLASS,
                                                    errors[field.key] &&
                                                        'border-rose-300',
                                                )}
                                            />
                                            {errors[field.key] && (
                                                <span className="mt-1.5 block text-[13px] text-rose-600">
                                                    {errors[field.key]}
                                                </span>
                                            )}
                                        </label>
                                    ))}
                                    <label className="sm:col-span-2">
                                        <span className="mb-1.5 block font-display text-[13px] font-semibold text-slate-700">
                                            {t('training.message')}
                                        </span>
                                        <textarea
                                            value={values.message}
                                            onChange={(event) =>
                                                update(
                                                    'message',
                                                    event.target.value,
                                                )
                                            }
                                            rows={4}
                                            placeholder={t(
                                                'training.message_placeholder',
                                            )}
                                            className={cn(
                                                FIELD_CLASS,
                                                'resize-none leading-relaxed',
                                            )}
                                        />
                                        {errors.message && (
                                            <span className="mt-1.5 block text-[13px] text-rose-600">
                                                {errors.message}
                                            </span>
                                        )}
                                    </label>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className={buttonVariants({
                                            size: 'lg',
                                            className: 'sm:col-span-2',
                                        })}
                                    >
                                        {processing
                                            ? t('training.sending')
                                            : formation.cta_label ||
                                              t('training.submit')}
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE
// ═════════════════════════════════════════════════════════════════════════════
export default function Show({ formation, related }: FormationShowProps) {
    const prefersReducedMotion = useReducedMotion();
    const { language, l } = useTranslation();
    const outcomes = formation.outcomes ?? [];
    const hasAudience = Boolean(
        formation.target_audience || formation.prerequisites,
    );

    const fadeIn = (delay: number) => ({
        initial: { opacity: 0, y: prefersReducedMotion ? 0 : 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, delay, ease: easings.smooth },
    });

    return (
        <MainLayout>
            <Head title={`${formation.title} — Formations`} />

            <HeroBackdrop className="overflow-clip">
                <div className="container-main pt-[110px] pb-20 sm:pt-[130px] sm:pb-28">
                    <motion.div
                        {...fadeIn(0)}
                        className="mb-10 flex flex-wrap items-center gap-3"
                    >
                        <Link
                            href="/formations"
                            className={buttonVariants({
                                variant: 'outline',
                                size: 'sm',
                            })}
                        >
                            {l('Toutes les formations', 'All training')}
                        </Link>
                        <span className="font-mono text-[12px] text-slate-500">
                            {formation.category} ·{' '}
                            {levelLabel(formation.level, language)}
                            {formation.featured && (
                                <span className="text-teal-600">
                                    {' '}
                                    · Populaire
                                </span>
                            )}
                        </span>
                    </motion.div>

                    <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
                        {/* ── Colonne principale ─────────────────────── */}
                        <div className="min-w-0">
                            <h1 className="font-display text-[38px] leading-[1.04] font-bold tracking-[-0.04em] text-ink-primary sm:text-6xl lg:text-[68px]">
                                <SplitWords
                                    text={formation.title}
                                    delay={0.1}
                                />
                            </h1>
                            {formation.excerpt && (
                                <motion.p
                                    {...fadeIn(0.5)}
                                    className="mt-7 max-w-[38rem] text-[20px] leading-[1.6] text-slate-600"
                                >
                                    {formation.excerpt}
                                </motion.p>
                            )}
                            {formation.tags.length > 0 && (
                                <motion.p
                                    {...fadeIn(0.6)}
                                    className="mt-6 font-mono text-[12px] text-slate-500"
                                >
                                    {formation.tags.join(' · ')}
                                </motion.p>
                            )}

                            {/* Fiche d'accès — sur mobile, juste après l'intro */}
                            <motion.div
                                {...fadeIn(0.7)}
                                className="mt-10 lg:hidden"
                            >
                                <AccessCard formation={formation} />
                            </motion.div>

                            {/* Objectifs */}
                            {outcomes.length > 0 && (
                                <section className="mt-20">
                                    <h2 className="mb-8 font-display text-3xl font-bold tracking-[-0.03em] text-slate-900 sm:text-[40px]">
                                        <MaskedLine onScroll>
                                            {l(
                                                'À la fin, vous saurez',
                                                'By the end, you will know how to',
                                            )}
                                        </MaskedLine>
                                    </h2>
                                    <ol className="grid gap-x-8 sm:grid-cols-2">
                                        {outcomes.map((outcome, index) => (
                                            <li key={outcome}>
                                                <DrawLine />
                                                <Reveal
                                                    y={10}
                                                    delay={(index % 2) * 0.08}
                                                    className="flex gap-4 py-5"
                                                >
                                                    <span className="font-mono text-[12px] text-teal-600">
                                                        {String(
                                                            index + 1,
                                                        ).padStart(2, '0')}
                                                    </span>
                                                    <span className="text-[18px] leading-snug text-slate-800">
                                                        {outcome}
                                                    </span>
                                                </Reveal>
                                            </li>
                                        ))}
                                    </ol>
                                </section>
                            )}

                            {/* Programme */}
                            {formation.content && (
                                <section className="mt-20">
                                    <h2 className="mb-8 font-display text-3xl font-bold tracking-[-0.03em] text-slate-900 sm:text-[40px]">
                                        <MaskedLine onScroll>
                                            {l('Programme', 'Curriculum')}
                                        </MaskedLine>
                                    </h2>
                                    <Reveal>
                                        <div className="max-w-[44rem]">
                                            <ReactMarkdown
                                                components={markdownComponents}
                                            >
                                                {formation.content}
                                            </ReactMarkdown>
                                        </div>
                                    </Reveal>
                                </section>
                            )}

                            {/* Public visé */}
                            {hasAudience && (
                                <section className="mt-20 grid gap-10 sm:grid-cols-2">
                                    {formation.target_audience && (
                                        <Reveal>
                                            <DrawLine />
                                            <p className="mt-5 mb-3 font-mono text-[11px] text-teal-600">
                                                {l('Pour qui', 'Who it is for')}
                                            </p>
                                            <p className="text-[18px] leading-relaxed text-slate-700">
                                                {formation.target_audience}
                                            </p>
                                        </Reveal>
                                    )}
                                    {formation.prerequisites && (
                                        <Reveal delay={0.08}>
                                            <DrawLine />
                                            <p className="mt-5 mb-3 font-mono text-[11px] text-teal-600">
                                                {l(
                                                    'Prérequis',
                                                    'Prerequisites',
                                                )}
                                            </p>
                                            <p className="text-[18px] leading-relaxed text-slate-700">
                                                {formation.prerequisites}
                                            </p>
                                        </Reveal>
                                    )}
                                </section>
                            )}
                        </div>

                        {/* ── Fiche d'accès collante (desktop) ───────── */}
                        <aside className="hidden lg:block">
                            <motion.div
                                {...fadeIn(0.35)}
                                className="sticky top-28"
                            >
                                <AccessCard formation={formation} />
                            </motion.div>
                        </aside>
                    </div>
                </div>
            </HeroBackdrop>

            <EnrollmentForm formation={formation} />

            {related.length > 0 && (
                <section className="border-t border-slate-200/80 bg-white py-20 sm:py-28">
                    <div className="container-main">
                        <div className="mb-10 flex flex-col gap-5 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
                            <h2 className="font-display text-4xl font-bold tracking-[-0.03em] text-slate-900 sm:text-5xl">
                                <MaskedLine onScroll>
                                    {l('À découvrir ensuite', 'Explore next')}
                                </MaskedLine>
                            </h2>
                            <Reveal delay={0.15}>
                                <Link
                                    href="/formations"
                                    className={buttonVariants({
                                        variant: 'outline',
                                    })}
                                >
                                    {l('Toutes les formations', 'All training')}
                                </Link>
                            </Reveal>
                        </div>
                        <FormationDeck formations={related as Formation[]} />
                    </div>
                </section>
            )}
        </MainLayout>
    );
}
