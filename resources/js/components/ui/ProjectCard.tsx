// resources/js/components/ui/ProjectCard.tsx
// Carte projet sobre : visuel, type, titre, description, liens.

import { Link } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';
import { primaryLinks, splitTitle } from '@/components/portofolio/project-meta';
import { ShotPreview } from '@/components/portofolio/shot-preview';
import { buttonVariants } from '@/components/ui/button';
import { HoverUnderline } from '@/components/ui/hover-underline';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { cn, easings } from '@/lib/utils';
import type { Project } from '@/types';
import { useTranslation } from '@/lib/i18n';

interface ProjectCardProps {
    project: Project;
    index?: number;
    /** Captures mobiles en cascade inclinée (cartes de l'accueil). */
    tiltMobile?: boolean;
    /** Grande carte sur toute la largeur : image d'un côté, texte de l'autre (desktop). */
    isWide?: boolean;
}

function getPreviewImage(p: Project) {
    return p.screenshots_urls?.[0] ?? p.image_url ?? null;
}

function GithubIcon({ className = 'w-4 h-4' }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
    );
}

export function ProjectCard({ project, index = 0, tiltMobile = false, isWide = false }: ProjectCardProps) {
    const prefersReducedMotion = useReducedMotion();
    const previewImage = getPreviewImage(project);
    const { language, l } = useTranslation();
    const externalLink = primaryLinks(project, language)[0] ?? null;
    const { name, tagline } = splitTitle(project.title);
    const number = String(index + 1).padStart(2, '0');
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
            <SpotlightCard className="h-full" innerClassName={cn(isWide && 'md:flex-row')}>
                <Link
                    href={`/projects/${project.slug}`}
                    aria-label={`Voir ${project.title}`}
                    className="absolute inset-0 z-10 rounded-2xl"
                />

                <div
                    className={cn(
                        'relative aspect-[16/10] flex-shrink-0 overflow-hidden border-b border-slate-100 bg-slate-50',
                        isWide && 'md:aspect-auto md:min-h-[380px] md:w-[58%] md:border-r md:border-b-0',
                    )}
                >
                    {previewImage ? (
                        <ShotPreview
                            src={previewImage}
                            alt={project.title}
                            moreSrcs={project.screenshots_urls ?? []}
                            tiltMobile={tiltMobile}
                            className="transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.02]"
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

                <div className={cn('relative isolate flex flex-1 flex-col gap-3 overflow-hidden p-5 sm:p-6', isWide && 'md:justify-center md:gap-4 md:p-10')}>
                    <span
                        aria-hidden
                        className="pointer-events-none absolute -right-[0.04em] -bottom-[0.22em] -z-10 font-display text-[110px] leading-none font-extrabold tracking-[-0.06em] text-transparent select-none [-webkit-text-stroke:1.2px_var(--watermark-stroke)]"
                    >
                        {number}
                    </span>

                    <p className="flex items-center gap-2.5 font-mono text-[11px] text-slate-400">
                        <span className="text-teal-600">{number}</span>
                        <span className="h-px w-6 bg-slate-200" />
                        <span className="capitalize">{typeLabel}</span>
                    </p>

                    <div>
                        <h3
                            className={cn(
                                'font-display leading-[1.1] font-bold tracking-[-0.025em] text-slate-900',
                                isWide ? 'text-[22px] md:text-[36px]' : 'text-[22px]',
                            )}
                        >
                            <HoverUnderline>{name}</HoverUnderline>
                        </h3>
                        {tagline && (
                            <p className="mt-1 font-display text-[14px] font-semibold tracking-tight text-teal-700">{tagline}</p>
                        )}
                    </div>

                    <p className={cn('line-clamp-2 text-[15px] leading-relaxed text-slate-600', isWide && 'md:line-clamp-4 md:text-[17px]')}>
                        {project.description}
                    </p>

                    {project.tags.length > 0 && (
                        <dl className="grid grid-cols-[64px_1fr] gap-3 border-y border-slate-200 py-2 text-[13px]">
                            <dt className="font-mono text-[10px] tracking-wide text-slate-400 uppercase">Stack</dt>
                            <dd className="truncate text-slate-700">{project.tags.slice(0, 4).join(', ')}</dd>
                        </dl>
                    )}

                    <div className="relative z-20 mt-auto flex flex-wrap items-center gap-2 pt-1">
                        <Link href={`/projects/${project.slug}`} className={buttonVariants({ size: 'sm' })}>
                            {l('Voir le projet', 'View project')}
                        </Link>
                        {externalLink && (
                            <a
                                href={externalLink.href}
                                target="_blank"
                                rel="noreferrer"
                                className={buttonVariants({ variant: 'outline', size: 'sm' })}
                            >
                                {externalLink.label}
                            </a>
                        )}
                        {showGithub && (
                            <a
                                href={project.github_url!}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={l('Code source sur GitHub', 'Source code on GitHub')}
                                className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'px-2.5' })}
                            >
                                <GithubIcon className="h-4 w-4" />
                            </a>
                        )}
                    </div>
                </div>
            </SpotlightCard>
        </motion.article>
    );
}
