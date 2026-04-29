// resources/js/pages/Blog/Index.tsx
// ─── 2026 Redesign — Editorial Studio Aesthetic ──────────────────────────────

import { Head, Link } from '@inertiajs/react';
import {
    motion,
    AnimatePresence,
    useScroll,
    useTransform,
} from 'framer-motion';
import { useMemo, useState, useRef } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { cn } from '@/lib/utils';
import type { BlogIndexProps, BlogPost } from '@/types';

// ─── Easing Tokens ────────────────────────────────────────────────────────────
const expo = [0.16, 1, 0.3, 1] as const;
const smooth = [0.25, 0.46, 0.45, 0.94] as const;

// ─── Tag Pill ─────────────────────────────────────────────────────────────────
function TagPill({
    label,
    active,
    onClick,
    count,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
    count?: number;
}) {
    return (
        <motion.button
            onClick={onClick}
            whileTap={{ scale: 0.96 }}
            className={cn(
                'relative inline-flex items-center gap-2 border px-4 py-2 text-[11px] font-bold tracking-[0.12em] uppercase transition-all duration-300',
                active
                    ? 'border-[#1a1916] bg-[#1a1916] text-[#f4f0e8]'
                    : 'border-[#e2e0da] bg-transparent text-[#8a8479] hover:border-[#1a1916] hover:text-[#1a1916]',
            )}
        >
            {label}
            {count !== undefined && (
                <span
                    className={cn(
                        'text-[10px] font-bold tabular-nums',
                        active ? 'text-[#8a8479]' : 'text-[#cac7be]',
                    )}
                >
                    {count}
                </span>
            )}
        </motion.button>
    );
}

// ─── Featured Article — Full Bleed ───────────────────────────────────────────
function FeaturedHero({ post }: { post: BlogPost }) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end start'],
    });
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
    const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: expo }}
            className="group relative overflow-hidden bg-[#0f1a17]"
            style={{ minHeight: 540 }}
        >
            {/* Parallax image */}
            {post.cover_image_url && (
                <motion.div
                    style={{ y }}
                    className="absolute inset-0 scale-110"
                >
                    <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="h-full w-full object-cover opacity-40"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                                'none';
                        }}
                    />
                </motion.div>
            )}

            {/* Grain overlay */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.035]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    backgroundSize: '200px',
                }}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1a17] via-[#0f1a17]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f1a17]/70 via-transparent to-transparent" />

            {/* Content */}
            <motion.div
                className="container-main relative z-10 flex h-full flex-col justify-end py-14 sm:py-20"
                style={{ opacity, minHeight: 540 }}
            >
                <div className="max-w-2xl">
                    {/* À la une label */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6, ease: expo }}
                        className="mb-5 inline-flex items-center gap-3"
                    >
                        <span className="h-px w-8 bg-[#1aa389]" />
                        <span className="text-[10px] font-bold tracking-[0.25em] text-[#1aa389] uppercase">
                            À la une
                        </span>
                    </motion.div>

                    {/* Title */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.7, ease: expo }}
                        className="mb-5 font-display text-3xl leading-[1.08] font-bold tracking-[-0.025em] text-white sm:text-4xl lg:text-5xl"
                    >
                        {post.title}
                    </motion.h2>

                    {/* Excerpt */}
                    {post.excerpt && (
                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: 0.4,
                                duration: 0.6,
                                ease: expo,
                            }}
                            className="mb-8 max-w-lg text-[15px] leading-relaxed text-white/60"
                        >
                            {post.excerpt}
                        </motion.p>
                    )}

                    {/* Meta + CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6, ease: expo }}
                        className="flex items-center gap-6"
                    >
                        <Link
                            href={`/blog/${post.slug}`}
                            className="group/btn inline-flex items-center gap-3 bg-[#1aa389] px-6 py-3 text-[13px] font-bold tracking-[0.08em] text-white uppercase transition-all duration-300 hover:bg-[#138770]"
                        >
                            Lire l'article
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 16 16"
                                fill="none"
                                className="transition-transform duration-300 group-hover/btn:translate-x-1"
                            >
                                <path
                                    d="M3 8h10M9 4l4 4-4 4"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </Link>
                        <span className="text-[12px] font-medium text-white/35">
                            {post.published_at}
                        </span>
                    </motion.div>
                </div>

                {/* Tags — bottom right */}
                {post.tags?.length > 0 && (
                    <div className="absolute right-6 bottom-8 hidden max-w-xs flex-wrap justify-end gap-2 lg:flex">
                        {post.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="border border-white/15 px-2.5 py-1 text-[10px] font-bold tracking-[0.15em] text-white/40 uppercase"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}

// ─── Blog Card — Grid Item ─────────────────────────────────────────────────────
function ArticleCard({ post, index }: { post: BlogPost; index: number }) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{
                duration: 0.6,
                ease: expo,
                delay: (index % 3) * 0.07,
            }}
            className="group relative flex flex-col border border-[#e2e0da] bg-[#fafaf8] transition-all duration-300 hover:border-[#1a1916]/20"
        >
            {/* Image */}
            <div
                className="relative overflow-hidden bg-[#f0efec]"
                style={{ aspectRatio: '16/9' }}
            >
                {post.cover_image_url ? (
                    <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                                'none';
                        }}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <svg
                            className="h-8 w-8 text-[#cac7be]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                        </svg>
                    </div>
                )}

                {/* Number overlay */}
                <div className="absolute top-3 right-3 bg-black/20 px-2 py-0.5 font-display text-[11px] font-bold text-white/50 tabular-nums backdrop-blur-sm">
                    {String(index + 1).padStart(2, '0')}
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-3 p-5">
                {/* Tags */}
                {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 2).map((tag) => (
                            <span
                                key={tag}
                                className="border border-[#e2e0da] px-2 py-0.5 text-[10px] font-bold tracking-[0.15em] text-[#8a8479] uppercase"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Title */}
                <h3 className="font-display text-[16px] leading-[1.3] font-bold tracking-[-0.01em] text-[#1a1916] transition-colors duration-300 group-hover:text-[#138770]">
                    {post.title}
                </h3>

                {/* Excerpt */}
                {post.excerpt && (
                    <p className="line-clamp-2 flex-1 text-[13px] leading-[1.65] text-[#706a5f]">
                        {post.excerpt}
                    </p>
                )}

                {/* Footer */}
                <div className="mt-auto flex items-center justify-between border-t border-[#e2e0da] pt-3">
                    <span className="text-[11px] font-medium text-[#aaa69e]">
                        {post.published_at}
                    </span>
                    <span className="text-[11px] font-medium text-[#aaa69e]">
                        {post.reading_time ?? '3 min'} lecture
                    </span>
                </div>
            </div>

            {/* Invisible full-card link */}
            <Link
                href={`/blog/${post.slug}`}
                className="absolute inset-0"
                aria-label={`Lire : ${post.title}`}
            />
        </motion.article>
    );
}

