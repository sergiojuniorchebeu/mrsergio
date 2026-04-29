import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { PublishedBadge, DeleteModal } from '@/components/admin/shared';
import AdminLayout from '@/layouts/AdminLayout';
import { cn } from '@/lib/utils';

type ProjectType = 'web' | 'mobile' | 'desktop' | 'api';

interface Project {
    id: number;
    title: string;
    slug: string;
    project_type: ProjectType;
    tags: string[];
    featured: boolean;
    published: boolean;
    image: string | null;
    created_at: string;
}

function TypeBadge({ type }: { type: ProjectType }) {
    const cls =
        type === 'mobile'
            ? 'bg-blue-50 text-blue-700 border-blue-100'
            : type === 'desktop'
              ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
              : type === 'api'
                ? 'bg-amber-50 text-amber-700 border-amber-100'
                : 'bg-emerald-50 text-emerald-700 border-emerald-100';

    const label =
        type === 'mobile'
            ? 'MOBILE'
            : type === 'desktop'
              ? 'DESKTOP'
              : type === 'api'
                ? 'API'
                : 'WEB';

    return (
        <span
            className={cn(
                'rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wide',
                cls,
            )}
        >
            {label}
        </span>
    );
}

export default function ProjectsIndex({ projects }: { projects: Project[] }) {
    const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

    function confirmDelete() {
        if (!deleteTarget) return;

        router.delete(`/admin/projects/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null),
        });
    }

    function togglePublished(project: Project) {
        router.patch(
            `/admin/projects/${project.id}`,
            { published: !project.published },
            { preserveScroll: true },
        );
    }

    return (
        <AdminLayout title="Projets">
            <Head title="Projets — Admin" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="font-display text-xl font-bold text-slate-800">
                        Projets
                    </h2>
                    <p className="mt-0.5 text-sm text-slate-500">
                        {projects.length} projet{projects.length > 1 ? 's' : ''}{' '}
                        au total
                    </p>
                </div>

                <Link
                    href="/admin/projects/create"
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
                    Nouveau projet
                </Link>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                {projects.length === 0 ? (
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
                                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                                />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-slate-500">
                            Aucun projet pour l'instant
                        </p>
                        <Link
                            href="/admin/projects/create"
                            className="mt-3 text-sm font-semibold text-teal-600 hover:underline"
                        >
                            Créer le premier
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/70">
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                        Projet
                                    </th>
                                    <th className="hidden px-4 py-3.5 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase sm:table-cell">
                                        Tags
                                    </th>
                                    <th className="px-4 py-3.5 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                        Statut
                                    </th>
                                    <th className="hidden px-4 py-3.5 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase md:table-cell">
                                        Featured
                                    </th>
                                    <th className="px-4 py-3.5" />
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {projects.map((project, i) => (
                                    <motion.tr
                                        key={project.id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        className="transition-colors hover:bg-slate-50/60"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                                                    {project.image ? (
                                                        <img
                                                            src={`/storage/${project.image}`}
                                                            alt={project.title}
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

                                                <div>
                                                    <p className="text-sm leading-snug font-semibold text-slate-800">
                                                        {project.title}
                                                    </p>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        <p className="text-xs text-slate-400">
                                                            /{project.slug}
                                                        </p>
                                                        <TypeBadge
                                                            type={
                                                                project.project_type
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="hidden px-4 py-4 sm:table-cell">
                                            <div className="flex flex-wrap gap-1">
                                                {(project.tags ?? [])
                                                    .slice(0, 3)
                                                    .map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                            </div>
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        togglePublished(project)
                                                    }
                                                    className={cn(
                                                        'relative h-5 w-10 rounded-full transition-colors duration-200',
                                                        project.published
                                                            ? 'bg-teal-500'
                                                            : 'bg-slate-300',
                                                    )}
                                                >
                                                    <span
                                                        className={cn(
                                                            'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
                                                            project.published
                                                                ? 'translate-x-5'
                                                                : 'translate-x-0.5',
                                                        )}
                                                    />
                                                </button>
                                                <PublishedBadge
                                                    published={
                                                        project.published
                                                    }
                                                />
                                            </div>
                                        </td>

                                        <td className="hidden px-4 py-4 md:table-cell">
                                            {project.featured ? (
                                                <span className="rounded-full border border-amber-100 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                                    Mis en avant
                                                </span>
                                            ) : (
                                                <span className="text-xs text-slate-400">
                                                    —
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Link
                                                    href={`/admin/projects/${project.id}/edit`}
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
                                                        setDeleteTarget(project)
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
