// resources/js/Pages/Admin/Formations/Index.tsx
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { PublishedBadge, DeleteModal } from '@/components/admin/shared';
import AdminLayout from '@/layouts/AdminLayout';
import { cn } from '@/lib/utils';

interface Formation {
    id: number;
    title: string;
    slug: string;
    category: string;
    level: string;
    duration_hours: number;
    lessons_count: number;
    is_free: boolean;
    price: number | null;
    featured: boolean;
    published: boolean;
    cover_image: string | null;
}

const levelColors: Record<string, string> = {
    débutant: 'bg-green-50 text-green-700 border-green-100',
    intermédiaire: 'bg-amber-50 text-amber-700 border-amber-100',
    avancé: 'bg-red-50  text-red-700  border-red-100',
};

export default function FormationsIndex({
    formations,
}: {
    formations: Formation[];
}) {
    const [deleteTarget, setDeleteTarget] = useState<Formation | null>(null);

    function confirmDelete() {
        if (!deleteTarget) return;
        router.delete(`/admin/formations/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null),
        });
    }

    function togglePublished(f: Formation) {
        router.patch(
            `/admin/formations/${f.id}`,
            { published: !f.published },
            { preserveScroll: true },
        );
    }

    return (
        <AdminLayout title="Formations">
            <Head title="Formations — Admin" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="font-display text-xl font-bold text-slate-800">
                        Formations
                    </h2>
                    <p className="mt-0.5 text-sm text-slate-500">
                        {formations.length} formation
                        {formations.length > 1 ? 's' : ''} au total
                    </p>
                </div>
                <Link
                    href="/admin/formations/create"
                    className="inline-flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-teal-500/20 transition-colors hover:bg-teal-700"
                >
                    <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    Nouvelle formation
                </Link>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                {formations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-slate-500">
                            Aucune formation pour l'instant
                        </p>
                        <Link
                            href="/admin/formations/create"
                            className="mt-3 text-sm font-semibold text-teal-600 hover:underline"
                        >
                            Créer la première
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/70">
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                        Formation
                                    </th>
                                    <th className="hidden px-4 py-3.5 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase sm:table-cell">
                                        Catégorie / Niveau
                                    </th>
                                    <th className="hidden px-4 py-3.5 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase md:table-cell">
                                        Durée
                                    </th>
                                    <th className="hidden px-4 py-3.5 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase lg:table-cell">
                                        Prix
                                    </th>
                                    <th className="px-4 py-3.5 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                        Statut
                                    </th>
                                    <th className="px-4 py-3.5" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {formations.map((f, i) => (
                                    <motion.tr
                                        key={f.id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        className="transition-colors hover:bg-slate-50/60"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                                                    {f.cover_image ? (
                                                        <img
                                                            src={`/storage/${f.cover_image}`}
                                                            alt={f.title}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                                                            <svg
                                                                className="h-4 w-4"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        1.5
                                                                    }
                                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-sm leading-snug font-semibold text-slate-800">
                                                    {f.title}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="hidden px-4 py-4 sm:table-cell">
                                            <div className="flex flex-col gap-1">
                                                <span className="w-fit rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                                                    {f.category}
                                                </span>
                                                <span
                                                    className={cn(
                                                        'w-fit rounded-full border px-2 py-0.5 text-xs font-medium',
                                                        levelColors[f.level] ??
                                                            'bg-slate-100 text-slate-600',
                                                    )}
                                                >
                                                    {f.level}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="hidden px-4 py-4 md:table-cell">
                                            <span className="text-xs text-slate-600">
                                                {f.duration_hours}h ·{' '}
                                                {f.lessons_count} leçons
                                            </span>
                                        </td>
                                        <td className="hidden px-4 py-4 lg:table-cell">
                                            {f.is_free ? (
                                                <span className="text-xs font-bold text-teal-600">
                                                    Gratuit
                                                </span>
                                            ) : (
                                                <span className="text-xs font-semibold text-slate-700">
                                                    {f.price
                                                        ? Number(
                                                              f.price,
                                                          ).toFixed(2)
                                                        : '—'}{' '}
                                                    €
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        togglePublished(f)
                                                    }
                                                    className={cn(
                                                        'relative h-5 w-10 rounded-full transition-colors duration-200',
                                                        f.published
                                                            ? 'bg-teal-500'
                                                            : 'bg-slate-300',
                                                    )}
                                                >
                                                    <span
                                                        className={cn(
                                                            'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
                                                            f.published
                                                                ? 'translate-x-5'
                                                                : 'translate-x-0.5',
                                                        )}
                                                    />
                                                </button>
                                                <PublishedBadge
                                                    published={f.published}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Link
                                                    href={`/admin/formations/${f.id}/edit`}
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-teal-50 hover:text-teal-600"
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
                                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                        />
                                                    </svg>
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        setDeleteTarget(f)
                                                    }
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-red-50 hover:text-red-500"
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
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <DeleteModal
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
                label={deleteTarget?.title ?? ''}
            />
        </AdminLayout>
    );
}
