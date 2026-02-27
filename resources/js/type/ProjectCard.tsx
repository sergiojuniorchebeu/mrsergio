// resources/js/components/ui/ProjectCard.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Composant card projet — hover premium, responsive, animé
// Flutter équivalent : un widget Card réutilisable avec InkWell
// ─────────────────────────────────────────────────────────────────────────────

import { Link }          from '@inertiajs/react';
import { motion }        from 'framer-motion';
import { cn }            from '@/lib/utils';
import { easings }       from '@/lib/utils';
import type { Project }  from '@/types';

interface ProjectCardProps {
    project:   Project;
    index?:    number;     // pour décaler l'animation (stagger)
    featured?: boolean;    // layout différent si mis en avant
}

// Couleurs par technologie — pour les pills
const TAG_COLORS: Record<string, string> = {
    'Laravel':    'bg-red-50    text-red-600    border-red-100',
    'React':      'bg-sky-50    text-sky-600    border-sky-100',
    'Flutter':    'bg-blue-50   text-blue-600   border-blue-100',
    'TypeScript': 'bg-blue-50   text-blue-700   border-blue-100',
    'MySQL':      'bg-orange-50 text-orange-600 border-orange-100',
    'PostgreSQL': 'bg-indigo-50 text-indigo-600 border-indigo-100',
    'Firebase':   'bg-amber-50  text-amber-600  border-amber-100',
    'Redis':      'bg-rose-50   text-rose-600   border-rose-100',
    'Python':     'bg-yellow-50 text-yellow-700 border-yellow-100',
    'Dart':       'bg-cyan-50   text-cyan-600   border-cyan-100',
    'Docker':     'bg-sky-50    text-sky-700    border-sky-100',
};

const defaultTagColor = 'bg-slate-50 text-slate-600 border-slate-100';

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
                duration: 0.6,
                delay:    index * 0.1,
                ease:     easings.smooth,
            }}
        >
            <Link href={`/projects/${project.slug}`} className="block group h-full">
                <div className={cn(
                    'h-full flex flex-col',
                    'bg-surface-card rounded-2xl overflow-hidden',
                    'border border-slate-200/80',
                    'shadow-sm hover:shadow-xl hover:shadow-teal-900/8',
                    'transition-all duration-300 ease-out',
                    'hover:-translate-y-1',
                )}>

                    {/* ── Image / Placeholder ──────────────────────────── */}
                    <div className="relative h-48 sm:h-52 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 flex-shrink-0">

                        {project.image_url ? (
                            <img
                                src={project.image_url}
                                alt={project.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            /* Placeholder élégant si pas d'image */
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="text-center space-y-3">
                                    <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center">
                                        <svg className="w-7 h-7 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                        </svg>
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium">{project.title}</p>
                                </div>
                            </div>
                        )}

                        {/* Overlay gradient au hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Badge featured */}
                        {project.featured && (
                            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-teal-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                                <span className="w-1.5 h-1.5 bg-white rounded-full" />
                                Featured
                            </div>
                        )}

                        {/* Liens rapides — apparaissent au hover */}
                        <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                            {project.github_url && (
                                <a
                                    href={project.github_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={e => e.stopPropagation()}
                                    className="w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-lg text-slate-700 hover:text-teal-600 shadow-sm transition-colors"
                                    aria-label="GitHub"
                                >
                                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                                    </svg>
                                </a>
                            )}
                            {project.demo_url && (
                                <a
                                    href={project.demo_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={e => e.stopPropagation()}
                                    className="w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-lg text-slate-700 hover:text-teal-600 shadow-sm transition-colors"
                                    aria-label="Demo"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* ── Contenu texte ────────────────────────────────── */}
                    <div className="flex flex-col flex-1 p-5 sm:p-6 space-y-4">

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5">
                            {project.tags.slice(0, 4).map(tag => (
                                <span
                                    key={tag}
                                    className={cn(
                                        'text-xs font-medium px-2 py-0.5 rounded-md border',
                                        TAG_COLORS[tag] ?? defaultTagColor,
                                    )}
                                >
                                    {tag}
                                </span>
                            ))}
                            {project.tags.length > 4 && (
                                <span className="text-xs font-medium px-2 py-0.5 rounded-md border bg-slate-50 text-slate-400 border-slate-100">
                                    +{project.tags.length - 4}
                                </span>
                            )}
                        </div>

                        {/* Titre */}
                        <h3 className="font-display font-semibold text-lg text-ink-primary leading-snug group-hover:text-teal-600 transition-colors duration-200">
                            {project.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-ink-muted leading-relaxed flex-1">
                            {project.description}
                        </p>

                        {/* Footer card — lien "Voir le projet" */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <span className="text-sm font-medium text-teal-600 flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-200">
                                Voir le projet
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>

                            {/* Icônes disponibilité liens */}
                            <div className="flex items-center gap-1.5">
                                {project.github_url && (
                                    <span className="w-6 h-6 flex items-center justify-center rounded-md bg-slate-100 text-slate-500">
                                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
                                            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                                        </svg>
                                    </span>
                                )}
                                {project.demo_url && (
                                    <span className="w-6 h-6 flex items-center justify-center rounded-md bg-teal-50 text-teal-500">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.article>
    );
}