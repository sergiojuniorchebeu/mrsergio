// resources/js/Pages/Admin/Blog/Index.tsx
import { Head, Link, router } from '@inertiajs/react';
import { motion }             from 'framer-motion';
import { useState }           from 'react';
import { PublishedBadge, DeleteModal } from '@/components/admin/shared';
import AdminLayout            from '@/layouts/AdminLayout';
import { cn }                 from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Post {
    id:           number;
    title:        string;
    slug:         string;
    excerpt:      string;
    tags:         string[];
    featured:     boolean;
    published:    boolean;
    cover_image:  string | null;
    published_at: string | null;
    created_at:   string;
}

// ─── Icônes inline ────────────────────────────────────────────────────────────
const Ico = {
    Plus: () => (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <path d="M7 2v10M2 7h10" strokeLinecap="round"/>
        </svg>
    ),
    Edit: () => (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
            <path d="M9.5 2.5l2 2L5 11H3v-2l6.5-6.5z" strokeLinejoin="round"/>
        </svg>
    ),
    Trash: () => (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
            <path d="M2 3.5h10M5 3.5V2.5h4v1M5.5 6v4M8.5 6v4M3 3.5l.7 7.5a1 1 0 001 .9h4.6a1 1 0 001-.9l.7-7.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    ),
    Image: () => (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
            <rect x="1.5" y="2.5" width="11" height="9" rx="1.5"/>
            <path d="M1.5 9l3-3 2.5 2.5 2-2 3 3.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="9.5" cy="5.5" r="1"/>
        </svg>
    ),
    Doc: () => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
            <rect x="3" y="2" width="14" height="16" rx="2.5"/>
            <path d="M6.5 7h7M6.5 10h7M6.5 13h5" strokeLinecap="round"/>
        </svg>
    ),
    Star: () => (
        <svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor" aria-hidden>
            <path d="M5.5 1l1.26 2.55 2.82.41-2.04 1.99.48 2.8L5.5 7.47 2.98 8.75l.48-2.8L1.42 3.96l2.82-.41z"/>
        </svg>
    ),
}

