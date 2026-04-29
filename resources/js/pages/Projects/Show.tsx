import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { ProjectScreenshotsGallery } from '@/components/ui/ProjectScreenshotsGallery';
import MainLayout from '@/layouts/MainLayout';
import { cn, easings } from '@/lib/utils';
import type { ProjectShowProps } from '@/types';

// ─── Color maps ────────────────────────────────────────────────────────────────
const TAG_COLORS: Record<string, string> = {
    Laravel: 'border-red-200/60    bg-red-50/80    text-red-600',
    React: 'border-sky-200/60    bg-sky-50/80    text-sky-600',
    Flutter: 'border-blue-200/60   bg-blue-50/80   text-blue-600',
    TypeScript: 'border-blue-200/60   bg-blue-50/80   text-blue-700',
    MySQL: 'border-orange-200/60 bg-orange-50/80 text-orange-600',
    PostgreSQL: 'border-indigo-200/60 bg-indigo-50/80 text-indigo-600',
    Firebase: 'border-amber-200/60  bg-amber-50/80  text-amber-600',
    Redis: 'border-rose-200/60   bg-rose-50/80   text-rose-600',
    Python: 'border-yellow-200/60 bg-yellow-50/80 text-yellow-700',
    Dart: 'border-cyan-200/60   bg-cyan-50/80   text-cyan-600',
};
const PLATFORM_COLORS: Record<string, string> = {
    Web: 'border-slate-200/60 bg-white/70       text-slate-600',
    Android: 'border-emerald-200/60 bg-emerald-50/80 text-emerald-700',
    iOS: 'border-sky-200/60   bg-sky-50/80      text-sky-700',
    Desktop: 'border-indigo-200/60 bg-indigo-50/80  text-indigo-700',
    API: 'border-amber-200/60  bg-amber-50/80   text-amber-700',
    Windows: 'border-indigo-200/60 bg-indigo-50/80  text-indigo-700',
    macOS: 'border-slate-200/60  bg-white/70      text-slate-600',
    Linux: 'border-amber-200/60  bg-amber-50/80   text-amber-700',
};
const TYPE_MAP: Record<
    string,
    { color: string; glow: string; label_cls: string }
