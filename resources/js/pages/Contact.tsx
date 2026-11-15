// resources/js/pages/Contact.tsx
// Page contact : hero, canaux directs (email, téléphone, lieu, heure locale),
// formulaire avec types de projet rapides, confirmation animée.

import { Head, useForm } from '@inertiajs/react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState, useSyncExternalStore } from 'react';
import { WorldMapBackdrop } from '@/components/portofolio/world-map-backdrop';
import { buttonVariants } from '@/components/ui/button';
import {
    DrawLine,
    MaskedLine,
    Reveal,
    SplitWords,
} from '@/components/ui/reveal';
import { useClipboard } from '@/hooks/use-clipboard';
import MainLayout from '@/layouts/MainLayout';
import { cn, easings } from '@/lib/utils';

const CONTACT_EMAIL = 'contact@mrsergio.dev';
const CONTACT_PHONE = '+237 698 824 439';
const CONTACT_PHONE_HREF = 'tel:+237698824439';
const MESSAGE_MAX_LENGTH = 2000;
const YAOUNDE = { lat: 3.848, lng: 11.5021 };

const PROJECT_TYPES = [
    'Site web',
    'Application mobile',
    'Refonte',
    'Formation',
    'Autre chose',
];

const COMMITMENTS = [
    'Réponse initiale sous 24 h avec un retour concret.',
    'Missions sélectives, collaborations et refontes à fort enjeu.',
    'En remote ou depuis Yaoundé.',
];

const FIELD_CLASS =
    'w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[16px] text-slate-900 placeholder:text-slate-400 outline-none transition-[border-color,box-shadow] focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10';

// ─── Heure locale ────────────────────────────────────────────────────────────
function formatLocalTime(): string {
    return new Intl.DateTimeFormat('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Africa/Douala',
    }).format(new Date());
}

function subscribeToMinuteTick(onTick: () => void): () => void {
    const interval = setInterval(onTick, 30_000);

    return () => clearInterval(interval);
}

function useLocalTime(): string | null {
    return useSyncExternalStore(
        subscribeToMinuteTick,
        formatLocalTime,
        () => null,
    );
}

// ─── Champ ───────────────────────────────────────────────────────────────────
function Field({
    label,
    error,
    hint,
    children,
    className,
}: {
    label: string;
    error?: string;
    hint?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <label className={cn('flex flex-col gap-1.5', className)}>
            <span className="flex items-baseline justify-between gap-3">
                <span className="font-display text-[13px] font-semibold text-slate-700">
                    {label}
                </span>
                {hint}
            </span>
            {children}
            <AnimatePresence initial={false}>
                {error && (
                    <motion.span
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="text-[13px] text-rose-600"
                    >
                        {error}
                    </motion.span>
                )}
            </AnimatePresence>
        </label>
    );
}

// ─── Canal de contact ────────────────────────────────────────────────────────
function Channel({
    label,
    children,
    delay,
}: {
    label: string;
    children: React.ReactNode;
    delay: number;
}) {
    return (
        <div>
            <DrawLine />
            <Reveal
                y={10}
                delay={delay}
                className="grid grid-cols-[110px_1fr] items-center gap-4 py-5"
            >
                <span className="font-mono text-[11px] tracking-wide text-slate-400 uppercase">
                    {label}
                </span>
                <div className="min-w-0">{children}</div>
            </Reveal>
        </div>
    );
}

