// resources/js/pages/Blog/Index.tsx

import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';
import { HexagonPattern } from '@/components/ui/hexagon-pattern';
import { BlogCard } from '@/components/ui/BlogCard';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import MainLayout from '@/layouts/MainLayout';
import { cn } from '@/lib/utils';
import type { BlogIndexProps, BlogPost } from '@/types';

// ─── Filter Chip ──────────────────────────────────────────────────────────────
function Chip({
    active,
    onClick,
    children,
    count,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
    count?: number;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40',
                active
                    ? 'border-teal-600 bg-teal-600 text-white shadow-sm shadow-teal-500/20'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-teal-200 hover:bg-teal-50/60 hover:text-teal-700',
            )}
        >
            {children}
            {count !== undefined && (
                <span className={cn(
                    'flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold',
                    active ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500',
                )}>
                    {count}
                </span>
            )}
        </button>
    );
}

// ─── Featured Article ─────────────────────────────────────────────────────────
function FeaturedCard({ post }: { post: BlogPost }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
        >
            <SpotlightCard className="w-full">
                <Link
                    href={`/blog/${post.slug}`}
                    aria-label={`Lire : ${post.title}`}
                    className="absolute inset-0 z-10 rounded-[19px]"
                />
                <div className="grid md:grid-cols-2">
                    {/* Image */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-teal-50/20" style={{ minHeight: '220px' }}>
                        {post.cover_image_url ? (
                            <img
                                src={post.cover_image_url}
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.04]"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-teal-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* À la une badge */}
                        <div className="absolute top-4 left-4 z-20 inline-flex items-center gap-1.5 rounded-full border border-teal-300/30 bg-teal-500/85 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-sm">
                            <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            À la une
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-center p-7 sm:p-10 gap-4">
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {post.tags.slice(0, 3).map((tag) => (
                                    <span key={tag} className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-teal-50 text-teal-700 border-teal-100">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <h2 className="font-display text-2xl sm:text-3xl font-bold leading-snug text-slate-900 group-hover:text-teal-600 transition-colors duration-300">
                            {post.title}
                        </h2>

                        {post.excerpt && (
                            <p className="text-[14px] leading-relaxed text-slate-500 line-clamp-3">
                                {post.excerpt}
                            </p>
                        )}

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[12px] font-medium text-slate-400">{post.published_at ?? '—'}</span>
                            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-teal-600 transition-[gap] duration-200 group-hover:gap-2.5">
                                Lire l'article
                                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
                                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
            </SpotlightCard>
        </motion.div>
    );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function Index({ posts }: BlogIndexProps) {
    const [activeTag, setActiveTag] = useState<string | null>(null);

    // Derive all tags
    const allTags = useMemo(() => {
        const s = new Set<string>();
        posts.forEach((p) => (p.tags ?? []).forEach((t) => s.add(t)));
        return Array.from(s).sort((a, b) => a.localeCompare(b));
    }, [posts]);

    const countForTag = (tag: string) =>
        posts.filter((p) => p.tags.includes(tag)).length;

    // Filtered posts
    const filtered = useMemo(() =>
        activeTag ? posts.filter((p) => p.tags.includes(activeTag)) : posts,
    [posts, activeTag]);

    // Featured = first featured post (only shown when no filter active)
    const featured = !activeTag ? filtered.find((p) => p.featured) : undefined;
    const rest = filtered.filter((p) => p.id !== featured?.id);

    const hasFilter = !!activeTag;

    return (
        <MainLayout>
            <Head title="Blog — Sergio Junior Chebeu" />

            {/* ── Hero ────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-white pt-[88px] pb-14 sm:pb-18">

                <HexagonPattern
                    radius={28}
                    gap={4}
                    className={cn(
                        'absolute inset-0 h-full w-full fill-transparent stroke-teal-600/[0.06]',
                        '[mask-image:radial-gradient(ellipse_85%_90%_at_50%_50%,white_30%,transparent_100%)]',
                    )}
                />

                {/* Watermark */}
                <div aria-hidden className="pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden">
                    <span
                        className="font-display font-extrabold uppercase leading-none tracking-[-0.04em] whitespace-nowrap text-slate-900/[0.028]"
                        style={{ fontSize: 'clamp(56px, 11vw, 150px)' }}
                    >
                        Articles
                    </span>
                </div>

                <div className="container-main relative z-10">
                    {/* Breadcrumb */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                        className="mb-8 flex items-center gap-2 text-[12px] font-medium text-slate-400"
                    >
                        <Link href="/" className="transition-colors hover:text-teal-600">Accueil</Link>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-slate-600">Blog</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.05, ease: [0.23, 1, 0.32, 1] }}
                        className="max-w-2xl"
                    >
                        {/* Label */}
                        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-200/70 bg-teal-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                            Notes & articles
                        </span>

                        {/* Title */}
                        <h1 className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-[#1a1916] sm:text-5xl lg:text-[52px]">
                            Le{' '}
                            <span className="text-teal-600">blog</span>
                        </h1>

                        {/* Description */}
                        <p className="mt-5 text-[17px] leading-[1.75] text-slate-600 max-w-lg">
                            Retours d'expérience, architecture, productivité et notes de build —
                            ce que j'apprends en construisant.
                        </p>

                        {/* Count */}
                        <motion.div className="mt-7 flex items-center gap-3" animate={{ opacity: 1 }}>
                            <span className="font-display text-3xl font-bold tracking-tight text-[#1a1916]">
                                {filtered.length}
                            </span>
                            <span className="text-[14px] font-medium text-slate-400">
                                article{filtered.length !== 1 ? 's' : ''}
                                {hasFilter ? (
                                    <span className="ml-1 text-teal-600">filtrés</span>
                                ) : (
                                    <span className="ml-1">publié{filtered.length !== 1 ? 's' : ''}</span>
                                )}
                            </span>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ── Filters ─────────────────────────────────────────────── */}
            {allTags.length > 0 && (
                <div className="border-y border-slate-100 bg-[#fafaf8]">
                    <div className="container-main py-5">
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
                            className="space-y-3"
                        >
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="mr-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 shrink-0">
                                    Thème
                                </span>
                                <Chip active={activeTag === null} onClick={() => setActiveTag(null)}>
                                    Tous
                                </Chip>
                                {allTags.map((tag) => (
                                    <Chip
                                        key={tag}
                                        active={activeTag === tag}
                                        onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                                        count={countForTag(tag)}
                                    >
                                        {tag}
                                    </Chip>
                                ))}
                            </div>

                            {/* Clear filter */}
                            {hasFilter && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    onClick={() => setActiveTag(null)}
                                    className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-slate-400 transition-colors hover:text-red-500"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Effacer le filtre
                                </motion.button>
                            )}
                        </motion.div>
                    </div>
                </div>
            )}

            {/* ── Content ─────────────────────────────────────────────── */}
            <section className="bg-white py-14 sm:py-18">
                <div className="container-main space-y-12">

                    {/* Featured */}
                    {featured && (
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 shrink-0">À la une</span>
                                <div className="h-px flex-1 bg-slate-100" />
                            </div>
                            <FeaturedCard post={featured} />
                        </div>
                    )}

                    {/* Grid */}
                    <AnimatePresence mode="wait">
                        {filtered.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="py-24 text-center"
                            >
                                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-300">
                                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                    </svg>
                                </div>
                                <p className="text-[15px] font-semibold text-slate-500">Aucun article pour ce filtre</p>
                                <button
                                    onClick={() => setActiveTag(null)}
                                    className="mt-3 text-[13px] font-semibold text-teal-600 hover:underline"
                                >
                                    Réinitialiser
                                </button>
                            </motion.div>
                        ) : rest.length > 0 ? (
                            <motion.div
                                key={activeTag ?? 'all'}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25 }}
                            >
                                {featured && (
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 shrink-0">Tous les articles</span>
                                        <div className="h-px flex-1 bg-slate-100" />
                                    </div>
                                )}
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                    {rest.map((post, i) => (
                                        <BlogCard key={post.id} post={post} index={i} />
                                    ))}
                                </div>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>

                    {/* Empty state — no posts at all */}
                    {posts.length === 0 && (
                        <div className="py-24 text-center">
                            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-300">
                                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                            </div>
                            <p className="text-[15px] font-semibold text-slate-500">Aucun article pour le moment</p>
                            <p className="text-[13px] text-slate-400 mt-1">Les premiers articles arrivent bientôt !</p>
                        </div>
                    )}

                    {/* Bottom CTA */}
                    {filtered.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="mt-4 flex flex-col items-center gap-4 text-center"
                        >
                            <p className="text-[14px] font-medium text-slate-400">
                                Un sujet vous intéresse ?
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
                            >
                                Suggérer un sujet
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </motion.div>
                    )}
                </div>
            </section>
        </MainLayout>
    );
}
