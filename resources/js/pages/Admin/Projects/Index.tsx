// resources/js/pages/Admin/Projects/Index.tsx
// Liste des projets (admin) : recherche, publication en un clic, édition, suppression.

import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    AdminEmptyState,
    AdminPageHeader,
    AdminPanel,
    DeleteModal,
    inputCls,
    PublishedBadge,
    TogglePublished,
} from '@/components/admin/shared';
import { buttonVariants } from '@/components/ui/button';
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

const TYPE_LABELS: Record<ProjectType, string> = { web: 'Web', mobile: 'Mobile', desktop: 'Desktop', api: 'API' };

export default function ProjectsIndex({ projects }: { projects: Project[] }) {
    const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
    const [search, setSearch] = useState('');

    const visibleProjects = useMemo(() => {
        const query = search.trim().toLowerCase();

        return query
            ? projects.filter((project) => [project.title, project.slug, ...(project.tags ?? [])].some((field) => field.toLowerCase().includes(query)))
            : projects;
    }, [projects, search]);

    const publishedCount = projects.filter((project) => project.published).length;

    function confirmDelete() {
        if (!deleteTarget) {
            return;
        }

        router.delete(`/admin/projects/${deleteTarget.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
        });
    }

    return (
        <AdminLayout title="Projets">
            <Head title="Projets — Admin" />

            <AdminPageHeader
                title="Projets"
                description={`${projects.length} projet${projects.length > 1 ? 's' : ''} · ${publishedCount} publié${publishedCount > 1 ? 's' : ''}`}
                actions={
                    <Link href="/admin/projects/create" className={buttonVariants()}>
                        Nouveau projet
                    </Link>
                }
            />

            {projects.length > 0 && (
                <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Rechercher un projet, un tag…"
                    className={cn(inputCls, 'mb-4 sm:max-w-xs')}
                />
            )}

            <AdminPanel>
                {visibleProjects.length === 0 ? (
                    <AdminEmptyState
                        message={projects.length === 0 ? "Aucun projet pour l'instant." : 'Aucun projet ne correspond.'}
                        action={
                            projects.length === 0 && (
                                <Link href="/admin/projects/create" className={buttonVariants({ variant: 'outline' })}>
                                    Créer le premier projet
                                </Link>
                            )
                        }
                    />
                ) : (
                    <ul className="divide-y divide-slate-100">
                        {visibleProjects.map((project) => (
                            <li key={project.id} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-slate-50/70">
                                <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                                    {project.image && (
                                        <img src={`/storage/${project.image}`} alt="" className="h-full w-full object-cover" />
                                    )}
                                </div>

                                <Link href={`/admin/projects/${project.id}/edit`} className="min-w-0 flex-1">
                                    <span className="flex items-center gap-2">
                                        <span className="truncate font-display text-[14px] font-semibold text-slate-900 hover:text-teal-700">
                                            {project.title}
                                        </span>
                                        {project.featured && (
                                            <span className="shrink-0 rounded bg-slate-900 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                                                À la une
                                            </span>
                                        )}
                                    </span>
                                    <span className="mt-0.5 block truncate font-mono text-[11px] text-slate-400">
                                        {TYPE_LABELS[project.project_type] ?? project.project_type}
                                        {project.tags?.length > 0 && ` · ${project.tags.slice(0, 3).join(', ')}`}
                                    </span>
                                </Link>

                                <div className="hidden sm:block">
                                    <PublishedBadge published={project.published} />
                                </div>
                                <TogglePublished published={project.published} route={`/admin/projects/${project.id}/toggle`} />

                                <div className="flex shrink-0 items-center gap-1">
                                    <Link
                                        href={`/admin/projects/${project.id}/edit`}
                                        className={buttonVariants({ variant: 'ghost', size: 'sm' })}
                                    >
                                        Modifier
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => setDeleteTarget(project)}
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
                onConfirm={confirmDelete}
                label={deleteTarget?.title ?? ''}
            />
        </AdminLayout>
    );
}
