// resources/js/pages/Blog/Index.tsx
// Liste des articles : hero, filtres par thème, grille stable
// (les cartes glissent à leur place quand on filtre, sans tout recharger).

import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    EmptyResults,
    FilterBar,
    FilterGrid,
    FilterGridItem,
    FilterRow,
    ListingCta,
    ListingHero,
} from '@/components/portofolio/listing';
import { HoverUnderline } from '@/components/ui/hover-underline';
import { SectionBackdrop } from '@/components/ui/section-backdrop';
import MainLayout from '@/layouts/MainLayout';
import { cn } from '@/lib/utils';
import type { BlogIndexProps, BlogPost } from '@/types';

// ─── Carte article ───────────────────────────────────────────────────────────
function PostCard({
    post,
    isLead,
    index,
}: {
    post: BlogPost;
    isLead: boolean;
    index: number;
}) {
    const meta = [post.published_at, post.reading_time].filter(Boolean);

    return (
        <article
            className={cn(
                'group relative flex h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-[border-color,box-shadow] duration-300 hover:border-slate-300 hover:shadow-[0_16px_40px_-20px_rgba(26,25,22,0.3)] active:brightness-95',
                isLead ? 'flex-col lg:flex-row' : 'flex-col',
            )}
        >
            <Link
                href={`/blog/${post.slug}`}
                aria-label={post.title}
                className="absolute inset-0 z-10 rounded-2xl"
            />

            <div
                className={cn(
                    'relative shrink-0 overflow-hidden bg-slate-100',
                    isLead
                        ? 'aspect-[16/9] lg:w-[56%]'
                        : 'aspect-[16/9]',
                )}
            >
                {post.cover_image_url ? (
                    <img
                        src={post.cover_image_url}
                        alt={post.title}
                        loading={index < 3 ? 'eager' : 'lazy'}
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.04]"
                    />
                ) : (
                    <div className="flex h-full min-h-[180px] w-full items-end p-5">
                        <span className="font-display text-2xl font-bold tracking-tight text-slate-300">
                            {post.tags[0] ?? 'Article'}
                        </span>
                    </div>
                )}
                {post.featured && isLead && (
                    <span className="absolute top-4 left-4 rounded-md bg-white/95 px-2 py-1 text-[11px] font-semibold text-slate-800 shadow-sm">
                        À la une
                    </span>
                )}
            </div>

            <div
                className={cn(
                    'flex flex-1 flex-col gap-3',
                    isLead ? 'p-6 sm:p-8 lg:justify-center' : 'p-5',
                )}
            >
                <p className="font-mono text-[11px] tracking-wide text-slate-400">
                    {meta.join(' · ')}
                    {post.tags[0] && (
                        <span> — {post.tags.slice(0, 2).join(', ')}</span>
                    )}
                </p>
                <h3
                    className={cn(
                        'font-display font-bold tracking-[-0.02em] text-slate-900',
                        isLead
                            ? 'text-[26px] leading-[1.15] sm:text-[32px]'
                            : 'line-clamp-2 text-[19px] leading-snug',
                    )}
                >
                    <HoverUnderline>{post.title}</HoverUnderline>
                </h3>
                {post.excerpt && (
                    <p
                        className={cn(
                            'text-slate-600',
                            isLead
                                ? 'line-clamp-4 text-[17px] leading-relaxed'
                                : 'line-clamp-3 text-[15px] leading-relaxed',
                        )}
                    >
                        {post.excerpt}
                    </p>
                )}
            </div>
        </article>
    );
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE
// ═════════════════════════════════════════════════════════════════════════════
export default function Index({ posts }: BlogIndexProps) {
    const [activeTag, setActiveTag] = useState<string | null>(null);

    const tagOptions = useMemo(() => {
        const counts = new Map<string, number>();
        posts.forEach((post) =>
            (post.tags ?? []).forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1)),
        );

        return Array.from(counts.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([tag, count]) => ({ value: tag, label: tag, count }));
    }, [posts]);

    const visiblePosts = useMemo(() => {
        const filtered = activeTag ? posts.filter((post) => post.tags.includes(activeTag)) : posts;

        return [...filtered].sort((a, b) => Number(b.featured) - Number(a.featured));
    }, [posts, activeTag]);

    return (
        <MainLayout>
            <Head title="Blog — Sergio Junior Chebeu" />

            <ListingHero
                eyebrow="Blog"
                title="Notes &"
                accent="articles"
                intro="Retours d'expérience, architecture, productivité et notes de build : ce que j'apprends en construisant."
                count={visiblePosts.length}
                unit={['article', 'articles']}
                filterLabel={activeTag ? `en ${activeTag}` : null}
            />

            {tagOptions.length > 0 && (
                <FilterBar>
                    <FilterRow
                        id="blog-tag"
                        allCount={posts.length}
                        options={tagOptions}
                        value={activeTag}
                        onChange={setActiveTag}
                    />
                </FilterBar>
            )}

            <section className="relative isolate overflow-clip bg-white py-16 sm:py-24">
                <SectionBackdrop pattern="lines" withMargin />
                <div className="container-main">
                    {posts.length === 0 ? (
                        <EmptyResults message="Les premiers articles arrivent bientôt." />
                    ) : (
                        <FilterGrid id="blog-grid">
                            {visiblePosts.map((post, index) => (
                                <FilterGridItem key={post.id} className={cn(index === 0 && 'sm:col-span-2')}>
                                    <PostCard post={post} index={index} isLead={index === 0} />
                                </FilterGridItem>
                            ))}
                        </FilterGrid>
                    )}

                    <ListingCta
                        title="Un sujet vous intéresse ?"
                        text="Proposez-le, il fera peut-être l'objet du prochain article."
                        href="/contact"
                        label="Suggérer un sujet"
                    />
                </div>
            </section>
        </MainLayout>
    );
}