> = {
    web: {
        color: '#10b981',
        glow: 'rgba(16,185,129,0.25)',
        label_cls: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    mobile: {
        color: '#3b82f6',
        glow: 'rgba(59,130,246,0.25)',
        label_cls: 'text-blue-700   bg-blue-50   border-blue-200',
    },
    desktop: {
        color: '#6366f1',
        glow: 'rgba(99,102,241,0.25)',
        label_cls: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    },
    api: {
        color: '#f59e0b',
        glow: 'rgba(245,158,11,0.25)',
        label_cls: 'text-amber-700  bg-amber-50  border-amber-200',
    },
};
const defaultTag = 'border-slate-200/60 bg-white/60 text-slate-500';
const defaultPlatform = 'border-slate-200/60 bg-white/60 text-slate-600';

// ─── Icons ────────────────────────────────────────────────────────────────────
const GithubIcon = ({ cls = 'h-4 w-4' }: { cls?: string }) => (
    <svg viewBox="0 0 24 24" className={cls} fill="currentColor" aria-hidden>
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
);
const ExtIcon = ({ cls = 'h-4 w-4' }: { cls?: string }) => (
    <svg
        className={cls}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
    </svg>
);
const ArrowL = ({ cls = 'h-4 w-4' }: { cls?: string }) => (
    <svg
        className={cls}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M7 16l-4-4m0 0l4-4m-4 4h18"
        />
    </svg>
);
const ArrowR = ({ cls = 'h-4 w-4' }: { cls?: string }) => (
    <svg
        className={cls}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
        />
    </svg>
);
const AppleIcon = ({ cls = 'h-4 w-4' }: { cls?: string }) => (
    <svg viewBox="0 0 24 24" className={cls} fill="currentColor" aria-hidden>
        <path d="M16.365 12.33c.02 2.127 1.864 2.835 1.884 2.844-.016.05-.295 1.015-.973 2.01-.585.862-1.19 1.72-2.147 1.738-.94.018-1.242-.558-2.317-.558-1.076 0-1.412.54-2.3.576-.92.035-1.62-.924-2.21-1.782-1.205-1.742-2.124-4.921-.888-7.065.614-1.064 1.712-1.737 2.904-1.755.905-.018 1.76.612 2.317.612.558 0 1.606-.757 2.708-.646.462.02 1.758.187 2.59 1.405-.067.042-1.546.901-1.568 2.621ZM14.36 6.042c.49-.594.82-1.422.73-2.242-.707.029-1.562.47-2.07 1.064-.455.528-.854 1.373-.747 2.18.79.061 1.596-.402 2.087-1.002Z" />
    </svg>
);
const PlayStoreIcon = ({ cls = 'h-4 w-4' }: { cls?: string }) => (
    <svg viewBox="0 0 24 24" className={cls} fill="currentColor" aria-hidden>
        <path d="M4.8 3.5c-.24.24-.38.6-.38 1.07v14.86c0 .47.14.83.38 1.07l8.24-8.5L4.8 3.5Z" />
        <path d="M15.98 9.84 6.7 4.45l7.13 7.35 2.15-1.96Z" opacity="0.82" />
        <path
            d="M18.7 11.46c.82.45.82 1.18 0 1.63l-2.57 1.42-2.3-2.38 2.3-2.1 2.57 1.43Z"
            opacity="0.92"
        />
        <path d="m6.7 19.55 9.28-5.4-2.15-1.96-7.13 7.36Z" opacity="0.72" />
    </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function splitContent(c?: string) {
    return (c ?? '')
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);
}
function getPrimaryLink(p: ProjectShowProps['project']) {
    if (p.project_type === 'mobile')
        return (
            p.store_links?.play_store ??
            p.store_links?.app_store ??
            p.demo_url ??
            null
        );
    if (p.project_type === 'desktop')
        return (
            p.store_links?.windows ?? p.store_links?.macos ?? p.demo_url ?? null
        );
    if (p.project_type === 'api')
        return (
            p.store_links?.docs ?? p.store_links?.base_url ?? p.demo_url ?? null
        );
    return p.demo_url ?? null;
}
function getPrimaryLabel(p: ProjectShowProps['project']) {
    if (p.project_type === 'mobile') return 'Ouvrir le produit';
    if (p.project_type === 'desktop') return 'Voir le logiciel';
    if (p.project_type === 'api') return 'Explorer la base';
    return 'Voir la démo';
}

// ─── Glass surface — Liquid Glass 2026 ────────────────────────────────────────
function Glass({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'relative overflow-hidden rounded-lg',
                'bg-white/[0.62] backdrop-blur-xl',
                'border border-white/70',
                'shadow-[0_8px_32px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]',
                className,
            )}
        >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />
            {children}
        </div>
    );
}

