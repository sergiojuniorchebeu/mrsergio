// resources/js/Pages/Admin/Projects/Index.tsx
import { Head, Link, router } from '@inertiajs/react';
import { motion }             from 'framer-motion';
import { useState }           from 'react';
import { PublishedBadge, DeleteModal } from '@/components/admin/shared';
import AdminLayout            from '@/layouts/AdminLayout';
import { cn }                 from '@/lib/utils';

interface Project {
    id:          number;
    title:       string;
    slug:        string;
    tags:        string[];
    featured:    boolean;
    published:   boolean;
    image:       string | null;
    created_at:  string;
}

export default function ProjectsIndex({ projects }: { projects: Project[] }) {
    const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

    function confirmDelete() {
        if (!deleteTarget) return;
        router.delete(`/admin/projects/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null),
        });
    }

    function togglePublished(p: Project) {
        router.patch(`/admin/projects/${p.id}`, { published: !p.published }, {
            preserveScroll: true,
        });
    }

    return (
        <AdminLayout title="Projets">
            <Head title="Projets — Admin" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-display font-bold text-slate-800">Projets</h2>
                    <p className="text-sm text-slate-500 mt-0.5">{projects.length} projet{projects.length > 1 ? 's' : ''} au total</p>
                </div>
                <Link
                    href="/admin/projects/create"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm shadow-teal-500/20"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Nouveau projet
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                {projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-slate-500">Aucun projet pour l'instant</p>
                        <Link href="/admin/projects/create" className="mt-3 text-sm text-teal-600 font-semibold hover:underline">
                            Créer le premier
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/70">
                                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3.5">Projet</th>
                                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3.5 hidden sm:table-cell">Tags</th>
                                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3.5">Statut</th>
                                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3.5 hidden md:table-cell">Featured</th>
                                    <th className="px-4 py-3.5" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {projects.map((p, i) => (
                                    <motion.tr
                                        key={p.id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        className="hover:bg-slate-50/60 transition-colors"
                                    >
                                        {/* Titre + image */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden">
                                                    {p.image ? (
                                                        <img src={`/storage/${p.image}`} alt={p.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                                </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800 leading-snug">{p.title}</p>
                                                    <p className="text-xs text-slate-400 mt-0.5">/{p.slug}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Tags */}
                                        <td className="px-4 py-4 hidden sm:table-cell">
                                            <div className="flex flex-wrap gap-1">
                                                {(p.tags ?? []).slice(0, 3).map(tag => (
                                                    <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>

                                        {/* Toggle publié */}
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => togglePublished(p)}
                                                    className={cn(
                                                        'relative w-10 h-5 rounded-full transition-colors duration-200',
                                                        p.published ? 'bg-teal-500' : 'bg-slate-300',
                                                    )}
                                                >
                                                    <span className={cn(
                                                        'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200',
                                                        p.published ? 'translate-x-5' : 'translate-x-0.5',
                                                    )} />
                                                </button>
                                                <PublishedBadge published={p.published} />
                                            </div>
                                        </td>

                                        {/* Featured */}
                                        <td className="px-4 py-4 hidden md:table-cell">
                                            {p.featured ? (
                                                <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
                                                    Mis en avant
                                                </span>
                                            ) : (
                                                <span className="text-xs text-slate-400">—</span>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-1.5 justify-end">
                                                <Link
                                                    href={`/admin/projects/${p.id}/edit`}
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-all"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteTarget(p)}
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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