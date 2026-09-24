import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { DeleteModal } from '@/components/admin/shared';
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

const statuses = ['nouvelle', 'contactée', 'confirmée', 'archivée'];

export default function Enrollments({
    enrollments,
}: {
    enrollments: Enrollment[];
}) {
    const [deleteTarget, setDeleteTarget] = useState<Enrollment | null>(null);

    function updateStatus(enrollment: Enrollment, status: string) {
        router.patch(
            `/admin/formation-enrollments/${enrollment.id}`,
            { status },
            { preserveScroll: true },
        );
    }

    function deleteEnrollment() {
        if (!deleteTarget) return;
        router.delete(`/admin/formation-enrollments/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null),
        });
    }

    return (
        <AdminLayout title="Demandes de formation">
            <Head title="Demandes de formation — Admin" />
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="font-display text-xl font-bold text-slate-800">
                        Demandes de formation
                    </h2>
                    <p className="mt-0.5 text-sm text-slate-500">
                        {enrollments.length} demande
                        {enrollments.length > 1 ? 's' : ''} reçue
                        {enrollments.length > 1 ? 's' : ''}
                    </p>
                </div>
                <Link
                    href="/admin/formations"
                    className="text-sm font-semibold text-teal-600 hover:text-teal-700"
                >
                    Retour aux formations
                </Link>
            </div>
            <div className="space-y-3">
                {enrollments.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200/80 bg-white py-16 text-center shadow-sm">
                        <p className="text-sm font-medium text-slate-500">
                            Aucune demande pour le moment.
                        </p>
                    </div>
                ) : (
                    enrollments.map((enrollment) => (
                        <div
                            key={enrollment.id}
                            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
                        >
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold tracking-[0.14em] text-teal-600 uppercase">
                                        {enrollment.formation.title}
                                    </p>
                                    <h3 className="mt-1 font-display text-lg font-bold text-slate-800">
                                        {enrollment.name}
                                    </h3>
                                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                                        <a
                                            href={'mailto:' + enrollment.email}
                                            className="hover:text-teal-600"
                                        >
                                            {enrollment.email}
                                        </a>
                                        {enrollment.phone && (
                                            <span>{enrollment.phone}</span>
                                        )}
                                    </div>
                                    {enrollment.message && (
                                        <p className="mt-4 max-w-2xl text-sm leading-relaxed whitespace-pre-wrap text-slate-600">
                                            {enrollment.message}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <select
                                        value={enrollment.status}
                                        onChange={(event) =>
                                            updateStatus(
                                                enrollment,
                                                event.target.value,
                                            )
                                        }
                                        className={cn(
                                            'rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 outline-none focus:border-teal-500',
                                            enrollment.status === 'confirmée' &&
                                                'border-teal-200 bg-teal-50 text-teal-700',
                                        )}
                                    >
                                        {statuses.map((status) => (
                                            <option key={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={() =>
                                            setDeleteTarget(enrollment)
                                        }
                                        className="rounded-md px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <DeleteModal
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={deleteEnrollment}
                label={`la demande de ${deleteTarget?.name ?? ''}`}
            />
        </AdminLayout>
    );
}
