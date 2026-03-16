import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { cn, easings } from '@/lib/utils';
import type { Project } from '@/types';

interface ProjectCardProps {
    project: Project;
    index?: number;
    featured?: boolean;
}

const TAG_COLORS: Record<string, string> = {
    Laravel: 'bg-red-50 text-red-600 border-red-100',
    React: 'bg-sky-50 text-sky-600 border-sky-100',
    Flutter: 'bg-blue-50 text-blue-600 border-blue-100',
    TypeScript: 'bg-blue-50 text-blue-700 border-blue-100',
    MySQL: 'bg-orange-50 text-orange-600 border-orange-100',
    PostgreSQL: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    Firebase: 'bg-amber-50 text-amber-600 border-amber-100',
    Redis: 'bg-rose-50 text-rose-600 border-rose-100',
    Python: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    Dart: 'bg-cyan-50 text-cyan-600 border-cyan-100',
    Docker: 'bg-sky-50 text-sky-700 border-sky-100',
};

const defaultTagColor = 'bg-slate-50 text-slate-600 border-slate-100';

const TYPE_COLORS: Record<string, string> = {
    web: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    mobile: 'bg-blue-50 text-blue-700 border-blue-100',
    desktop: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    api: 'bg-amber-50 text-amber-700 border-amber-100',
};

const PLATFORM_COLORS: Record<string, string> = {
    Web: 'bg-slate-50 text-slate-700 border-slate-200',
    Android: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    iOS: 'bg-sky-50 text-sky-700 border-sky-100',
    Desktop: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    API: 'bg-amber-50 text-amber-700 border-amber-100',
    Windows: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    macOS: 'bg-slate-50 text-slate-700 border-slate-200',
    Linux: 'bg-amber-50 text-amber-700 border-amber-100',
};

const defaultPlatformColor = 'bg-slate-50 text-slate-700 border-slate-200';

function GithubIcon({ className = 'w-4 h-4' }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
    );
}

function ExternalIcon({ className = 'w-4 h-4' }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
    );
}

function MobileIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 18h.01M8 4h8a2 2 0 012 2v12a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z" />
        </svg>
    );
}

function DesktopIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.75 17L8.5 20h7L14.25 17M4 5h16a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z" />
        </svg>
    );
}

function ApiIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 9l-3 3 3 3M16 9l3 3-3 3M14 4l-4 16" />
        </svg>
    );
}

function WebIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function getTypeIcon(type?: string) {
    switch (type) {
        case 'mobile':
            return <MobileIcon />;
        case 'desktop':
            return <DesktopIcon />;
        case 'api':
            return <ApiIcon />;
        default:
            return <WebIcon />;
    }
}

function getTypeLabel(project: Project) {
    return project.project_type_label ?? project.project_type?.toUpperCase?.() ?? 'PROJECT';
}

function getPreviewImage(project: Project) {
    if (project.screenshots_urls?.length) return project.screenshots_urls[0];
    if (project.image_url) return project.image_url;
    return null;
}

function getPrimaryExternalLink(project: Project) {
    if (project.project_type === 'mobile') {
        return project.store_links?.play_store || project.store_links?.app_store || project.demo_url || null;
    }

    if (project.project_type === 'desktop') {
        return project.store_links?.windows || project.store_links?.macos || project.store_links?.linux || project.demo_url || null;
    }

    if (project.project_type === 'api') {
        return project.store_links?.docs || project.store_links?.postman || project.store_links?.base_url || null;
    }

    return project.demo_url || null;
}

