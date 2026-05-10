// resources/js/pages/Admin/Blog/Comments.tsx
import { Head, Link, router } from '@inertiajs/react';
import { motion }             from 'framer-motion';
import { useState }           from 'react';
import { DeleteModal }        from '@/components/admin/shared';
import AdminLayout            from '@/layouts/AdminLayout';
import { cn }                 from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Comment {
    id:          number;
    author_name: string | null;
    content:     string;
    ip_address:  string;
    created_at:  string;
}

interface Props {
    post:     { id: number; title: string; slug: string };
    comments: Comment[];
}

// ─── Icônes ───────────────────────────────────────────────────────────────────
const Ico = {
    Back: () => (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <path d="M9 2L4 7l5 5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    ),
    Trash: () => (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
            <path d="M2 3.5h10M5 3.5V2.5h4v1M5.5 6v4M8.5 6v4M3 3.5l.7 7.5a1 1 0 001 .9h4.6a1 1 0 001-.9l.7-7.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    ),
    Chat: () => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
            <path d="M3 3h14a1 1 0 011 1v9a1 1 0 01-1 1H6l-4 3V4a1 1 0 011-1z" strokeLinejoin="round"/>
        </svg>
    ),
    Eye: () => (
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
            <path d="M1 6.5C2.5 3.5 4.5 2 6.5 2s4 1.5 5.5 4.5C10.5 10 8.5 11 6.5 11S2.5 10 1 6.5z"/>
            <circle cx="6.5" cy="6.5" r="1.5"/>
        </svg>
    ),
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ postTitle }: { postTitle: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300">
                <Ico.Chat/>
            </div>
            <div className="text-center">
                <p className="text-[14px] font-semibold text-slate-700">Aucun commentaire</p>
                <p className="text-[12px] text-slate-400 mt-0.5 max-w-xs">
                    Personne n'a encore commenté « {postTitle} ».
                </p>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Comments({ post, comments }: Props) {
    const [deleteTarget, setDeleteTarget] = useState<Comment | null>(null);

    function confirmDelete() {
        if (!deleteTarget) return;
        router.delete(`/admin/blog-comments/${deleteTarget.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
        });
    }

    return (
        <AdminLayout
            title={`Commentaires — ${post.title}`}
            breadcrumb={[
                { label: 'Blog',        href: '/admin/blog' },
                { label: post.title,    href: `/admin/blog/${post.id}/edit` },
                { label: 'Commentaires' },
            ]}
        >
            <Head title={`Commentaires — ${post.title}`}/>

            {/* ── Header ────────────────────────────────────────────── */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link
                            href="/admin/blog"
                            className="inline-flex items-center gap-1.5 text-[12px] text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <Ico.Back/> Blog
                        </Link>
                    </div>
                    <h2 className="text-[20px] font-bold text-slate-900 tracking-tight">
                        Commentaires
                    </h2>
                    <p className="text-[13px] text-slate-500 mt-0.5 max-w-md truncate">
                        {post.title}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {comments.length > 0 && (
                        <span className="rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-[12px] font-semibold text-indigo-600">
                            {comments.length} commentaire{comments.length > 1 ? 's' : ''}
                        </span>
                    )}
                    <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className={cn(
                            'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl',
                            'border border-slate-200 bg-white text-slate-600 text-[13px] font-semibold',
                            'hover:border-slate-300 hover:bg-slate-50 transition-all duration-150',
                        )}
                    >
                        <Ico.Eye/> Voir l'article
                    </a>
                </div>
            </div>

            {/* ── Table ─────────────────────────────────────────────── */}
            <div className="bg-white border border-slate-200/70 rounded-2xl overflow-hidden">
                {comments.length === 0 ? (
                    <EmptyState postTitle={post.title}/>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/60">
                                    <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-[0.1em] px-5 py-3.5">
                                        Auteur
                                    </th>
                                    <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-[0.1em] px-4 py-3.5">
                                        Commentaire
                                    </th>
                                    <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-[0.1em] px-4 py-3.5 hidden lg:table-cell">
                                        IP
                                    </th>
                                    <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-[0.1em] px-4 py-3.5 hidden sm:table-cell">
                                        Date
                                    </th>
                                    <th className="px-4 py-3.5 w-[52px]"/>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100/70">
                                {comments.map((c, i) => (
                                    <motion.tr
                                        key={c.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="group hover:bg-slate-50/50 transition-colors duration-100"
                                    >
                                        {/* Auteur */}
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-2.5">
                                                <div className="h-8 w-8 shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-[12px] font-bold text-slate-500 uppercase">
                                                    {(c.author_name ?? 'A')[0]}
                                                </div>
                                                <span className="text-[13px] font-semibold text-slate-700 whitespace-nowrap">
                                                    {c.author_name ?? (
                                                        <span className="text-slate-400 font-normal italic">Anonyme</span>
                                                    )}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Contenu */}
                                        <td className="px-4 py-3.5 max-w-sm">
                                            <p className="text-[13px] text-slate-600 leading-relaxed line-clamp-2">
                                                {c.content}
                                            </p>
                                        </td>

                                        {/* IP */}
                                        <td className="px-4 py-3.5 hidden lg:table-cell">
                                            <span className="font-mono text-[11px] text-slate-400 bg-slate-50 border border-slate-100 rounded px-2 py-0.5">
                                                {c.ip_address}
                                            </span>
                                        </td>

                                        {/* Date */}
                                        <td className="px-4 py-3.5 hidden sm:table-cell">
                                            <span className="text-[12px] text-slate-400 whitespace-nowrap">
                                                {c.created_at}
                                            </span>
                                        </td>

                                        {/* Action */}
                                        <td className="px-4 py-3.5">
                                            <button
                                                onClick={() => setDeleteTarget(c)}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all duration-150 opacity-0 group-hover:opacity-100"
                                                title="Supprimer"
                                            >
                                                <Ico.Trash/>
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/40">
                            <p className="text-[11px] text-slate-400">
                                {comments.length} commentaire{comments.length > 1 ? 's' : ''} au total
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <DeleteModal
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
                label={`le commentaire de ${deleteTarget?.author_name ?? 'Anonyme'}`}
            />
        </AdminLayout>
    );
}