// ─── Large Text Card — for breaking the grid ─────────────────────────────────
function LargeTextCard({ post, index }: { post: BlogPost; index: number }) {
    return (
        <motion.article
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: expo }}
            className="group relative col-span-full flex gap-8 border border-[#e2e0da] bg-[#fafaf8] p-6 transition-all duration-300 hover:border-[#1a1916]/20 sm:p-8 lg:col-span-2"
        >
            {/* Index number — decorative */}
            <div className="hidden items-start pt-1 sm:flex">
                <span className="font-display text-[48px] leading-none font-bold text-[#e2e0da] tabular-nums select-none">
                    {String(index + 1).padStart(2, '0')}
                </span>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-3">
                {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="border border-[#a8ebd8] bg-[#effcf8] px-2 py-0.5 text-[10px] font-bold tracking-[0.15em] text-[#138770] uppercase"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
                <h3 className="font-display text-xl leading-[1.2] font-bold tracking-[-0.02em] text-[#1a1916] transition-colors duration-300 group-hover:text-[#138770] sm:text-2xl">
                    {post.title}
                </h3>
                {post.excerpt && (
                    <p className="line-clamp-2 max-w-xl text-[14px] leading-relaxed text-[#706a5f]">
                        {post.excerpt}
                    </p>
                )}
                <div className="mt-1 flex items-center gap-4">
                    <span className="text-[11px] font-medium text-[#aaa69e]">
                        {post.published_at}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-bold tracking-[0.1em] text-[#1a1916] uppercase">
                        Lire
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 16 16"
                            fill="none"
                            className="transition-transform duration-300 group-hover:translate-x-1"
                        >
                            <path
                                d="M3 8h10M9 4l4 4-4 4"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                </div>
            </div>

            {/* Image — thumbnail right */}
            {post.cover_image_url && (
                <div className="relative hidden h-28 w-36 shrink-0 overflow-hidden bg-[#f0efec] md:block">
                    <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                                'none';
                        }}
                    />
                </div>
            )}

            <Link
                href={`/blog/${post.slug}`}
                className="absolute inset-0"
                aria-label={`Lire : ${post.title}`}
            />
        </motion.article>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Index({ posts }: BlogIndexProps) {
    const [activeTag, setActiveTag] = useState<string | null>(null);

    const allTags = useMemo(() => {
        const s = new Set<string>();
        posts.forEach((p) => (p.tags ?? []).forEach((t) => s.add(t)));
        return Array.from(s).sort((a, b) => a.localeCompare(b));
    }, [posts]);

    const countForTag = (tag: string) =>
        posts.filter((p) => p.tags.includes(tag)).length;

    const filtered = useMemo(
        () =>
            activeTag ? posts.filter((p) => p.tags.includes(activeTag)) : posts,
        [posts, activeTag],
    );

    const featured = !activeTag ? filtered.find((p) => p.featured) : undefined;
    const rest = filtered.filter((p) => p.id !== featured?.id);

    // Mixed layout: every 5th card is "large"
    const renderGrid = () => {
        const elements: React.ReactNode[] = [];
        let regularCount = 0;

        rest.forEach((post, i) => {
            const isLarge = i % 5 === 2; // Every 3rd article within cycle of 5
            if (isLarge) {
                elements.push(
                    <LargeTextCard key={post.id} post={post} index={i} />,
                );
            } else {
                elements.push(
                    <ArticleCard
                        key={post.id}
                        post={post}
                        index={regularCount++}
                    />,
                );
            }
        });

        return elements;
    };

    return (
        <MainLayout>
            <Head title="Blog — Sergio Junior Chebeu" />

            {/* ── Hero Section ─────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-[#f4f3ef] pt-[88px]">
                {/* Background typography — oversized */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 flex items-end justify-end overflow-hidden pr-4 pb-4 select-none sm:pr-8"
                >
                    <span
                        className="font-display leading-none font-extrabold tracking-[-0.04em] text-[#1a1916]/[0.03] uppercase"
                        style={{ fontSize: 'clamp(80px, 18vw, 220px)' }}
                    >
                        Blog
                    </span>
                </div>

                <div className="container-main relative z-10 py-14 sm:py-20">
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                        {/* Left — Title block */}
                        <div className="max-w-xl">
                            {/* Breadcrumb */}
                            <motion.nav
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, ease: expo }}
                                className="mb-8 flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] text-[#aaa69e] uppercase"
                            >
                                <Link
                                    href="/"
                                    className="transition-colors hover:text-[#138770]"
                                >
                                    Accueil
                                </Link>
                                <span className="text-[#cac7be]">/</span>
                                <span className="text-[#1a1916]">Blog</span>
                            </motion.nav>

                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.7,
                                    ease: expo,
                                    delay: 0.1,
                                }}
                            >
                                <h1 className="font-display text-5xl leading-[0.95] font-bold tracking-[-0.03em] text-[#1a1916] sm:text-6xl lg:text-7xl">
                                    Notes &<br />
                                    <em className="text-[#138770] not-italic">
                                        articles
                                    </em>
                                </h1>
                                <p className="mt-6 max-w-sm text-[16px] leading-[1.7] text-[#706a5f]">
                                    Retours d'expérience, architecture,
                                    productivité et notes de build — ce que
                                    j'apprends en construisant.
                                </p>
                            </motion.div>
                        </div>

                        {/* Right — Counter */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 0.6,
                                ease: expo,
                                delay: 0.3,
                            }}
                            className="flex items-baseline gap-3 lg:pb-2"
                        >
                            <span className="font-display text-[72px] leading-none font-bold tracking-[-0.04em] text-[#1a1916] tabular-nums sm:text-[96px]">
                                {filtered.length}
                            </span>
                            <div className="flex flex-col gap-0.5 pb-2">
                                <span className="text-[13px] font-bold tracking-[0.15em] text-[#8a8479] uppercase">
                                    article{filtered.length !== 1 ? 's' : ''}
                                </span>
                                {activeTag && (
                                    <span className="text-[11px] font-bold tracking-[0.1em] text-[#138770]">
                                        filtrés
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Bottom border line */}
                <div className="container-main">
                    <div className="h-px bg-[#e2e0da]" />
                </div>
            </section>

            {/* ── Filters ──────────────────────────────────────────── */}
            {allTags.length > 0 && (
                <div className="sticky top-[72px] z-20 border-b border-[#e2e0da] bg-[#f4f3ef]/90 backdrop-blur-sm">
                    <div className="container-main py-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex flex-wrap items-center gap-2"
                        >
                            <span className="mr-2 shrink-0 text-[10px] font-bold tracking-[0.22em] text-[#cac7be] uppercase">
                                Thème
                            </span>
                            <TagPill
                                label="Tous"
                                active={activeTag === null}
                                onClick={() => setActiveTag(null)}
                            />
                            {allTags.map((tag) => (
                                <TagPill
                                    key={tag}
                                    label={tag}
                                    active={activeTag === tag}
                                    onClick={() =>
                                        setActiveTag(
                                            activeTag === tag ? null : tag,
                                        )
                                    }
                                    count={countForTag(tag)}
                                />
                            ))}

                            {activeTag && (
                                <motion.button
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    onClick={() => setActiveTag(null)}
                                    className="ml-auto flex items-center gap-1.5 text-[11px] font-bold tracking-[0.1em] text-[#e05c4a] uppercase transition-opacity hover:opacity-70"
                                >
                                    <svg
                                        className="h-3 w-3"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                    Effacer
                                </motion.button>
                            )}
                        </motion.div>
                    </div>
                </div>
            )}

            {/* ── Featured Hero ─────────────────────────────────────── */}
            {featured && <FeaturedHero post={featured} />}

            {/* ── Articles Grid ─────────────────────────────────────── */}
            <section className="bg-[#f4f3ef] py-14 sm:py-20">
                <div className="container-main">
                    {/* Section header */}
                    {rest.length > 0 && (
                        <div className="mb-10 flex items-center gap-4">
                            <span className="text-[10px] font-bold tracking-[0.25em] text-[#aaa69e] uppercase">
                                {featured ? 'Tous les articles' : 'Articles'}
                            </span>
                            <div className="h-px flex-1 bg-[#e2e0da]" />
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        {filtered.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="py-28 text-center"
                            >
                                <div className="mb-6 font-display text-[80px] leading-none font-bold text-[#e2e0da]">
                                    ∅
                                </div>
                                <p className="mb-4 text-[15px] font-bold text-[#8a8479]">
                                    Aucun article pour ce filtre
                                </p>
                                <button
                                    onClick={() => setActiveTag(null)}
                                    className="text-[12px] font-bold tracking-[0.15em] text-[#138770] uppercase transition-opacity hover:opacity-70"
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
                                transition={{ duration: 0.3 }}
                            >
                                <div className="grid grid-cols-1 gap-px bg-[#e2e0da] sm:grid-cols-2 lg:grid-cols-3">
                                    {renderGrid()}
                                </div>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>

                    {posts.length === 0 && (
                        <div className="py-28 text-center">
                            <div className="mb-6 font-display text-[80px] leading-none font-bold text-[#e2e0da]">
                                —
                            </div>
                            <p className="text-[15px] font-bold text-[#8a8479]">
                                Aucun article pour le moment
                            </p>
                            <p className="mt-2 text-[13px] text-[#aaa69e]">
                                Les premiers articles arrivent bientôt !
                            </p>
                        </div>
                    )}

                    {/* Bottom CTA */}
                    {filtered.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, ease: smooth }}
                            className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-[#e2e0da] pt-12 sm:flex-row"
                        >
                            <p className="text-[14px] text-[#8a8479]">
                                Un sujet vous intéresse ?
                            </p>
                            <Link
                                href="/contact"
                                className="group/cta inline-flex items-center gap-3 border border-[#1a1916] bg-[#1a1916] px-8 py-3.5 text-[12px] font-bold tracking-[0.12em] text-white uppercase transition-all duration-300 hover:bg-transparent hover:text-[#1a1916]"
                            >
                                Suggérer un sujet
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    className="transition-transform duration-300 group-hover/cta:translate-x-1"
                                >
                                    <path
                                        d="M3 8h10M9 4l4 4-4 4"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </Link>
                        </motion.div>
                    )}
                </div>
            </section>
        </MainLayout>
    );
}