function getFooterLabel(project: Project) {
    switch (project.project_type) {
        case 'mobile':
            return 'Voir l’app';
        case 'desktop':
            return 'Voir le logiciel';
        case 'api':
            return 'Voir l’API';
        default:
            return 'Voir le projet';
    }
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
    const previewImage = getPreviewImage(project);
    const externalLink = getPrimaryExternalLink(project);

    return (
        <motion.article
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: easings.smooth,
            }}
            className="h-full"
        >
            <div
                className={cn(
                    'group relative h-full flex flex-col',
                    'bg-surface-card rounded-2xl overflow-hidden',
                    'border border-slate-200/80',
                    'shadow-sm hover:shadow-xl hover:shadow-teal-900/8',
                    'transition-all duration-300 ease-out',
                    'hover:-translate-y-1'
                )}
            >
                {/* Overlay de navigation vers la page détail */}
                <Link
                    href={`/projects/${project.slug}`}
                    aria-label={`Voir le projet ${project.title}`}
                    className="absolute inset-0 z-10 rounded-2xl"
                />

                <div className="relative h-48 sm:h-52 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 flex-shrink-0">
                    {previewImage ? (
                        <img
                            src={previewImage}
                            alt={project.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
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

                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-2">
                        <span
                            className={cn(
                                'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide backdrop-blur-sm',
                                TYPE_COLORS[project.project_type ?? 'web'] ?? 'bg-slate-50 text-slate-700 border-slate-200'
                            )}
                        >
                            {getTypeIcon(project.project_type)}
                            {getTypeLabel(project)}
                        </span>

                        {project.featured && (
                            <div className="flex items-center gap-1.5 bg-teal-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                                <span className="w-1.5 h-1.5 bg-white rounded-full" />
                                Featured
                            </div>
                        )}
                    </div>

                    <div className="absolute top-3 right-3 z-20 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                        {project.github_url && (
                            project.private_repo ? (
                                <span
                                    className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-lg text-slate-500 shadow-sm"
                                    aria-disabled="true"
                                    title="Repo privé"
                                >
                                    <GithubIcon />
                                </span>
                            ) : (
                                <a
                                    href={project.github_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-lg text-slate-700 hover:text-teal-600 shadow-sm transition-colors"
                                    aria-label="GitHub"
                                >
                                    <GithubIcon />
                                </a>
                            )
                        )}

                        {externalLink && (
                            <a
                                href={externalLink}
                                target="_blank"
                                rel="noreferrer"
                                className="w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-lg text-slate-700 hover:text-teal-600 shadow-sm transition-colors"
                                aria-label="Lien externe"
                            >
                                <ExternalIcon />
                            </a>
                        )}
                    </div>
                </div>

                <div className="flex flex-col flex-1 p-5 sm:p-6 space-y-4">
                    <div className="flex flex-wrap gap-1.5">
                        {project.tags.slice(0, 4).map((tag) => (
                            <span
                                key={tag}
                                className={cn(
                                    'text-xs font-medium px-2 py-0.5 rounded-md border',
                                    TAG_COLORS[tag] ?? defaultTagColor
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

                    {project.platforms?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {project.platforms.slice(0, 3).map((platform) => (
                                <span
                                    key={platform}
                                    className={cn(
                                        'text-[11px] font-medium px-2 py-0.5 rounded-md border',
                                        PLATFORM_COLORS[platform] ?? defaultPlatformColor
                                    )}
                                >
                                    {platform}
                                </span>
                            ))}

                            {project.platforms.length > 3 && (
                                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md border bg-slate-50 text-slate-400 border-slate-100">
                                    +{project.platforms.length - 3}
                                </span>
                            )}
                        </div>
                    )}

                    <h3 className="font-display font-semibold text-lg text-ink-primary leading-snug group-hover:text-teal-600 transition-colors duration-200">
                        {project.title}
                    </h3>

                    <p className="text-sm text-ink-muted leading-relaxed flex-1">
                        {project.description}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="text-sm font-medium text-teal-600 flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-200">
                            {getFooterLabel(project)}
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </span>

                        <div className="flex items-center gap-1.5">
                            {project.github_url && (
                                <span
                                    className={cn(
                                        'w-6 h-6 flex items-center justify-center rounded-md',
                                        project.private_repo
                                            ? 'bg-slate-100 text-slate-400'
                                            : 'bg-slate-100 text-slate-500'
                                    )}
                                    title={project.private_repo ? 'Repo privé' : 'GitHub'}
                                >
                                    <GithubIcon className="w-3.5 h-3.5" />
                                </span>
                            )}

                            {externalLink && (
                                <span className="w-6 h-6 flex items-center justify-center rounded-md bg-teal-50 text-teal-500">
                                    <ExternalIcon className="w-3.5 h-3.5" />
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.article>
    );
}