// ─── Toggle switch ────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
    return (
        <button
            type="button"
            onClick={onChange}
            aria-label={checked ? 'Dépublier' : 'Publier'}
            className={cn(
                'relative w-9 h-5 rounded-full transition-colors duration-200 flex-shrink-0',
                checked ? 'bg-teal-500' : 'bg-slate-200',
            )}
        >
            <span className={cn(
                'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm',
                'transition-transform duration-200',
                checked ? 'translate-x-4' : 'translate-x-0.5',
            )}/>
        </button>
    );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                <Ico.Doc/>
            </div>
            <div className="text-center">
                <p className="text-[14px] font-semibold text-slate-700">Aucun article</p>
                <p className="text-[12px] text-slate-400 mt-0.5">Rédigez votre premier article de blog.</p>
            </div>
            <Link
                href="/admin/blog/create"
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-teal-600 hover:text-teal-700 transition-colors"
            >
                <Ico.Plus/> Créer un article
            </Link>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BlogIndex({ posts }: { posts: Post[] }) {
    const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);

    function confirmDelete() {
        if (!deleteTarget) return;
        router.delete(`/admin/blog/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null),
        });
    }

    function togglePublished(p: Post) {
        router.patch(`/admin/blog/${p.id}`, { published: !p.published }, { preserveScroll: true });
    }

    const pub    = posts.filter(p => p.published).length;
    const draft  = posts.length - pub;

    return (
        <AdminLayout title="Blog" breadcrumb={[{ label: 'Blog' }]}>
            <Head title="Blog — Admin"/>

            {/* ── Header ────────────────────────────────────────────── */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-[20px] font-bold text-slate-900 tracking-tight">Articles</h2>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="text-[12px] text-slate-500">
                            {posts.length} au total
                        </span>
                        {pub > 0 && (
                            <>
                                <span className="w-px h-3 bg-slate-200"/>
                                <span className="text-[12px] text-teal-600 font-medium">{pub} publiés</span>
                            </>
                        )}
                        {draft > 0 && (
                            <>
                                <span className="w-px h-3 bg-slate-200"/>
                                <span className="text-[12px] text-slate-400">{draft} brouillons</span>
                            </>
                        )}
                    </div>
                </div>

                <Link
                    href="/admin/blog/create"
                    className={cn(
                        'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl',
                        'bg-teal-600 text-white text-[13px] font-semibold',
                        'shadow-[0_1px_3px_rgba(29,158,117,0.3)]',
                        'hover:bg-teal-700 hover:shadow-[0_4px_12px_rgba(29,158,117,0.35)]',
                        'transition-all duration-200',
                    )}
                >
                    <Ico.Plus/> Nouvel article
                </Link>
            </div>

            {/* ── Table ─────────────────────────────────────────────── */}
            <div className="bg-white border border-slate-200/70 rounded-2xl overflow-hidden">
                {posts.length === 0 ? (
                    <EmptyState/>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            {/* Head */}
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/60">
                                    <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-[0.1em] px-5 py-3.5">
                                        Article
                                    </th>
                                    <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-[0.1em] px-4 py-3.5 hidden sm:table-cell">
                                        Tags
                                    </th>
                                    <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-[0.1em] px-4 py-3.5">
                                        Statut
                                    </th>
                                    <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-[0.1em] px-4 py-3.5 hidden md:table-cell">
                                        Date
                                    </th>
                                    <th className="px-4 py-3.5 w-[90px]"/>
                                </tr>
                            </thead>

                            {/* Body */}
                            <tbody className="divide-y divide-slate-100/70">
                                {posts.map((p, i) => (
                                    <motion.tr
                                        key={p.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.035 }}
                                        className="group hover:bg-slate-50/50 transition-colors duration-100"
                                    >
                                        {/* Article */}
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                {/* Thumbnail */}
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200/50">
                                                    {p.cover_image ? (
                                                        <img
                                                            src={`/storage/${p.cover_image}`}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                            <Ico.Image/>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-1.5">
                                                        <p className="text-[13px] font-semibold text-slate-800 truncate leading-snug">
                                                            {p.title}
                                                        </p>
                                                        {p.featured && (
                                                            <span className="text-amber-500 flex-shrink-0" title="Mis en avant">
                                                                <Ico.Star/>
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] text-slate-400 truncate mt-0.5 max-w-[260px]">
                                                        {p.excerpt}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Tags */}
                                        <td className="px-4 py-3.5 hidden sm:table-cell">
                                            <div className="flex flex-wrap gap-1">
                                                {(p.tags ?? []).slice(0, 3).map(tag => (
                                                    <span
                                                        key={tag}
                                                        className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                                {(p.tags ?? []).length > 3 && (
                                                    <span className="text-[10px] text-slate-400">+{p.tags.length - 3}</span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Statut toggle */}
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-2">
                                                <Toggle
                                                    checked={p.published}
                                                    onChange={() => togglePublished(p)}
                                                />
                                                <PublishedBadge published={p.published}/>
                                            </div>
                                        </td>

                                        {/* Date */}
                                        <td className="px-4 py-3.5 hidden md:table-cell">
                                            <span className="text-[12px] text-slate-400">
                                                {p.published_at
                                                    ? new Date(p.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
                                                    : <span className="text-slate-300">—</span>
                                                }
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                                <Link
                                                    href={`/admin/blog/${p.id}/edit`}
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-all duration-150"
                                                    title="Modifier"
                                                >
                                                    <Ico.Edit/>
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteTarget(p)}
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150"
                                                    title="Supprimer"
                                                >
                                                    <Ico.Trash/>
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Footer table */}
                        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/40">
                            <p className="text-[11px] text-slate-400">
                                {posts.length} article{posts.length > 1 ? 's' : ''} — {pub} publié{pub > 1 ? 's' : ''}
                            </p>
                        </div>
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