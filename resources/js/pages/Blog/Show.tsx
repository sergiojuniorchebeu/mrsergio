// resources/js/pages/Blog/Show.tsx
// Page de lecture d'un article : hero, couverture, sommaire collant (scroll spy),
// contenu Markdown, réactions, commentaires, articles liés.

import { Head, Link, usePage } from '@inertiajs/react';
import NumberFlow from '@number-flow/react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ArticleList } from '@/components/portofolio/article-list';
import type { MarkdownHeading } from '@/components/portofolio/markdown';
import {
    extractHeadings,
    markdownComponents,
} from '@/components/portofolio/markdown';
import {
    ExpandingCover,
    ReadingProgress,
} from '@/components/portofolio/reading-chrome';
import { buttonVariants } from '@/components/ui/button';
import { HeroBackdrop } from '@/components/ui/hero-backdrop';
import {
    DrawLine,
    MaskedLine,
    Reveal,
    SplitWords,
} from '@/components/ui/reveal';
import { SectionBackdrop } from '@/components/ui/section-backdrop';
import MainLayout from '@/layouts/MainLayout';
import { cn, easings } from '@/lib/utils';
import type { BlogComment, BlogShowProps } from '@/types';

const AUTHOR_NAME = 'Sergio Junior Chebeu';
const AUTHOR_AVATAR = '/images/profile_avatar-600.webp';

function csrfToken(): string {
    return (
        (
            document.querySelector(
                'meta[name="csrf-token"]',
            ) as HTMLMetaElement | null
        )?.content ?? ''
    );
}

// ─── Sommaire (scroll spy) ───────────────────────────────────────────────────
function useActiveHeading(headings: MarkdownHeading[]): string | null {
    const [activeId, setActiveId] = useState<string | null>(
        headings[0]?.id ?? null,
    );

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter((entry) => entry.isIntersecting);

                if (visible.length > 0) {
                    setActiveId(visible[0].target.id);
                }
            },
            { rootMargin: '-20% 0px -70% 0px' },
        );

        headings.forEach(({ id }) => {
            const element = document.getElementById(id);

            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, [headings]);

    return activeId;
}

