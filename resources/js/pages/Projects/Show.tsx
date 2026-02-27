// resources/js/Pages/Projects/Show.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Page détail d'un projet
// Flutter équivalent : une page de détail avec Hero widget + scroll
// ─────────────────────────────────────────────────────────────────────────────

import { Head, Link }            from '@inertiajs/react';
import { motion }                from 'framer-motion';
import MainLayout                from '@/layouts/MainLayout';
import { ProjectCard }           from '@/components/ui/ProjectCard';
import { cn, easings }           from '@/lib/utils';
import type { ProjectShowProps } from '@/types';

// Couleurs tags (même objet que ProjectCard — à déplacer dans utils si besoin)
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
};
const defaultTagColor = 'bg-slate-50 text-slate-600 border-slate-100';

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────────────────────
export default function Show({ project, related }: ProjectShowProps) {
    return (
        <MainLayout>
            <Head title={`${project.title} — Sergio Junior Chebeu`} />

            {/* ── Hero projet ───────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-surface-card border-b border-slate-200/60">

                {/* Orbe décoratif */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="container-main relative z-10 py-12 sm:py-16">

                    {/* Breadcrumb retour */}
                    <motion.div
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, ease: easings.smooth }}
                    >
                        <Link
                            href="/projects"
                            className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-teal-600 transition-colors mb-8 group"
                        >
                            <svg
                                className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                            </svg>
                            Retour aux projets
                        </Link>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

                        {/* Infos gauche */}
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: easings.smooth, delay: 0.1 }}
                            className="space-y-6"
                        >
                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className={cn(
                                            'text-xs font-medium px-2.5 py-1 rounded-lg border',
                                            TAG_COLORS[tag] ?? defaultTagColor,
                                        )}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Titre */}
                            <h1 className="text-3xl sm:text-4xl font-display font-bold text-ink-primary tracking-tight leading-tight">
                                {project.title}
                            </h1>

                            {/* Description */}
                            <p className="text-lg text-ink-secondary leading-relaxed">
                                {project.description}
                            </p>

                            {/* Liens */}
                            <div className="flex flex-wrap gap-3 pt-2">
                                {project.github_url && (
                                    <a
                                        href={project.github_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors duration-200"
                                    >
                                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                                            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                                        </svg>
                                        Voir le code
                                    </a>
                                )}
                                {project.demo_url && (
                                    <a
                                        href={project.demo_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors duration-200 shadow-sm shadow-teal-500/20"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        Voir la démo
                                    </a>
                                )}
                            </div>
                        </motion.div>

                        {/* Image droite */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, ease: easings.smooth, delay: 0.2 }}
                            className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 aspect-video shadow-xl shadow-slate-200/60 border border-slate-200/60"
                        >
                            {project.image_url ? (
                                <img
                                    src={project.image_url}
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="text-center space-y-3">
                                        <div className="w-16 h-16 mx-auto rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center">
                                            <svg className="w-8 h-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

            {/* ── Contenu Markdown ──────────────────────────────────────── */}
            {project.content && (
                <section className="container-main py-12 sm:py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: easings.smooth, delay: 0.3 }}
                        className="max-w-3xl mx-auto"
                    >
                        {/* Prose — contenu formaté */}
                        {/* Pour rendre le Markdown, installe : npm install react-markdown */}
                        {/* Pour l'instant on affiche en texte brut proprement */}
                        <div className="prose prose-slate prose-headings:font-display prose-headings:text-ink-primary prose-a:text-teal-600 prose-strong:text-ink-primary max-w-none">
                            <pre className="whitespace-pre-wrap font-sans text-sm text-ink-secondary leading-relaxed bg-transparent p-0 border-0">
                                {project.content.trim()}
                            </pre>
                        </div>
                    </motion.div>
                </section>
            )}

            {/* ── Projets similaires ────────────────────────────────────── */}
            {related.length > 0 && (
                <section className="border-t border-slate-200/60 bg-surface-card">
                    <div className="container-main py-12 sm:py-16">

                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-px flex-1 bg-slate-200" />
                            <p className="text-xs font-medium text-ink-muted uppercase tracking-[0.2em] whitespace-nowrap">
                                Autres projets
                            </p>
                            <div className="h-px flex-1 bg-slate-200" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {related.map((p, i) => (
                                <ProjectCard
                                    key={p.id}
                                    project={p as any}
                                    index={i}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

        </MainLayout>
    );
}