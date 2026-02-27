// resources/js/Pages/Blog/Show.tsx
import { Head, Link }          from '@inertiajs/react';
import { motion }              from 'framer-motion';
import ReactMarkdown           from 'react-markdown';
import MainLayout              from '@/layouts/MainLayout';
import { cn, easings }         from '@/lib/utils';
import type { BlogShowProps }  from '@/types';

// ─────────────────────────────────────────────────────────────────────────────
// COULEURS TAGS
// ─────────────────────────────────────────────────────────────────────────────
const TAG_COLORS: Record<string, string> = {
    'Laravel':      'bg-red-50    text-red-600    border-red-100',
    'Inertia':      'bg-sky-50    text-sky-600    border-sky-100',
    'Tailwind':     'bg-teal-50   text-teal-600   border-teal-100',
    'React':        'bg-sky-50    text-sky-600    border-sky-100',
    'TypeScript':   'bg-blue-50   text-blue-700   border-blue-100',
    'Database':     'bg-violet-50 text-violet-600 border-violet-100',
    'Productivité': 'bg-amber-50  text-amber-600  border-amber-100',
};
const defaultTagColor = 'bg-slate-50 text-slate-600 border-slate-100';

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function Show({ post, related }: BlogShowProps) {
    return (
        <MainLayout>
            <Head title={`${post.title} — Blog`} />

            {/* ── Hero article ─────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-surface-card border-b border-slate-200/60">
                <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="container-main py-12 sm:py-16 relative z-10">

                    {/* Retour */}
                    <motion.div
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, ease: easings.smooth }}
                    >
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-teal-600 transition-colors mb-8 group"
                        >
                            <svg
                                className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                            </svg>
                            Retour au blog
                        </Link>
                    </motion.div>

                    {/* Layout hero — titre à gauche, image à droite */}
                    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

                        {/* Texte */}
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: easings.smooth, delay: 0.1 }}
                            className="space-y-5"
                        >
                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className={cn('text-xs font-medium px-2.5 py-1 rounded-lg border', TAG_COLORS[tag] ?? defaultTagColor)}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Titre */}
                            <h1 className="text-3xl sm:text-4xl font-display font-bold text-ink-primary tracking-tight leading-tight">
                                {post.title}
                            </h1>

                            {/* Extrait */}
                            <p className="text-lg text-ink-secondary leading-relaxed">
                                {post.excerpt}
                            </p>

                            {/* Meta */}
                            <div className="flex items-center gap-3 pt-1">
                                <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-xs font-bold font-display">S</span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-ink-primary">Sergio Junior Chebeu</p>
                                    <p className="text-xs text-ink-muted">{post.published_at ?? ''}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, ease: easings.smooth, delay: 0.2 }}
                            className="relative rounded-2xl overflow-hidden aspect-video bg-gradient-to-br from-slate-100 to-slate-50 shadow-xl shadow-slate-200/60 border border-slate-200/60"
                        >
                            <img
                                src={post.cover_image_url}
                                alt={post.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    const el = e.target as HTMLImageElement;
                                    el.parentElement!.innerHTML = `
                                        <div class="w-full h-full flex items-center justify-center">
                                            <div class="text-center space-y-2">
                                                <div class="w-14 h-14 mx-auto rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center">
                                                    <svg class="w-7 h-7 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                                    </svg>
                                                </div>
                                                <p class="text-xs text-slate-400">Image à venir</p>
                                            </div>
                                        </div>
                                    `;
                                }}
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Contenu de l'article ─────────────────────────────────── */}
            {post.content && (
                <section className="container-main py-12 sm:py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: easings.smooth, delay: 0.3 }}
                        className="max-w-3xl mx-auto"
                    >
                        {/* Barre de progression de lecture — décorative */}
                        <div className="flex items-center gap-3 mb-10 pb-10 border-b border-slate-100">
                            <div className="h-px flex-1 bg-gradient-to-r from-teal-400 to-transparent" />
                            <span className="text-xs text-ink-subtle">Article</span>
                        </div>

                        {/* Prose Markdown */}
                        <div className="prose prose-slate prose-headings:font-display prose-headings:text-ink-primary prose-a:text-teal-600 prose-strong:text-ink-primary prose-code:text-teal-700 prose-code:bg-teal-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-normal prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 max-w-none">
                            <ReactMarkdown>{post.content}</ReactMarkdown>
                        </div>

                        {/* Tags footer */}
                        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap items-center gap-2">
                            <span className="text-xs text-ink-muted mr-1">Tags :</span>
                            {post.tags.map(tag => (
                                <span
                                    key={tag}
                                    className={cn('text-xs font-medium px-2.5 py-1 rounded-lg border', TAG_COLORS[tag] ?? defaultTagColor)}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </section>
            )}

            {/* ── Articles similaires ───────────────────────────────────── */}
            {related.length > 0 && (
                <section className="border-t border-slate-200/60 bg-surface-card">
                    <div className="container-main py-12 sm:py-16">

                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-px flex-1 bg-slate-200" />
                            <p className="text-xs font-medium text-ink-muted uppercase tracking-[0.2em] whitespace-nowrap">
                                À lire aussi
                            </p>
                            <div className="h-px flex-1 bg-slate-200" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {related.map((p, i) => (
                                <motion.div
                                    key={p.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.45, ease: easings.smooth, delay: i * 0.08 }}
                                >
                                    <Link
                                        href={`/blog/${p.slug}`}
                                        className="group flex flex-col gap-3 p-5 rounded-2xl bg-surface-raised border border-slate-200/70 hover:border-teal-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                                    >
                                        {/* Tags mini */}
                                        <div className="flex flex-wrap gap-1">
                                            {p.tags.slice(0, 2).map(tag => (
                                                <span
                                                    key={tag}
                                                    className={cn('text-xs font-medium px-2 py-0.5 rounded border', TAG_COLORS[tag] ?? defaultTagColor)}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <p className="text-sm font-semibold text-ink-primary leading-snug group-hover:text-teal-600 transition-colors">
                                            {p.title}
                                        </p>
                                        <p className="text-xs text-ink-muted leading-relaxed line-clamp-2">
                                            {p.excerpt}
                                        </p>
                                        <p className="text-xs text-ink-subtle">{p.published_at ?? ''}</p>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

        </MainLayout>
    );
}