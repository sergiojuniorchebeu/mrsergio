// resources/js/components/ui/FormationCard.tsx
// SpotlightCard formation — réutilisable (Home + FormationsIndex)

import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { cn, easings } from '@/lib/utils';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import type { Formation } from '@/types';

// ─── Level styles ─────────────────────────────────────────────────────────────
const LEVEL_STYLES: Record<string, string> = {
    'débutant':      'bg-emerald-50/90 text-emerald-700 border-emerald-200/60',
    'intermédiaire': 'bg-amber-50/90   text-amber-700   border-amber-200/60',
    'avancé':        'bg-red-50/90     text-red-700     border-red-200/60',
};
const defaultLevel = 'bg-slate-50/90 text-slate-600 border-slate-200/60';

// ─── Component ────────────────────────────────────────────────────────────────
export function FormationCard({ formation, index = 0 }: { formation: Formation; index?: number }) {
    const levelStyle = LEVEL_STYLES[formation.level] ?? defaultLevel;
    const levelLabel = formation.level.charAt(0).toUpperCase() + formation.level.slice(1);

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
                <Link href={`/formations/${formation.slug}`} aria-label={formation.title} className="absolute inset-0 z-10 rounded-[19px]" />

                {/* ── Image ─────────────────────────────────────────────── */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-50 to-teal-50/20 flex-shrink-0">
                    {formation.cover_image_url ? (
                        <img
                            src={formation.cover_image_url}
                            alt={formation.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.06]"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-teal-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                            </svg>
                        </div>
                    )}

                    {/* Gradient hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/55 via-slate-900/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* Play icon */}
                    <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 border border-white/30 backdrop-blur-sm">
                            <svg className="w-5 h-5 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>

                    {/* Price badge — top right */}
                    <div className={cn(
                        'absolute top-3 right-3 z-10 rounded-full border px-3 py-1 text-[11px] font-bold backdrop-blur-sm',
                        formation.is_free
                            ? 'border-teal-200/60 bg-teal-500/80 text-white'
                            : 'border-white/20 bg-black/50 text-white',
                    )}>
                        {formation.price_formatted}
                    </div>

                    {/* Category + level — bottom */}
                    <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
                        <div className="rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                            {formation.category}
                        </div>
                        <div className={cn('rounded-full border px-2.5 py-1 text-[10px] font-bold backdrop-blur-sm', levelStyle)}>
                            {levelLabel}
                        </div>
                    </div>
                </div>

                {/* ── Content ───────────────────────────────────────────── */}
                <div className="flex flex-col flex-1 p-5 gap-3">

                    {/* Featured */}
                    {formation.featured && (
                        <span className="self-start inline-flex items-center gap-1 rounded-full border border-amber-100 bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-600">
                            <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            Populaire
                        </span>
                    )}

                    {/* Title */}
                    <h3 className="font-display font-semibold text-[16px] leading-snug text-slate-900 line-clamp-2 group-hover:text-teal-600 transition-colors duration-300">
                        {formation.title}
                    </h3>

                    {/* Excerpt */}
                    {formation.excerpt && (
                        <p className="text-[13px] leading-relaxed text-slate-500 line-clamp-2 flex-1">
                            {formation.excerpt}
                        </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-[12px] text-slate-400">
                        {formation.duration_formatted && (
                            <span className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {formation.duration_formatted}
                            </span>
                        )}
                        {formation.lessons_count > 0 && (
                            <span className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                {formation.lessons_count} leçons
                            </span>
                        )}
                        {formation.students_count !== undefined && formation.students_count > 0 && (
                            <span className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                {formation.students_count}
                            </span>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="mt-1 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-teal-600 transition-[gap] duration-200 group-hover:gap-2.5">
                            Accéder
                            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden>
                                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                        {formation.is_free ? (
                            <span className="text-[11px] font-bold text-teal-600 bg-teal-50 border border-teal-100 rounded-full px-2.5 py-0.5">
                                Gratuit
                            </span>
                        ) : (
                            <span className="text-[13px] font-bold text-slate-700">{formation.price_formatted}</span>
                        )}
                    </div>
                </div>
            </SpotlightCard>
        </motion.article>
    );
}
