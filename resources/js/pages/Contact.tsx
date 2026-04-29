// resources/js/pages/Contact.tsx

import { Head, Link, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { DottedMap } from '@/components/ui/dotted-map';
import { HexagonPattern } from '@/components/ui/hexagon-pattern';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import MainLayout from '@/layouts/MainLayout';
import { cn } from '@/lib/utils';

// ─── Markers ──────────────────────────────────────────────────────────────────
const markers = [
    { lat: 40.7128, lng: -74.006, size: 0.3 }, // New York
    { lat: 34.0522, lng: -118.2437, size: 0.3 }, // Los Angeles
    { lat: 51.5074, lng: -0.1278, size: 0.3 }, // London
    { lat: -33.8688, lng: 151.2093, size: 0.3 }, // Sydney
    { lat: 48.8566, lng: 2.3522, size: 0.3 }, // Paris
    { lat: 35.6762, lng: 139.6503, size: 0.3 }, // Tokyo
    { lat: 55.7558, lng: 37.6176, size: 0.3 }, // Moscou
    { lat: 39.9042, lng: 116.4074, size: 0.3 }, // Beijing
    { lat: 28.6139, lng: 77.209, size: 0.3 }, // New Delhi
    { lat: -23.5505, lng: -46.6333, size: 0.3 }, // São Paulo
    { lat: 1.3521, lng: 103.8198, size: 0.3 }, // Singapore
    { lat: 25.2048, lng: 55.2708, size: 0.3 }, // Dubai
    { lat: 52.52, lng: 13.405, size: 0.3 }, // Berlin
    { lat: 19.4326, lng: -99.1332, size: 0.3 }, // Mexico City
    { lat: -26.2041, lng: 28.0473, size: 0.3 }, // Johannesburg
    { lat: 3.848, lng: 11.5021, size: 0.55 }, // Yaoundé ★
    { lat: 4.0511, lng: 9.7679, size: 0.45 }, // Douala
];

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const PhoneIcon = () => (
    <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
    </svg>
);
const MailIcon = () => (
    <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
    </svg>
);
const MapPinIcon = () => (
    <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
    </svg>
);

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <label className="block text-[13px] font-semibold text-slate-700">
                {label} <span className="text-teal-500">*</span>
            </label>
            {children}
            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="flex items-center gap-1 text-[12px] text-red-500"
                    >
                        <svg
                            className="h-3.5 w-3.5 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}

const inputBase = cn(
    'w-full rounded-md px-4 py-3 text-[14px] text-slate-900 placeholder:text-slate-400',
    'border border-[rgb(226,224,218)] bg-[#fafaf8] outline-none',
    'focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-400/15',
    'transition-all duration-200',
);
const inputError =
    'border-red-300 focus:border-red-400 focus:ring-red-400/15 bg-red-50/30';

// ─── Spinner ──────────────────────────────────────────────────────────────────
function Spinner() {
    return (
        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
                className="opacity-20"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-90"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
        </svg>
    );
}

// ─── Success State ────────────────────────────────────────────────────────────
function SuccessBanner({ message }: { message: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col items-center justify-center gap-5 py-12 text-center"
        >
            {/* Checkmark circle */}
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-teal-200 bg-teal-50">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        delay: 0.15,
                        duration: 0.4,
                        type: 'spring',
                        stiffness: 200,
                    }}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-600"
                >
                    <svg
                        className="h-7 w-7 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </motion.div>
                {/* Ping */}
                <span className="absolute inset-0 animate-ping rounded-full bg-teal-400/20" />
            </div>

            <div>
                <p className="font-display text-[20px] font-bold text-slate-900">
                    Message envoyé !
                </p>
                <p className="mt-1 max-w-xs text-[14px] text-slate-500">
                    {message}
                </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-4 py-2 text-[13px] font-medium text-teal-700">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500" />
                Réponse attendue sous 24h
            </div>
        </motion.div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Contact() {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm<{
        name: string;
        email: string;
        subject: string;
        message: string;
    }>({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        post('/contact', {
            preserveScroll: true,
            preserveState: true,
            replace: true,
            onSuccess: () => {
                reset();
                setSuccessMessage(
                    'Votre message a bien ete envoye. Je vous repondrai dans les plus brefs delais.',
                );
            },
        });
    }

    function updateField<K extends keyof typeof data>(
        field: K,
        value: (typeof data)[K],
    ) {
        if (successMessage) {
            setSuccessMessage(null);
        }

        setData(field, value as never);
    }

    return (
        <MainLayout>
            <Head title="Contact — Sergio Junior Chebeu" />

            {/* ── Hero ────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-white pt-[88px] pb-14 sm:pb-18">
                <HexagonPattern
                    radius={28}
                    gap={4}
                    className={cn(
                        'absolute inset-0 h-full w-full fill-transparent stroke-teal-600/[0.06]',
                        '[mask-image:radial-gradient(ellipse_85%_90%_at_50%_50%,white_30%,transparent_100%)]',
                    )}
                />

                {/* Watermark */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none"
                >
                    <span
                        className="font-display leading-none font-extrabold tracking-[-0.04em] whitespace-nowrap text-slate-900/[0.028] uppercase"
                        style={{ fontSize: 'clamp(56px, 11vw, 150px)' }}
                    >
                        Contact
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
                        <span className="text-slate-600">Contact</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.6,
                            delay: 0.05,
                            ease: [0.23, 1, 0.32, 1],
                        }}
                        className="max-w-3xl"
                    >
                        {/* Availability badge */}
                        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200/70 bg-teal-50 px-4 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-teal-700 uppercase">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500" />
                            Disponible — Remote & Cameroun
                        </span>

                        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_250px] lg:items-end">
                            <div>
                                <div className="mb-4 flex items-center gap-3">
                                    <span className="h-px w-10 bg-slate-300" />
                                    <span className="text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
                                        Collaborons ensemble
                                    </span>
                                </div>

                                <h1 className="font-display text-4xl leading-[0.98] font-bold tracking-[-0.04em] text-[#1a1916] sm:text-5xl lg:text-[60px]">
                                    Parlons d&apos;un projet
                                    <br />
                                    <span className="text-teal-600">
                                        clair et ambitieux.
                                    </span>
                                </h1>

                                <p className="mt-5 max-w-xl text-[16px] leading-8 text-slate-600 sm:text-[17px]">
                                    Site, application, produit ou formation:
                                    j&apos;aime cadrer vite, simplifier ce qui
                                    est flou et poser une direction qui tient
                                    autant en design qu&apos;en execution.
                                </p>
                            </div>

                            <div className="border border-slate-200/80 bg-white/70 p-5 backdrop-blur-sm lg:mb-1">
                                <p className="text-[11px] font-semibold tracking-[0.16em] text-slate-400 uppercase">
                                    Cadre
                                </p>
                                <div className="mt-3 space-y-3 text-[14px] leading-7 text-slate-600">
                                    <p>
                                        Reponse initiale sous 24h avec un retour
                                        concret.
                                    </p>
                                    <p>
                                        Missions selectives, collaborations et
                                        refontes a fort enjeu.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Main content ────────────────────────────────────────── */}
            <section className="bg-[#fafaf8] py-14 sm:py-18">
                <div className="container-main">
                    <div className="grid items-start gap-6 lg:grid-cols-2">
                        {/* ── Left: Map + Contact info ───────────────────── */}
                        <motion.div
                            initial={{ opacity: 0, y: 28 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: 0.1,
                                ease: [0.23, 1, 0.32, 1],
                            }}
                        >
                            <SpotlightCard className="overflow-hidden">
                                {/* Map — dark bg, white dots */}
                                <div className="relative h-56 flex-shrink-0 overflow-hidden bg-slate-950">
                                    {/* Radial vignette */}
                                    <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(2,6,23,0.8)_100%)]" />
                                    <DottedMap
                                        markers={markers}
                                        markerColor="#2dd4bf"
                                        dotRadius={0.22}
                                        className="text-white/30"
                                    />
                                    {/* Location label */}
                                    <div className="absolute bottom-4 left-4 z-20 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1.5 backdrop-blur-sm">
                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-400" />
                                        <span className="text-[11px] font-semibold tracking-wide text-white/80">
                                            Yaoundé, Cameroun
                                        </span>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="space-y-1 p-6">
                                    <h2 className="font-display text-[19px] font-bold text-slate-900">
                                        Prenons contact
                                    </h2>
                                    <p className="text-[13px] leading-relaxed text-slate-500">
                                        Disponible pour des missions freelance,
                                        collaborations et formations — en remote
                                        ou depuis Yaoundé.
                                    </p>
                                </div>

                                <div className="space-y-1.5 px-6 pb-6">
                                    {/* Phone */}
                                    <a
                                        href="tel:+237698824439"
                                        className="group flex items-center gap-4 rounded-md border border-transparent px-4 py-3 transition-all duration-200 hover:border-teal-100 hover:bg-teal-50"
                                    >
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-teal-100 bg-teal-50 text-teal-600 transition-colors group-hover:bg-teal-100">
                                            <PhoneIcon />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-semibold tracking-[0.14em] text-slate-400 uppercase">
                                                Téléphone
                                            </p>
                                            <p className="text-[14px] font-semibold text-slate-800 transition-colors group-hover:text-teal-600">
                                                +237 698 824 439
                                            </p>
                                        </div>
                                    </a>

                                    {/* Email */}
                                    <a
                                        href="mailto:contact@mrsergio.dev"
                                        className="group flex items-center gap-4 rounded-md border border-transparent px-4 py-3 transition-all duration-200 hover:border-teal-100 hover:bg-teal-50"
                                    >
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-teal-100 bg-teal-50 text-teal-600 transition-colors group-hover:bg-teal-100">
                                            <MailIcon />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-semibold tracking-[0.14em] text-slate-400 uppercase">
                                                Email
                                            </p>
                                            <p className="text-[14px] font-semibold text-slate-800 transition-colors group-hover:text-teal-600">
                                                contact@mrsergio.dev
                                            </p>
                                        </div>
                                    </a>

                                    {/* Location */}
                                    <div className="flex items-center gap-4 rounded-md px-4 py-3">
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-slate-100 bg-slate-50 text-slate-500">
                                            <MapPinIcon />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-semibold tracking-[0.14em] text-slate-400 uppercase">
                                                Localisation
                                            </p>
                                            <p className="text-[14px] font-semibold text-slate-800">
                                                Yaoundé, Cameroun · Remote
                                            </p>
                                        </div>
                                    </div>

                                    {/* Availability */}
                                    <div className="flex items-center gap-4 rounded-md border border-emerald-100 bg-emerald-50/60 px-4 py-3">
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-emerald-100 bg-emerald-50 text-emerald-600">
                                            <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={1.8}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-semibold tracking-[0.14em] text-slate-400 uppercase">
                                                Disponibilité
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                                                <p className="text-[14px] font-semibold text-emerald-700">
                                                    Disponible — réponse sous
                                                    24h
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SpotlightCard>
                        </motion.div>

                        {/* ── Right: Form ────────────────────────────────── */}
                        <motion.div
                            initial={{ opacity: 0, y: 28 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: 0.18,
                                ease: [0.23, 1, 0.32, 1],
                            }}
                        >
                            <SpotlightCard>
                                <div className="border-b border-slate-100 p-6">
                                    <h2 className="font-display text-[19px] font-bold text-slate-900">
                                        Envoyez un message
                                    </h2>
                                    <p className="mt-1 text-[13px] text-slate-500">
                                        Tous les champs{' '}
                                        <span className="font-semibold text-teal-600">
                                            *
                                        </span>{' '}
                                        sont obligatoires.
                                    </p>
                                </div>

                                <div className="space-y-5 p-6">
                                    <AnimatePresence>
                                        {successMessage && (
                                            <SuccessBanner
                                                key="success"
                                                message={successMessage}
                                            />
                                        )}
                                    </AnimatePresence>

                                    <motion.form
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        onSubmit={handleSubmit}
                                        className="space-y-5"
                                    >
                                        {/* Nom + Email */}
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <Field
                                                label="Nom complet"
                                                error={errors.name}
                                            >
                                                <input
                                                    type="text"
                                                    value={data.name}
                                                    onChange={(e) =>
                                                        updateField(
                                                            'name',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Sergio Junior"
                                                    autoComplete="name"
                                                    className={cn(
                                                        inputBase,
                                                        errors.name &&
                                                            inputError,
                                                    )}
                                                />
                                            </Field>

                                            <Field
                                                label="Adresse email"
                                                error={errors.email}
                                            >
                                                <input
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) =>
                                                        updateField(
                                                            'email',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="vous@exemple.com"
                                                    autoComplete="email"
                                                    className={cn(
                                                        inputBase,
                                                        errors.email &&
                                                            inputError,
                                                    )}
                                                />
                                            </Field>
                                        </div>

                                        {/* Sujet */}
                                        <Field
                                            label="Sujet"
                                            error={errors.subject}
                                        >
                                            <input
                                                type="text"
                                                value={data.subject}
                                                onChange={(e) =>
                                                    updateField(
                                                        'subject',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Projet web, formation Laravel..."
                                                className={cn(
                                                    inputBase,
                                                    errors.subject &&
                                                        inputError,
                                                )}
                                            />
                                        </Field>

                                        {/* Message */}
                                        <Field
                                            label="Message"
                                            error={errors.message}
                                        >
                                            <textarea
                                                value={data.message}
                                                onChange={(e) =>
                                                    updateField(
                                                        'message',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Décrivez votre projet, vos besoins, votre budget indicatif..."
                                                rows={6}
                                                className={cn(
                                                    inputBase,
                                                    'resize-none leading-relaxed',
                                                    errors.message &&
                                                        inputError,
                                                )}
                                            />
                                            <div className="mt-1 flex items-center justify-end gap-2">
                                                {data.message.length > 1800 && (
                                                    <span className="text-[11px] font-medium text-amber-500">
                                                        {2000 -
                                                            data.message
                                                                .length}{' '}
                                                        restants
                                                    </span>
                                                )}
                                                <span className="text-[11px] text-slate-400">
                                                    {data.message.length} / 2000
                                                </span>
                                            </div>
                                        </Field>

                                        {/* Submit */}
                                        <motion.button
                                            type="submit"
                                            disabled={processing}
                                            whileHover={
                                                !processing
                                                    ? { scale: 1.01 }
                                                    : {}
                                            }
                                            whileTap={
                                                !processing
                                                    ? { scale: 0.98 }
                                                    : {}
                                            }
                                            className={cn(
                                                'relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-md px-6 py-3.5',
                                                'bg-teal-600 text-[14px] font-semibold text-white',
                                                'shadow-sm shadow-teal-500/25 transition-all duration-200',
                                                processing
                                                    ? 'cursor-not-allowed opacity-80'
                                                    : 'hover:bg-teal-700 hover:shadow-teal-500/35',
                                            )}
                                        >
                                            {/* Shimmer sur processing */}
                                            {processing && (
                                                <span className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                            )}

                                            <AnimatePresence mode="wait">
                                                {processing ? (
                                                    <motion.span
                                                        key="loading"
                                                        initial={{
                                                            opacity: 0,
                                                            y: 6,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                        }}
                                                        exit={{
                                                            opacity: 0,
                                                            y: -6,
                                                        }}
                                                        className="flex items-center gap-2.5"
                                                    >
                                                        <Spinner />
                                                        Envoi en cours…
                                                    </motion.span>
                                                ) : (
                                                    <motion.span
                                                        key="idle"
                                                        initial={{
                                                            opacity: 0,
                                                            y: 6,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                        }}
                                                        exit={{
                                                            opacity: 0,
                                                            y: -6,
                                                        }}
                                                        className="flex items-center gap-2.5"
                                                    >
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
                                                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                                            />
                                                        </svg>
                                                        Envoyer le message
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </motion.button>
                                    </motion.form>
                                </div>
                            </SpotlightCard>
                        </motion.div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
