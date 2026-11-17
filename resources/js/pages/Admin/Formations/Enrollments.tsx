// resources/js/pages/Admin/Formations/Enrollments.tsx
// Demandes d'inscription : filtre par statut, changement de statut en un clic.

import { Head, Link, router } from '@inertiajs/react';
import { LayoutGroup, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import {
    AdminEmptyState,
    AdminPageHeader,
    AdminPanel,
    DeleteModal,
} from '@/components/admin/shared';
import { buttonVariants } from '@/components/ui/button';
import AdminLayout from '@/layouts/AdminLayout';
import { cn } from '@/lib/utils';

interface SessionOption {
    id: number;
    formation_id: number;
    label: string;
    is_full: boolean;
}

interface Enrollment {
    id: number;
    formation_id: number;
    name: string;
    email: string;
    phone: string | null;
    message: string | null;
    status: Status;
    attended_at: string | null;
    formation: { title: string };
    session: { title: string | null; starts_at: string } | null;
}

type Status = 'inscrite' | 'en_attente' | 'traitée' | 'annulée';

// Session en direct : place réservée, liste d'attente (promue seule quand une place se libère).
const SESSION_STATUSES: { value: Status; label: string }[] = [
    { value: 'inscrite', label: 'Inscrit' },
    { value: 'en_attente', label: "Liste d'attente" },
    { value: 'annulée', label: 'Annulé' },
];

// Demande sans session (formation payante) : à traiter, puis traitée.
const REQUEST_STATUSES: { value: Status; label: string }[] = [
    { value: 'inscrite', label: 'À traiter' },
    { value: 'traitée', label: 'Traitée' },
    { value: 'annulée', label: 'Annulée' },
];

type Filter = 'registered' | 'waitlist' | 'to_handle' | 'handled' | 'cancelled';

const FILTERS: {
    value: Filter;
    label: string;
    matches: (enrollment: Enrollment) => boolean;
}[] = [
    {
        value: 'registered',
        label: 'Inscrits',
        matches: (e) => e.session !== null && e.status === 'inscrite',
    },
    {
        value: 'waitlist',
        label: "Liste d'attente",
        matches: (e) => e.status === 'en_attente',
    },
    {
        value: 'to_handle',
        label: 'Demandes à traiter',
        matches: (e) => e.session === null && e.status === 'inscrite',
    },
    {
        value: 'handled',
        label: 'Traitées',
        matches: (e) => e.status === 'traitée',
    },
    {
        value: 'cancelled',
        label: 'Annulés',
        matches: (e) => e.status === 'annulée',
    },
];

/**
 * Place une demande sans session (ancienne demande, formation payante) dans une session à venir.
 */
function AssignSession({
    enrollment,
    sessions,
}: {
    enrollment: Enrollment;
    sessions: SessionOption[];
}) {
    const [error, setError] = useState<string | null>(null);
    const options = sessions.filter(
        (session) => session.formation_id === enrollment.formation_id,
    );

    if (options.length === 0) {
        return null;
    }

    function assign(sessionId: string) {
        if (!sessionId) {
            return;
        }

        router.patch(
            `/admin/formation-enrollments/${enrollment.id}/session`,
            { formation_session_id: Number(sessionId) },
            {
                preserveScroll: true,
                onError: (errors) =>
                    setError(errors.formation_session_id ?? null),
                onSuccess: () => setError(null),
            },
        );
    }

    return (
        <div className="mt-3">
            <select
                defaultValue=""
                onChange={(event) => assign(event.target.value)}
                aria-label={`Ajouter ${enrollment.name} à une session`}
                className="max-w-full rounded-lg border border-teal-200 bg-teal-50/60 px-3 py-2 text-[13px] font-semibold text-teal-800 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
            >
                <option value="">Ajouter aux inscrits d'une session…</option>
                {options.map((session) => (
                    <option key={session.id} value={session.id}>
                        {session.label}
                        {session.is_full ? " (complète : liste d'attente)" : ''}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1.5 text-[12px] text-rose-600">{error}</p>
            )}
        </div>
    );
}

export default function Enrollments({
    enrollments,
    sessions,
}: {
    enrollments: Enrollment[];
    sessions: SessionOption[];
}) {
    const [deleteTarget, setDeleteTarget] = useState<Enrollment | null>(null);
    const [statusFilter, setStatusFilter] = useState<Filter | null>(null);

    const counts = useMemo(
        () =>
            Object.fromEntries(
                FILTERS.map((filter) => [
                    filter.value,
                    enrollments.filter(filter.matches).length,
                ]),
            ) as Record<Filter, number>,
        [enrollments],
    );

    const activeFilter = FILTERS.find(
        (filter) => filter.value === statusFilter,
    );
    const visibleEnrollments = activeFilter
        ? enrollments.filter(activeFilter.matches)
        : enrollments;

    function updateStatus(enrollment: Enrollment, status: Status) {
        router.patch(
            `/admin/formation-enrollments/${enrollment.id}`,
            { status },
            { preserveScroll: true },
        );
    }

    function deleteEnrollment() {
        if (!deleteTarget) {
            return;
        }

        router.delete(`/admin/formation-enrollments/${deleteTarget.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
        });
    }

    const filterOptions = [
        { value: null, label: 'Toutes', count: enrollments.length },
        ...FILTERS.filter(
            (filter) =>
                counts[filter.value] > 0 || filter.value === statusFilter,
        ).map((filter) => ({
            value: filter.value,
            label: filter.label,
            count: counts[filter.value],
        })),
    ];

    return (
        <AdminLayout title="Demandes de formation">
            <Head title="Demandes de formation — Admin" />

            <AdminPageHeader
                title="Demandes d'inscription"
                description={`${counts.registered} inscrit${counts.registered > 1 ? 's' : ''} · ${counts.waitlist} en liste d'attente · ${counts.to_handle} demande${counts.to_handle > 1 ? 's' : ''} à traiter`}
                actions={
                    <Link
                        href="/admin/formations"
                        className={buttonVariants({ variant: 'outline' })}
                    >
                        Formations
                    </Link>
                }
            />

            <LayoutGroup id="enrollment-filter">
                <div className="mb-4 flex w-fit max-w-full gap-1 overflow-x-auto rounded-lg bg-slate-100 p-1">
                    {filterOptions.map((option) => {
                        const isActive = statusFilter === option.value;

                        return (
                            <button
                                key={option.label}
                                type="button"
                                onClick={() => setStatusFilter(option.value)}
                                className={cn(
                                    'relative shrink-0 rounded-md px-3 py-1.5 text-[13px] font-semibold transition-colors',
                                    isActive
                                        ? 'text-slate-900'
                                        : 'text-slate-500 hover:text-slate-800',
                                )}
                            >
                                {isActive && (
                                    <motion.span
                                        layoutId="enrollment-filter-active"
                                        className="absolute inset-0 rounded-md bg-white shadow-sm"
                                    />
                                )}
                                <span className="relative">
                                    {option.label}{' '}
                                    <span className="font-mono text-[11px] text-slate-400">
                                        {option.count}
                                    </span>
                                </span>
                            </button>
                        );
                    })}
                </div>
            </LayoutGroup>

            <AdminPanel>
                {visibleEnrollments.length === 0 ? (
                    <AdminEmptyState
                        message={
                            enrollments.length === 0
                                ? 'Aucune demande pour le moment.'
                                : 'Aucune demande avec ce statut.'
                        }
                    />
                ) : (
                    <ul className="divide-y divide-slate-100">
                        {visibleEnrollments.map((enrollment) => (
                            <li
                                key={enrollment.id}
                                className="flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-start lg:justify-between"
                            >
                                <div className="min-w-0">
                                    <p className="font-mono text-[11px] text-teal-700">
                                        {enrollment.formation.title}
                                    </p>
                                    <p className="mt-1 font-display text-[16px] font-semibold text-slate-900">
                                        {enrollment.name}
                                    </p>
                                    {enrollment.session && (
                                        <p className="mt-1 text-[12px] text-teal-700">
                                            {enrollment.session.title ||
                                                'Session en direct'}{' '}
                                            ·{' '}
                                            {new Date(
                                                enrollment.session.starts_at,
                                            ).toLocaleDateString('fr-FR')}
                                            {enrollment.attended_at && (
                                                <span className="ml-2 rounded-full bg-teal-50 px-2 py-0.5 font-mono text-[11px] text-teal-700">
                                                    Présent
                                                </span>
                                            )}
                                        </p>
                                    )}
                                    <p className="mt-0.5 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-slate-500">
                                        <a
                                            href={`mailto:${enrollment.email}`}
                                            className="hover:text-teal-700"
                                        >
                                            {enrollment.email}
                                        </a>
                                        {enrollment.phone && (
                                            <a
                                                href={`tel:${enrollment.phone.replace(/\s+/g, '')}`}
                                                className="hover:text-teal-700"
                                            >
                                                {enrollment.phone}
                                            </a>
                                        )}
                                    </p>
                                    {enrollment.message && (
                                        <p className="mt-3 max-w-2xl rounded-xl bg-slate-50 p-3.5 text-[14px] leading-relaxed whitespace-pre-wrap text-slate-700">
                                            {enrollment.message}
                                        </p>
                                    )}
                                    {!enrollment.session &&
                                        enrollment.status !== 'annulée' && (
                                            <AssignSession
                                                enrollment={enrollment}
                                                sessions={sessions}
                                            />
                                        )}
                                </div>

                                <div className="flex shrink-0 flex-wrap items-center gap-2">
                                    <div
                                        role="radiogroup"
                                        aria-label="Statut"
                                        className="flex gap-1 rounded-lg border border-slate-200 p-1"
                                    >
                                        {(enrollment.session
                                            ? SESSION_STATUSES
                                            : REQUEST_STATUSES
                                        ).map((status) => (
                                            <button
                                                key={status.value}
                                                type="button"
                                                role="radio"
                                                aria-checked={
                                                    enrollment.status ===
                                                    status.value
                                                }
                                                onClick={() =>
                                                    enrollment.status !==
                                                        status.value &&
                                                    updateStatus(
                                                        enrollment,
                                                        status.value,
                                                    )
                                                }
                                                className={cn(
                                                    'rounded-md px-2.5 py-1 text-[12px] font-semibold transition-colors',
                                                    enrollment.status ===
                                                        status.value
                                                        ? status.value ===
                                                          'inscrite'
                                                            ? 'bg-teal-600 text-white'
                                                            : 'bg-slate-900 text-white'
                                                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800',
                                                )}
                                            >
                                                {status.label}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setDeleteTarget(enrollment)
                                        }
                                        className={buttonVariants({
                                            variant: 'ghost',
                                            size: 'sm',
                                            className:
                                                'text-rose-600 hover:bg-rose-50 hover:text-rose-700',
                                        })}
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </AdminPanel>

            <DeleteModal
                open={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                onConfirm={deleteEnrollment}
                label={`Demande de ${deleteTarget?.name ?? ''}`}
            />
        </AdminLayout>
    );
}
