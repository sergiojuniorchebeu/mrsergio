import { Head, Link } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';
import { ProjectCaseStudy } from '@/components/portofolio/project-case-study';
import { ProjectGallery } from '@/components/portofolio/project-gallery';
import { primaryLinks, splitTitle } from '@/components/portofolio/project-meta';
import {
    ExpandingCover,
    ReadingProgress,
} from '@/components/portofolio/reading-chrome';
import { buttonVariants } from '@/components/ui/button';
import { HeroBackdrop } from '@/components/ui/hero-backdrop';
import {
    DrawLine,
    MaskedLine,
    Reveal,
    SplitChars,
} from '@/components/ui/reveal';
import { SectionBackdrop } from '@/components/ui/section-backdrop';
import MainLayout from '@/layouts/MainLayout';
import { useTranslation } from '@/lib/i18n';
import { easings } from '@/lib/utils';
import type { Project, ProjectShowProps } from '@/types';

function projectYear(createdAt?: string): string | null {
    return createdAt?.split('/')[2] ?? null;
}

function previewImage(project: Project): string | null {
    return project.image_url || project.screenshots_urls?.[0] || null;
}

// ─── Fiche technique ─────────────────────────────────────────────────────────
function FactRow({
    label,
    children,
    delay,
}: {
    label: string;
    children: React.ReactNode;
    delay: number;
}) {
    return (
        <div>
            <DrawLine />
            <Reveal
                y={10}
                delay={delay}
                className="grid grid-cols-[110px_1fr] gap-4 py-4"
            >
                <dt className="font-mono text-[11px] tracking-wide text-slate-400 uppercase">
                    {label}
                </dt>
                <dd className="text-[16px] leading-snug text-slate-800">
                    {children}
                </dd>
            </Reveal>
        </div>
    );
}

