// resources/js/components/ui/ProjectCard.tsx
// Carte projet sobre : visuel, type, titre, description, liens.

import { Link } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';
import { HoverUnderline } from '@/components/ui/hover-underline';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { easings } from '@/lib/utils';
import type { Project } from '@/types';

interface ProjectCardProps {
    project: Project;
    index?: number;
}

function getPreviewImage(p: Project) {
    return p.screenshots_urls?.[0] ?? p.image_url ?? null;
}

function getPrimaryLink(p: Project) {
    if (p.project_type === 'mobile')  return p.store_links?.play_store ?? p.store_links?.app_store ?? p.demo_url ?? null;
    if (p.project_type === 'desktop') return p.store_links?.windows    ?? p.store_links?.macos     ?? p.demo_url ?? null;
    if (p.project_type === 'api')     return p.store_links?.docs        ?? p.store_links?.base_url  ?? p.demo_url ?? null;
    return p.demo_url ?? null;
}

function getExternalLabel(p: Project) {
    switch (p.project_type) {
        case 'mobile':  return 'Store';
        case 'desktop': return 'Télécharger';
        case 'api':     return 'Docs';
        default:        return 'En ligne';
    }
}

function GithubIcon({ className = 'w-4 h-4' }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
    );
}

function ArrowUpRight({ className = 'h-3 w-3' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M5 11L11 5M6 5h5v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
    const prefersReducedMotion = useReducedMotion();
    const previewImage = getPreviewImage(project);
    const externalLink = getPrimaryLink(project);
    const typeKey      = project.project_type ?? 'web';
    const typeLabel    = project.project_type_label ?? typeKey;
    const showGithub   = Boolean(project.github_url) && !project.private_repo;

    return (
        <motion.article
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.6, delay: (index % 3) * 0.07, ease: easings.smooth }}
            className="h-full"
        >
            <SpotlightCard className="h-full">
                <Link
                    href={`/projects/${project.slug}`}
                    aria-label={`Voir ${project.title}`}
                    className="absolute inset-0 z-10 rounded-2xl"
                />

                <div className="relative aspect-[16/10] flex-shrink-0 overflow-hidden border-b border-slate-100 bg-slate-50">
                    {previewImage ? (
                        <img
                            src={previewImage}
                            alt={project.title}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.025]"
                        />
                    ) : (
                        <div className="flex h-full w-full items-end p-5">
                            <span className="font-display text-2xl font-bold tracking-tight text-slate-300">
                                {project.title}
                            </span>
                        </div>
                    )}

                    {project.featured && (
                        <span className="absolute top-3 left-3 rounded-md bg-white/95 px-2 py-1 text-[10px] font-semibold tracking-[0.08em] text-slate-700 uppercase shadow-sm">
                            À la une
                        </span>
                    )}
                </div>

                <div className="flex flex-1 flex-col gap-2.5 p-5">
                    <p className="font-mono text-[11px] tracking-wide text-slate-400">
                        <span className="capitalize">{typeLabel}</span>
                        {project.tags.length > 0 && (
                            <span> — {project.tags.slice(0, 3).join(', ')}</span>
                        )}
                    </p>

                    <h3 className="font-display text-[17px] leading-snug font-semibold text-slate-900">
                        <HoverUnderline>
                            {project.title}
                        </HoverUnderline>
                    </h3>

                    <p className="line-clamp-2 flex-1 text-[15px] leading-relaxed text-slate-600">
                        {project.description}
                    </p>

                    {(showGithub || externalLink) && (
                        <div className="mt-2 flex items-center gap-4 text-[12px] font-medium text-slate-500">
                            {externalLink && (
                                <a
                                    href={externalLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="relative z-20 inline-flex items-center gap-1 transition-colors hover:text-teal-700"
                                >
                                    {getExternalLabel(project)}
                                    <ArrowUpRight />
                                </a>
                            )}
                            {showGithub && (
                                <a
                                    href={project.github_url!}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="relative z-20 inline-flex items-center gap-1.5 transition-colors hover:text-slate-900"
                                >
                                    <GithubIcon className="h-3.5 w-3.5" />
                                    Code
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </SpotlightCard>
        </motion.article>
    );
}
