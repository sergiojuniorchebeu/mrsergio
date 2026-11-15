// resources/js/components/ui/FormationCard.tsx
// Carte formation sobre — réutilisable (Home + FormationsIndex)

import { Link } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';
import { HoverUnderline } from '@/components/ui/hover-underline';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { easings } from '@/lib/utils';
import type { Formation } from '@/types';

export function FormationCard({
    formation,
    index = 0,
    withEntrance = true,
}: {
    formation: Formation;
    index?: number;
    withEntrance?: boolean;
}) {
    const prefersReducedMotion = useReducedMotion();
    const levelLabel = formation.level.charAt(0).toUpperCase() + formation.level.slice(1);
    const meta = [
        formation.duration_formatted,
        formation.lessons_count > 0 ? `${formation.lessons_count} leçons` : null,
        formation.students_count ? `${formation.students_count} inscrits` : null,
    ].filter(Boolean);

    return (
        <motion.article
            initial={withEntrance ? { opacity: 0, y: prefersReducedMotion ? 0 : 16 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.6, delay: (index % 3) * 0.07, ease: easings.smooth }}
            className="h-full"
        >
            <SpotlightCard className="h-full">
                <Link href={`/formations/${formation.slug}`} aria-label={formation.title} className="absolute inset-0 z-10 rounded-2xl" />

                <div className="relative aspect-[16/10] flex-shrink-0 overflow-hidden border-b border-slate-100 bg-slate-50">
                    {formation.cover_image_url ? (
                        <img
                            src={formation.cover_image_url}
                            alt={formation.title}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover object-[50%_25%] transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.025]"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                    ) : (
                        <div className="flex h-full w-full items-end p-5">
                            <span className="font-display text-2xl font-bold tracking-tight text-slate-300">
                                {formation.category}
                            </span>
                        </div>
                    )}

                    <span className="absolute top-3 right-3 rounded-md bg-white/95 px-2 py-1 font-display text-[11px] font-semibold text-slate-800 shadow-sm">
                        {formation.is_free ? 'Gratuit' : formation.price_formatted}
                    </span>
                </div>

                <div className="flex flex-1 flex-col gap-2.5 p-5">
                    <p className="font-mono text-[11px] tracking-wide text-slate-400">
                        {formation.category} — {levelLabel}
                        {formation.featured && <span className="text-teal-600"> · populaire</span>}
                    </p>

                    <h3 className="line-clamp-2 font-display text-[17px] leading-snug font-semibold text-slate-900">
                        <HoverUnderline>
                            {formation.title}
                        </HoverUnderline>
                    </h3>

                    {formation.excerpt && (
                        <p className="line-clamp-2 flex-1 text-[15px] leading-relaxed text-slate-600">
                            {formation.excerpt}
                        </p>
                    )}

                    {meta.length > 0 && (
                        <p className="mt-auto pt-2 font-mono text-[11px] text-slate-400">{meta.join(' · ')}</p>
                    )}
                </div>
            </SpotlightCard>
        </motion.article>
    );
}
