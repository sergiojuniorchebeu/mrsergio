// resources/js/Pages/Blog/Show.tsx
// ─── 2026 Redesign — Editorial Studio Aesthetic ──────────────────────────────

import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern';
import MainLayout from '@/layouts/MainLayout';
import { cn } from '@/lib/utils';
import type { BlogShowProps } from '@/types';

// ─── Easing ───────────────────────────────────────────────────────────────────
const expo = [0.16, 1, 0.3, 1] as const;

// ─── Reading Progress Bar ─────────────────────────────────────────────────────
function ReadingProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const update = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.body.offsetHeight - window.innerHeight;
            setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
        };
        window.addEventListener('scroll', update, { passive: true });
        return () => window.removeEventListener('scroll', update);
    }, []);

    return (
        <div className="fixed top-0 right-0 left-0 z-50 h-[2px] bg-[#e2e0da]">
            <motion.div
                className="h-full origin-left bg-[#1aa389]"
                style={{ scaleX: progress / 100 }}
            />
        </div>
    );
}

// ─── Image with fallback ──────────────────────────────────────────────────────
function ImageWithFallback({
    src,
    alt,
    className,
}: {
    src: string;
    alt: string;
    className?: string;
}) {
    const [failed, setFailed] = useState(false);

    if (failed) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#f0efec]">
                <svg
                    className="h-10 w-10 text-[#cac7be]"
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
                <span className="text-[11px] font-medium text-[#aaa69e]">
                    Image à venir
                </span>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={() => setFailed(true)}
        />
    );
}

// ─── Tag color map ────────────────────────────────────────────────────────────
const TAG_COLORS: Record<string, string> = {
    Laravel: 'text-red-700 border-red-200 bg-red-50',
    Inertia: 'text-sky-700 border-sky-200 bg-sky-50',
    Tailwind: 'text-teal-700 border-[#a8ebd8] bg-[#effcf8]',
    React: 'text-sky-700 border-sky-200 bg-sky-50',
    TypeScript: 'text-blue-700 border-blue-200 bg-blue-50',
    Database: 'text-violet-700 border-violet-200 bg-violet-50',
    Productivité: 'text-amber-700 border-amber-200 bg-amber-50',
};
const defaultTag = 'text-[#706a5f] border-[#e2e0da] bg-[#f4f3ef]';
const profileImageSrc = '/images/profile_avatar.jpg';

// ─── Share Button ─────────────────────────────────────────────────────────────
function ShareButton({ url }: { url: string }) {
    const [copied, setCopied] = useState(false);

    const copy = () => {
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <button
            onClick={copy}
            className="inline-flex items-center gap-2 border border-[#e2e0da] px-4 py-2 text-[11px] font-bold tracking-[0.12em] text-[#8a8479] uppercase transition-all duration-200 hover:border-[#1a1916] hover:text-[#1a1916]"
        >
            {copied ? (
                <>
                    <svg
                        className="h-3.5 w-3.5 text-[#1aa389]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                    Copié !
                </>
            ) : (
                <>
                    <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                    </svg>
                    Copier le lien
                </>
            )}
        </button>
    );
}

// ─── Sidebar TOC ──────────────────────────────────────────────────────────────
function TableOfContents({ content }: { content: string }) {
    const headings = content
        .split('\n')
        .filter((line) => line.startsWith('## ') || line.startsWith('### '))
        .map((line) => ({
            level: line.startsWith('### ') ? 3 : 2,
            text: line.replace(/^#{2,3}\s+/, ''),
            id: line
                .replace(/^#{2,3}\s+/, '')
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w-]/g, ''),
        }));

    if (headings.length < 2) return null;

    return (
        <div className="sticky top-24 space-y-1">
            <p className="mb-4 text-[10px] font-bold tracking-[0.22em] text-[#aaa69e] uppercase">
                Sommaire
            </p>
            {headings.map((h, i) => (
                <a
                    key={i}
                    href={`#${h.id}`}
                    className={cn(
                        'block border-l-2 py-0.5 text-[12px] leading-snug transition-colors duration-200',
                        h.level === 2
                            ? 'border-[#e2e0da] pl-3 font-semibold text-[#706a5f] hover:border-[#1a1916] hover:text-[#1a1916]'
                            : 'border-[#e2e0da] pl-5 font-medium text-[#aaa69e] hover:border-[#cac7be] hover:text-[#706a5f]',
                    )}
                >
                    {h.text}
                </a>
            ))}
        </div>
    );
}

