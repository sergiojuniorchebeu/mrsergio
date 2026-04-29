// resources/js/Pages/Blog/Show.tsx
// ─── 2026 Redesign — Editorial Studio Aesthetic ──────────────────────────────

import { Head, Link } from '@inertiajs/react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
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
        <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-[#e2e0da]">
            <motion.div
                className="h-full bg-[#1aa389] origin-left"
                style={{ scaleX: progress / 100 }}
            />
        </div>
    );
}

// ─── Image with fallback ──────────────────────────────────────────────────────
function ImageWithFallback({ src, alt, className }: { src: string; alt: string; className?: string }) {
    const [failed, setFailed] = useState(false);

    if (failed) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-[#f0efec]">
                <svg className="w-10 h-10 text-[#cac7be]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="text-[11px] text-[#aaa69e] font-medium">Image à venir</span>
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
    'Laravel':      'text-red-700 border-red-200 bg-red-50',
    'Inertia':      'text-sky-700 border-sky-200 bg-sky-50',
    'Tailwind':     'text-teal-700 border-[#a8ebd8] bg-[#effcf8]',
    'React':        'text-sky-700 border-sky-200 bg-sky-50',
    'TypeScript':   'text-blue-700 border-blue-200 bg-blue-50',
    'Database':     'text-violet-700 border-violet-200 bg-violet-50',
    'Productivité': 'text-amber-700 border-amber-200 bg-amber-50',
};
const defaultTag = 'text-[#706a5f] border-[#e2e0da] bg-[#f4f3ef]';

// ─── Share Button ─────────────────────────────────────────────────────────────
function ShareButton({ title, url }: { title: string; url: string }) {
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
            className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.12em] uppercase text-[#8a8479] border border-[#e2e0da] px-4 py-2 hover:border-[#1a1916] hover:text-[#1a1916] transition-all duration-200"
        >
            {copied ? (
                <>
                    <svg className="w-3.5 h-3.5 text-[#1aa389]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Copié !
                </>
            ) : (
                <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
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
            id: line.replace(/^#{2,3}\s+/, '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
        }));

    if (headings.length < 2) return null;

    return (
        <div className="sticky top-24 space-y-1">
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#aaa69e] mb-4">
                Sommaire
            </p>
            {headings.map((h, i) => (
                <a
                    key={i}
                    href={`#${h.id}`}
                    className={cn(
                        'block text-[12px] leading-snug transition-colors duration-200 py-0.5 border-l-2',
                        h.level === 2
                            ? 'pl-3 font-semibold text-[#706a5f] border-[#e2e0da] hover:text-[#1a1916] hover:border-[#1a1916]'
                            : 'pl-5 font-medium text-[#aaa69e] border-[#e2e0da] hover:text-[#706a5f] hover:border-[#cac7be]',
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
                className="group flex flex-col border border-[#e2e0da] bg-[#fafaf8] hover:border-[#1a1916]/20 transition-all duration-300 overflow-hidden"
            >
                {post.cover_image_url && (
                    <div className="relative overflow-hidden bg-[#f0efec]" style={{ aspectRatio: '16/9' }}>
                        <img
                            src={post.cover_image_url}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                    </div>
                )}
                <div className="p-5 flex flex-col gap-2.5">
                    {post.tags?.slice(0, 2).map((tag: string) => (
                        <span
                            key={tag}
                            className={cn('text-[10px] font-bold tracking-[0.12em] uppercase border px-2 py-0.5 inline-block w-fit', TAG_COLORS[tag] ?? defaultTag)}
                        >
                            {tag}
                        </span>
                    ))}
                    <p className="text-[14px] font-bold text-[#1a1916] leading-snug tracking-[-0.01em] group-hover:text-[#138770] transition-colors">
                        {post.title}
                    </p>
                    {post.excerpt && (
                        <p className="text-[12px] leading-relaxed text-[#8a8479] line-clamp-2">
                            {post.excerpt}
                        </p>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-[#e2e0da] mt-auto">
                        <span className="text-[11px] text-[#aaa69e]">{post.published_at}</span>
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-[#1aa389] transition-transform duration-200 group-hover:translate-x-0.5">
                            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Show({ post, related }: BlogShowProps) {
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
    const imageOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.4]);

    return (
        <MainLayout>
            <Head title={`${post.title} — Blog`} />

            {/* Reading progress */}
            <ReadingProgress />

            {/* ── Hero ──────────────────────────────────────────────── */}
            <section ref={heroRef} className="relative bg-[#0f1a17] overflow-hidden" style={{ minHeight: 480 }}>

                {/* Parallax cover */}
                <motion.div
                    style={{ y: imageY, opacity: imageOpacity }}
                    className="absolute inset-0 scale-110"
                >
                    <ImageWithFallback
                        src={post.cover_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover opacity-30"
                    />
                </motion.div>

                {/* Grain */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.04]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                        backgroundSize: '200px',
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0f1a17]/50 via-[#0f1a17]/70 to-[#0f1a17]" />

                <div className="relative z-10 container-main pt-[96px] pb-16 sm:pb-20">
                    {/* Back */}
                    <motion.div
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: expo }}
                        className="mb-10"
                    >
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2.5 text-[11px] font-bold tracking-[0.18em] uppercase text-white/40 hover:text-white/80 transition-colors group"
                        >
                            <svg className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                            </svg>
                            Blog
                        </Link>
                    </motion.div>

                    <div className="max-w-3xl">
                        {/* Tags */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: expo, delay: 0.1 }}
                            className="flex flex-wrap gap-2 mb-6"
                        >
                            {post.tags.map((tag: string) => (
                                <span
                                    key={tag}
                                    className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/50 border border-white/20 px-3 py-1"
                                >
                                    {tag}
                                </span>
                            ))}
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: expo, delay: 0.15 }}
                            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.08] tracking-[-0.025em] mb-5"
                        >
                            {post.title}
                        </motion.h1>

                        {/* Excerpt */}
                        {post.excerpt && (
                            <motion.p
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: expo, delay: 0.22 }}
                                className="text-[16px] leading-[1.7] text-white/55 mb-8 max-w-2xl"
                            >
                                {post.excerpt}
                            </motion.p>
                        )}

                        {/* Meta row */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, ease: expo, delay: 0.28 }}
                            className="flex items-center gap-5"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#1aa389] flex items-center justify-center">
                                    <span className="font-display text-white text-[11px] font-bold">S</span>
                                </div>
                                <div>
                                    <p className="text-[12px] font-bold text-white/80">Sergio Junior Chebeu</p>
                                    <p className="text-[11px] text-white/35">{post.published_at}</p>
                                </div>
                            </div>
                            <div className="h-5 w-px bg-white/15" />
                            <span className="text-[11px] text-white/35 font-medium">
                                ~5 min de lecture
                            </span>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Article Body ──────────────────────────────────────── */}
            {post.content && (
                <section className="bg-[#fafaf8] py-14 sm:py-20">
                    <div className="container-main">
                        <div className="flex gap-16 lg:gap-20">

                            {/* Sidebar TOC */}
                            <aside className="hidden xl:block w-48 shrink-0 pt-1">
                                <TableOfContents content={post.content} />
                            </aside>

                            {/* Main content */}
                            <div className="flex-1 min-w-0">
                                <motion.div
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.7, ease: expo }}
                                    className="max-w-2xl"
                                >
                                    {/* Decorative rule */}
                                    <div className="flex items-center gap-4 mb-12">
                                        <div className="h-px w-12 bg-[#1aa389]" />
                                        <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#aaa69e]">
                                            Article
                                        </span>
                                        <div className="h-px flex-1 bg-[#e2e0da]" />
                                    </div>

                                    {/* Prose */}
                                    <div className="
                                        prose prose-slate max-w-none
                                        prose-headings:font-display prose-headings:tracking-[-0.02em] prose-headings:text-[#1a1916]
                                        prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-b prose-h2:border-[#e2e0da] prose-h2:pb-3
                                        prose-h3:text-[18px] prose-h3:mt-8 prose-h3:mb-3
                                        prose-p:text-[15px] prose-p:leading-[1.85] prose-p:text-[#4a4740]
                                        prose-a:text-[#138770] prose-a:no-underline hover:prose-a:underline
                                        prose-strong:text-[#1a1916] prose-strong:font-bold
                                        prose-code:text-[#138770] prose-code:bg-[#effcf8] prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-[13px] prose-code:rounded-none prose-code:font-normal prose-code:border prose-code:border-[#a8ebd8]
                                        prose-pre:bg-[#1a1916] prose-pre:border prose-pre:border-[#433e37] prose-pre:rounded-none
                                        prose-blockquote:border-l-2 prose-blockquote:border-[#1aa389] prose-blockquote:bg-[#f4f3ef] prose-blockquote:pl-5 prose-blockquote:py-1 prose-blockquote:not-italic prose-blockquote:text-[#706a5f]
                                        prose-ul:text-[#4a4740] prose-ol:text-[#4a4740]
                                        prose-li:text-[15px] prose-li:leading-[1.8]
                                        prose-hr:border-[#e2e0da]
                                    ">
                                        <ReactMarkdown>{post.content}</ReactMarkdown>
                                    </div>

                                    {/* Footer — tags + share */}
                                    <div className="mt-16 pt-10 border-t border-[#e2e0da]">
                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#aaa69e] mr-1">Tags</span>
                                                {post.tags.map((tag: string) => (
                                                    <span
                                                        key={tag}
                                                        className={cn('text-[10px] font-bold tracking-[0.12em] uppercase border px-2.5 py-1', TAG_COLORS[tag] ?? defaultTag)}
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <ShareButton
                                                title={post.title}
                                                url={typeof window !== 'undefined' ? window.location.href : ''}
                                            />
                                        </div>
                                    </div>

                                    {/* Author card */}
                                    <div className="mt-10 p-6 border border-[#e2e0da] bg-[#f4f3ef] flex gap-5 items-start">
                                        <div className="w-12 h-12 rounded-full bg-[#0f1a17] flex items-center justify-center shrink-0">
                                            <span className="font-display text-white text-[14px] font-bold">SJ</span>
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-bold text-[#1a1916] mb-1">Sergio Junior Chebeu</p>
                                            <p className="text-[13px] leading-relaxed text-[#706a5f]">
                                                Développeur fullstack passionné par l'architecture logicielle, la performance et les expériences utilisateur mémorables.
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
                <section className="bg-[#f4f3ef] border-t border-[#e2e0da] py-14 sm:py-20">
                    <div className="container-main">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="h-px w-12 bg-[#1aa389]" />
                            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#aaa69e]">
                                À lire aussi
                            </span>
                            <div className="h-px flex-1 bg-[#e2e0da]" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e2e0da]">
                            {related.map((p, i) => (
                                <RelatedCard key={p.id} post={p} index={i} />
                            ))}
                        </div>

                        <div className="mt-12 text-center">
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-3 border border-[#1a1916] bg-transparent text-[#1a1916] hover:bg-[#1a1916] hover:text-white px-8 py-3.5 text-[12px] font-bold tracking-[0.12em] uppercase transition-all duration-300 group/btn"
                            >
                                Voir tous les articles
                                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover/btn:translate-x-1">
                                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

        </MainLayout>
    );
}