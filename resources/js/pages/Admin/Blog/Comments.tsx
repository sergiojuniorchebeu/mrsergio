// resources/js/pages/Admin/Blog/Comments.tsx
// Commentaires d'un article : lecture et suppression.

import { Head, Link, router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { AdminEmptyState, AdminPageHeader, AdminPanel, DeleteModal } from '@/components/admin/shared';
import { buttonVariants } from '@/components/ui/button';
import AdminLayout from '@/layouts/AdminLayout';

interface Comment {
    id: number;
    author_name: string | null;
    content: string;
    ip_address: string;
    created_at: string;
}

interface Props {
    post: { id: number; title: string; slug: string };
    comments: Comment[];
}

const DATE_FORMAT = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function Comments({ post, comments }: Props) {
    const [deleteTarget, setDeleteTarget] = useState<Comment | null>(null);

    function confirmDelete() {
        if (!deleteTarget) {
            return;
        }

        router.delete(`/admin/blog-comments/${deleteTarget.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
        });
    }

    return (
        <AdminLayout
            title={`Commentaires — ${post.title}`}
            breadcrumb={[{ label: 'Blog', href: '/admin/blog' }, { label: post.title }, { label: 'Commentaires' }]}
        >
            <Head title={`Commentaires — ${post.title}`} />

            <AdminPageHeader
                title="Commentaires"
                description={
                    <>
                        {comments.length} commentaire{comments.length > 1 ? 's' : ''} sur « {post.title} »
                    </>
                }
                actions={
                    <>
                        <Link href="/admin/blog" className={buttonVariants({ variant: 'outline' })}>
                            Articles
                        </Link>
                        <a href={`/blog/${post.slug}#commentaires`} target="_blank" rel="noreferrer" className={buttonVariants({ variant: 'outline' })}>
                            Voir sur le site
                        </a>
                    </>
                }
            />

            <AdminPanel>
                {comments.length === 0 ? (
                    <AdminEmptyState message={`Personne n'a encore commenté « ${post.title} ».`} />
                ) : (
                    <ul className="divide-y divide-slate-100">
                        <AnimatePresence initial={false}>
                            {comments.map((comment) => (
                                <motion.li
                                    key={comment.id}
                                    layout
                                    exit={{ opacity: 0, x: -16 }}
                                    className="flex gap-4 px-5 py-4"
                                >
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 font-display text-[12px] font-bold text-white uppercase">
                                        {(comment.author_name ?? 'A').charAt(0)}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                                            <span className="font-display text-[14px] font-semibold text-slate-900">
                                                {comment.author_name ?? 'Anonyme'}
                                            </span>
                                            <span className="font-mono text-[11px] text-slate-400">
                                                {DATE_FORMAT.format(new Date(comment.created_at))} · {comment.ip_address}
                                            </span>
                                        </p>
                                        <p className="mt-1.5 text-[14px] leading-relaxed whitespace-pre-wrap text-slate-700">{comment.content}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setDeleteTarget(comment)}
                                        className={buttonVariants({
                                            variant: 'ghost',
                                            size: 'sm',
                                            className: 'shrink-0 text-rose-600 hover:bg-rose-50 hover:text-rose-700',
                                        })}
                                    >
                                        Supprimer
                                    </button>
                                </motion.li>
                            ))}
                        </AnimatePresence>
                    </ul>
                )}
            </AdminPanel>

            <DeleteModal
                open={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
                label={`Commentaire de ${deleteTarget?.author_name ?? 'Anonyme'}`}
            />
        </AdminLayout>
    );
}
