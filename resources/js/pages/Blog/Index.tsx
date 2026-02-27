// resources/js/Pages/Blog/Index.tsx
import { Head, Link }            from '@inertiajs/react';
import { motion }                from 'framer-motion';
import MainLayout                from '@/layouts/MainLayout';
import { AnimatedGridPattern }   from '@/components/ui/animated-grid-pattern';
import { cn, easings }           from '@/lib/utils';
import type { BlogIndexProps }   from '@/types';

// ─────────────────────────────────────────────────────────────────────────────
// COULEURS TAGS — palette cohérente avec Projects
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
// COMPOSANT CARD — réutilisable pour la grille
// ─────────────────────────────────────────────────────────────────────────────
function BlogCard({ post, index }: { post: any; index: number }) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease: easings.smooth, delay: index * 0.08 }}
        >
            <Link href={`/blog/${post.slug}`} className="group block h-full">
                <div className={cn(
                    'h-full flex flex-col rounded-2xl overflow-hidden',
                    'bg-surface-card border border-slate-200/70',
                    'shadow-sm hover:shadow-lg hover:shadow-teal-900/6',
                    'transition-all duration-300 hover:-translate-y-1',
                )}>

                    {/* Image */}
                    <div className="relative aspect-[16/9] bg-gradient-to-br from-slate-100 to-slate-50 flex-shrink-0 overflow-hidden">
                        <img
                            src={post.cover_image_url}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        {/* Overlay au hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Badge featured */}
                        {post.featured && (
                            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-teal-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                                <span className="w-1.5 h-1.5 bg-white rounded-full" />
                                À la une
                            </div>
                        )}
                    </div>

                    {/* Contenu */}
                    <div className="flex flex-col flex-1 p-5 space-y-3">

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5">
                            {post.tags.slice(0, 3).map((tag: string) => (
                                <span
                                    key={tag}
                                    className={cn('text-xs font-medium px-2 py-0.5 rounded-md border', TAG_COLORS[tag] ?? defaultTagColor)}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Titre */}
                        <h2 className="font-display font-bold text-lg text-ink-primary leading-snug group-hover:text-teal-600 transition-colors duration-200">
                            {post.title}
                        </h2>

                        {/* Extrait */}
                        <p className="text-sm text-ink-muted leading-relaxed flex-1">
                            {post.excerpt}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <span className="text-xs text-ink-subtle">{post.published_at ?? ''}</span>
                            <span className="text-sm font-semibold text-teal-600 flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                                Lire
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.article>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function Index({ posts }: BlogIndexProps) {
    const featured = posts.find(p => p.featured);
    const rest     = posts.filter(p => !p.featured || p.id !== featured?.id);

    return (
        <MainLayout>
            <Head title="Blog — Sergio Junior Chebeu" />

            {/* ── Header ───────────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-surface-card border-b border-slate-200/60">

                <AnimatedGridPattern
                    numSquares={20}
                    maxOpacity={0.03}
                    duration={5}
                    repeatDelay={1}
                    className={cn(
                        'absolute inset-0 w-full h-full text-teal-600',
                        '[mask-image:radial-gradient(600px_circle_at_50%_100%,white,transparent)]',
                    )}
                />
                <div className="absolute -top-24 -right-24 w-[28rem] h-[28rem] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="container-main py-14 sm:py-20 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: easings.smooth }}
                        className="max-w-2xl"
                    >
                        <p className="text-xs font-medium text-ink-muted uppercase tracking-[0.2em] mb-5">
                            Notes & articles
                        </p>
                        <h1 className="text-4xl sm:text-5xl font-display font-bold text-ink-primary tracking-tight leading-tight mb-4">
                            Le <span className="gradient-text">blog</span>
                        </h1>
                        <p className="text-lg text-ink-secondary leading-relaxed">
                            Retours d'expérience, architecture, productivité et notes de build —
                            ce que j'apprends en construisant.
                        </p>
                        <div className="mt-5 flex items-center gap-2">
                            <span className="text-sm font-semibold text-teal-600">{posts.length}</span>
                            <span className="text-sm text-ink-muted">article{posts.length > 1 ? 's' : ''} publié{posts.length > 1 ? 's' : ''}</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="container-main py-12 sm:py-16 space-y-12">

                {/* ── Article à la une (featured) ──────────────────────── */}
                {featured && (
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, ease: easings.smooth }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-xs font-medium text-ink-muted uppercase tracking-[0.18em]">À la une</span>
                            <div className="h-px flex-1 bg-slate-200" />
                        </div>

                        <Link href={`/blog/${featured.slug}`} className="group block">
                            <div className={cn(
                                'grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden',
                                'bg-surface-card border border-slate-200/70',
                                'shadow-sm hover:shadow-xl hover:shadow-teal-900/8',
                                'transition-all duration-300 hover:-translate-y-0.5',
                            )}>

                                {/* Image grande */}
                                <div className="relative aspect-[4/3] md:aspect-auto min-h-[220px] bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
                                    <img
                                        src={featured.cover_image_url}
                                        alt={featured.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>

                                {/* Texte */}
                                <div className="flex flex-col justify-center p-7 sm:p-10 space-y-5">
                                    <div className="flex flex-wrap gap-1.5">
                                        {featured.tags.slice(0, 3).map(tag => (
                                            <span
                                                key={tag}
                                                className={cn('text-xs font-medium px-2 py-0.5 rounded-md border', TAG_COLORS[tag] ?? defaultTagColor)}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink-primary leading-snug group-hover:text-teal-600 transition-colors duration-200">
                                        {featured.title}
                                    </h2>

                                    <p className="text-sm text-ink-secondary leading-relaxed">
                                        {featured.excerpt}
                                    </p>

                                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                        <span className="text-xs text-ink-subtle">{featured.published_at ?? ''}</span>
                                        <span className="text-sm font-semibold text-teal-600 flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-200">
                                            Lire l'article
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                )}

                {/* ── Grille articles restants ──────────────────────────── */}
                {rest.length > 0 && (
                    <div>
                        {featured && (
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-xs font-medium text-ink-muted uppercase tracking-[0.18em]">Tous les articles</span>
                                <div className="h-px flex-1 bg-slate-200" />
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {rest.map((post, i) => (
                                <BlogCard key={post.id} post={post} index={i} />
                            ))}
                        </div>
                    </div>
                )}

                {/* État vide */}
                {posts.length === 0 && (
                    <div className="text-center py-24">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                        </div>
                        <p className="text-ink-muted font-medium">Aucun article pour le moment</p>
                        <p className="text-sm text-ink-subtle mt-1">Les premiers articles arrivent bientôt !</p>
                    </div>
                )}

            </section>
        </MainLayout>
    );
}