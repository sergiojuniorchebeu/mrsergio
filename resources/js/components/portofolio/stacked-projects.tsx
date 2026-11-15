// resources/js/components/portofolio/stacked-projects.tsx
// Projets en cartes collantes qui s'empilent au scroll (desktop),
// carrousel horizontal à glisser (mobile).

import { Link } from '@inertiajs/react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Project } from '@/types';

const STACK_OFFSET_PX = 28;
const STACK_OFFSET_MOBILE_PX = 12;

function StackCard({
    project,
    index,
    total,
    progress,
}: {
    project: Project;
    index: number;
    total: number;
    progress: MotionValue<number>;
}) {
    const prefersReducedMotion = useReducedMotion();
    const isMobile = useIsMobile();
    const stackOffset = isMobile ? STACK_OFFSET_MOBILE_PX : STACK_OFFSET_PX;
    const cardRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress: entryProgress } = useScroll({
        target: cardRef,
        offset: ['start end', 'start start'],
    });

    const targetScale = 1 - (total - index - 1) * (isMobile ? 0.025 : 0.04);
    const scale = useTransform(
        progress,
        [index / total, 1],
        prefersReducedMotion ? [1, 1] : [1, targetScale],
    );
    const imageScale = useTransform(entryProgress, [0, 1], prefersReducedMotion ? [1, 1] : [isMobile ? 1.12 : 1.3, 1]);
    const previewImage = project.screenshots_urls?.[0] ?? project.image_url ?? null;
    const number = String(index + 1).padStart(2, '0');

    return (
        <div ref={cardRef} className="sticky top-0 flex h-[100svh] items-center">
            <motion.article
                style={{ scale, top: `calc(-3svh + ${index * stackOffset}px)` }}
                className="relative flex h-[76svh] max-h-[620px] min-h-[420px] w-full md:h-[72svh] origin-top flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_-12px_48px_-12px_rgba(26,25,22,0.18)] md:flex-row"
            >
                <div className="flex flex-col justify-between gap-4 p-6 sm:gap-6 sm:p-10 md:w-[42%]">
                    <div>
                        <p className="mb-4 flex items-center sm:mb-6 gap-3 font-mono text-[12px] text-slate-400">
                            <span className="text-teal-600">{number}</span>
                            <span className="h-px w-8 bg-slate-200" />
                            <span className="capitalize">{project.project_type_label ?? project.project_type}</span>
                        </p>
                        <h3 className="font-display text-[26px] leading-[1.05] sm:text-3xl md:text-[40px] font-bold tracking-[-0.03em] text-slate-900">
                            {project.title}
                        </h3>
                        <p className="mt-3 line-clamp-2 text-[15px] sm:mt-4 sm:line-clamp-4 sm:text-[17px] leading-relaxed text-slate-600">
                            {project.description}
                        </p>
                    </div>

                    <div className="flex flex-col gap-5">
                        {project.tags.length > 0 && (
                            <p className="font-mono text-[12px] text-slate-500">
                                {project.tags.slice(0, 4).join(' · ')}
                            </p>
                        )}
                        <Link
                            href={`/projects/${project.slug}`}
                            className={buttonVariants({ variant: 'outline', className: 'self-start' })}
                        >
                            Voir le projet
                        </Link>
                    </div>
                </div>

                <Link
                    href={`/projects/${project.slug}`}
                    aria-label={`Voir ${project.title}`}
                    className="group relative min-h-[140px] flex-1 overflow-hidden bg-slate-100 md:m-3 md:rounded-2xl"
                >
                    {previewImage ? (
                        <motion.img
                            src={previewImage}
                            alt={project.title}
                            loading="lazy"
                            decoding="async"
                            style={{ scale: imageScale }}
                            className="h-full w-full object-cover object-top"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center font-display text-6xl font-bold text-slate-200">
                            {number}
                        </div>
                    )}
                </Link>
            </motion.article>
        </div>
    );
}

function StackedDeck({ projects }: { projects: Project[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    return (
        <div ref={containerRef} className="relative">
            {projects.map((project, index) => (
                <StackCard
                    key={project.id ?? project.slug}
                    project={project}
                    index={index}
                    total={projects.length}
                    progress={scrollYProgress}
                />
            ))}
        </div>
    );
}

/**
 * Mobile : carrousel horizontal à glisser au doigt, avec barre de progression.
 */
function MobileCarousel({ projects }: { projects: Project[] }) {
    const trackRef = useRef<HTMLDivElement>(null);
    const { scrollXProgress } = useScroll({ container: trackRef });
    const barScale = useTransform(scrollXProgress, [0, 1], [1 / projects.length, 1]);

    return (
        <div>
            <div
                ref={trackRef}
                className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 [scrollbar-width:none] sm:-mx-6 sm:px-6 [&::-webkit-scrollbar]:hidden"
            >
                {projects.map((project, index) => (
                    <div key={project.id ?? project.slug} className="w-[84%] shrink-0 snap-center">
                        <ProjectCard project={project} index={index} />
                    </div>
                ))}
            </div>
            <div className="mx-auto h-px w-24 overflow-hidden bg-slate-200">
                <motion.div style={{ scaleX: barScale }} className="h-full origin-left bg-teal-600" />
            </div>
        </div>
    );
}

export function StackedProjects({ projects }: { projects: Project[] }) {
    const isMobile = useIsMobile();

    return isMobile ? <MobileCarousel projects={projects} /> : <StackedDeck projects={projects} />;
}
