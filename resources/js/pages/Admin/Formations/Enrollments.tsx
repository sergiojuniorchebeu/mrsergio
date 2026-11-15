// resources/js/pages/Admin/Formations/Enrollments.tsx
// Demandes d'inscription : filtre par statut, changement de statut en un clic.

import { Head, Link, router } from '@inertiajs/react';
import { LayoutGroup, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { AdminEmptyState, AdminPageHeader, AdminPanel, DeleteModal } from '@/components/admin/shared';
import { buttonVariants } from '@/components/ui/button';
import AdminLayout from '@/layouts/AdminLayout';
import { cn } from '@/lib/utils';

interface Enrollment {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    message: string | null;
    status: string;
    formation: { title: string };
}

const STATUSES = ['nouvelle', 'contactée', 'confirmée', 'archivée'] as const;

function statusLabel(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function Enrollments({ enrollments }: { enrollments: Enrollment[] }) {
    const [deleteTarget, setDeleteTarget] = useState<Enrollment | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>('nouvelle');

    const counts = useMemo(
        () => Object.fromEntries(STATUSES.map((status) => [status, enrollments.filter((enrollment) => enrollment.status === status).length])),
        [enrollments],
    );

    const visibleEnrollments = statusFilter ? enrollments.filter((enrollment) => enrollment.status === statusFilter) : enrollments;

    function updateStatus(enrollment: Enrollment, status: string) {
        router.patch(`/admin/formation-enrollments/${enrollment.id}`, { status }, { preserveScroll: true });
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

    const filterOptions = [{ value: null, label: 'Toutes', count: enrollments.length }, ...STATUSES.map((status) => ({ value: status, label: statusLabel(status), count: counts[status] }))];

    return (
        <AdminLayout title="Demandes de formation">
            <Head title="Demandes de formation — Admin" />

            <AdminPageHeader
                title="Demandes d'inscription"
                description={`${enrollments.length} demande${enrollments.length > 1 ? 's' : ''} · ${counts.nouvelle} à traiter`}
                actions={
                    <Link href="/admin/formations" className={buttonVariants({ variant: 'outline' })}>
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
                                    isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800',
                                )}
                            >
                                {isActive && <motion.span layoutId="enrollment-filter-active" className="absolute inset-0 rounded-md bg-white shadow-sm" />}
                                <span className="relative">
                                    {option.label} <span className="font-mono text-[11px] text-slate-400">{option.count}</span>
                                </span>
                            </button>
                        );
                    })}
                </div>
            </LayoutGroup>

            <AdminPanel>
                {visibleEnrollments.length === 0 ? (
                    <AdminEmptyState message={enrollments.length === 0 ? 'Aucune demande pour le moment.' : 'Aucune demande avec ce statut.'} />
                ) : (
                    <ul className="divide-y divide-slate-100">
                        {visibleEnrollments.map((enrollment) => (
                            <li key={enrollment.id} className="flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-start lg:justify-between">
                                <div className="min-w-0">
                                    <p className="font-mono text-[11px] text-teal-700">{enrollment.formation.title}</p>
                                    <p className="mt-1 font-display text-[16px] font-semibold text-slate-900">{enrollment.name}</p>
                                    <p className="mt-0.5 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-slate-500">
                                        <a href={`mailto:${enrollment.email}`} className="hover:text-teal-700">
                                            {enrollment.email}
                                        </a>
                                        {enrollment.phone && (
                                            <a href={`tel:${enrollment.phone.replace(/\s+/g, '')}`} className="hover:text-teal-700">
                                                {enrollment.phone}
                                            </a>
                                        )}
                                    </p>
                                    {enrollment.message && (
                                        <p className="mt-3 max-w-2xl rounded-xl bg-slate-50 p-3.5 text-[14px] leading-relaxed whitespace-pre-wrap text-slate-700">
                                            {enrollment.message}
                                        </p>
                                    )}
                                </div>

                                <div className="flex shrink-0 flex-wrap items-center gap-2">
                                    <div role="radiogroup" aria-label="Statut" className="flex gap-1 rounded-lg border border-slate-200 p-1">
                                        {STATUSES.map((status) => (
                                            <button
                                                key={status}
                                                type="button"
                                                role="radio"
                                                aria-checked={enrollment.status === status}
                                                onClick={() => enrollment.status !== status && updateStatus(enrollment, status)}
                                                className={cn(
                                                    'rounded-md px-2.5 py-1 text-[12px] font-semibold transition-colors',
                                                    enrollment.status === status
                                                        ? status === 'confirmée'
                                                            ? 'bg-teal-600 text-white'
                                                            : 'bg-slate-900 text-white'
                                                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800',
                                                )}
                                            >
                                                {statusLabel(status)}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setDeleteTarget(enrollment)}
                                        className={buttonVariants({
                                            variant: 'ghost',
                                            size: 'sm',
                                            className: 'text-rose-600 hover:bg-rose-50 hover:text-rose-700',
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