// ─── Formulaire ──────────────────────────────────────────────────────────────
function ContactForm() {
    const [isSent, setIsSent] = useState(false);
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            name: '',
            email: '',
            subject: '',
            message: '',
        });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        post('/contact', {
            preserveScroll: true,
            preserveState: true,
            replace: true,
            onSuccess: () => {
                reset();
                setIsSent(true);
            },
        });
    };

    const chooseProjectType = (type: string) => {
        setData('subject', data.subject === type ? '' : type);
        clearErrors('subject');
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(26,25,22,0.3)] sm:p-8">
            <AnimatePresence mode="wait" initial={false}>
                {isSent ? (
                    <motion.div
                        key="sent"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: easings.smooth }}
                        className="flex min-h-[420px] flex-col items-start justify-center gap-4"
                    >
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                            <svg
                                className="h-6 w-6"
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
                        <p className="font-display text-2xl font-bold tracking-tight text-slate-900">
                            Message envoyé
                        </p>
                        <p className="max-w-sm text-[17px] leading-relaxed text-slate-600">
                            Votre message a bien été envoyé. Je vous réponds
                            dans les plus brefs délais.
                        </p>
                        <button
                            type="button"
                            onClick={() => setIsSent(false)}
                            className={buttonVariants({
                                variant: 'outline',
                                size: 'sm',
                                className: 'mt-2',
                            })}
                        >
                            Envoyer un autre message
                        </button>
                    </motion.div>
                ) : (
                    <motion.form
                        key="form"
                        onSubmit={submit}
                        noValidate
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col gap-5"
                    >
                        <div>
                            <p className="mb-3 font-display text-[13px] font-semibold text-slate-700">
                                Votre projet
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {PROJECT_TYPES.map((type) => {
                                    const isActive = data.subject === type;

                                    return (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() =>
                                                chooseProjectType(type)
                                            }
                                            aria-pressed={isActive}
                                            className={cn(
                                                'h-9 rounded-full border px-4 font-display text-[13px] font-semibold transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.97]',
                                                isActive
                                                    ? 'border-slate-900 bg-slate-900 text-white'
                                                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900',
                                            )}
                                        >
                                            {type}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field label="Nom" error={errors.name}>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(event) =>
                                        setData('name', event.target.value)
                                    }
                                    placeholder="Votre nom"
                                    autoComplete="name"
                                    aria-invalid={Boolean(errors.name)}
                                    className={cn(
                                        FIELD_CLASS,
                                        errors.name && 'border-rose-300',
                                    )}
                                />
                            </Field>
                            <Field label="Email" error={errors.email}>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(event) =>
                                        setData('email', event.target.value)
                                    }
                                    placeholder="vous@email.com"
                                    autoComplete="email"
                                    aria-invalid={Boolean(errors.email)}
                                    className={cn(
                                        FIELD_CLASS,
                                        errors.email && 'border-rose-300',
                                    )}
                                />
                            </Field>
                        </div>

                        <Field label="Sujet" error={errors.subject}>
                            <input
                                type="text"
                                value={data.subject}
                                onChange={(event) =>
                                    setData('subject', event.target.value)
                                }
                                placeholder="Refonte de mon site, application de gestion…"
                                aria-invalid={Boolean(errors.subject)}
                                className={cn(
                                    FIELD_CLASS,
                                    errors.subject && 'border-rose-300',
                                )}
                            />
                        </Field>

                        <Field
                            label="Message"
                            error={errors.message}
                            hint={
                                <span
                                    className={cn(
                                        'font-mono text-[11px] tabular-nums',
                                        data.message.length >
                                            MESSAGE_MAX_LENGTH * 0.9
                                            ? 'text-rose-500'
                                            : 'text-slate-400',
                                    )}
                                >
                                    {data.message.length}/{MESSAGE_MAX_LENGTH}
                                </span>
                            }
                        >
                            <textarea
                                value={data.message}
                                onChange={(event) =>
                                    setData('message', event.target.value)
                                }
                                placeholder="L'objectif, le délai, et le budget si vous l'avez déjà."
                                rows={6}
                                maxLength={MESSAGE_MAX_LENGTH}
                                aria-invalid={Boolean(errors.message)}
                                className={cn(
                                    FIELD_CLASS,
                                    'resize-none leading-relaxed',
                                    errors.message && 'border-rose-300',
                                )}
                            />
                        </Field>

                        <button
                            type="submit"
                            disabled={processing}
                            className={buttonVariants({
                                size: 'lg',
                                className: 'w-full',
                            })}
                        >
                            {processing
                                ? 'Envoi en cours…'
                                : 'Envoyer le message'}
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    );
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE
// ═════════════════════════════════════════════════════════════════════════════
export default function Contact() {
    const prefersReducedMotion = useReducedMotion();
    const localTime = useLocalTime();
    const [copiedText, copy] = useClipboard();
    const isEmailCopied = copiedText === CONTACT_EMAIL;

    const fadeIn = (delay: number) => ({
        initial: { opacity: 0, y: prefersReducedMotion ? 0 : 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, delay, ease: easings.smooth },
    });

    return (
        <MainLayout>
            <Head title="Contact — Sergio Junior Chebeu" />

            <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden bg-white">
                <WorldMapBackdrop place={YAOUNDE} />
                <div className="container-main w-full pt-[110px] pb-14 sm:pt-[130px] sm:pb-20">
                    <motion.p
                        {...fadeIn(0)}
                        className="mb-8 font-mono text-[12px] text-slate-500"
                    >
                        Contact
                    </motion.p>
                    <h1 className="max-w-4xl font-display text-[44px] leading-[1] font-bold tracking-[-0.045em] text-[#1a1916] sm:text-7xl lg:text-[84px]">
                        <SplitWords text="Parlons d'un projet" delay={0.1} />
                        <SplitWords
                            text="clair et ambitieux."
                            delay={0.3}
                            className="text-teal-600"
                        />
                    </h1>
                    <motion.p
                        {...fadeIn(0.6)}
                        className="mt-8 max-w-xl text-[19px] leading-[1.6] text-slate-600"
                    >
                        Site, application, produit ou formation : j&apos;aime
                        cadrer vite, simplifier ce qui est flou et poser une
                        direction qui tient autant en design qu&apos;en
                        exécution.
                    </motion.p>
                    <motion.p
                        {...fadeIn(0.75)}
                        className="mt-10 inline-flex items-center gap-2.5 rounded-full border border-slate-200/90 bg-white/80 px-3.5 py-1.5 font-mono text-[12px] text-slate-600 backdrop-blur"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-70 motion-reduce:hidden" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
                        </span>
                        Yaoundé, Cameroun
                        {localTime && (
                            <span className="text-slate-400">
                                · {localTime}
                            </span>
                        )}
                    </motion.p>
                </div>
            </section>

            <section className="relative isolate overflow-clip border-t border-slate-200/80 bg-white py-16 sm:py-24">
                <div className="container-main grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
                    {/* ── Canaux directs ─────────────────────────── */}
                    <div>
                        <h2 className="mb-6 font-display text-3xl font-bold tracking-[-0.03em] text-slate-900">
                            <MaskedLine onScroll>Directement</MaskedLine>
                        </h2>

                        <Channel label="Email" delay={0.05}>
                            <div className="flex flex-wrap items-center gap-3">
                                <a
                                    href={`mailto:${CONTACT_EMAIL}`}
                                    className="truncate font-display text-[17px] font-semibold text-slate-900 transition-colors hover:text-teal-700"
                                >
                                    {CONTACT_EMAIL}
                                </a>
                                <button
                                    type="button"
                                    onClick={() => copy(CONTACT_EMAIL)}
                                    className={buttonVariants({
                                        variant: 'outline',
                                        size: 'sm',
                                        className: 'h-8 px-3',
                                    })}
                                >
                                    {isEmailCopied ? 'Copié' : 'Copier'}
                                </button>
                            </div>
                        </Channel>
                        <Channel label="Téléphone" delay={0.1}>
                            <a
                                href={CONTACT_PHONE_HREF}
                                className="font-display text-[17px] font-semibold text-slate-900 transition-colors hover:text-teal-700"
                            >
                                {CONTACT_PHONE}
                            </a>
                        </Channel>
                        <Channel label="Lieu" delay={0.15}>
                            <p className="font-display text-[17px] font-semibold text-slate-900">
                                Yaoundé, Cameroun
                                {localTime && (
                                    <span className="ml-2 font-mono text-[13px] font-normal text-slate-500">
                                        · {localTime} en ce moment
                                    </span>
                                )}
                            </p>
                        </Channel>
                        <DrawLine />

                        <ul className="mt-10 flex flex-col gap-3">
                            {COMMITMENTS.map((commitment, index) => (
                                <Reveal
                                    key={commitment}
                                    as="li"
                                    y={8}
                                    delay={index * 0.06}
                                    className="flex gap-3 text-[17px] text-slate-700"
                                >
                                    <span
                                        aria-hidden
                                        className="mt-[0.7em] h-px w-4 shrink-0 bg-teal-500"
                                    />
                                    {commitment}
                                </Reveal>
                            ))}
                        </ul>
                    </div>

                    {/* ── Formulaire ─────────────────────────────── */}
                    <div className="lg:pt-2">
                        <h2 className="mb-6 font-display text-3xl font-bold tracking-[-0.03em] text-slate-900">
                            <MaskedLine onScroll>Ou écrivez-moi ici</MaskedLine>
                        </h2>
                        <Reveal delay={0.1}>
                            <ContactForm />
                        </Reveal>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
