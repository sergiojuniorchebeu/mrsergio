// resources/js/pages/Admin/Blog/Index.tsx
// Liste des articles (admin) : recherche, publication en un clic, commentaires, édition.

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

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    tags: string[];
    featured: boolean;
    published: boolean;
    cover_image: string | null;
    published_at: string | null;
    created_at: string;
    comments_count: number;
}

export default function BlogIndex({ posts }: { posts: Post[] }) {
    const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
    const [search, setSearch] = useState('');

    const visiblePosts = useMemo(() => {
        const query = search.trim().toLowerCase();

        return query
            ? posts.filter((post) => [post.title, post.slug, ...(post.tags ?? [])].some((field) => field.toLowerCase().includes(query)))
            : posts;
    }, [posts, search]);

    const publishedCount = posts.filter((post) => post.published).length;

    function confirmDelete() {
        if (!deleteTarget) {
            return;
        }

        router.delete(`/admin/blog/${deleteTarget.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
        });
    }

    return (
        <AdminLayout title="Blog">
            <Head title="Blog — Admin" />

            <AdminPageHeader
                title="Articles"
                description={`${posts.length} article${posts.length > 1 ? 's' : ''} · ${publishedCount} publié${publishedCount > 1 ? 's' : ''}`}
                actions={
                    <Link href="/admin/blog/create" className={buttonVariants()}>
                        Nouvel article
                    </Link>
                }
            />

            {posts.length > 0 && (
                <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Rechercher un article, un tag…"
                    className={cn(inputCls, 'mb-4 sm:max-w-xs')}
                />
            )}

            <AdminPanel>
                {visiblePosts.length === 0 ? (
                    <AdminEmptyState
                        message={posts.length === 0 ? "Aucun article pour l'instant." : 'Aucun article ne correspond.'}
                        action={
                            posts.length === 0 && (
                                <Link href="/admin/blog/create" className={buttonVariants({ variant: 'outline' })}>
                                    Rédiger le premier article
                                </Link>
                            )
                        }
                    />
                ) : (
                    <ul className="divide-y divide-slate-100">
                        {visiblePosts.map((post) => (
                            <li key={post.id} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-slate-50/70">
                                <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                                    {post.cover_image && <img src={`/storage/${post.cover_image}`} alt="" className="h-full w-full object-cover" />}
                                </div>

                                <Link href={`/admin/blog/${post.id}/edit`} className="min-w-0 flex-1">
                                    <span className="flex items-center gap-2">
                                        <span className="truncate font-display text-[14px] font-semibold text-slate-900 hover:text-teal-700">
                                            {post.title}
                                        </span>
                                        {post.featured && (
                                            <span className="shrink-0 rounded bg-slate-900 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                                                À la une
                                            </span>
                                        )}
                                    </span>
                                    <span className="mt-0.5 block truncate font-mono text-[11px] text-slate-400">
                                        {post.published_at ?? 'Non daté'}
                                        {post.tags?.length > 0 && ` · ${post.tags.slice(0, 3).join(', ')}`}
                                    </span>
                                </Link>

                                <Link
                                    href={`/admin/blog/${post.id}/comments`}
                                    className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'hidden md:inline-flex' })}
                                >
                                    {post.comments_count} commentaire{post.comments_count > 1 ? 's' : ''}
                                </Link>
                                <div className="hidden sm:block">
                                    <PublishedBadge published={post.published} />
                                </div>
                                <TogglePublished published={post.published} route={`/admin/blog/${post.id}/toggle`} />

                                <div className="flex shrink-0 items-center gap-1">
                                    <Link href={`/admin/blog/${post.id}/edit`} className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
                                        Modifier
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => setDeleteTarget(post)}
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
