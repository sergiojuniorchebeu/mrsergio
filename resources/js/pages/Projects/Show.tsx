import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import MainLayout from '@/layouts/MainLayout';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { ProjectScreenshotsGallery } from '@/components/ui/ProjectScreenshotsGallery';
import { cn, easings } from '@/lib/utils';
import type { ProjectShowProps } from '@/types';

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
};

const defaultTagColor = 'bg-slate-50 text-slate-600 border-slate-100';

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

const TYPE_COLORS: Record<string, string> = {
    web: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    mobile: 'bg-blue-50 text-blue-700 border-blue-100',
    desktop: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    api: 'bg-amber-50 text-amber-700 border-amber-100',
};

export default function Show({ project, related }: ProjectShowProps) {
    const repoDisabled = project.private_repo || !project.github_url;

    return (
        <MainLayout>
            <Head title={`${project.title} — Sergio Junior Chebeu`} />

            <section className="relative overflow-hidden border-b border-slate-200/60 bg-surface-card">
                <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-teal-500/5 blur-3xl" />

                <div className="container-main relative z-10 py-12 sm:py-16">
                    <motion.div
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, ease: easings.smooth }}
                    >
                        <Link
                            href="/projects"
                            className="group mb-8 inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-teal-600"
                        >
                            <svg className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                            </svg>
                            Retour aux projets
                        </Link>
                    </motion.div>

                    <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: easings.smooth, delay: 0.1 }}
                            className="space-y-6"
                        >
                            <div className="flex flex-wrap gap-2">
                                <span
                                    className={cn(
                                        'rounded-lg border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide',
                                        TYPE_COLORS[project.project_type] ?? 'bg-slate-50 text-slate-700 border-slate-200'
                                    )}
                                >
                                    {project.project_type_label ?? project.project_type}
                                </span>

                                {project.tags.map((tag: string) => (
                                    <span
                                        key={tag}
                                        className={cn(
                                            'rounded-lg border px-2.5 py-1 text-xs font-medium',
                                            TAG_COLORS[tag] ?? defaultTagColor
                                        )}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {project.platforms?.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {project.platforms.map((platform: string) => (
                                        <span
                                            key={platform}
                                            className={cn(
                                                'rounded-lg border px-2.5 py-1 text-xs font-medium',
                                                PLATFORM_COLORS[platform] ?? defaultPlatformColor
                                            )}
                                        >
                                            {platform}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-ink-primary sm:text-4xl">
                                {project.title}
                            </h1>

                            <p className="text-lg leading-relaxed text-ink-secondary">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-3 pt-2">
                                {!repoDisabled ? (
                                    <a
                                        href={project.github_url!}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-slate-700"
                                    >
                                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                                            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                                        </svg>
                                        Voir le code
                                    </a>
                                ) : (
                                    <button
                                        type="button"
                                        disabled
                                        title={project.private_repo ? 'Repo privé' : 'Repo non disponible'}
                                        className="cursor-not-allowed inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-500"
                                    >
                                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                                            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                                        </svg>
                                        {project.private_repo ? 'Repo privé' : 'Repo indisponible'}
                                    </button>
                                )}

                                {project.demo_url && (
                                    <a
                                        href={project.demo_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-teal-500/20 transition-colors duration-200 hover:bg-teal-700"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        Voir la démo
                                    </a>
                                )}
                            </div>

                            {project.project_type === 'mobile' && (
                                <div className="flex flex-wrap gap-3 pt-1">
                                    {project.store_links?.play_store && (
                                        <a
                                            href={project.store_links.play_store}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                                        >
                                            Play Store
                                        </a>
                                    )}

                                    {project.store_links?.app_store && (
                                        <a
                                            href={project.store_links.app_store}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-700"
                                        >
                                            App Store
                                        </a>
                                    )}
                                </div>
                            )}

                            {project.project_type === 'desktop' && (
                                <div className="flex flex-wrap gap-3 pt-1">
                                    {project.store_links?.windows && (
                                        <a
                                            href={project.store_links.windows}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                                        >
                                            Windows
                                        </a>
                                    )}

                                    {project.store_links?.macos && (
                                        <a
                                            href={project.store_links.macos}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
                                        >
                                            macOS
                                        </a>
                                    )}

                                    {project.store_links?.linux && (
                                        <a
                                            href={project.store_links.linux}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
                                        >
                                            Linux
                                        </a>
                                    )}
                                </div>
                            )}

                            {project.project_type === 'api' && (
                                <div className="flex flex-wrap gap-3 pt-1">
                                    {project.store_links?.docs && (
                                        <a
                                            href={project.store_links.docs}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
                                        >
                                            Documentation
                                        </a>
                                    )}

                                    {project.store_links?.postman && (
                                        <a
                                            href={project.store_links.postman}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
                                        >
                                            Postman
                                        </a>
                                    )}

                                    {project.store_links?.base_url && (
                                        <a
                                            href={project.store_links.base_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
                                        >
                                            Base URL
                                        </a>
                                    )}
                                </div>
                            )}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, ease: easings.smooth, delay: 0.2 }}
                            className="relative aspect-video overflow-hidden rounded-2xl border border-slate-200/60 bg-gradient-to-br from-slate-100 to-slate-50 shadow-xl shadow-slate-200/60"
                        >
                            {project.image_url ? (
                                <img src={project.image_url} alt={project.title} className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <div className="space-y-3 text-center">
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-teal-100 bg-teal-50">
                                            <svg className="h-8 w-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                            </svg>
                                        </div>
                                        <p className="text-sm text-slate-400">Pas d'image disponible</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>

            {project.content && (
                <section className="container-main py-12 sm:py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: easings.smooth, delay: 0.3 }}
                        className="mx-auto max-w-3xl"
                    >
                        <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-ink-primary prose-a:text-teal-600 prose-strong:text-ink-primary">
                            <pre className="whitespace-pre-wrap border-0 bg-transparent p-0 font-sans text-sm leading-relaxed text-ink-secondary">
                                {project.content.trim()}
                            </pre>
                        </div>
                    </motion.div>
                </section>
            )}

            {project.screenshots?.length > 0 && (
                <section className="pb-16 sm:pb-20">
                    <div className="container-main">
                        <div className="mb-8 flex items-center gap-4">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-200" />
                            <div className="flex flex-shrink-0 items-center gap-2.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
                                    Captures d'écran
                                </p>
                                <span className="rounded-full border border-teal-100 bg-teal-50 px-2 py-0.5 text-[10px] font-bold tabular-nums text-teal-600">
                                    {project.screenshots.length}
                                </span>
                            </div>
                            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-200" />
                        </div>

                        <ProjectScreenshotsGallery
                            projectType={project.project_type}
                            screenshots={project.screenshots}
                            title={project.title}
                            demoUrl={project.demo_url}
                        />
                    </div>
                </section>
            )}

            {related.length > 0 && (
                <section className="border-t border-slate-200/60 bg-surface-card">
                    <div className="container-main py-12 sm:py-16">
                        <div className="mb-8 flex items-center gap-4">
                            <div className="h-px flex-1 bg-slate-200" />
                            <p className="whitespace-nowrap text-xs font-medium uppercase tracking-[0.2em] text-ink-muted">
                                Autres projets
                            </p>
                            <div className="h-px flex-1 bg-slate-200" />
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {related.map((p: any, i: number) => (
                                <ProjectCard key={p.id} project={p} index={i} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </MainLayout>
    );
}