// ─── Related Post Card ────────────────────────────────────────────────────────
function RelatedCard({ post, index }: { post: any; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: expo, delay: index * 0.08 }}
        >
            <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden border border-[#e2e0da] bg-[#fafaf8] transition-all duration-300 hover:border-[#1a1916]/20"
            >
                {post.cover_image_url && (
                    <div
                        className="relative overflow-hidden bg-[#f0efec]"
                        style={{ aspectRatio: '16/9' }}
                    >
                        <img
                            src={post.cover_image_url}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                    'none';
                            }}
                        />
                    </div>
                )}
                <div className="flex flex-col gap-2.5 p-5">
                    {post.tags?.slice(0, 2).map((tag: string) => (
                        <span
                            key={tag}
                            className={cn(
                                'inline-block w-fit border px-2 py-0.5 text-[10px] font-bold tracking-[0.12em] uppercase',
                                TAG_COLORS[tag] ?? defaultTag,
                            )}
                        >
                            {tag}
                        </span>
                    ))}
                    <p className="text-[14px] leading-snug font-bold tracking-[-0.01em] text-[#1a1916] transition-colors group-hover:text-[#138770]">
                        {post.title}
                    </p>
                    {post.excerpt && (
                        <p className="line-clamp-2 text-[12px] leading-relaxed text-[#8a8479]">
                            {post.excerpt}
                        </p>
                    )}
                    <div className="mt-auto flex items-center justify-between border-t border-[#e2e0da] pt-2">
                        <span className="text-[11px] text-[#aaa69e]">
                            {post.published_at}
                        </span>
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 16 16"
                            fill="none"
                            className="text-[#1aa389] transition-transform duration-200 group-hover:translate-x-0.5"
                        >
                            <path
                                d="M3 8h10M9 4l4 4-4 4"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Show({ post, related }: BlogShowProps) {
    return (
        <MainLayout>
            <Head title={`${post.title} — Blog`} />

            {/* Reading progress */}
            <ReadingProgress />

            {/* ── Hero ──────────────────────────────────────────────── */}
            <section className="relative overflow-hidden border-b border-slate-200/60 bg-white pt-[96px]">
                <AnimatedGridPattern
                    numSquares={22}
                    maxOpacity={0.035}
                    duration={4.5}
                    repeatDelay={0.8}
                    className={cn(
                        'absolute inset-0 h-full w-full text-teal-600/70',
                        '[mask-image:radial-gradient(720px_circle_at_50%_10%,white,transparent)]',
                    )}
                />
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                        backgroundSize: '200px',
                    }}
                />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[280px] [background-image:linear-gradient(to_right,rgba(148,163,184,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.16)_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,white,transparent)] [background-size:34px_34px] opacity-[0.14]" />
                <div className="pointer-events-none absolute top-24 left-[8%] h-20 w-20 rounded-full border border-teal-200/40" />
                <div className="pointer-events-none absolute top-28 right-[10%] h-px w-16 bg-teal-300/50" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0.94))]" />

                <div className="container-main relative z-10 pb-16 sm:pb-20">
                    {/* Back */}
                    <motion.div
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: expo }}
                        className="mb-10"
                    >
                        <Link
                            href="/blog"
                            className="group inline-flex items-center gap-2.5 text-[11px] font-bold tracking-[0.18em] text-[#8a8479] uppercase transition-colors hover:text-[#138770]"
                        >
                            <svg
                                className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M7 16l-4-4m0 0l4-4m-4 4h18"
                                />
                            </svg>
                            Blog
                        </Link>
                    </motion.div>

                    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_400px]">
                        <div className="max-w-3xl">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    ease: expo,
                                    delay: 0.1,
                                }}
                                className="mb-6 flex flex-wrap gap-2"
                            >
                                {post.tags.map((tag: string) => (
                                    <span
                                        key={tag}
                                        className="border border-[#ddd8cf] bg-white/60 px-3 py-1 text-[10px] font-bold tracking-[0.18em] text-[#8a8479] uppercase"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.7,
                                    ease: expo,
                                    delay: 0.15,
                                }}
                                className="mb-5 font-display text-3xl leading-[1.08] font-bold tracking-[-0.025em] text-[#1a1916] sm:text-4xl lg:text-5xl"
                            >
                                {post.title}
                            </motion.h1>

                            {post.excerpt && (
                                <motion.p
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.6,
                                        ease: expo,
                                        delay: 0.22,
                                    }}
                                    className="mb-8 max-w-2xl text-[16px] leading-[1.75] text-[#706a5f]"
                                >
                                    {post.excerpt}
                                </motion.p>
                            )}

                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.55,
                                    ease: expo,
                                    delay: 0.28,
                                }}
                                className="flex items-center gap-5 border-t border-slate-200/70 pt-6"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 overflow-hidden rounded-full border border-white/80 shadow-[0_6px_18px_rgba(15,23,42,0.10)] ring-2 ring-teal-50">
                                        <img
                                            src={profileImageSrc}
                                            alt="Sergio Junior Chebeu"
                                            className="h-full w-full object-cover object-top"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-bold text-[#1a1916]">
                                            Sergio Junior Chebeu
                                        </p>
                                        <p className="text-[11px] text-[#aaa69e]">
                                            {post.published_at}
                                        </p>
                                    </div>
                                </div>
                                <div className="h-5 w-px bg-[#e2e0da]" />
                                <span className="text-[11px] font-medium text-[#8a8479]">
                                    {post.reading_time ?? '~5 min de lecture'}
                                </span>
                            </motion.div>
                        </div>

                        {post.cover_image_url && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    ease: expo,
                                    delay: 0.2,
                                }}
                                className="overflow-hidden rounded-lg border border-slate-200/90 bg-white/80 p-3 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm"
                            >
                                <div className="relative aspect-[5/3.8] overflow-hidden rounded-md bg-[#f0efec] lg:aspect-[5/3.9]">
                                    <ImageWithFallback
                                        src={post.cover_image_url}
                                        alt={post.title}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </section>

            {/* ── Article Body ──────────────────────────────────────── */}
            {post.content && (
                <section className="relative overflow-hidden bg-white py-14 sm:py-20">
                    <AnimatedGridPattern
                        numSquares={38}
                        maxOpacity={0.04}
                        duration={4}
                        repeatDelay={0.6}
                        className={cn(
                            'absolute inset-0 h-full w-full text-teal-600/70',
                            '[mask-image:radial-gradient(900px_circle_at_50%_20%,white,transparent)]',
                        )}
                    />
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.94),rgba(255,255,255,0))]" />
                    <div className="container-main relative z-10">
                        <div className="flex gap-16 lg:gap-20">
                            {/* Sidebar TOC */}
                            <aside className="hidden w-48 shrink-0 pt-1 xl:block">
                                <TableOfContents content={post.content} />
                            </aside>

                            {/* Main content */}
                            <div className="min-w-0 flex-1">
                                <motion.div
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.7, ease: expo }}
                                    className="max-w-2xl"
                                >
                                    {/* Decorative rule */}
                                    <div className="mb-12 flex items-center gap-4">
                                        <div className="h-px w-12 bg-[#1aa389]" />
                                        <span className="text-[10px] font-bold tracking-[0.22em] text-[#aaa69e] uppercase">
                                            Article
                                        </span>
                                        <div className="h-px flex-1 bg-[#e2e0da]" />
                                    </div>

                                    {/* Prose */}
                                    <div className="prose max-w-none prose-slate prose-headings:font-display prose-headings:tracking-[-0.02em] prose-headings:text-[#1a1916] prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-b prose-h2:border-[#e2e0da] prose-h2:pb-3 prose-h2:text-2xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-[18px] prose-p:text-[15px] prose-p:leading-[1.85] prose-p:text-[#4a4740] prose-a:text-[#138770] prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-2 prose-blockquote:border-[#1aa389] prose-blockquote:bg-[#f4f3ef] prose-blockquote:py-1 prose-blockquote:pl-5 prose-blockquote:text-[#706a5f] prose-blockquote:not-italic prose-strong:font-bold prose-strong:text-[#1a1916] prose-code:rounded-none prose-code:border prose-code:border-[#a8ebd8] prose-code:bg-[#effcf8] prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-[13px] prose-code:font-normal prose-code:text-[#138770] prose-pre:rounded-none prose-pre:border prose-pre:border-[#433e37] prose-pre:bg-[#1a1916] prose-ol:text-[#4a4740] prose-ul:text-[#4a4740] prose-li:text-[15px] prose-li:leading-[1.8] prose-hr:border-[#e2e0da]">
                                        <ReactMarkdown>
                                            {post.content}
                                        </ReactMarkdown>
                                    </div>

                                    {/* Footer — tags + share */}
                                    <div className="mt-16 border-t border-[#e2e0da] pt-10">
                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="mr-1 text-[10px] font-bold tracking-[0.2em] text-[#aaa69e] uppercase">
                                                    Tags
                                                </span>
                                                {post.tags.map(
                                                    (tag: string) => (
                                                        <span
                                                            key={tag}
                                                            className={cn(
                                                                'border px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] uppercase',
                                                                TAG_COLORS[
                                                                    tag
                                                                ] ?? defaultTag,
                                                            )}
                                                        >
                                                            {tag}
                                                        </span>
                                                    ),
                                                )}
                                            </div>
                                            <ShareButton
                                                url={
                                                    typeof window !==
                                                    'undefined'
                                                        ? window.location.href
                                                        : ''
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* Author card */}
                                    <div className="mt-10 flex items-start gap-5 border border-[#e2e0da] bg-[#f8f7f3] p-6">
                                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white shadow-[0_10px_24px_rgba(15,23,42,0.10)] ring-2 ring-teal-50">
                                            <img
                                                src={profileImageSrc}
                                                alt="Sergio Junior Chebeu"
                                                className="h-full w-full object-cover object-top"
                                            />
                                        </div>
                                        <div>
                                            <p className="mb-1 text-[13px] font-bold text-[#1a1916]">
                                                Sergio Junior Chebeu
                                            </p>
                                            <p className="text-[13px] leading-relaxed text-[#706a5f]">
                                                Je conçois des produits web
                                                clairs, robustes et agréables à
                                                utiliser, avec une attention
                                                particulière portée au détail.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ── Related Articles ──────────────────────────────────── */}
            {related.length > 0 && (
                <section className="relative overflow-hidden border-t border-[#e2e0da] bg-white py-14 sm:py-20">
                    <AnimatedGridPattern
                        numSquares={24}
                        maxOpacity={0.03}
                        duration={4.5}
                        repeatDelay={0.8}
                        className={cn(
                            'absolute inset-0 h-full w-full text-teal-600/60',
                            '[mask-image:radial-gradient(900px_circle_at_50%_0%,white,transparent)]',
                        )}
                    />
                    <div className="container-main relative z-10">
                        <div className="mb-10 flex items-center gap-4">
                            <div className="h-px w-12 bg-[#1aa389]" />
                            <span className="text-[10px] font-bold tracking-[0.25em] text-[#aaa69e] uppercase">
                                À lire aussi
                            </span>
                            <div className="h-px flex-1 bg-[#e2e0da]" />
                        </div>

                        <div className="grid grid-cols-1 gap-px bg-[#e2e0da] sm:grid-cols-2 lg:grid-cols-3">
                            {related.map((p, i) => (
                                <RelatedCard key={p.id} post={p} index={i} />
                            ))}
                        </div>

                        <div className="mt-12 text-center">
                            <Link
                                href="/blog"
                                className="group/btn inline-flex items-center gap-3 border border-[#1a1916] bg-transparent px-8 py-3.5 text-[12px] font-bold tracking-[0.12em] text-[#1a1916] uppercase transition-all duration-300 hover:bg-[#1a1916] hover:text-white"
                            >
                                Voir tous les articles
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    className="transition-transform duration-300 group-hover/btn:translate-x-1"
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
                        </div>
                    </div>
                </section>
            )}
        </MainLayout>
    );
}