// ─── Eyebrow ──────────────────────────────────────────────────────────────────
function Eyebrow({ children }: { children: React.ReactNode }) {
    return (
        <p className="mb-3 flex items-center gap-2 text-[10px] font-black tracking-[0.28em] text-slate-400/90 uppercase">
            <span className="inline-block h-px w-5 bg-teal-400/60" />
            {children}
        </p>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Show({ project, related }: ProjectShowProps) {
    const repoDisabled = project.private_repo || !project.github_url;
    const primaryLink = getPrimaryLink(project);
    const contentBlocks = splitContent(project.content);
    const screenshots = project.screenshots?.length ?? 0;
    const brandTeal = '#1aa389';
    const brandTealGlow = 'rgba(26,163,137,0.22)';
    const typeAccent = TYPE_MAP[project.project_type] ?? {
        color: brandTeal,
        glow: brandTealGlow,
        label_cls: 'text-teal-700 bg-teal-50 border-teal-200',
    };
    const primaryButtonClass =
        'inline-flex items-center justify-center gap-2 rounded-sm px-5 py-2.5 text-[13px] font-bold text-white transition-all hover:brightness-[1.03]';
    const secondaryButtonClass =
        'inline-flex items-center justify-center gap-2 rounded-sm border border-teal-200/80 bg-white/92 px-5 py-2.5 text-[13px] font-semibold text-teal-700 transition-colors hover:bg-teal-50/80 hover:text-teal-800';

    const allLinks = [
        project.demo_url && {
            href: project.demo_url,
            label: 'Démo live',
            icon: <ExtIcon />,
        },
        project.github_url &&
            !project.private_repo && {
                href: project.github_url,
                label: 'Code source',
                icon: <GithubIcon />,
            },
        project.store_links?.play_store && {
            href: project.store_links.play_store,
            label: 'Google Play',
            icon: <PlayStoreIcon />,
        },
        project.store_links?.app_store && {
            href: project.store_links.app_store,
            label: 'App Store',
            icon: <AppleIcon />,
        },
        project.store_links?.windows && {
            href: project.store_links.windows,
            label: 'Windows',
            icon: <ExtIcon />,
        },
        project.store_links?.macos && {
            href: project.store_links.macos,
            label: 'macOS',
            icon: <AppleIcon />,
        },
        project.store_links?.docs && {
            href: project.store_links.docs,
            label: 'Documentation',
            icon: <ExtIcon />,
        },
        project.store_links?.base_url && {
            href: project.store_links.base_url,
            label: 'Base URL',
            icon: <ExtIcon />,
        },
    ].filter(Boolean) as {
        href: string;
        label: string;
        icon: React.ReactNode;
    }[];

    return (
        <MainLayout>
            <Head title={`${project.title} — Sergio Junior Chebeu`} />

            <section className="relative overflow-hidden border-b border-slate-200/60 bg-[#f4f0e7] pt-[104px]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(26,163,137,0.10),transparent_30%),radial-gradient(circle_at_88%_12%,rgba(15,23,42,0.06),transparent_22%)]" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[340px] [background-image:linear-gradient(to_right,rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.18)_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,white,transparent)] [background-size:34px_34px] opacity-[0.16]" />
                <div className="pointer-events-none absolute top-24 left-[8%] h-24 w-24 rounded-full border border-teal-200/40" />
                <div className="pointer-events-none absolute right-[10%] bottom-12 h-px w-16 bg-teal-300/60" />

                <div className="container-main relative z-10 py-14 sm:py-16">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35 }}
                        className="mb-7"
                    >
                        <Link
                            href="/projects"
                            className="group inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] text-slate-500 uppercase transition-colors hover:text-teal-700"
                        >
                            <ArrowL cls="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                            Tous les projets
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 32 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.6,
                            delay: 0.1,
                            ease: easings.smooth,
                        }}
                        className="max-w-3xl"
                    >
                        <div className="mb-5 flex flex-wrap items-center gap-2">
                            <span
                                className={cn(
                                    'rounded-sm border px-3 py-1 text-[10px] font-black tracking-[0.2em] uppercase',
                                    typeAccent.label_cls,
                                )}
                            >
                                {project.project_type_label ??
                                    project.project_type}
                            </span>
                            {project.platforms?.slice(0, 3).map((p) => (
                                <span
                                    key={p}
                                    className="rounded-sm border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white/55 backdrop-blur-sm"
                                >
                                    {p}
                                </span>
                            ))}
                        </div>

                        <h1 className="font-display text-[clamp(2.4rem,6vw,5rem)] leading-[0.95] font-black tracking-[-0.04em] text-slate-950">
                            {project.title}
                        </h1>

                        <p className="mt-5 max-w-2xl text-[15px] leading-[1.85] text-slate-600 sm:text-[17px]">
                            {project.description}
                        </p>

                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            {primaryLink && (
                                <a
                                    href={primaryLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={primaryButtonClass}
                                    style={{
                                        background: brandTeal,
                                        boxShadow: `0 0 24px ${brandTealGlow}`,
                                    }}
                                >
                                    {getPrimaryLabel(project)}
                                </a>
                            )}
                            {!repoDisabled && (
                                <a
                                    href={project.github_url!}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={secondaryButtonClass}
                                >
                                    <GithubIcon cls="h-4 w-4" />
                                    Voir le code
                                </a>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Mobile sticky bar */}
            {(primaryLink || !repoDisabled) && (
                <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="sticky top-[56px] z-30 border-b border-white/40 bg-white/80 backdrop-blur-lg lg:hidden"
                >
                    <div className="container-main flex gap-3 py-3">
                        {primaryLink && (
                            <a
                                href={primaryLink}
                                target="_blank"
                                rel="noreferrer"
                                className="flex flex-1 items-center justify-center gap-2 rounded-sm px-4 py-2.5 text-[13px] font-bold text-white transition-colors"
                                style={{ background: brandTeal }}
                            >
                                {getPrimaryLabel(project)}
                            </a>
                        )}
                        {!repoDisabled && (
                            <a
                                href={project.github_url!}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 rounded-sm border border-teal-200 bg-white px-4 py-2.5 text-[13px] font-semibold text-teal-700 transition-colors hover:bg-teal-50/70"
                            >
                                <GithubIcon /> Code
                            </a>
                        )}
                    </div>
                </motion.div>
            )}

            {/* ══════════════════════════════════════════════════════════
                BODY — Soft Spatial mesh background
            ══════════════════════════════════════════════════════════ */}
            <div
                className="relative"
                style={{
                    background: `
                        radial-gradient(ellipse 70% 50% at 10% 15%, rgba(20,184,166,0.07) 0%, transparent 60%),
                        radial-gradient(ellipse 55% 45% at 88% 80%, rgba(99,102,241,0.06) 0%, transparent 55%),
                        radial-gradient(ellipse 40% 35% at 60% 40%, rgba(248,250,252,0.5) 0%, transparent 50%),
                        linear-gradient(155deg, #e8f4f1 0%, #eef0f8 30%, #faf9f6 58%, #edf5f1 100%)
                    `,
                }}
            >
                {/* Dot grid — masked top-only */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-[0.20]"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
                        backgroundSize: '28px 28px',
                        maskImage:
                            'radial-gradient(ellipse 100% 60% at 50% 0%, white 30%, transparent 100%)',
                    }}
                />

                <div className="container-main relative z-10 py-14 lg:py-20">
                    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_310px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_340px]">
                        {/* ── LEFT ─────────────────────────────────── */}
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.55,
                                delay: 0.15,
                                ease: easings.smooth,
                            }}
                            className="min-w-0 space-y-10"
                        >
                            {/* Bento stats */}
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    {
                                        label: 'Format',
                                        value:
                                            project.project_type_label ??
                                            project.project_type,
                                    },
                                    {
                                        label: 'Plateformes',
                                        value:
                                            project.platforms?.length > 0
                                                ? project.platforms.join(' · ')
                                                : 'Digital',
                                    },
                                    {
                                        label: 'Captures',
                                        value:
                                            screenshots > 0
                                                ? `${screenshots} écran${screenshots > 1 ? 's' : ''}`
                                                : '—',
                                    },
                                ].map((s, i) => (
                                    <motion.div
                                        key={s.label}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.18 + i * 0.07 }}
                                    >
                                        <Glass className="flex flex-col gap-1.5 p-4 sm:p-5">
                                            <span className="text-[9px] font-black tracking-[0.22em] text-slate-400/80 uppercase">
                                                {s.label}
                                            </span>
                                            <span className="text-[13px] leading-snug font-bold text-slate-800 sm:text-[14px]">
                                                {s.value}
                                            </span>
                                        </Glass>
                                    </motion.div>
                                ))}
                            </div>

                            {project.image_url && (
                                <section className="lg:hidden">
                                    <Eyebrow>Visuel</Eyebrow>
                                    <Glass className="p-3">
                                        <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-[#ebe7de]">
                                            <img
                                                src={project.image_url}
                                                alt={project.title}
                                                className="h-full w-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/12 to-transparent" />
                                        </div>
                                    </Glass>
                                </section>
                            )}

                            {/* Overview */}
                            <section>
                                <Eyebrow>Vue d'ensemble</Eyebrow>
                                <h2 className="mb-6 font-display text-2xl font-black tracking-[-0.035em] text-slate-900 sm:text-3xl">
                                    Ce que ce projet accomplit.
                                </h2>
                                {contentBlocks.length > 0 ? (
                                    <div className="space-y-3">
                                        {contentBlocks.map((para, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 10 }}
                                                whileInView={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                viewport={{
                                                    once: true,
                                                    amount: 0.25,
                                                }}
                                                transition={{
                                                    duration: 0.4,
                                                    delay: i * 0.05,
                                                }}
                                            >
                                                <Glass className="px-6 py-5">
                                                    <div
                                                        className="pointer-events-none absolute inset-y-0 left-0 w-[3px]"
                                                        style={{
                                                            background: `linear-gradient(to bottom, ${brandTeal}90, ${brandTeal}15)`,
                                                        }}
                                                    />
                                                    <p className="pl-3 text-[15px] leading-[1.9] text-slate-600 sm:text-[16px]">
                                                        {para}
                                                    </p>
                                                </Glass>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <Glass className="px-6 py-10 text-center">
                                        <p className="text-[14px] text-slate-400">
                                            Pas de description disponible.
                                        </p>
                                    </Glass>
                                )}
                            </section>

                            {/* Key points */}
                            <section>
                                <Eyebrow>Points clés</Eyebrow>
                                <h2 className="mb-6 font-display text-2xl font-black tracking-[-0.035em] text-slate-900 sm:text-3xl">
                                    Décisions et exigences.
                                </h2>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {[
                                        {
                                            n: '01',
                                            title: 'Qualité de finition',
                                            body: 'Une exécution concentrée sur la lisibilité, la vitesse et une base technique propre — suffisamment solide pour évoluer sans accumuler de dette.',
                                        },
                                        {
                                            n: '02',
                                            title: 'Stack moderne',
                                            body: 'Surfaces cohérentes, distribution adaptée au type de produit — site, application mobile, logiciel desktop ou API.',
                                        },
                                    ].map((card) => (
                                        <Glass
                                            key={card.n}
                                            className="group p-6 transition-shadow hover:shadow-[0_12px_40px_rgba(15,23,42,0.10)]"
                                        >
                                            <span
                                                className="pointer-events-none absolute top-2 right-4 font-display text-7xl leading-none font-black opacity-[0.04] select-none"
                                                style={{
                                                    color: typeAccent.color,
                                                }}
                                            >
                                                {card.n}
                                            </span>
                                            <div
                                                className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-25"
                                                style={{
                                                    background: typeAccent.glow,
                                                }}
                                            />
                                            <p className="mb-3 text-[12px] font-black tracking-[0.1em] text-slate-800 uppercase">
                                                {card.title}
                                            </p>
                                            <p className="text-[14px] leading-[1.8] text-slate-500">
                                                {card.body}
                                            </p>
                                        </Glass>
                                    ))}
                                </div>
                            </section>

                            {/* Screenshots */}
                            {project.screenshots?.length > 0 && (
                                <section>
                                    <Eyebrow>Galerie</Eyebrow>
                                    <h2 className="mb-6 font-display text-2xl font-black tracking-[-0.035em] text-slate-900 sm:text-3xl">
                                        Lecture visuelle du produit.
                                    </h2>
                                    <Glass className="p-4 sm:p-6">
                                        <div className="mb-4 flex items-center justify-between">
                                            <span className="text-[10px] font-black tracking-[0.22em] text-slate-400 uppercase">
                                                {screenshots} capture
                                                {screenshots > 1 ? 's' : ''}
                                            </span>
                                            <div className="flex gap-1.5">
                                                {[
                                                    ...Array(
                                                        Math.min(
                                                            screenshots,
                                                            5,
                                                        ),
                                                    ),
                                                ].map((_, i) => (
                                                    <span
                                                        key={i}
                                                        className="h-1.5 w-1.5 rounded-full"
                                                        style={{
                                                            background:
                                                                i === 0
                                                                    ? brandTeal
                                                                    : `${brandTeal}40`,
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <ProjectScreenshotsGallery
                                            projectType={project.project_type}
                                            screenshots={project.screenshots}
                                            title={project.title}
                                            demoUrl={project.demo_url}
                                        />
                                    </Glass>
                                </section>
                            )}
                        </motion.div>

                        {/* ── RIGHT sidebar ─────────────────────────── */}
                        <motion.aside
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.55,
                                delay: 0.25,
                                ease: easings.smooth,
                            }}
                            className="hidden lg:block"
                        >
                            <div className="sticky top-28 space-y-4">
                                {/* CTA card */}
                                <Glass>
                                    {project.image_url && (
                                        <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                                            <img
                                                src={project.image_url}
                                                alt={project.title}
                                                className="h-full w-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                            <div className="absolute inset-0 ring-1 ring-white/10 ring-inset" />
                                            <div className="absolute bottom-3 left-3">
                                                <span
                                                    className={cn(
                                                        'rounded-sm border px-2.5 py-0.5 text-[10px] font-black tracking-[0.18em] uppercase backdrop-blur-sm',
                                                        typeAccent.label_cls,
                                                    )}
                                                >
                                                    {project.project_type_label ??
                                                        project.project_type}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="p-5">
                                        <Eyebrow>Actions</Eyebrow>
                                        <div className="flex flex-col gap-2.5">
                                            {primaryLink && (
                                                <a
                                                    href={primaryLink}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className={
                                                        primaryButtonClass
                                                    }
                                                    style={{
                                                        background: brandTeal,
                                                        boxShadow: `0 4px 20px ${brandTealGlow}`,
                                                    }}
                                                >
                                                    {getPrimaryLabel(project)}
                                                </a>
                                            )}
                                            {!repoDisabled ? (
                                                <a
                                                    href={project.github_url!}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className={
                                                        secondaryButtonClass
                                                    }
                                                >
                                                    <GithubIcon />
                                                    Voir le code
                                                </a>
                                            ) : (
                                                <div className="flex items-center justify-center gap-2 rounded-sm border border-slate-100 bg-slate-50/80 px-4 py-3 text-[13px] font-semibold text-slate-400 select-none">
                                                    <GithubIcon />
                                                    {project.private_repo
                                                        ? 'Dépôt privé'
                                                        : 'Non disponible'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Glass>

                                {/* Stack */}
                                <Glass className="p-5">
                                    <Eyebrow>Stack</Eyebrow>
                                    <div className="flex flex-wrap gap-1.5">
                                        {project.tags.map((t) => (
                                            <span
                                                key={t}
                                                className={cn(
                                                    'rounded-sm border px-2.5 py-1 text-[11px] font-semibold',
                                                    TAG_COLORS[t] ?? defaultTag,
                                                )}
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                    {project.platforms?.length > 0 && (
                                        <>
                                            <div className="my-4 h-px bg-slate-100/80" />
                                            <Eyebrow>Distribution</Eyebrow>
                                            <div className="flex flex-wrap gap-1.5">
                                                {project.platforms.map((p) => (
                                                    <span
                                                        key={p}
                                                        className={cn(
                                                            'rounded-sm border px-2.5 py-1 text-[11px] font-semibold',
                                                            PLATFORM_COLORS[
                                                                p
                                                            ] ??
                                                                defaultPlatform,
                                                        )}
                                                    >
                                                        {p}
                                                    </span>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </Glass>

                                {/* Links */}
                                {allLinks.length > 0 && (
                                    <Glass className="p-5">
                                        <Eyebrow>Liens utiles</Eyebrow>
                                        <div className="flex flex-col gap-1.5">
                                            {allLinks.map((l) => (
                                                <a
                                                    key={l.label}
                                                    href={l.href}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="group flex items-center justify-between rounded-sm border border-transparent px-3 py-2.5 text-[13px] font-medium text-slate-600 transition-all hover:border-slate-200/80 hover:bg-white/80 hover:text-slate-900"
                                                >
                                                    {l.label}
                                                    <span className="text-slate-300 transition-colors group-hover:text-teal-600">
                                                        {l.icon}
                                                    </span>
                                                </a>
                                            ))}
                                        </div>
                                    </Glass>
                                )}
                            </div>
                        </motion.aside>
                    </div>
                </div>
            </div>

            {/* Mobile sidebar content */}
            <div className="border-t border-slate-200/60 bg-white/80 backdrop-blur-sm lg:hidden">
                <div className="container-main space-y-6 py-10">
                    <div>
                        <Eyebrow>Stack</Eyebrow>
                        <div className="flex flex-wrap gap-2">
                            {project.tags.map((t) => (
                                <span
                                    key={t}
                                    className={cn(
                                        'rounded-sm border px-2.5 py-1 text-[11px] font-semibold',
                                        TAG_COLORS[t] ?? defaultTag,
                                    )}
                                >
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                    {project.platforms?.length > 0 && (
                        <div>
                            <Eyebrow>Distribution</Eyebrow>
                            <div className="flex flex-wrap gap-2">
                                {project.platforms.map((p) => (
                                    <span
                                        key={p}
                                        className={cn(
                                            'rounded-sm border px-2.5 py-1 text-[11px] font-semibold',
                                            PLATFORM_COLORS[p] ??
                                                defaultPlatform,
                                        )}
                                    >
                                        {p}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    {allLinks.length > 0 && (
                        <div>
                            <Eyebrow>Liens utiles</Eyebrow>
                            <div className="flex flex-col gap-2">
                                {allLinks.map((l) => (
                                    <a
                                        key={l.label}
                                        href={l.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-between rounded-sm border border-slate-200 bg-white px-4 py-3 text-[13px] font-medium text-slate-700 transition-all hover:border-teal-200 hover:bg-teal-50/60 hover:text-teal-700"
                                    >
                                        {l.label}
                                        <span className="text-slate-300">
                                            {l.icon}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════
                RELATED
            ══════════════════════════════════════════════════════════ */}
            {related.length > 0 && (
                <section
                    className="relative overflow-hidden py-16 sm:py-20"
                    style={{
                        background: `
                            radial-gradient(ellipse 60% 50% at 90% 20%, rgba(20,184,166,0.06) 0%, transparent 55%),
                            linear-gradient(170deg, #eef3f0 0%, #eef1f8 45%, #f5f3ee 100%)
                        `,
                    }}
                >
                    {/* Diagonal accent lines */}
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 overflow-hidden"
                    >
                        <div className="absolute top-0 -right-20 h-full w-px rotate-[15deg] bg-gradient-to-b from-transparent via-teal-300/15 to-transparent" />
                        <div className="via-teal-300/08 absolute top-0 -right-4 h-full w-px rotate-[15deg] bg-gradient-to-b from-transparent to-transparent" />
                    </div>

                    <div className="container-main relative z-10">
                        <div className="mb-10 flex items-end justify-between gap-4">
                            <div>
                                <Eyebrow>Suite</Eyebrow>
                                <h2 className="font-display text-2xl font-black tracking-[-0.035em] text-slate-900 sm:text-3xl">
                                    D'autres projets.
                                </h2>
                            </div>
                            <Link
                                href="/projects"
                                className="hidden shrink-0 items-center gap-1.5 text-[12px] font-bold tracking-[0.12em] text-teal-600 uppercase transition-colors hover:text-teal-500 sm:flex"
                            >
                                Tout voir <ArrowR cls="h-3 w-3" />
                            </Link>
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {related.map((rp, i) => (
                                <motion.div
                                    key={rp.id}
                                    initial={{ opacity: 0, y: 18 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{
                                        duration: 0.45,
                                        ease: easings.smooth,
                                        delay: i * 0.07,
                                    }}
                                >
                                    <ProjectCard project={rp} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ══════════════════════════════════════════════════════════
                BOTTOM CTA — dark, with ambient glow
            ══════════════════════════════════════════════════════════ */}
            <section className="relative overflow-hidden border-t border-slate-200/60 bg-[#070d0a] py-20 text-center">
                <div
                    className="pointer-events-none absolute top-0 left-1/2 h-72 w-[500px] -translate-x-1/2 -translate-y-1/2 opacity-25 blur-[90px]"
                    style={{ background: typeAccent.glow }}
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-[0.10]"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
                        backgroundSize: '32px 32px',
                        maskImage:
                            'radial-gradient(ellipse 70% 80% at 50% 50%, white, transparent)',
                    }}
                />

                <div className="container-main relative z-10 max-w-lg">
                    <span
                        className="mb-4 inline-block text-[10px] font-black tracking-[0.28em] uppercase"
                        style={{ color: typeAccent.color }}
                    >
                        Collaboration
                    </span>
                    <h3 className="mb-4 font-display text-3xl font-black tracking-[-0.04em] text-white sm:text-[2.6rem]">
                        Un projet similaire
                        <br className="hidden sm:block" /> en tête ?
                    </h3>
                    <p className="mb-8 text-[15px] leading-[1.8] text-white/40">
                        Discutons ensemble de vos idées, contraintes et
                        ambitions produit.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-3 rounded-sm px-8 py-4 text-[14px] font-bold text-white transition-all"
                        style={{
                            background: brandTeal,
                            boxShadow: `0 0 40px ${brandTealGlow}, 0 4px 16px rgba(0,0,0,0.3)`,
                        }}
                    >
                        Discutons-en
                    </Link>
                </div>
            </section>
        </MainLayout>
    );
}
