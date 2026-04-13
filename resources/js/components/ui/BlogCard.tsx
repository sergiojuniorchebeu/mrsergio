// resources/js/components/ui/BlogCard.tsx
// SpotlightCard blog post — réutilisable (Home + Blog/Index)

import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { cn, easings } from '@/lib/utils';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import type { BlogPost } from '@/types';

// ─── Tag colors ───────────────────────────────────────────────────────────────
const TAG_COLORS: Record<string, string> = {
    'Laravel':      'bg-red-50    text-red-600    border-red-100',
    'Inertia':      'bg-sky-50    text-sky-600    border-sky-100',
    'Tailwind':     'bg-teal-50   text-teal-600   border-teal-100',
    'React':        'bg-sky-50    text-sky-600    border-sky-100',
    'TypeScript':   'bg-violet-50 text-violet-600 border-violet-100',
    'Database':     'bg-violet-50 text-violet-600 border-violet-100',
    'Productivité': 'bg-amber-50  text-amber-600  border-amber-100',
    'DevOps':       'bg-orange-50 text-orange-600 border-orange-100',
    'Architecture': 'bg-indigo-50 text-indigo-600 border-indigo-100',
    'PHP':          'bg-purple-50 text-purple-600 border-purple-100',
};
const defaultTag = 'bg-slate-50 text-slate-500 border-slate-100';

// ─── Component ────────────────────────────────────────────────────────────────
export function BlogCard({ post, index = 0 }: { post: BlogPost; index?: number }) {
    const firstTag = post.tags?.[0];

    return (
        <motion.article
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, delay: index * 0.08, ease: easings.smooth }}
            className="h-full"
        >
            <SpotlightCard className="h-full">
                {/* Nav link */}
                <Link href={`/blog/${post.slug}`} aria-label={post.title} className="absolute inset-0 z-10 rounded-[19px]" />

                {/* ── Image ──────────────────────────────────────────────── */}
                <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-teal-50/20 flex-shrink-0" style={{ aspectRatio: '16/9' }}>
                    {post.cover_image_url ? (
                        <img
                            src={post.cover_image_url}
                            alt={post.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.06]"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-teal-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                    )}

                    {/* Gradient hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* Tag badge — top left */}
                    {firstTag && (
                        <div className="absolute top-3 left-3 z-10 rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
                            {firstTag}
                        </div>
                    )}

                    {/* Featured badge — top right */}
                    {post.featured && (
                        <div className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-full border border-teal-300/30 bg-teal-500/80 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                            <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            À la une
                        </div>
                    )}
                </div>

                {/* ── Content ────────────────────────────────────────────── */}
                <div className="flex flex-col flex-1 p-5 gap-2.5">
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {post.tags.slice(0, 3).map((tag) => (
                                <span key={tag} className={cn('text-[11px] font-semibold px-2.5 py-0.5 rounded-full border', TAG_COLORS[tag] ?? defaultTag)}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Title */}
                    <h3 className="font-display font-semibold text-[16px] leading-snug text-slate-900 line-clamp-2 group-hover:text-teal-600 transition-colors duration-300">
                        {post.title}
                    </h3>

                    {/* Excerpt */}
                    {post.excerpt && (
                        <p className="text-[13px] leading-relaxed text-slate-500 line-clamp-2 flex-1">
                            {post.excerpt}
                        </p>
                    )}

                    {/* Footer */}
                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[12px] font-medium text-slate-400">
                            {post.published_at ?? '—'}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-teal-600 transition-[gap] duration-200 group-hover:gap-2.5">
                            Lire l'article
                            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden>
                                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                    </div>
                </div>
            </SpotlightCard>
        </motion.article>
    );
}
