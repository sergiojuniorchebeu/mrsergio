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
    TogglePublished,
} from '@/components/admin/shared';
import { SessionDate } from '@/components/portofolio/session-list';
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
    upcoming_sessions_count: number;
    pending_enrollments_count: number;
    next_session: {
        starts_at: string;
        date_label: string;
        time_label: string;
        published: boolean;
    } | null;
}

function levelLabel(level: string): string {
    return level ? level.charAt(0).toUpperCase() + level.slice(1) : '';
}

export default function FormationsIndex({
    formations,
}: {
    formations: Formation[];
}) {
    const [deleteTarget, setDeleteTarget] = useState<Formation | null>(null);
    const [search, setSearch] = useState('');

    const visibleFormations = useMemo(() => {
        const query = search.trim().toLowerCase();

        return query
            ? formations.filter((formation) =>
                  [formation.title, formation.slug, formation.category].some(
                      (field) => field?.toLowerCase().includes(query),
                  ),
              )
            : formations;
    }, [formations, search]);

    const publishedCount = formations.filter(
        (formation) => formation.published,
    ).length;

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
                        <Link
                            href="/admin/formation-enrollments"
                            className={buttonVariants({ variant: 'outline' })}
                        >
                            Inscriptions
                        </Link>
                        <Link
                            href="/admin/formations/create"
                            className={buttonVariants()}
                        >
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
                        message={
                            formations.length === 0
                                ? "Aucune formation pour l'instant."
                                : 'Aucune formation ne correspond.'
                        }
                        action={
                            formations.length === 0 && (
                                <Link
                                    href="/admin/formations/create"
                                    className={buttonVariants({
                                        variant: 'outline',
                                    })}
                                >
                                    Créer la première formation
                                </Link>
                            )
                        }
                    />
                ) : (
                    <ul className="divide-y divide-slate-100">
                        {visibleFormations.map((formation) => (
                            <li
                                key={formation.id}
                                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 px-5 py-4 transition-colors hover:bg-slate-50/70 lg:grid-cols-[auto_minmax(0,1fr)_220px_auto]"
                            >
                                <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                                    {formation.cover_image && (
                                        <img
                                            src={`/storage/${formation.cover_image}`}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    )}
                                </div>

                                <Link
                                    href={`/admin/formations/${formation.id}/edit`}
                                    className="min-w-0"
                                >
                                    <span className="flex items-center gap-2">
                                        <span className="truncate font-display text-[15px] font-semibold text-slate-900 hover:text-teal-700">
                                            {formation.title}
                                        </span>
                                        <span
                                            className={cn(
                                                'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold',
                                                formation.is_free
                                                    ? 'bg-teal-50 text-teal-700'
                                                    : 'bg-slate-100 text-slate-600',
                                            )}
                                        >
                                            {formation.is_free
                                                ? 'Gratuite'
                                                : formation.price
                                                  ? `${Number(formation.price).toFixed(2)} ${formation.currency ?? '€'}`
                                                  : 'Payante'}
                                        </span>
                                        {formation.featured && (
                                            <span className="hidden shrink-0 rounded-full bg-slate-900 px-2 py-0.5 text-[11px] font-semibold text-white sm:inline">
                                                Populaire
                                            </span>
                                        )}
                                    </span>
                                    <span className="mt-1 block truncate font-mono text-[11px] text-slate-400">
                                        {[
                                            formation.category,
                                            levelLabel(formation.level),
                                            formation.lessons_count
                                                ? `${formation.lessons_count} leçons`
                                                : null,
                                            formation.published
                                                ? 'Publiée'
                                                : 'Brouillon',
                                        ]
                                            .filter(Boolean)
                                            .join(' · ')}
                                    </span>
                                </Link>

                                <div className="col-span-3 flex items-center gap-3 lg:col-span-1">
                                    {formation.next_session ? (
                                        <Link
                                            href={`/admin/formations/${formation.id}/sessions`}
                                            className="flex items-center gap-3"
                                        >
                                            <SessionDate
                                                startsAt={
                                                    formation.next_session
                                                        .starts_at
                                                }
                                                isMuted={
                                                    !formation.next_session
                                                        .published
                                                }
                                            />
                                            <span className="text-[13px] leading-snug">
                                                <span className="block font-medium text-slate-800">
                                                    {
                                                        formation.next_session
                                                            .time_label
                                                    }
                                                </span>
                                                <span className="block text-slate-500">
                                                    {formation.upcoming_sessions_count >
                                                    1
                                                        ? `+ ${formation.upcoming_sessions_count - 1} autre${formation.upcoming_sessions_count > 2 ? 's' : ''} à venir`
                                                        : 'Prochaine session'}
                                                </span>
                                                {formation.pending_enrollments_count >
                                                    0 && (
                                                    <span className="mt-0.5 block font-semibold text-teal-700">
                                                        {
                                                            formation.pending_enrollments_count
                                                        }{' '}
                                                        à traiter
                                                    </span>
                                                )}
                                            </span>
                                        </Link>
                                    ) : (
                                        <Link
                                            href={`/admin/formations/${formation.id}/sessions`}
                                            className="flex w-full items-center gap-3 rounded-xl border border-dashed border-slate-300 px-3 py-2.5 text-[13px] text-slate-500 transition-colors hover:border-teal-400 hover:text-teal-700"
                                        >
                                            Aucune session prévue ·{' '}
                                            <span className="font-semibold">
                                                Planifier
                                            </span>
                                        </Link>
                                    )}
                                </div>

                                <div className="col-start-3 row-start-1 flex shrink-0 items-center gap-1 lg:col-start-4">
                                    <TogglePublished
                                        published={formation.published}
                                        route={`/admin/formations/${formation.id}/toggle`}
                                    />
                                    <Link
                                        href={`/admin/formations/${formation.id}/sessions`}
                                        className={buttonVariants({
                                            variant: 'ghost',
                                            size: 'sm',
                                            className:
                                                'ml-2 hidden sm:inline-flex',
                                        })}
                                    >
                                        Sessions
                                    </Link>
                                    <Link
                                        href={`/admin/formations/${formation.id}/edit`}
                                        className={buttonVariants({
                                            variant: 'ghost',
                                            size: 'sm',
                                            className: 'hidden sm:inline-flex',
                                        })}
                                    >
                                        Modifier
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setDeleteTarget(formation)
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
                onConfirm={confirmDelete}
                label={deleteTarget?.title ?? ''}
            />
        </AdminLayout>
    );
}