// ─── Projet suivant ──────────────────────────────────────────────────────────
function NextProject({ projects }: { projects: Project[] }) {
    const [next, ...others] = projects;
    const { l } = useTranslation();

    if (!next) {
        return null;
    }

    const { name, tagline } = splitTitle(next.title);
    const image = previewImage(next);

    return (
        <section className="relative isolate overflow-clip border-t border-slate-200/80 bg-white py-24 sm:py-32">
            <SectionBackdrop pattern="grid" />
            <div className="container-main">
                <Reveal y={8}>
                    <p className="mb-8 font-mono text-[11px] text-slate-400">
                        {l('Projet suivant', 'Next project')}
                    </p>
                </Reveal>

                <Link
                    href={`/projects/${next.slug}`}
                    className="group grid items-end gap-10 lg:grid-cols-[1.2fr_0.8fr]"
                >
                    <div>
                        <h2 className="font-display text-[44px] leading-[0.98] font-bold tracking-[-0.045em] text-slate-900 transition-colors duration-500 group-hover:text-teal-700 sm:text-7xl lg:text-[92px]">
                            <MaskedLine onScroll>{name}</MaskedLine>
                        </h2>
                        {tagline && (
                            <Reveal delay={0.15}>
                                <p className="mt-5 max-w-lg text-[19px] leading-relaxed text-slate-600">
                                    {tagline}
                                </p>
                            </Reveal>
                        )}
                        <Reveal delay={0.25}>
                            <span
                                className={buttonVariants({
                                    variant: 'outline',
                                    className: 'mt-8',
                                })}
                            >
                                {l('Découvrir le projet', 'Explore the project')}
                            </span>
                        </Reveal>
                    </div>

                    {image && (
                        <Reveal delay={0.1}>
                            <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                                <img
                                    src={image}
                                    alt={next.title}
                                    loading="lazy"
                                    className="h-full w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.05]"
                                />
                            </div>
                        </Reveal>
                    )}
                </Link>

                {others.length > 0 && (
                    <div className="mt-20">
                        <p className="mb-2 font-mono text-[11px] text-slate-400">
                            {l('Autres projets', 'More projects')}
                        </p>
                        <ul>
                            {others.map((project) => (
                                <li key={project.id}>
                                    <DrawLine />
                                    <Link
                                        href={`/projects/${project.slug}`}
                                        className="group flex items-baseline justify-between gap-6 py-5"
                                    >
                                        <span className="font-display text-xl font-bold tracking-tight text-slate-900 transition-[color,transform] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-2 group-hover:text-teal-700 sm:text-2xl">
                                            {splitTitle(project.title).name}
                                        </span>
                                        <span className="shrink-0 font-mono text-[12px] text-slate-400 capitalize">
                                            {project.project_type_label ??
                                                project.project_type}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <DrawLine />
                    </div>
                )}
            </div>
        </section>
    );
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE
// ═════════════════════════════════════════════════════════════════════════════
export default function Show({ project, related }: ProjectShowProps) {
    const prefersReducedMotion = useReducedMotion();
    const { language, l } = useTranslation();
    const { name, tagline } = splitTitle(project.title);
    const year = projectYear(project.created_at);
    const links = primaryLinks(project, language);
    const hasPublicCode = Boolean(project.github_url) && !project.private_repo;
    const cover = previewImage(project);
    const screenshots = useMemo(
        () => (project.screenshots_urls ?? []).filter((src) => src !== cover),
        [project.screenshots_urls, cover],
    );
    const typeLabel = project.project_type_label ?? project.project_type;

    const fadeIn = (delay: number) => ({
        initial: { opacity: 0, y: prefersReducedMotion ? 0 : 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, delay, ease: easings.smooth },
    });

    return (
        <MainLayout>
            <Head title={`${project.title} — Sergio Junior Chebeu`}>
                <meta
                    property="og:title"
                    content={`${project.title} — Sergio Junior Chebeu`}
                />
                <meta property="og:description" content={project.description} />
                <meta property="og:image" content={project.image_url} />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image" content={project.image_url} />
            </Head>

            <ReadingProgress />

            {/* ══ HERO ═══════════════════════════════════════════════ */}
            <HeroBackdrop>
                <div className="container-main pt-[110px] pb-14 sm:pt-[130px] sm:pb-20">
                    <motion.div
                        {...fadeIn(0)}
                        className="mb-10 flex flex-wrap items-center gap-3"
                    >
                        <Link
                            href="/projects"
                            className={buttonVariants({
                                variant: 'outline',
                                size: 'sm',
                            })}
                        >
                            {l('Tous les projets', 'All projects')}
                        </Link>
                        <span className="font-mono text-[12px] text-slate-500">
                            <span className="capitalize">{typeLabel}</span>
                            {year && <span> · {year}</span>}
                            {project.featured && (
                                <span className="text-teal-600">
                                    {' '}
                                    · À la une
                                </span>
                            )}
                        </span>
                    </motion.div>

                    <div className="grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16">
                        <div>
                            <h1 className="font-display text-[48px] leading-[0.96] font-bold tracking-[-0.05em] text-ink-primary sm:text-7xl lg:text-[104px]">
                                <SplitChars text={name} delay={0.1} />
                            </h1>
                            {tagline && (
                                <motion.p
                                    {...fadeIn(0.45)}
                                    className="mt-5 font-display text-2xl font-semibold tracking-tight text-teal-700 sm:text-3xl"
                                >
                                    {tagline}
                                </motion.p>
                            )}
                            <motion.p
                                {...fadeIn(0.55)}
                                className="mt-6 max-w-[38rem] text-[20px] leading-[1.6] text-slate-700"
                            >
                                {project.description}
                            </motion.p>

                            {(links.length > 0 || hasPublicCode) && (
                                <motion.div
                                    {...fadeIn(0.65)}
                                    className="mt-9 flex flex-wrap gap-3"
                                >
                                    {links.map((link, index) => (
                                        <a
                                            key={link.href}
                                            href={link.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={buttonVariants({
                                                variant:
                                                    index === 0
                                                        ? 'default'
                                                        : 'outline',
                                                size: 'lg',
                                            })}
                                        >
                                            {link.label}
                                        </a>
                                    ))}
                                    {hasPublicCode && (
                                        <a
                                            href={project.github_url!}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={buttonVariants({
                                                variant:
                                                    links.length === 0
                                                        ? 'default'
                                                        : 'outline',
                                                size: 'lg',
                                            })}
                                        >
                                            {l('Code source', 'Source code')}
                                        </a>
                                    )}
                                </motion.div>
                            )}
                        </div>

                        <dl className="self-end">
                            <FactRow label="Type" delay={0.3}>
                                <span className="capitalize">{typeLabel}</span>
                            </FactRow>
                            {project.platforms.length > 0 && (
                                <FactRow
                                    label={l('Plateformes', 'Platforms')}
                                    delay={0.38}
                                >
                                    {project.platforms.join(', ')}
                                </FactRow>
                            )}
                            {project.tags.length > 0 && (
                                <FactRow label="Stack" delay={0.46}>
                                    {project.tags.join(', ')}
                                </FactRow>
                            )}
                            {year && (
                                <FactRow
                                    label={l('Année', 'Year')}
                                    delay={0.54}
                                >
                                    {year}
                                </FactRow>
                            )}
                            <FactRow label="Code" delay={0.62}>
                                {hasPublicCode
                                    ? l('Public sur GitHub', 'Public on GitHub')
                                    : l('Privé', 'Private')}
                            </FactRow>
                            <DrawLine />
                        </dl>
                    </div>
                </div>
            </HeroBackdrop>

            {/* ══ COUVERTURE ═════════════════════════════════════════ */}
            {cover && (
                <ExpandingCover
                    src={cover}
                    alt={project.title}
                    moreSrcs={project.screenshots_urls ?? []}
                    framed
                />
            )}

            {/* ══ ÉTUDE DE CAS + GALERIE (après « Contexte ») ════════ */}
            <ProjectCaseStudy
                key={project.slug}
                content={project.content ?? ''}
                afterContext={
                    <ProjectGallery
                        images={screenshots}
                        title={project.title}
                        siteUrl={project.demo_url}
                        projectType={project.project_type}
                    />
                }
            />

            {/* ══ PROJET SUIVANT ═════════════════════════════════════ */}
            <NextProject projects={related} />
        </MainLayout>
    );
}
