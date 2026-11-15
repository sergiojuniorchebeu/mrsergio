// resources/js/pages/Admin/Formations/Index.tsx
// Liste des formations (admin) : recherche, publication en un clic, inscriptions, édition.

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
    currency?: string | null;
    featured: boolean;
    published: boolean;
    cover_image: string | null;
}

function levelLabel(level: string): string {
    return level ? level.charAt(0).toUpperCase() + level.slice(1) : '';
}

export default function FormationsIndex({ formations }: { formations: Formation[] }) {
    const [deleteTarget, setDeleteTarget] = useState<Formation | null>(null);
    const [search, setSearch] = useState('');

    const visibleFormations = useMemo(() => {
        const query = search.trim().toLowerCase();

        return query
            ? formations.filter((formation) =>
                  [formation.title, formation.slug, formation.category].some((field) => field?.toLowerCase().includes(query)),
              )
            : formations;
    }, [formations, search]);

    const publishedCount = formations.filter((formation) => formation.published).length;

    function confirmDelete() {
        if (!deleteTarget) {
            return;
        }

        router.delete(`/admin/formations/${deleteTarget.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
        });
    }

    return (
        <AdminLayout title="Formations">
            <Head title="Formations — Admin" />

            <AdminPageHeader
                title="Formations"
                description={`${formations.length} formation${formations.length > 1 ? 's' : ''} · ${publishedCount} publiée${publishedCount > 1 ? 's' : ''}`}
                actions={
                    <>
                        <Link href="/admin/formation-enrollments" className={buttonVariants({ variant: 'outline' })}>
                            Demandes d&apos;inscription
                        </Link>
                        <Link href="/admin/formations/create" className={buttonVariants()}>
                            Nouvelle formation
                        </Link>
                    </>
                }
            />

            {formations.length > 0 && (
                <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Rechercher une formation, une catégorie…"
                    className={cn(inputCls, 'mb-4 sm:max-w-xs')}
                />
            )}

            <AdminPanel>
                {visibleFormations.length === 0 ? (
                    <AdminEmptyState
                        message={formations.length === 0 ? "Aucune formation pour l'instant." : 'Aucune formation ne correspond.'}
                        action={
                            formations.length === 0 && (
                                <Link href="/admin/formations/create" className={buttonVariants({ variant: 'outline' })}>
                                    Créer la première formation
                                </Link>
                            )
                        }
                    />
                ) : (
                    <ul className="divide-y divide-slate-100">
                        {visibleFormations.map((formation) => (
                            <li key={formation.id} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-slate-50/70">
                                <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                                    {formation.cover_image && (
                                        <img src={`/storage/${formation.cover_image}`} alt="" className="h-full w-full object-cover" />
                                    )}
                                </div>

                                <Link href={`/admin/formations/${formation.id}/edit`} className="min-w-0 flex-1">
                                    <span className="flex items-center gap-2">
                                        <span className="truncate font-display text-[14px] font-semibold text-slate-900 hover:text-teal-700">
                                            {formation.title}
                                        </span>
                                        {formation.featured && (
                                            <span className="shrink-0 rounded bg-slate-900 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                                                Populaire
                                            </span>
                                        )}
                                    </span>
                                    <span className="mt-0.5 block truncate font-mono text-[11px] text-slate-400">
                                        {[
                                            formation.category,
                                            levelLabel(formation.level),
                                            formation.lessons_count ? `${formation.lessons_count} leçons` : null,
                                            formation.is_free
                                                ? 'Gratuit'
                                                : formation.price
                                                  ? `${Number(formation.price).toFixed(2)} ${formation.currency ?? '€'}`
                                                  : null,
                                        ]
                                            .filter(Boolean)
                                            .join(' · ')}
                                    </span>
                                </Link>

                                <div className="hidden sm:block">
                                    <PublishedBadge published={formation.published} />
                                </div>
                                <TogglePublished published={formation.published} route={`/admin/formations/${formation.id}/toggle`} />

                                <div className="flex shrink-0 items-center gap-1">
                                    <Link
                                        href={`/admin/formations/${formation.id}/edit`}
                                        className={buttonVariants({ variant: 'ghost', size: 'sm' })}
                                    >
                                        Modifier
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => setDeleteTarget(formation)}
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