function TableOfContents({ headings }: { headings: MarkdownHeading[] }) {
    const prefersReducedMotion = useReducedMotion();
    const activeId = useActiveHeading(headings);
    const activeIndex = Math.max(
        0,
        headings.findIndex((heading) => heading.id === activeId),
    );

    const goTo = (id: string) => {
        document
            .getElementById(id)
            ?.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
                block: 'start',
            });
        window.history.replaceState(null, '', `#${id}`);
    };

    return (
        <nav aria-label="Sommaire" className="sticky top-28">
            <p className="mb-5 font-mono text-[11px] text-slate-400">
                Sommaire
            </p>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 w-px bg-slate-200" />
                <motion.div
                    initial={false}
                    animate={{ scaleY: (activeIndex + 1) / headings.length }}
                    transition={{ duration: 0.5, ease: easings.smooth }}
                    className="absolute inset-y-0 left-0 w-px origin-top bg-teal-500"
                />
                <ul className="flex flex-col">
                    {headings.map((heading) => {
                        const isActive = heading.id === activeId;

                        return (
                            <li key={heading.id}>
                                <a
                                    href={`#${heading.id}`}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        goTo(heading.id);
                                    }}
                                    className={cn(
                                        'block py-1.5 text-[14px] leading-snug transition-colors duration-300',
                                        heading.level === 3
                                            ? 'pl-9 text-[13px]'
                                            : 'pl-5',
                                        isActive
                                            ? 'font-semibold text-slate-900'
                                            : 'text-slate-400 hover:text-slate-700',
                                    )}
                                >
                                    {heading.text}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}

// ─── Réactions ───────────────────────────────────────────────────────────────
function LikeButton({
    slug,
    initialCount,
    initialLiked,
}: {
    slug: string;
    initialCount: number;
    initialLiked: boolean;
}) {
    const [liked, setLiked] = useState(initialLiked);
    const [count, setCount] = useState(initialCount);
    const [loading, setLoading] = useState(false);

    const toggle = () => {
        if (loading) {
            return;
        }

        setLoading(true);
        const next = !liked;
        setLiked(next);
        setCount((current) => (next ? current + 1 : current - 1));

        fetch(`/blog/${slug}/like`, {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': csrfToken(),
                Accept: 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setLiked(data.liked);
                setCount(data.likes_count);
            })
            .catch(() => {
                setLiked(!next);
                setCount((current) => (next ? current - 1 : current + 1));
            })
            .finally(() => setLoading(false));
    };

    return (
        <button
            type="button"
            onClick={toggle}
            disabled={loading}
            aria-pressed={liked}
            className={buttonVariants({
                variant: 'outline',
                className: cn(
                    liked &&
                        'border-rose-200 bg-rose-50 text-rose-600 hover:border-rose-300 hover:bg-rose-50',
                ),
            })}
        >
            <motion.svg
                key={liked ? 'liked' : 'idle'}
                initial={liked ? { scale: 0.6 } : false}
                animate={{ scale: [null, 1.35, 1] }}
                transition={{ duration: 0.45, ease: easings.smooth }}
                className="h-4 w-4"
                fill={liked ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
            </motion.svg>
            <NumberFlow value={count} className="tabular-nums" />
            <span>J&apos;aime</span>
        </button>
    );
}

function ShareButton({ title }: { title: string }) {
    const [copied, setCopied] = useState(false);

    const share = async () => {
        const url = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({ title, url });

                return;
            } catch {
                // Partage annulé : on retombe sur la copie du lien.
            }
        }

        await navigator.clipboard?.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            type="button"
            onClick={share}
            className={buttonVariants({ variant: 'outline' })}
        >
            <span className="relative inline-flex h-5 items-center overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                        key={copied ? 'copied' : 'share'}
                        initial={{ y: '110%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '-110%' }}
                        transition={{ duration: 0.3, ease: easings.smooth }}
                        className={cn('block', copied && 'text-teal-700')}
                    >
                        {copied ? 'Lien copié' : 'Partager'}
                    </motion.span>
                </AnimatePresence>
            </span>
        </button>
    );
}

// ─── Commentaires ────────────────────────────────────────────────────────────
function Comments({ slug, initial }: { slug: string; initial: BlogComment[] }) {
    const { auth } = usePage<{ auth: { user: { is_admin: boolean } | null } }>()
        .props;
    const isAdmin = auth?.user?.is_admin ?? false;
    const [comments, setComments] = useState<BlogComment[]>(initial);
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const deleteComment = async (id: number) => {
        if (!confirm('Supprimer ce commentaire ?')) {
            return;
        }

        try {
            await fetch(`/admin/blog-comments/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': csrfToken(),
                    Accept: 'application/json',
                },
            });
            setComments((previous) =>
                previous.filter((comment) => comment.id !== id),
            );
        } catch {
            // Échec silencieux : le commentaire reste affiché.
        }
    };

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!content.trim() || sending) {
            return;
        }

        setSending(true);
        setError(null);

        try {
            const response = await fetch(`/blog/${slug}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken(),
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    author_name: name.trim() || null,
                    content: content.trim(),
                }),
            });
            const data = await response.json();

            if (!response.ok) {
                setError(data.error ?? 'Une erreur est survenue.');
            } else {
                setComments((previous) => [data.comment, ...previous]);
                setContent('');
                setName('');
                setSent(true);
                setTimeout(() => setSent(false), 3000);
            }
        } catch {
            setError("Impossible d'envoyer le commentaire.");
        } finally {
            setSending(false);
        }
    };

    const fieldClass =
        'w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[16px] text-slate-900 placeholder:text-slate-400 outline-none transition-[border-color,box-shadow] focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10';

    return (
        <section
            id="commentaires"
            className="relative isolate overflow-clip border-t border-slate-200/80 bg-white py-20 sm:py-28"
        >
            <SectionBackdrop pattern="lines" withMargin />
            <div className="container-main">
                <div className="mx-auto max-w-2xl">
                    <div className="mb-10 flex items-end justify-between gap-4">
                        <h2 className="font-display text-3xl font-bold tracking-[-0.03em] text-slate-900 sm:text-4xl">
                            <MaskedLine onScroll>Discussion</MaskedLine>
                        </h2>
                        <span className="font-mono text-[12px] text-slate-500">
                            <NumberFlow value={comments.length} /> commentaire
                            {comments.length > 1 ? 's' : ''}
                        </span>
                    </div>

                    <Reveal>
                        <form
                            onSubmit={submit}
                            className="mb-14 flex flex-col gap-3"
                        >
                            <input
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                                placeholder="Votre nom (facultatif)"
                                maxLength={80}
                                className={fieldClass}
                            />
                            <textarea
                                value={content}
                                onChange={(event) =>
                                    setContent(event.target.value)
                                }
                                placeholder="Votre commentaire…"
                                required
                                maxLength={1000}
                                rows={4}
                                className={cn(
                                    fieldClass,
                                    'resize-none leading-relaxed',
                                )}
                            />

                            <AnimatePresence>
                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="text-[14px] font-medium text-rose-600"
                                    >
                                        {error}
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            <div className="flex items-center justify-between gap-4">
                                <span className="font-mono text-[12px] text-slate-400 tabular-nums">
                                    {content.length}/1000
                                </span>
                                <button
                                    type="submit"
                                    disabled={sending || !content.trim()}
                                    className={buttonVariants({
                                        className: 'min-w-[130px]',
                                    })}
                                >
                                    {sent
                                        ? 'Envoyé'
                                        : sending
                                          ? 'Envoi…'
                                          : 'Commenter'}
                                </button>
                            </div>
                        </form>
                    </Reveal>

                    {comments.length === 0 ? (
                        <p className="rounded-2xl border border-dashed border-slate-200 px-6 py-10 text-center text-[16px] text-slate-500">
                            Aucun commentaire pour l&apos;instant. Soyez le
                            premier.
                        </p>
                    ) : (
                        <ul className="flex flex-col">
                            <AnimatePresence initial={false}>
                                {comments.map((comment) => (
                                    <motion.li
                                        key={comment.id}
                                        layout
                                        initial={{ opacity: 0, y: -12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{
                                            duration: 0.4,
                                            ease: easings.smooth,
                                        }}
                                        className="border-t border-slate-200 py-6"
                                    >
                                        <div className="mb-2 flex items-center gap-3">
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 font-display text-[12px] font-bold text-white uppercase">
                                                {
                                                    (comment.author_name ??
                                                        'A')[0]
                                                }
                                            </span>
                                            <span className="font-display text-[14px] font-semibold text-slate-900">
                                                {comment.author_name ??
                                                    'Anonyme'}
                                            </span>
                                            <span className="font-mono text-[11px] text-slate-400">
                                                {comment.created_at}
                                            </span>
                                            {isAdmin && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        deleteComment(
                                                            comment.id,
                                                        )
                                                    }
                                                    className={buttonVariants({
                                                        variant: 'ghost',
                                                        size: 'sm',
                                                        className:
                                                            'ml-auto text-rose-600 hover:bg-rose-50',
                                                    })}
                                                >
                                                    Supprimer
                                                </button>
                                            )}
                                        </div>
                                        <p className="pl-11 text-[17px] leading-relaxed text-slate-700">
                                            {comment.content}
                                        </p>
                                    </motion.li>
                                ))}
                            </AnimatePresence>
                        </ul>
                    )}
                </div>
            </div>
        </section>
    );
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE
// ═════════════════════════════════════════════════════════════════════════════
export default function Show({ post, related, comments }: BlogShowProps) {
    const prefersReducedMotion = useReducedMotion();
    const headings = useMemo(
        () => extractHeadings(post.content ?? ''),
        [post.content],
    );
    const hasTableOfContents = headings.length >= 2;
    const meta = [post.published_at, post.reading_time].filter(Boolean);

    const fadeIn = (delay: number) => ({
        initial: { opacity: 0, y: prefersReducedMotion ? 0 : 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, delay, ease: easings.smooth },
    });

    return (
        <MainLayout>
            <Head title={`${post.title} — Blog`}>
                <meta property="og:title" content={`${post.title} — Blog`} />
                <meta property="og:description" content={post.excerpt ?? ''} />
                <meta property="og:image" content={post.cover_image_url} />
                <meta property="og:type" content="article" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image" content={post.cover_image_url} />
            </Head>

            <ReadingProgress />

            {/* ══ HERO ═══════════════════════════════════════════════ */}
            <HeroBackdrop>
                <div className="container-main pt-[110px] pb-14 sm:pt-[130px] sm:pb-20">
                    <div className="mx-auto max-w-4xl">
                        <motion.div
                            {...fadeIn(0)}
                            className="mb-10 flex flex-wrap items-center gap-3"
                        >
                            <Link
                                href="/blog"
                                className={buttonVariants({
                                    variant: 'outline',
                                    size: 'sm',
                                })}
                            >
                                Tous les articles
                            </Link>
                            {post.tags.length > 0 && (
                                <span className="font-mono text-[12px] text-slate-500">
                                    {post.tags.join(' · ')}
                                </span>
                            )}
                        </motion.div>

                        <h1 className="font-display text-[34px] leading-[1.08] font-bold tracking-[-0.035em] text-[#1a1916] sm:text-5xl lg:text-[64px]">
                            <SplitWords text={post.title} delay={0.1} />
                        </h1>

                        {post.excerpt && (
                            <motion.p
                                {...fadeIn(0.5)}
                                className="mt-7 max-w-[40rem] text-[21px] leading-[1.6] text-slate-600"
                            >
                                {post.excerpt}
                            </motion.p>
                        )}

                        <motion.div
                            {...fadeIn(0.6)}
                            className="mt-10 flex items-center gap-4"
                        >
                            <img
                                src={AUTHOR_AVATAR}
                                alt={AUTHOR_NAME}
                                width={44}
                                height={44}
                                className="h-11 w-11 rounded-full object-cover object-top ring-2 ring-white"
                            />
                            <div className="flex flex-col">
                                <span className="font-display text-[14px] font-semibold text-slate-900">
                                    {AUTHOR_NAME}
                                </span>
                                <span className="font-mono text-[12px] text-slate-500">
                                    {meta.join(' · ')}
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </HeroBackdrop>

            {/* ══ COUVERTURE ═════════════════════════════════════════ */}
            {post.cover_image_url && (
                <ExpandingCover src={post.cover_image_url} alt={post.title} />
            )}

            {/* ══ CONTENU ════════════════════════════════════════════ */}
            {post.content && (
                <section className="bg-white py-20 sm:py-28">
                    <div
                        className={cn(
                            'container-main grid gap-12',
                            hasTableOfContents &&
                                'lg:grid-cols-[220px_1fr] lg:gap-20',
                        )}
                    >
                        {hasTableOfContents && (
                            <aside className="hidden lg:block">
                                <TableOfContents headings={headings} />
                            </aside>
                        )}

                        <article
                            className={cn(
                                'min-w-0',
                                !hasTableOfContents &&
                                    'mx-auto w-full max-w-[44rem]',
                            )}
                        >
                            <Reveal>
                                <div className="max-w-[44rem]">
                                    <ReactMarkdown
                                        components={markdownComponents}
                                    >
                                        {post.content}
                                    </ReactMarkdown>
                                </div>
                            </Reveal>

                            {/* Réactions */}
                            <div className="mt-16 max-w-[44rem]">
                                <DrawLine />
                                <div className="flex flex-wrap items-center justify-between gap-4 pt-8">
                                    <p className="font-display text-[15px] font-semibold text-slate-900">
                                        Cet article vous a été utile&nbsp;?
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <LikeButton
                                            slug={post.slug}
                                            initialCount={post.likes_count ?? 0}
                                            initialLiked={post.liked ?? false}
                                        />
                                        <ShareButton title={post.title} />
                                    </div>
                                </div>
                            </div>

                            {/* Auteur */}
                            <Reveal className="mt-12 max-w-[44rem]">
                                <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center">
                                    <img
                                        src={AUTHOR_AVATAR}
                                        alt={AUTHOR_NAME}
                                        width={64}
                                        height={64}
                                        loading="lazy"
                                        className="h-16 w-16 shrink-0 rounded-full object-cover object-top"
                                    />
                                    <div className="flex-1">
                                        <p className="font-display text-[15px] font-semibold text-slate-900">
                                            {AUTHOR_NAME}
                                        </p>
                                        <p className="mt-1 text-[16px] leading-relaxed text-slate-600">
                                            Je conçois des produits web clairs,
                                            robustes et agréables à utiliser,
                                            avec une attention particulière
                                            portée au détail.
                                        </p>
                                    </div>
                                    <Link
                                        href="/contact"
                                        className={buttonVariants({
                                            variant: 'outline',
                                            className: 'shrink-0',
                                        })}
                                    >
                                        Me contacter
                                    </Link>
                                </div>
                            </Reveal>
                        </article>
                    </div>
                </section>
            )}

            {/* ══ COMMENTAIRES ═══════════════════════════════════════ */}
            <Comments slug={post.slug} initial={comments} />

            {/* ══ À LIRE AUSSI ═══════════════════════════════════════ */}
            {related.length > 0 && (
                <section className="border-t border-slate-200/80 bg-white py-20 sm:py-28">
                    <div className="container-main">
                        <div className="mb-10 flex flex-col gap-5 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
                            <h2 className="font-display text-4xl font-bold tracking-[-0.03em] text-slate-900 sm:text-5xl">
                                <MaskedLine onScroll>À lire aussi</MaskedLine>
                            </h2>
                            <Reveal delay={0.15}>
                                <Link
                                    href="/blog"
                                    className={buttonVariants({
                                        variant: 'outline',
                                    })}
                                >
                                    Tous les articles
                                </Link>
                            </Reveal>
                        </div>
                        <ArticleList articles={related} />
                    </div>
                </section>
            )}
        </MainLayout>
    );
}
